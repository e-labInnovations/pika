<?php

/**
 * Frontend loader for serving the React app
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_Frontend_Loader {
    private $route = 'pika';
    private $query_var = 'pika_frontend_loader';
    private $build_dir;

    public function __construct() {
        $this->build_dir = PIKA_PLUGIN_PATH . 'frontend-build';

        add_action('init', [$this, 'add_rewrite_rule']);
        add_action('template_redirect', [$this, 'serve_spa']);
        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);
        add_filter('redirect_canonical', [$this, 'prevent_trailing_slash_redirect'], 10, 2);
    }

    /**
     * Add rewrite rule to capture /pika-frontend/ routes.
     */
    public function add_rewrite_rule() {
        add_rewrite_tag("%{$this->query_var}%", '1');
        add_rewrite_rule("^{$this->route}(?:/.*)?$", "index.php?{$this->query_var}=1", 'top');
    }

    /**
     * Serve the SPA (index.html for routes, static assets otherwise)
     */
    public function serve_spa() {
        if (!get_query_var($this->query_var)) return;

        $request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $base_path = '/' . $this->route;
        $relative_path = substr($request_uri, strlen($base_path));
        $relative_path = trim($relative_path, '/');

        // Default to index.html for root or unknown path
        $file_path = $this->build_dir . '/' . ($relative_path ?: 'index.html');

        // If the request ends in / and no file, fallback to index.html
        if (!file_exists($file_path)) {
            // Also try stripping trailing slash if it's like .js/
            $maybe_file_path = rtrim($file_path, '/');
            if (file_exists($maybe_file_path)) {
                $file_path = $maybe_file_path;
            } else {
                $file_path = $this->build_dir . '/index.html'; // Final fallback
            }
        }

        if (file_exists($file_path)) {
            $mime = $this->get_mime_type($file_path);
            header('Content-Type: ' . $mime);
            readfile($file_path);
            exit;
        }

        status_header(404);
        echo "File not found.";
        exit;
    }


    /**
     * Activate the plugin
     */
    public function activate() {
        $this->add_rewrite_rule();
        flush_rewrite_rules();
    }

    /**
     * Deactivate the plugin
     */
    public function deactivate() {
        flush_rewrite_rules();
    }

    public function prevent_trailing_slash_redirect($redirect_url, $requested_url) {
        if (get_query_var($this->query_var)) {
            return false; // Prevent WordPress auto-fixing to trailing slash
        }
        return $redirect_url;
    }

    private function get_mime_type($file_path) {
        // First try WordPress's built-in MIME type detection
        $wp_mime = wp_check_filetype($file_path)['type'] ?? '';

        // If WordPress returned a valid MIME type, use it
        if (!empty($wp_mime)) {
            return $wp_mime;
        }

        // Fallback to extension-based detection
        $ext = strtolower(pathinfo($file_path, PATHINFO_EXTENSION));

        $mime_map = [
            'js'   => 'application/javascript; charset=utf-8',
            'mjs'  => 'application/javascript; charset=utf-8', // ES6 modules
            'css'  => 'text/css',
            'json' => 'application/json',
            'html' => 'text/html',
            'htm'  => 'text/html',
            'png'  => 'image/png',
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif'  => 'image/gif',
            'svg'  => 'image/svg+xml',
            'ico'  => 'image/x-icon',
            'map'  => 'application/json',
            'woff' => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf'  => 'font/ttf',
            'eot'  => 'application/vnd.ms-fontobject',
            'otf'  => 'font/otf',
            'webp' => 'image/webp',
        ];

        return $mime_map[$ext] ?? 'application/octet-stream';
    }
}
