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
    
    private $namespace = 'pika_pw';
    private $build_dir;
    private $build_url;

    public function __construct() {
        $this->build_dir = plugin_dir_path(__FILE__) . '../frontend-build';
        $this->build_url = plugins_url('frontend-build', __FILE__);

        add_action('init', [$this, 'add_rewrite_rules']);
        add_action('template_redirect', [$this, 'serve_pwa']);
    }

    /**
     * Add rewrite rules to capture /pika/ routes.
     */
    public function add_rewrite_rules() {
        add_rewrite_rule(
            '^pika/(.*)?',
            'index.php?pika_pwa_route=$matches[1]',
            'top'
        );

        add_rewrite_tag('%pika_pwa_route%', '(.+)');
    }

    /**
     * Serve the PWA (index.html for routes, static assets otherwise)
     */
    public function serve_pwa() {
        $route = get_query_var('pika_pwa_route');

        if ($route === null) {
            return;
        }

        // If empty or it's not a static file, serve index.html (React router)
        if ($route === '' || !$this->is_static_file($route)) {
            $index_file = $this->build_dir . '/index.html';
            if (file_exists($index_file)) {
                header('Content-Type: text/html; charset=utf-8');
                readfile($index_file);
                exit;
            } else {
                wp_die('PWA index.html not found.', 'Error 404', ['response' => 404]);
            }
        }

        // If static file
        $file_path = realpath($this->build_dir . '/' . $route);

        // Security: Check if file exists and within build dir
        if (!$file_path || strpos($file_path, realpath($this->build_dir)) !== 0 || !file_exists($file_path)) {
            wp_die('File not found.', 'Error 404', ['response' => 404]);
        }

        $mime_type = $this->get_mime_type($file_path);
        if ($mime_type) {
            header('Content-Type: ' . $mime_type);
        }

        readfile($file_path);
        exit;
    }

    /**
     * Check if the route is a static file.
     */
    private function is_static_file($route) {
        return preg_match('/\.(js|css|png|jpe?g|gif|svg|ico|woff2?|ttf|eot|webp|json|txt|map)$/i', $route);
    }

    /**
     * Get proper MIME type.
     */
    private function get_mime_type($file) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

        $mime_types = [
            'js'   => 'application/javascript',
            'css'  => 'text/css',
            'json' => 'application/json',
            'png'  => 'image/png',
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif'  => 'image/gif',
            'svg'  => 'image/svg+xml',
            'ico'  => 'image/x-icon',
            'woff' => 'font/woff',
            'woff2'=> 'font/woff2',
            'ttf'  => 'font/ttf',
            'eot'  => 'application/vnd.ms-fontobject',
            'webp' => 'image/webp',
            'map'  => 'application/json',
            'txt'  => 'text/plain',
        ];

        return $mime_types[$ext] ?? false;
    }
} 