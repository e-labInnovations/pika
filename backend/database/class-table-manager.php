<?php

/**
 * Table Manager for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Table_Manager {

  /**
   * Create all database tables
   */
  public function create_all_tables() {
    global $wpdb;

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

    $charset_collate = $wpdb->get_charset_collate();

    // Create accounts table
    $this->create_accounts_table($charset_collate);

    // Create people table
    $this->create_people_table($charset_collate);

    // Create categories table
    $this->create_categories_table($charset_collate);

    // Create tags table
    $this->create_tags_table($charset_collate);

    // Create transactions table
    $this->create_transactions_table($charset_collate);

    // Create transaction tags table
    $this->create_transaction_tags_table($charset_collate);

    // Create uploads table
    $this->create_uploads_table($charset_collate);

    // Create transaction attachments table
    $this->create_transaction_attachments_table($charset_collate);

    // Create user settings table
    $this->create_user_settings_table($charset_collate);

    // Create reminders table (if not exists)
    $this->create_reminders_table($charset_collate);
  }

  /**
   * Create accounts table
   */
  private function create_accounts_table($charset_collate) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_accounts';
    $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            name varchar(255) NOT NULL,
            icon varchar(100) NOT NULL DEFAULT 'wallet',
            bg_color varchar(7) NOT NULL DEFAULT '#3B82F6',
            color varchar(7) NOT NULL DEFAULT '#ffffff',
            avatar_id bigint(20) unsigned DEFAULT NULL,
            description text,
            is_active tinyint(1) NOT NULL DEFAULT 1,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY is_active (is_active)
        ) $charset_collate;";

    dbDelta($sql);
  }

  /**
   * Create people table
   */
  private function create_people_table($charset_collate) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_people';
    $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            name varchar(255) NOT NULL,
            email varchar(255),
            phone varchar(50),
            avatar_id bigint(20) unsigned DEFAULT NULL,
            description text,
            is_active tinyint(1) NOT NULL DEFAULT 1,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY email (email),
            KEY is_active (is_active)
        ) $charset_collate;";

    dbDelta($sql);
  }

  /**
   * Create categories table
   */
  private function create_categories_table($charset_collate) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_categories';
    $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            parent_id bigint(20) unsigned DEFAULT NULL,
            name varchar(255) NOT NULL,
            icon varchar(100) NOT NULL DEFAULT 'folder',
            color varchar(7) NOT NULL DEFAULT '#3B82F6',
            bg_color varchar(7) NOT NULL DEFAULT '#ffffff',
            type enum('income','expense','transfer') NOT NULL,
            description text,
            is_active tinyint(1) NOT NULL DEFAULT 1,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY parent_id (parent_id),
            KEY type (type),
            KEY is_active (is_active)
        ) $charset_collate;";

    dbDelta($sql);
  }

  /**
   * Create tags table
   */
  private function create_tags_table($charset_collate) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_tags';
    $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            name varchar(255) NOT NULL,
            icon varchar(100) NOT NULL DEFAULT 'tag',
            color varchar(7) NOT NULL DEFAULT '#3B82F6',
            bg_color varchar(7) NOT NULL DEFAULT '#ffffff',
            description text,
            is_active tinyint(1) NOT NULL DEFAULT 1,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY is_active (is_active)
        ) $charset_collate;";

    dbDelta($sql);
  }

  /**
   * Create transactions table
   */
  private function create_transactions_table($charset_collate) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_transactions';
    $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            title varchar(255) NOT NULL,
            amount decimal(15,4) NOT NULL,
            date datetime NOT NULL,
            type enum('income','expense','transfer') NOT NULL,
            category_id bigint(20) unsigned NOT NULL,
            account_id bigint(20) unsigned NOT NULL,
            to_account_id bigint(20) unsigned DEFAULT NULL,
            person_id bigint(20) unsigned DEFAULT NULL,
            note text,
            is_active tinyint(1) NOT NULL DEFAULT 1,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY category_id (category_id),
            KEY account_id (account_id),
            KEY to_account_id (to_account_id),
            KEY person_id (person_id),
            KEY date (date),
            KEY type (type),
            KEY is_active (is_active)
        ) $charset_collate;";

    dbDelta($sql);
  }

  /**
   * Create transaction tags table
   */
  private function create_transaction_tags_table($charset_collate) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_transaction_tags';
    $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            transaction_id bigint(20) unsigned NOT NULL,
            tag_id bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY transaction_tag_unique (transaction_id,tag_id),
            KEY transaction_id (transaction_id),
            KEY tag_id (tag_id)
        ) $charset_collate;";

    dbDelta($sql);
  }

  /**
   * Create uploads table
   */
  private function create_uploads_table($charset_collate) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_uploads';
    $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            type enum('avatar','attachment','other') NOT NULL,
            file_name varchar(255) NOT NULL,
            file_url text NOT NULL,
            file_size bigint(20) unsigned DEFAULT NULL,
            mime_type varchar(100) DEFAULT NULL,
            attachment_type enum('image','document') NOT NULL,
            entity_type enum('person','account','transaction','other') NOT NULL,
            uploaded_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            description text DEFAULT NULL,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY type (type),
            KEY attachment_type (attachment_type),
            KEY entity_type (entity_type)
        ) $charset_collate;";

    dbDelta($sql);
  }

  /**
   * Create transaction attachments table
   */
  private function create_transaction_attachments_table($charset_collate) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_transaction_attachments';
    $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            transaction_id bigint(20) unsigned NOT NULL,
            upload_id bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY transaction_id (transaction_id),
            KEY upload_id (upload_id)
        ) $charset_collate;";

    dbDelta($sql);
  }

  /**
   * Create user settings table
   */
  private function create_user_settings_table($charset_collate) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_user_settings';
    $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            setting_key varchar(100) NOT NULL,
            setting_value text,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY user_setting_unique (user_id,setting_key),
            KEY user_id (user_id)
        ) $charset_collate;";

    dbDelta($sql);
  }

  /**
   * Create reminders table
   */
  private function create_reminders_table($charset_collate) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'pika_reminders';
    $sql = "CREATE TABLE $table_name (
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

    dbDelta($sql);
  }

  /**
   * Check if all tables exist
   */
  public function check_tables_exist() {
    global $wpdb;

    $tables = [
      $wpdb->prefix . 'pika_accounts',
      $wpdb->prefix . 'pika_people',
      $wpdb->prefix . 'pika_categories',
      $wpdb->prefix . 'pika_tags',
      $wpdb->prefix . 'pika_transactions',
      $wpdb->prefix . 'pika_transaction_tags',
      $wpdb->prefix . 'pika_uploads',
      $wpdb->prefix . 'pika_transaction_attachments',
      $wpdb->prefix . 'pika_user_settings',
      $wpdb->prefix . 'pika_reminders'
    ];

    foreach ($tables as $table) {
      if ($wpdb->get_var("SHOW TABLES LIKE '$table'") != $table) {
        return false;
      }
    }

    return true;
  }

  /**
   * Drop all tables (development only)
   */
  public function drop_all_tables() {
    if (!defined('WP_DEBUG') || !WP_DEBUG) {
      return false;
    }

    global $wpdb;

    $tables = [
      $wpdb->prefix . 'pika_reminders',
      $wpdb->prefix . 'pika_transaction_attachments',
      $wpdb->prefix . 'pika_transaction_tags',
      $wpdb->prefix . 'pika_transactions',
      $wpdb->prefix . 'pika_tags',
      $wpdb->prefix . 'pika_categories',
      $wpdb->prefix . 'pika_people',
      $wpdb->prefix . 'pika_accounts',
      $wpdb->prefix . 'pika_uploads',
      $wpdb->prefix . 'pika_user_settings'
    ];

    foreach ($tables as $table) {
      $wpdb->query("DROP TABLE IF EXISTS $table");
    }

    return true;
  }
}
