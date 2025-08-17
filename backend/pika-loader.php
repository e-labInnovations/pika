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
        $this->check_db_upgrade();
        $this->set_locale();
        $this->define_admin_hooks();
        $this->define_public_hooks();
        $this->define_api_hooks();
    }

    /**
     * Load required dependencies
     */
    private function load_dependencies() {
        // Load utility functions
        require_once PIKA_PLUGIN_PATH . 'backend/utils.php';

        // Load ai utils
        require_once PIKA_PLUGIN_PATH . 'backend/ai/prompts/ai-prompt-utils.php';

        // Load API loader
        require_once PIKA_PLUGIN_PATH . 'backend/api-loader.php';

        // Load frontend loader
        require_once PIKA_PLUGIN_PATH . 'backend/frontend-loader.php';

        // Load admin page
        require_once PIKA_PLUGIN_PATH . 'backend/admin/admin-page.php';
    }

    /**
     * Check if database upgrade is needed and run it
     */
    private function check_db_upgrade() {
        require_once PIKA_PLUGIN_PATH . 'backend/database/class-database-manager.php';

        $db_manager = new Pika_Database_Manager();

        // Run upgrade if needed
        if ($db_manager->needs_upgrade()) {
            $db_manager->upgrade();
        }
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
    private function define_admin_hooks() {
        $admin_page = new Pika_Admin_Page();

        add_action('admin_menu', array($admin_page, 'add_admin_menu'));
        add_action('admin_notices', array($this, 'admin_notices'));
        add_action('admin_init', array($this, 'admin_init'));
    }

    /**
     * Initialize admin functionality
     */
    public function admin_init() {
        // Check if plugin was just activated
        if (get_option('pika_activated', false)) {
            delete_option('pika_activated');
            wp_redirect(admin_url('admin.php?page=pika&activated=true'));
            exit;
        }
    }

    /**
     * Display admin notices
     */
    public function admin_notices() {
        // Show activation notice
        if (isset($_GET['page']) && $_GET['page'] === 'pika' && isset($_GET['activated'])) {
?>
            <div class="notice notice-success is-dismissible">
                <p><strong>Pika Financial</strong> plugin has been activated successfully!</p>
            </div>
<?php
        }

        // Database upgrade notices are now handled by Migration Manager
    }

    /**
     * Register public hooks
     */
    private function define_public_hooks() {
        // Load frontend loader
        $frontend_loader = new Pika_Frontend_Loader();
    }

    /**
     * Register API hooks
     */
    private function define_api_hooks() {
        $api_loader = new Pika_API_Loader();
    }
}
