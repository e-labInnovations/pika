<?php
/**
 * PWA loader for serving the React app
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_PWA_Loader {
    
    /**
     * Initialize the PWA loader
     */
    public function __construct() {
        add_action('init', array($this, 'add_rewrite_rule'));
        add_filter('template_include', array($this, 'serve_pwa'), 99);
        add_action('template_redirect', array($this, 'handle_static_files'));
    }
    
    /**
     * Add rewrite rule for PWA
     */
    public function add_rewrite_rule() {
        add_rewrite_rule('^pika(?:/.*)?$', 'index.php?pika_pwa=1', 'top');
        add_rewrite_tag('%pika_pwa%', '1');
    }
    
    /**
     * Serve PWA app
     */
    public function serve_pwa($template) {
        if (get_query_var('pika_pwa') === '1') {
            $pwa_index = PIKA_PLUGIN_PATH . 'frontend-build/index.html';
            
            if (file_exists($pwa_index)) {
                // Set headers for HTML
                header("Content-Type: text/html");
                header("Cache-Control: no-cache, no-store, must-revalidate");
                header("Pragma: no-cache");
                header("Expires: 0");
                
                readfile($pwa_index);
                exit;
            } else {
                // Fallback if build doesn't exist
                wp_die('Pika app is not built yet. Please build the frontend first.');
            }
        }
        
        return $template;
    }
    
    /**
     * Handle static files (JS, CSS, etc.)
     */
    public function handle_static_files() {
        $uri = $_SERVER['REQUEST_URI'];
        
        if (strpos($uri, '/pika/') === 0 && preg_match('/\.(js|css|json|png|ico|txt|webmanifest|svg|woff|woff2|ttf|eot)$/', $uri)) {
            $file_path = PIKA_PLUGIN_PATH . 'frontend-build' . str_replace('/pika', '', $uri);
            
            if (file_exists($file_path)) {
                $ext = pathinfo($file_path, PATHINFO_EXTENSION);
                $mime_types = [
                    'js' => 'application/javascript',
                    'css' => 'text/css',
                    'json' => 'application/json',
                    'ico' => 'image/x-icon',
                    'png' => 'image/png',
                    'svg' => 'image/svg+xml',
                    'webmanifest' => 'application/manifest+json',
                    'woff' => 'font/woff',
                    'woff2' => 'font/woff2',
                    'ttf' => 'font/ttf',
                    'eot' => 'application/vnd.ms-fontobject',
                    'txt' => 'text/plain'
                ];
                
                $mime_type = $mime_types[$ext] ?? 'text/plain';
                
                // Set appropriate headers
                header("Content-Type: $mime_type");
                header("Cache-Control: public, max-age=31536000"); // 1 year cache
                
                // For fonts, add CORS headers
                if (in_array($ext, ['woff', 'woff2', 'ttf', 'eot'])) {
                    header("Access-Control-Allow-Origin: *");
                }
                
                readfile($file_path);
                exit;
            }
        }
    }
    
    /**
     * Get PWA URL
     */
    public static function get_pwa_url() {
        return home_url('/pika/');
    }
    
    /**
     * Check if PWA is accessible
     */
    public static function is_pwa_accessible() {
        $pwa_index = PIKA_PLUGIN_PATH . 'frontend-build/index.html';
        return file_exists($pwa_index);
    }
} 