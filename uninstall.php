<?php

/**
 * Plugin uninstall handler
 * 
 * This file is called when the plugin is uninstalled.
 * By default, we preserve all user data to prevent accidental data loss.
 * Users can opt-in to data removal via plugin settings.
 * 
 * @package Pika
 */

// Prevent direct access
if (!defined('WP_UNINSTALL_PLUGIN')) {
  exit;
}

class Pika_Uninstaller {

  /**
   * Handle plugin uninstallation
   */
  public static function uninstall() {
    // Check if user explicitly opted to remove data
    $remove_data = get_option('pika_remove_data_on_uninstall', false); // For future use

    if ($remove_data) {
      self::remove_all_data();
    } else {
      // Default behavior: Keep all data for potential reinstallation
      self::cleanup_temporary_data();
    }

    // Always remove plugin-specific options that don't contain user data
    self::cleanup_plugin_options();
  }

  /**
   * Remove all plugin data (only if user explicitly opted in)
   */
  private static function remove_all_data() {
    global $wpdb;

    // Drop all plugin tables
    $tables = [
      $wpdb->prefix . 'pika_accounts',
      $wpdb->prefix . 'pika_people',
      $wpdb->prefix . 'pika_categories',
      $wpdb->prefix . 'pika_tags',
      $wpdb->prefix . 'pika_transactions',
      $wpdb->prefix . 'pika_transaction_tags',
      $wpdb->prefix . 'pika_uploads',
      $wpdb->prefix . 'pika_transaction_attachments',
      $wpdb->prefix . 'pika_user_settings'
    ];

    foreach ($tables as $table) {
      $wpdb->query($wpdb->prepare("DROP TABLE IF EXISTS %i", $table));
    }

    // Remove uploaded files
    self::remove_uploaded_files();

    // Remove all user data options
    self::remove_user_data_options();

    error_log('Pika: All user data removed during uninstallation as requested by user.');
  }

  /**
   * Clean up only temporary data (default behavior)
   */
  private static function cleanup_temporary_data() {
    // Remove transients and cache
    delete_transient('pika_cache_analytics');
    delete_transient('pika_cache_dashboard');

    // Keep user data but log the preservation
    error_log('Pika: Plugin uninstalled. User data preserved for potential reinstallation.');
  }

  /**
   * Remove plugin-specific options that don't contain user data
   */
  private static function cleanup_plugin_options() {
    // Remove activation/installation tracking
    delete_option('pika_installed_at');
    delete_option('pika_last_upgrade');
    delete_option('pika_last_schema_refresh');

    // Keep pika_db_version for potential reinstallation
    // Keep pika_remove_data_on_uninstall for user preference
  }

  /**
   * Remove user data options
   */
  private static function remove_user_data_options() {
    delete_option('pika_db_version');
    delete_option('pika_remove_data_on_uninstall');

    // Remove user-specific settings
    global $wpdb;
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE 'pika_%'");
  }

  /**
   * Remove all uploaded files
   */
  private static function remove_uploaded_files() {
    $upload_dir = wp_upload_dir();
    $pika_dir = $upload_dir['basedir'] . '/pika';

    if (is_dir($pika_dir)) {
      self::remove_directory_recursive($pika_dir);
    }
  }

  /**
   * Recursively remove directory and all contents
   * 
   * @param string $dir Directory path
   */
  private static function remove_directory_recursive($dir) {
    if (!is_dir($dir)) {
      return false;
    }

    $files = array_diff(scandir($dir), array('.', '..'));

    foreach ($files as $file) {
      $path = $dir . '/' . $file;
      if (is_dir($path)) {
        self::remove_directory_recursive($path);
      } else {
        unlink($path);
      }
    }

    return rmdir($dir);
  }
}

// Run the uninstaller
Pika_Uninstaller::uninstall();
