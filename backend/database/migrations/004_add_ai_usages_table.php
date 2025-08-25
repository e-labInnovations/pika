<?php

/**
 * Migration: Add AI usages table
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Migration_Add_Ai_Usages_Table {

  /**
   * Run the migration
   */
  public function up() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_ai_usages';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE {$table_name} (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NOT NULL,
      provider VARCHAR(50) NOT NULL,
      is_user_api_key TINYINT(1) DEFAULT 0,
      model VARCHAR(100) NOT NULL,
      total_tokens BIGINT UNSIGNED DEFAULT 0,
      token_details JSON DEFAULT NULL,
      cost DECIMAL(10,6) DEFAULT 0.0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      prompt_type VARCHAR(50) NOT NULL,
      latency_ms BIGINT UNSIGNED DEFAULT 0,
      status VARCHAR(50) NOT NULL,
      error_message TEXT,
      
      INDEX idx_user_id (user_id),
      INDEX idx_provider (provider),
      INDEX idx_model (model),
      INDEX idx_created_at (created_at)
    ) {$charset_collate};";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    // Log the migration
    error_log("Pika: Created AI usages table: {$table_name}");
  }

  /**
   * Rollback the migration
   */
  public function down() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_ai_usages';
    
    $sql = "DROP TABLE IF EXISTS {$table_name}";
    $wpdb->query($sql);

    // Log the rollback
    error_log("Pika: Dropped AI usages table: {$table_name}");
  }
}
