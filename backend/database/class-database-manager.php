<?php

/**
 * Main Database Manager for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Database_Manager {

  /**
   * Database version
   */
  const DB_VERSION = '1.1.0';

  /**
   * Table managers
   */
  private $table_manager;
  private $migration_manager;
  private $seed_manager;

  /**
   * Constructor
   */
  public function __construct() {
    $this->load_dependencies();
    $this->init_managers();
  }

  /**
   * Load required dependencies
   */
  private function load_dependencies() {
    require_once PIKA_PLUGIN_PATH . 'backend/database/class-table-manager.php';
    require_once PIKA_PLUGIN_PATH . 'backend/database/class-migration-manager.php';
    require_once PIKA_PLUGIN_PATH . 'backend/database/class-seed-manager.php';
  }

  /**
   * Initialize managers
   */
  private function init_managers() {
    $this->table_manager = new Pika_Table_Manager();
    $this->migration_manager = new Pika_Migration_Manager();
    $this->seed_manager = new Pika_Seed_Manager();
  }

  /**
   * Initialize database (called during activation)
   */
  public function initialize() {
    try {
      // Create tables
      $this->table_manager->create_all_tables();

      // Check if we need to insert default data
      if ($this->should_insert_default_data()) {
        $this->seed_manager->insert_all_default_data();
      }

      // Update database version
      update_option('pika_db_version', self::DB_VERSION);

      return true;
    } catch (Exception $e) {
      error_log('Pika Database Initialization Failed: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Check if database upgrade is needed
   */
  public function needs_upgrade() {
    $current_version = get_option('pika_db_version', '0.0.0');
    return version_compare($current_version, self::DB_VERSION, '<');
  }

  /**
   * Run database upgrades
   */
  public function upgrade() {
    try {
      $current_version = get_option('pika_db_version', '0.0.0');

      if ($this->needs_upgrade()) {
        $this->migration_manager->run_migrations($current_version, self::DB_VERSION);

        // Update database version
        update_option('pika_db_version', self::DB_VERSION);
        update_option('pika_last_upgrade', current_time('mysql'));

        return true;
      }

      return false;
    } catch (Exception $e) {
      error_log('Pika Database Upgrade Failed: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Check if default data should be inserted
   */
  private function should_insert_default_data() {
    $current_version = get_option('pika_db_version', '0.0.0');

    // Insert if version is exactly 1.0.0 (fresh install)
    if (version_compare($current_version, '1.0.0', '=')) {
      return true;
    }

    // Insert if tables are empty
    return $this->seed_manager->are_tables_empty();
  }

  /**
   * Get current database version
   */
  public function get_current_version() {
    return get_option('pika_db_version', '0.0.0');
  }

  /**
   * Get target database version
   */
  public function get_target_version() {
    return self::DB_VERSION;
  }

  /**
   * Check database health
   */
  public function check_health() {
    return $this->table_manager->check_tables_exist();
  }

  /**
   * Reset database (development only)
   */
  public function reset_database() {
    if (!defined('WP_DEBUG') || !WP_DEBUG) {
      return false;
    }

    try {
      $this->table_manager->drop_all_tables();
      $this->table_manager->create_all_tables();
      $this->seed_manager->insert_all_default_data();

      update_option('pika_db_version', self::DB_VERSION);
      return true;
    } catch (Exception $e) {
      error_log('Pika Database Reset Failed: ' . $e->getMessage());
      return false;
    }
  }
}
