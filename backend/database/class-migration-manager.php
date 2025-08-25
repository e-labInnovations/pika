<?php

/**
 * Migration Manager for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Migration_Manager {

  /**
   * Available migrations
   */
  private $migrations = [
    '1.1.0' => '001_add_reminders_table',
    '1.2.0' => '002_add_push_notifications_tables',
    '1.3.0' => '003_modify_device_subscriptions_table',
    '1.4.0' => '004_add_ai_usages_table'
  ];

  /**
   * Run migrations from current version to target version
   */
  public function run_migrations($from_version, $to_version) {
    global $wpdb;

    // Start transaction for safe upgrade
    $wpdb->query('START TRANSACTION');

    try {
      // Show admin notice
      // add_action('admin_notices', [__CLASS__, 'migration_started_notice']);

      // Log upgrade start
      error_log("Pika: Starting database migration from version {$from_version} to {$to_version}");

      // Get sorted list of migrations to run
      $migrations_to_run = $this->get_migrations_to_run($from_version, $to_version);

      foreach ($migrations_to_run as $version => $migration_file) {
        $this->run_migration($version, $migration_file);
      }

      // Commit transaction
      $wpdb->query('COMMIT');

      error_log("Pika: Database migration completed successfully to version {$to_version}");
      return true;
    } catch (Exception $e) {
      // Rollback on error
      $wpdb->query('ROLLBACK');
      error_log("Pika: Database migration failed: " . $e->getMessage());

      // Optionally show admin notice
      add_action('admin_notices', [__CLASS__, 'migration_failed_notice']);

      return false;
    }
  }

  /**
   * Run all pending migrations (used by database manager)
   */
  public function run_all_pending_migrations() {
    $current_version = get_option('pika_db_version', '0.0.0');
    $target_version = PIKA_DB_VERSION;

    if (version_compare($current_version, $target_version, '<')) {
      $result = $this->run_migrations($current_version, $target_version);

      // Only update version if migrations succeeded
      if ($result) {
        update_option('pika_db_version', $target_version);
        error_log("Pika: Database version updated to {$target_version}");

        // Show admin notice
        // add_action('admin_notices', [__CLASS__, 'migration_completed_notice']);
      }

      return $result;
    }

    return true; // No migrations needed
  }

  /**
   * Get list of migrations to run
   */
  private function get_migrations_to_run($from_version, $to_version) {
    $migrations_to_run = [];

    foreach ($this->migrations as $version => $migration_file) {
      if (
        version_compare($from_version, $version, '<') &&
        version_compare($version, $to_version, '<=')
      ) {
        $migrations_to_run[$version] = $migration_file;
      }
    }

    // Sort by version
    uksort($migrations_to_run, 'version_compare');

    return $migrations_to_run;
  }

  /**
   * Run a specific migration
   */
  private function run_migration($version, $migration_file) {
    $migration_path = PIKA_PLUGIN_PATH . 'backend/database/migrations/' . $migration_file . '.php';

    if (!file_exists($migration_path)) {
      throw new Exception("Migration file not found: {$migration_file}");
    }

    require_once $migration_path;

    $migration_class = $this->get_migration_class_name($migration_file);

    if (!class_exists($migration_class)) {
      throw new Exception("Migration class not found: {$migration_class}");
    }

    $migration = new $migration_class();

    if (method_exists($migration, 'up')) {
      $migration->up();
      error_log("Pika: Successfully ran migration {$version} - {$migration_file}");
    } else {
      throw new Exception("Migration class {$migration_class} missing 'up' method");
    }
  }

  /**
   * Check if migration is needed
   */
  public function needs_migration($from_version, $to_version) {
    return version_compare($from_version, $to_version, '<');
  }

  /**
   * Get available migrations
   */
  public function get_available_migrations() {
    return $this->migrations;
  }

  /**
   * Get migration class name from filename
   */
  private function get_migration_class_name($migration_file) {
    // Remove starting number up to the first underscore (001_, 002_, etc.)
    $class_name = preg_replace('/^\d+_/', '', $migration_file);

    // Convert underscores to spaces, uppercase first letter of each word, then remove spaces
    $class_name = str_replace('_', ' ', $class_name);
    $class_name = ucwords($class_name);
    $class_name = str_replace(' ', '_', $class_name);

    // Add Pika_Migration_ prefix
    return 'Pika_Migration_' . $class_name;
  }

  /**
   * Get pending migrations for a version
   */
  public function get_pending_migrations($current_version) {
    $pending = [];

    foreach ($this->migrations as $version => $migration_file) {
      if (version_compare($current_version, $version, '<')) {
        $pending[$version] = $migration_file;
      }
    }

    return $pending;
  }

  /**
   * Show admin notice when migration is started
   */
  public static function migration_started_notice() {
    echo '<div class="notice notice-info is-dismissible">';
    echo '<p><strong>Pika Financial:</strong> Database migration started.</p>';
    echo '</div>';
  }

  /**
   * Show admin notice when migration fails
   */
  public static function migration_failed_notice() {
    echo '<div class="notice notice-error is-dismissible">';
    echo '<p><strong>Pika Financial:</strong> Database migration failed. Please check error logs and contact support if the issue persists.</p>';
    echo '</div>';
  }

  /**
   * Show admin notice when migration is completed
   */
  public static function migration_completed_notice() {
    echo '<div class="notice notice-success is-dismissible">';
    echo '<p><strong>Pika Financial:</strong> Database migration completed successfully.</p>';
    echo '</div>';
  }

  /**
   * Force run a specific migration (development only)
   */
  public function force_migration($version) {
    if (!defined('WP_DEBUG') || !WP_DEBUG) {
      return false;
    }

    if (!isset($this->migrations[$version])) {
      return false;
    }

    try {
      $this->run_migration($version, $this->migrations[$version]);
      return true;
    } catch (Exception $e) {
      error_log("Pika: Force migration {$version} failed: " . $e->getMessage());
      return false;
    }
  }

  /**
   * Rollback a migration (development only)
   */
  public function rollback_migration($version) {
    if (!defined('WP_DEBUG') || !WP_DEBUG) {
      return false;
    }

    if (!isset($this->migrations[$version])) {
      return false;
    }

    $migration_path = PIKA_PLUGIN_PATH . 'backend/database/migrations/' . $this->migrations[$version] . '.php';

    if (!file_exists($migration_path)) {
      return false;
    }

    require_once $migration_path;

    $migration_class = 'Pika_Migration_' . str_replace('001_', '', $this->migrations[$version]);

    if (!class_exists($migration_class)) {
      return false;
    }

    $migration = new $migration_class();

    if (method_exists($migration, 'down')) {
      try {
        $migration->down();
        error_log("Pika: Successfully rolled back migration {$version}");
        return true;
      } catch (Exception $e) {
        error_log("Pika: Rollback migration {$version} failed: " . $e->getMessage());
        return false;
      }
    }

    return false;
  }
}
