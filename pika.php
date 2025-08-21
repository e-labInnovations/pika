<?php

/**
 * Plugin Name: Pika Finance
 * Plugin URI: https://pika.elabins.com
 * Description: Complete financial management solution for WordPress
 * Version: 1.0.0
 * Author: e-lab innovations
 * License: GPL v2 or later
 * Text Domain: pika-financial
 * Domain Path: /languages
 * Requires at least: 6.0
 * Tested up to: 6.4
 * Requires PHP: 8.1
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('PIKA_PLUGIN_URL', plugin_dir_url(__FILE__));
define('PIKA_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('PIKA_PLUGIN_VERSION', '1.0.0');
define('PIKA_PLUGIN_BASENAME', plugin_basename(__FILE__));
define('PIKA_DB_VERSION', '1.3.0');
define('PIKA_APP_URL', get_site_url() . '/pika');

// Load libraries autoloader (composer)
if (file_exists(PIKA_PLUGIN_PATH . 'backend/libraries/vendor/autoload.php')) {
    require_once PIKA_PLUGIN_PATH . 'backend/libraries/vendor/autoload.php';
}

// Include the main plugin class
require_once PIKA_PLUGIN_PATH . 'backend/pika-loader.php';

// Initialize the plugin
function pika_init() {
    $plugin = new Pika_Loader();
    $plugin->run();
}
add_action('plugins_loaded', 'pika_init');

// Activation hook
register_activation_hook(__FILE__, 'pika_activate');
function pika_activate() {
    require_once PIKA_PLUGIN_PATH . 'backend/activator.php';
    Pika_Activator::activate();
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'pika_deactivate');
function pika_deactivate() {
    require_once PIKA_PLUGIN_PATH . 'backend/deactivator.php';
    Pika_Deactivator::deactivate();
}
