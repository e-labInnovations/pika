<?php

/**
 * Migration: Modify device subscriptions table
 * Remove device_name and device_type columns, add session column
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Migration_Modify_Device_Subscriptions_Table {

  /**
   * Run the migration
   */
  public function up() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_device_subscriptions';

    // Check if table exists
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
      return false;
    }

    // Remove all existing rows from the table
    $wpdb->query("DELETE FROM $table_name");

    // Remove device_name column if it exists
    if ($wpdb->get_var("SHOW COLUMNS FROM $table_name LIKE 'device_name'") == 'device_name') {
      $wpdb->query("ALTER TABLE $table_name DROP COLUMN device_name");
    }

    // Remove device_type column if it exists
    if ($wpdb->get_var("SHOW COLUMNS FROM $table_name LIKE 'device_type'") == 'device_type') {
      $wpdb->query("ALTER TABLE $table_name DROP COLUMN device_type");
    }

    // Add session column if it doesn't exist
    if ($wpdb->get_var("SHOW COLUMNS FROM $table_name LIKE 'session'") != 'session') {
      $wpdb->query("ALTER TABLE $table_name ADD COLUMN session varchar(255) DEFAULT NULL AFTER device_id");
      
      // Add index for session column
      $wpdb->query("ALTER TABLE $table_name ADD INDEX session (session)");
    }

    // Update version
    update_option('pika_db_version', '1.3.0');

    return true;
  }

  /**
   * Rollback the migration
   */
  public function down() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_device_subscriptions';

    // Check if table exists
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
      return false;
    }

    // Remove session column if it exists
    if ($wpdb->get_var("SHOW COLUMNS FROM $table_name LIKE 'session'") == 'session') {
      $wpdb->query("ALTER TABLE $table_name DROP COLUMN session");
    }

    // Add back device_name column if it doesn't exist
    if ($wpdb->get_var("SHOW COLUMNS FROM $table_name LIKE 'device_name'") != 'device_name') {
      $wpdb->query("ALTER TABLE $table_name ADD COLUMN device_name varchar(255) DEFAULT NULL AFTER device_id");
    }

    // Add back device_type column if it doesn't exist
    if ($wpdb->get_var("SHOW COLUMNS FROM $table_name LIKE 'device_type'") != 'device_type') {
      $wpdb->query("ALTER TABLE $table_name ADD COLUMN device_type enum('web','mobile','desktop') NOT NULL DEFAULT 'web' AFTER device_name");
      
      // Add back index for device_type
      $wpdb->query("ALTER TABLE $table_name ADD INDEX device_type (device_type)");
    }

    // Revert version
    update_option('pika_db_version', '1.2.0');

    return true;
  }

  /**
   * Check if migration is needed
   */
  public function is_needed() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_device_subscriptions';

    // Check if table exists
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
      return false;
    }

    // Check if device_name column still exists
    $has_device_name = $wpdb->get_var("SHOW COLUMNS FROM $table_name LIKE 'device_name'") == 'device_name';
    
    // Check if device_type column still exists
    $has_device_type = $wpdb->get_var("SHOW COLUMNS FROM $table_name LIKE 'device_type'") == 'device_type';
    
    // Check if session column exists
    $has_session = $wpdb->get_var("SHOW COLUMNS FROM $table_name LIKE 'session'") == 'session';

    // Migration is needed if:
    // - device_name or device_type columns still exist, OR
    // - session column doesn't exist
    return $has_device_name || $has_device_type || !$has_session;
  }
}
