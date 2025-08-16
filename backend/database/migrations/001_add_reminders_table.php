<?php

/**
 * Migration: Add reminders table
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Migration_Add_Reminders_Table {

  /**
   * Run the migration
   */
  public function up() {
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

    error_log('Pika: Created reminders table in migration 001');
  }

  /**
   * Rollback the migration
   */
  public function down() {
    global $wpdb;

    $reminders_table = $wpdb->prefix . 'pika_reminders';
    $wpdb->query("DROP TABLE IF EXISTS $reminders_table");

    error_log('Pika: Dropped reminders table in migration 001 rollback');
  }
}
