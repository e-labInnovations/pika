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
    '1.1.0' => '001_add_reminders_table'
  ];

  /**
   * Run migrations from current version to target version
   */
  public function run_migrations($from_version, $to_version) {
    global $wpdb;

    // Start transaction for safe upgrade
    $wpdb->query('START TRANSACTION');

    try {
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

    $migration_class = 'Pika_Migration_' . str_replace('001_', '', $migration_file);

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
   * Show admin notice when migration fails
   */
  public static function migration_failed_notice() {
    echo '<div class="notice notice-error is-dismissible">';
    echo '<p><strong>Pika Financial:</strong> Database migration failed. Please check error logs and contact support if the issue persists.</p>';
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
