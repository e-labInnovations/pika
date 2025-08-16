<?php

/**
 * Plugin activation handler
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_Activator {

    /**
     * Activate the plugin
     */
    public static function activate() {
        // Initialize database using the new database manager
        require_once PIKA_PLUGIN_PATH . 'backend/database/class-database-manager.php';

        $db_manager = new Pika_Database_Manager();
        $db_manager->initialize();

        self::create_upload_directories();
        self::flush_rewrite_rules();

        // Set installation timestamp if not exists
        if (!get_option('pika_installed_at')) {
            update_option('pika_installed_at', current_time('mysql'));
        }
    }

    /**
     * Create database tables (legacy method - now handled by Database Manager)
     * @deprecated Use Pika_Database_Manager instead
     */
    public static function create_database_tables() {
        // This method is deprecated and kept for backward compatibility
        // All database operations are now handled by Pika_Database_Manager
        _deprecated_function(__METHOD__, '1.1.0', 'Pika_Database_Manager');

        require_once PIKA_PLUGIN_PATH . 'backend/database/class-database-manager.php';
        $db_manager = new Pika_Database_Manager();
        $db_manager->initialize();
    }

    /**
     * Insert default data (legacy method - now handled by Seed Manager)
     * @deprecated Use Pika_Seed_Manager instead
     */
    private static function insert_default_data() {
        // This method is deprecated and kept for backward compatibility
        // All default data operations are now handled by Pika_Seed_Manager
        _deprecated_function(__METHOD__, '1.1.0', 'Pika_Seed_Manager');

        require_once PIKA_PLUGIN_PATH . 'backend/database/class-seed-manager.php';
        $seed_manager = new Pika_Seed_Manager();
        $seed_manager->insert_all_default_data();
    }

    /**
     * Create upload directories
     */
    private static function create_upload_directories() {
        $upload_dir = wp_upload_dir();
        $pika_dir = $upload_dir['basedir'] . '/pika';
        $avatars_dir = $pika_dir . '/avatars';
        $attachments_dir = $pika_dir . '/attachments';

        // Create directories if they don't exist
        if (!file_exists($pika_dir)) {
            wp_mkdir_p($pika_dir);
        }
        if (!file_exists($avatars_dir)) {
            wp_mkdir_p($avatars_dir);
        }
        if (!file_exists($attachments_dir)) {
            wp_mkdir_p($attachments_dir);
        }

        // Create .htaccess to protect uploads
        $htaccess_content = "Options -Indexes\n";
        file_put_contents($pika_dir . '/.htaccess', $htaccess_content);
    }

    /**
     * Flush rewrite rules
     */
    private static function flush_rewrite_rules() {
        flush_rewrite_rules();
    }
}
