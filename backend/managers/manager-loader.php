<?php

/**
 * Manager loader for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

// Include base manager
require_once plugin_dir_path(__FILE__) . 'base-manager.php';

// Include all manager classes
require_once plugin_dir_path(__FILE__) . 'auth-manager.php';
require_once plugin_dir_path(__FILE__) . 'accounts-manager.php';
require_once plugin_dir_path(__FILE__) . 'transactions-manager.php';
require_once plugin_dir_path(__FILE__) . 'categories-manager.php';
require_once plugin_dir_path(__FILE__) . 'people-manager.php';
require_once plugin_dir_path(__FILE__) . 'tags-manager.php';
require_once plugin_dir_path(__FILE__) . 'settings-manager.php';
require_once plugin_dir_path(__FILE__) . 'analytics-manager.php';
require_once plugin_dir_path(__FILE__) . 'upload-manager.php';

/**
 * Initialize all managers
 */
function pika_init_managers() {
  global $pika_managers;

  $pika_managers = [
    'auth' => new Pika_Auth_Manager(),
    'accounts' => new Pika_Accounts_Manager(),
    'transactions' => new Pika_Transactions_Manager(),
    'categories' => new Pika_Categories_Manager(),
    'people' => new Pika_People_Manager(),
    'tags' => new Pika_Tags_Manager(),
    'settings' => new Pika_Settings_Manager(),
    'analytics' => new Pika_Analytics_Manager(),
    'upload' => new Pika_Upload_Manager()
  ];
}

/**
 * Get manager instance
 */
function pika_get_manager($manager_name) {
  global $pika_managers;

  if (!isset($pika_managers)) {
    pika_init_managers();
  }

  return isset($pika_managers[$manager_name]) ? $pika_managers[$manager_name] : null;
}

// Initialize managers when WordPress loads
add_action('init', 'pika_init_managers');
