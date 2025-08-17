<?php

/**
 * Migration: Add push notifications tables
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Migration_Add_Push_Notifications_Tables {

  /**
   * Run the migration
   */
  public function up() {
    global $wpdb;

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    $charset_collate = $wpdb->get_charset_collate();

    // Create notifications table
    $this->create_notifications_table($wpdb, $charset_collate);

    // Create device subscriptions table
    $this->create_device_subscriptions_table($wpdb, $charset_collate);

    // Add version to options
    update_option('pika_db_version', '1.2.0');
  }

  /**
   * Create notifications table
   */
  private function create_notifications_table($wpdb, $charset_collate) {
    $table_name = $wpdb->prefix . 'pika_notifications';

    $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            title varchar(255) NOT NULL,
            body text NOT NULL,
            icon varchar(255) DEFAULT NULL,
            badge varchar(255) DEFAULT NULL,
            image varchar(255) DEFAULT NULL,
            tag varchar(100) DEFAULT NULL,
            data JSON DEFAULT NULL,
            actions JSON DEFAULT NULL,
            require_interaction tinyint(1) NOT NULL DEFAULT 0,
            silent tinyint(1) NOT NULL DEFAULT 0,
            timestamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            read_at datetime DEFAULT NULL,
            clicked_at datetime DEFAULT NULL,
            dismissed_at datetime DEFAULT NULL,
            is_active tinyint(1) NOT NULL DEFAULT 1,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY tag (tag),
            KEY timestamp (timestamp),
            KEY read_at (read_at),
            KEY is_active (is_active)
        ) $charset_collate;";

    dbDelta($sql);
  }

  /**
   * Create device subscriptions table
   */
  private function create_device_subscriptions_table($wpdb, $charset_collate) {
    $table_name = $wpdb->prefix . 'pika_device_subscriptions';

    $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            device_id varchar(255) NOT NULL,
            device_name varchar(255) DEFAULT NULL,
            device_type enum('web','mobile','desktop') NOT NULL DEFAULT 'web',
            subscription_data JSON NOT NULL,
            is_active tinyint(1) NOT NULL DEFAULT 1,
            last_seen datetime DEFAULT NULL,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY user_device_unique (user_id,device_id),
            KEY user_id (user_id),
            KEY device_id (device_id),
            KEY device_type (device_type),
            KEY is_active (is_active)
        ) $charset_collate;";

    dbDelta($sql);
  }

  /**
   * Rollback the migration
   */
  public function down() {
    global $wpdb;

    $tables = [
      $wpdb->prefix . 'pika_notifications',
      $wpdb->prefix . 'pika_device_subscriptions'
    ];

    foreach ($tables as $table) {
      $wpdb->query("DROP TABLE IF EXISTS $table");
    }

    // Revert version
    update_option('pika_db_version', '1.1.0');
  }

  /**
   * Check if migration is needed
   */
  public function is_needed() {
    global $wpdb;

    $notifications_table = $wpdb->prefix . 'pika_notifications';
    $device_subscriptions_table = $wpdb->prefix . 'pika_device_subscriptions';

    $notifications_exists = $wpdb->get_var("SHOW TABLES LIKE '$notifications_table'") == $notifications_table;
    $device_subscriptions_exists = $wpdb->get_var("SHOW TABLES LIKE '$device_subscriptions_table'") == $device_subscriptions_table;

    return !($notifications_exists && $device_subscriptions_exists);
  }
}
