<?php

/**
 * Admin page handler for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_Admin_Page {

    /**
     * Constructor
     */
    public function __construct() {
        // Initialize admin hooks
        add_action('admin_init', array($this, 'admin_init'));
    }

    /**
     * Initialize admin functionality
     */
    public function admin_init() {
        // Add admin scripts and styles
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));

        add_action('admin_footer', array($this, 'add_admin_footer'));
    }

    /**
     * Add admin menu items
     */
    public function add_admin_menu() {
        // Main menu page
        add_menu_page(
            'Pika Financial',
            'Pika',
            'manage_options',
            'pika',
            array($this, 'admin_page'),
            // Custom SVG icon for the menu
            PIKA_PLUGIN_URL . 'backend/admin/assets/icon.svg',
            30
        );

        // Submenu items
        add_submenu_page(
            'pika',
            'Dashboard',
            'Dashboard',
            'manage_options',
            'pika',
            array($this, 'admin_page')
        );

        // Link to open Pika PWA in new tab
        add_submenu_page(
            'pika',
            'Pika App',
            'Pika App',
            'manage_options',
            'pika-app',
            '__return_null'
        );

        add_submenu_page(
            'pika',
            'Settings',
            'Settings',
            'manage_options',
            'pika-settings',
            array($this, 'settings_page')
        );
    }

    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        // Only load on Pika admin pages
        if (strpos($hook, 'pika') === false) {
            return;
        }

        $manifest = require PIKA_PLUGIN_PATH . 'backend/admin/build/main.asset.php';
        
        // Enqueue CSS first
        wp_enqueue_style(
            'pika-admin-style',
            PIKA_PLUGIN_URL . 'backend/admin/build/main.css',
            array(),
            $manifest['version']
        );

        // Enqueue JavaScript
        wp_enqueue_script(
            'pika-admin-script',
            PIKA_PLUGIN_URL . 'backend/admin/build/main.js',
            $manifest['dependencies'],
            $manifest['version']
        );

        wp_localize_script(
            'pika-admin-script',
            'pikaAdmin',
            [
                'cssUrl' => PIKA_PLUGIN_URL . 'backend/admin/build/main.css',
            ]
        );
    }

    /**
     * Add admin footer
     */
    public function add_admin_footer() {
?>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                let link = document.querySelector('#toplevel_page_pika ul.wp-submenu a[href*="pika-app"]');
                if (link) {
                    link.setAttribute('href', '<?php echo PIKA_APP_URL; ?>'); // external link
                    link.setAttribute('target', '_blank');
                }
            });
        </script>
    <?php
    }

    /**
     * Main admin page content
     */
    public function admin_page() {
    ?>
        <div class="wrap">
            <div id="pika-dashboard"></div>
        </div>
    <?php
    }

    /**
     * Settings page content
     */
    public function settings_page() {
    ?>
        <div class="wrap">
            <div id="pika-settings"></div>
        </div>
    <?php
    }

    /**
     * Pika App page content
     */
    public function app_page() {
    ?>
        <div class="wrap">
            <h1>Pika App</h1>
            <p>Pika App page content will be implemented here.</p>
        </div>
<?php
    }
}
