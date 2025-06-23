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
        
        $system_categories = [
            // Expense categories
            [
                'name' => 'Food & Dining',
                'icon' => 'shopping-cart',
                'bg_color' => '#f97316',
                'color' => '#ffffff',
                'type' => 'expense',
                'description' => 'Food and dining expenses',
                'is_system' => 1
            ],
            [
                'name' => 'Transportation',
                'icon' => 'car',
                'bg_color' => '#3b82f6',
                'color' => '#ffffff',
                'type' => 'expense',
                'description' => 'Transportation expenses',
                'is_system' => 1
            ],
            [
                'name' => 'Entertainment',
                'icon' => 'tv',
                'bg_color' => '#8b5cf6',
                'color' => '#ffffff',
                'type' => 'expense',
                'description' => 'Entertainment expenses',
                'is_system' => 1
            ],
            [
                'name' => 'Shopping',
                'icon' => 'shopping-bag',
                'bg_color' => '#ec4899',
                'color' => '#ffffff',
                'type' => 'expense',
                'description' => 'Shopping expenses',
                'is_system' => 1
            ],
            [
                'name' => 'Healthcare',
                'icon' => 'heart',
                'bg_color' => '#ef4444',
                'color' => '#ffffff',
                'type' => 'expense',
                'description' => 'Healthcare expenses',
                'is_system' => 1
            ],
            // Income categories
            [
                'name' => 'Salary',
                'icon' => 'briefcase',
                'bg_color' => '#10b981',
                'color' => '#ffffff',
                'type' => 'income',
                'description' => 'Salary income',
                'is_system' => 1
            ],
            [
                'name' => 'Freelance',
                'icon' => 'laptop',
                'bg_color' => '#f59e0b',
                'color' => '#ffffff',
                'type' => 'income',
                'description' => 'Freelance income',
                'is_system' => 1
            ],
            [
                'name' => 'Investment',
                'icon' => 'trending-up',
                'bg_color' => '#06b6d4',
                'color' => '#ffffff',
                'type' => 'income',
                'description' => 'Investment income',
                'is_system' => 1
            ]
        ];
        
        foreach ($system_categories as $category) {
            $wpdb->insert(
                $categories_table,
                array_merge($category, ['user_id' => 0]) // 0 for system categories
            );
        }
    }
    
    /**
     * Insert system tags
     */
    private static function insert_system_tags() {
        global $wpdb;
        
        $tags_table = $wpdb->prefix . 'pika_tags';
        
        $system_tags = [
            [
                'name' => 'Coffee',
                'icon' => 'coffee',
                'color' => '#ffffff',
                'bg_color' => '#f59e0b',
                'description' => 'Coffee expenses',
                'is_system' => 1
            ],
            [
                'name' => 'Birthday',
                'icon' => 'cake',
                'color' => '#ffffff',
                'bg_color' => '#ec4899',
                'description' => 'Birthday celebrations',
                'is_system' => 1
            ],
            [
                'name' => 'Business',
                'icon' => 'briefcase',
                'color' => '#ffffff',
                'bg_color' => '#3b82f6',
                'description' => 'Business expenses',
                'is_system' => 1
            ]
        ];
        
        foreach ($system_tags as $tag) {
            $wpdb->insert(
                $tags_table,
                array_merge($tag, ['user_id' => 0]) // 0 for system tags
            );
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