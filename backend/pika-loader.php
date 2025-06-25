<?php

/**
 * Main plugin loader class
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_Loader {

    /**
     * Initialize the plugin
     */
    public function run() {
        $this->load_dependencies();
        $this->set_locale();
        // $this->define_admin_hooks();
        $this->define_public_hooks();
        $this->define_api_hooks();
    }

    /**
     * Load required dependencies
     */
    private function load_dependencies() {
        // Load utility functions
        require_once PIKA_PLUGIN_PATH . 'backend/utils.php';

        // Load API loader
        require_once PIKA_PLUGIN_PATH . 'backend/api-loader.php';

        // Load PWA loader
        require_once PIKA_PLUGIN_PATH . 'backend/pwa-loader.php';

        // Load admin page
        // require_once PIKA_PLUGIN_PATH . 'backend/admin/admin-page.php';
    }

    /**
     * Set locale for translations
     */
    private function set_locale() {
        load_plugin_textdomain(
            'pika-financial',
            false,
            dirname(PIKA_PLUGIN_BASENAME) . '/languages/'
        );
    }

    /**
     * Register admin hooks
     */
    // private function define_admin_hooks() {
    //     $admin_page = new Pika_Admin_Page();

    //     add_action('admin_menu', array($admin_page, 'add_admin_menu'));
    //     add_action('admin_enqueue_scripts', array($admin_page, 'enqueue_admin_scripts'));
    // }

    /**
     * Register public hooks
     */
    private function define_public_hooks() {
        $pwa_loader = new Pika_PWA_Loader();
    }

    /**
     * Register API hooks
     */
    private function define_api_hooks() {
        $api_loader = new Pika_API_Loader();
    }
}
