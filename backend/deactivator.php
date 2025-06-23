<?php
/**
 * Plugin deactivation handler
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_Deactivator {
    
    /**
     * Deactivate the plugin
     */
    public static function deactivate() {
        self::flush_rewrite_rules();
        
        // Note: We don't delete tables or data on deactivation
        // This allows users to reactivate without losing data
        // Use uninstall.php for complete removal
    }
    
    /**
     * Flush rewrite rules
     */
    private static function flush_rewrite_rules() {
        flush_rewrite_rules();
    }
} 