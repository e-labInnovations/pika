<?php
/**
 * Uninstall script for Pika plugin
 * 
 * This file is executed when the plugin is deleted from WordPress admin
 */

// If uninstall not called from WordPress, exit
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

// Delete plugin options
delete_option('pika_settings');

// Drop custom tables
global $wpdb;

$tables = [
    $wpdb->prefix . 'pika_accounts',
    $wpdb->prefix . 'pika_people',
    $wpdb->prefix . 'pika_categories',
    $wpdb->prefix . 'pika_tags',
    $wpdb->prefix . 'pika_transactions',
    $wpdb->prefix . 'pika_transaction_tags',
    $wpdb->prefix . 'pika_transaction_attachments',
    $wpdb->prefix . 'pika_user_settings'
];

foreach ($tables as $table) {
    $wpdb->query("DROP TABLE IF EXISTS $table");
}

// Remove uploaded files
$upload_dir = wp_upload_dir();
$pika_dir = $upload_dir['basedir'] . '/pika';

if (is_dir($pika_dir)) {
    // Recursively delete the pika upload directory
    function delete_directory($dir) {
        if (!is_dir($dir)) {
            return;
        }
        
        $files = array_diff(scandir($dir), ['.', '..']);
        
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            
            if (is_dir($path)) {
                delete_directory($path);
            } else {
                unlink($path);
            }
        }
        
        rmdir($dir);
    }
    
    delete_directory($pika_dir);
}

// Clear any cached data
wp_cache_flush(); 