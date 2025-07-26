<?php

/**
 * Plugin upgrade handler
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Upgrader {

  /**
   * Check if database upgrade is needed and run it
   */
  public static function check_upgrade() {
    $installed_version = get_option('pika_db_version', '0.0.0');

    // Only run upgrade if version is different
    if (version_compare($installed_version, PIKA_DB_VERSION, '<')) {
      self::run_upgrades($installed_version);
    }
  }

  /**
   * Run database upgrades from current version to latest
   * 
   * @param string $from_version Current installed version
   */
  private static function run_upgrades($from_version) {
    global $wpdb;

    // Start transaction for safe upgrade
    $wpdb->query('START TRANSACTION');

    try {
      // Log upgrade start
      error_log("Pika: Starting database upgrade from version {$from_version} to " . PIKA_DB_VERSION);

      // Upgrade to version 1.1.0 - Add reminders table
      if (version_compare($from_version, '1.1.0', '<')) {
        self::upgrade_to_1_1_0();
      }

      // Example: Upgrade to version 1.2.0
      // if (version_compare($from_version, '1.2.0', '<')) {
      //     self::upgrade_to_1_2_0();
      // }

      // Re-run table creation to handle any schema changes
      // This is safe because dbDelta only applies changes, doesn't drop data
      require_once PIKA_PLUGIN_PATH . 'backend/activator.php';
      Pika_Activator::create_database_tables();

      // Update the database version
      update_option('pika_db_version', PIKA_DB_VERSION);
      update_option('pika_last_upgrade', current_time('mysql'));

      // Commit transaction
      $wpdb->query('COMMIT');

      error_log("Pika: Database upgrade completed successfully to version " . PIKA_DB_VERSION);
    } catch (Exception $e) {
      // Rollback on error
      $wpdb->query('ROLLBACK');
      error_log("Pika: Database upgrade failed: " . $e->getMessage());

      // Optionally show admin notice
      add_action('admin_notices', [__CLASS__, 'upgrade_failed_notice']);
    }
  }

  /**
   * Upgrade to version 1.1.0 - Add reminders table
   */
  private static function upgrade_to_1_1_0() {
    global $wpdb;

    $charset_collate = $wpdb->get_charset_collate();
    $reminders_table = $wpdb->prefix . 'pika_reminders';

    $sql = "CREATE TABLE $reminders_table (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            member_id bigint(20) unsigned DEFAULT NULL,
            title varchar(255) NOT NULL,
            description text DEFAULT NULL,
            amount decimal(15,4) NOT NULL,
            type enum('income','expense','transfer') NOT NULL,
            from_member_id bigint(20) unsigned DEFAULT NULL,
            to_member_id bigint(20) unsigned DEFAULT NULL,
            category_id bigint(20) unsigned DEFAULT NULL,
            tag_ids JSON DEFAULT NULL,
            account_id bigint(20) unsigned NOT NULL,
            date date NOT NULL,
            is_recurring tinyint(1) NOT NULL DEFAULT 0,
            recurrence_period varchar(50) DEFAULT NULL,
            recurrence_type enum('postpaid','prepaid') DEFAULT NULL,
            last_triggered_at datetime DEFAULT NULL,
            next_due_date date DEFAULT NULL,
            completed_dates JSON DEFAULT NULL,
            archived tinyint(1) NOT NULL DEFAULT 0,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY member_id (member_id),
            KEY category_id (category_id),
            KEY account_id (account_id),
            KEY from_member_id (from_member_id),
            KEY to_member_id (to_member_id),
            KEY date (date),
            KEY next_due_date (next_due_date),
            KEY type (type),
            KEY is_recurring (is_recurring),
            KEY archived (archived)
        ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    error_log('Pika: Created reminders table in upgrade to version 1.1.0');
  }

  /**
   * Example upgrade method for version 1.2.0
   * Uncomment and modify when needed
   */
  // private static function upgrade_to_1_2_0() {
  //     global $wpdb;
  //     
  //     // Example: Create new table
  //     $new_table = $wpdb->prefix . 'pika_new_feature';
  //     $charset_collate = $wpdb->get_charset_collate();
  //     
  //     $sql = "CREATE TABLE $new_table (
  //         id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  //         user_id bigint(20) unsigned NOT NULL,
  //         name varchar(255) NOT NULL,
  //         created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  //         PRIMARY KEY (id),
  //         KEY user_id (user_id)
  //     ) $charset_collate;";
  //     
  //     require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
  //     dbDelta($sql);
  // }

  /**
   * Show admin notice when upgrade fails
   */
  public static function upgrade_failed_notice() {
    echo '<div class="notice notice-error is-dismissible">';
    echo '<p><strong>Pika Financial:</strong> Database upgrade failed. Please check error logs and contact support if the issue persists.</p>';
    echo '</div>';
  }

  /**
   * Get current database version
   * 
   * @return string
   */
  public static function get_db_version() {
    return get_option('pika_db_version', '0.0.0');
  }

  /**
   * Check if upgrade is needed
   * 
   * @return bool
   */
  public static function needs_upgrade() {
    return version_compare(self::get_db_version(), PIKA_DB_VERSION, '<');
  }

  /**
   * Force refresh database schema (useful for development)
   * This method should only be used in development/debugging
   */
  public static function force_schema_refresh() {
    if (defined('WP_DEBUG') && WP_DEBUG) {
      require_once PIKA_PLUGIN_PATH . 'backend/activator.php';
      Pika_Activator::create_database_tables();
      update_option('pika_db_version', PIKA_DB_VERSION);
      update_option('pika_last_schema_refresh', current_time('mysql'));
    }
  }
}
