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
        // Include default data
        require_once PIKA_PLUGIN_PATH . 'backend/data/default-data.php';

        self::create_database_tables();
        self::insert_default_data();
        self::create_upload_directories();
        self::flush_rewrite_rules();
    }

    /**
     * Create database tables
     */
    private static function create_database_tables() {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        // Accounts table
        $accounts_table = $wpdb->prefix . 'pika_accounts';
        $sql_accounts = "CREATE TABLE $accounts_table (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            name varchar(255) NOT NULL,
            icon varchar(100) NOT NULL DEFAULT 'wallet',
            bg_color varchar(7) NOT NULL DEFAULT '#3B82F6',
            color varchar(7) NOT NULL DEFAULT '#ffffff',
            avatar text,
            description text,
            is_active tinyint(1) NOT NULL DEFAULT 1,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY is_active (is_active)
        ) $charset_collate;";

        // People table
        $people_table = $wpdb->prefix . 'pika_people';
        $sql_people = "CREATE TABLE $people_table (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            name varchar(255) NOT NULL,
            email varchar(255),
            phone varchar(50),
            avatar text,
            description text,
            is_active tinyint(1) NOT NULL DEFAULT 1,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY email (email),
            KEY is_active (is_active)
        ) $charset_collate;";

        // Categories table
        $categories_table = $wpdb->prefix . 'pika_categories';
        $sql_categories = "CREATE TABLE $categories_table (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            parent_id bigint(20) unsigned DEFAULT NULL,
            name varchar(255) NOT NULL,
            icon varchar(100) NOT NULL DEFAULT 'folder',
            color varchar(7) NOT NULL DEFAULT '#3B82F6',
            bg_color varchar(7) NOT NULL DEFAULT '#ffffff',
            type enum('income','expense','transfer') NOT NULL,
            description text,
            is_system tinyint(1) NOT NULL DEFAULT 0,
            is_active tinyint(1) NOT NULL DEFAULT 1,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY parent_id (parent_id),
            KEY type (type),
            KEY is_system (is_system),
            KEY is_active (is_active)
        ) $charset_collate;";

        // Tags table
        $tags_table = $wpdb->prefix . 'pika_tags';
        $sql_tags = "CREATE TABLE $tags_table (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            name varchar(255) NOT NULL,
            icon varchar(100) NOT NULL DEFAULT 'tag',
            color varchar(7) NOT NULL DEFAULT '#3B82F6',
            bg_color varchar(7) NOT NULL DEFAULT '#ffffff',
            description text,
            is_system tinyint(1) NOT NULL DEFAULT 0,
            is_active tinyint(1) NOT NULL DEFAULT 1,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY is_system (is_system),
            KEY is_active (is_active)
        ) $charset_collate;";

        // Transactions table
        $transactions_table = $wpdb->prefix . 'pika_transactions';
        $sql_transactions = "CREATE TABLE $transactions_table (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            title varchar(255) NOT NULL,
            amount decimal(15,2) NOT NULL,
            date datetime NOT NULL,
            type enum('income','expense','transfer') NOT NULL,
            category_id bigint(20) unsigned NOT NULL,
            account_id bigint(20) unsigned NOT NULL,
            to_account_id bigint(20) unsigned DEFAULT NULL,
            person_id bigint(20) unsigned DEFAULT NULL,
            note text,
            currency varchar(3) NOT NULL DEFAULT 'USD',
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

        // Transaction tags table
        $transaction_tags_table = $wpdb->prefix . 'pika_transaction_tags';
        $sql_transaction_tags = "CREATE TABLE $transaction_tags_table (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            transaction_id bigint(20) unsigned NOT NULL,
            tag_id bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY transaction_tag_unique (transaction_id,tag_id),
            KEY transaction_id (transaction_id),
            KEY tag_id (tag_id)
        ) $charset_collate;";

        // Transaction attachments table
        $transaction_attachments_table = $wpdb->prefix . 'pika_transaction_attachments';
        $sql_transaction_attachments = "CREATE TABLE $transaction_attachments_table (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            transaction_id bigint(20) unsigned NOT NULL,
            name varchar(255) NOT NULL,
            url text NOT NULL,
            type enum('image','pdf') NOT NULL DEFAULT 'image',
            file_size bigint(20) unsigned DEFAULT NULL,
            mime_type varchar(100) DEFAULT NULL,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY transaction_id (transaction_id),
            KEY type (type)
        ) $charset_collate;";

        // User settings table
        $user_settings_table = $wpdb->prefix . 'pika_user_settings';
        $sql_user_settings = "CREATE TABLE $user_settings_table (
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

        // Execute all SQL statements
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        dbDelta($sql_accounts);
        dbDelta($sql_people);
        dbDelta($sql_categories);
        dbDelta($sql_tags);
        dbDelta($sql_transactions);
        dbDelta($sql_transaction_tags);
        dbDelta($sql_transaction_attachments);
        dbDelta($sql_user_settings);
    }

    /**
     * Insert default data
     */
    private static function insert_default_data() {
        self::insert_system_categories();
        self::insert_system_tags();
    }

    /**
     * Insert system categories
     */
    private static function insert_system_categories() {
        global $wpdb;

        $categories_table = $wpdb->prefix . 'pika_categories';

        // Insert expense categories
        self::insert_categories_with_children(Pika_Default_Data::DEFAULT_EXPENSE_CATEGORIES, 0);

        // Insert income categories
        self::insert_categories_with_children(Pika_Default_Data::DEFAULT_INCOME_CATEGORIES, 0);

        // Insert transfer categories
        self::insert_categories_with_children(Pika_Default_Data::DEFAULT_TRANSFER_CATEGORIES, 0);
    }

    /**
     * Insert categories with their children
     */
    private static function insert_categories_with_children($categories, $user_id) {
        global $wpdb;

        $categories_table = $wpdb->prefix . 'pika_categories';

        foreach ($categories as $category) {
            // Insert parent category
            $parent_data = [
                'user_id' => $user_id,
                'name' => $category['name'],
                'icon' => $category['icon'],
                'color' => $category['color'],
                'bg_color' => $category['bg_color'],
                'type' => $category['type'],
                'description' => $category['description'],
                'is_system' => $category['is_system'],
                'is_active' => 1
            ];

            $wpdb->insert($categories_table, $parent_data);
            $parent_id = $wpdb->insert_id;

            // Insert children if they exist
            if (!empty($category['children'])) {
                foreach ($category['children'] as $child) {
                    $child_data = [
                        'user_id' => $user_id,
                        'parent_id' => $parent_id,
                        'name' => $child['name'],
                        'icon' => $child['icon'],
                        'color' => $child['color'],
                        'bg_color' => $child['bg_color'],
                        'type' => $child['type'],
                        'description' => $child['description'],
                        'is_system' => $child['is_system'],
                        'is_active' => 1
                    ];

                    $wpdb->insert($categories_table, $child_data);
                }
            }
        }
    }

    /**
     * Insert system tags
     */
    private static function insert_system_tags() {
        global $wpdb;

        $tags_table = $wpdb->prefix . 'pika_tags';

        foreach (Pika_Default_Data::DEFAULT_TAGS as $tag) {
            $tag_data = [
                'user_id' => 0, // 0 for system tags
                'name' => $tag['name'],
                'icon' => $tag['icon'],
                'color' => $tag['color'],
                'bg_color' => $tag['bg_color'],
                'description' => $tag['description'],
                'is_system' => $tag['is_system'],
                'is_active' => 1
            ];

            $wpdb->insert($tags_table, $tag_data);
        }
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
