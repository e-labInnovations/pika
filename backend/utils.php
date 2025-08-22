<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Utility functions for Pika plugin
 * 
 * @package Pika
 */

 use DeviceDetector\DeviceDetector;

class Pika_Utils {

    /**
     * Check if ABSPATH is defined
     */
    public static function reject_abs_path() {
        if (!defined('ABSPATH')) {
            exit;
        }
    }

    /**
     * Get current user ID with validation
     */
    public static function get_current_user_id() {
        return get_current_user_id(); // The current user’s ID, or 0 if no user is logged in.
    }

    /**
     * Validate and sanitize request data
     */
    public static function sanitize_request_data($data, $fields) {
        $sanitized = [];

        foreach ($fields as $field => $type) {
            if (isset($data[$field])) {
                switch ($type) {
                    case 'string':
                        $sanitized[$field] = sanitize_text_field($data[$field]);
                        break;
                    case 'email':
                        $sanitized[$field] = sanitize_email($data[$field]);
                        break;
                    case 'url':
                        $sanitized[$field] = esc_url_raw($data[$field]);
                        break;
                    case 'int':
                        $sanitized[$field] = intval($data[$field]);
                        break;
                    case 'float':
                        $sanitized[$field] = floatval($data[$field]);
                        break;
                    case 'bool':
                        $sanitized[$field] = (bool) $data[$field];
                        break;
                    case 'array':
                        $sanitized[$field] = is_array($data[$field]) ? array_map('sanitize_text_field', $data[$field]) : [];
                        break;
                    case 'text':
                        $sanitized[$field] = sanitize_textarea_field($data[$field]);
                        break;
                    default:
                        $sanitized[$field] = sanitize_text_field($data[$field]);
                }
            }
        }

        return $sanitized;
    }

    /**
     * Generate unique filename for uploads
     */
    public static function generate_unique_filename($original_name, $extension = null) {
        if (!$extension) {
            $extension = pathinfo($original_name, PATHINFO_EXTENSION);
        }

        $unique_string = wp_generate_password(8, false);
        $timestamp = time();

        return $timestamp . '-' . $unique_string . '.' . $extension;
    }

    /**
     * Get upload directory for Pika
     */
    public static function get_upload_dir($type = 'avatars') {
        $upload_dir = wp_upload_dir();
        $pika_dir = $upload_dir['basedir'] . '/pika/' . $type;

        // Create directory if it doesn't exist
        if (!file_exists($pika_dir)) {
            wp_mkdir_p($pika_dir);
        }

        return $pika_dir;
    }

    /**
     * Get upload URL for Pika
     */
    public static function get_upload_url($type = 'avatars') {
        $upload_dir = wp_upload_dir();
        return $upload_dir['baseurl'] . '/pika/' . $type;
    }

    /**
     * Handle file upload
     */
    public static function handle_file_upload($file, $type = 'avatars') {
        if (!$file || !isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            return new WP_Error('invalid_file', 'Invalid file upload');
        }

        // Check file size (5MB limit)
        if ($file['size'] > 5 * 1024 * 1024) {
            return new WP_Error('file_too_large', 'File size exceeds 5MB limit');
        }

        // Check file type
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'];
        if (!in_array($file['type'], $allowed_types)) {
            return new WP_Error('invalid_file_type', 'File type not allowed');
        }

        $upload_dir = self::get_upload_dir($type);
        $filename = self::generate_unique_filename($file['name']);
        $filepath = $upload_dir . '/' . $filename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            return new WP_Error('upload_failed', 'Failed to move uploaded file');
        }

        // Generate URL
        $upload_url = self::get_upload_url($type);
        $file_url = $upload_url . '/' . $filename;

        return [
            'url' => $file_url,
            'filename' => $filename,
            'size' => $file['size'],
            'type' => $file['type']
        ];
    }

    /**
     * Format currency
     */
    public static function format_currency($amount, $currency = 'INR') {
        return number_format($amount, 2) . ' ' . $currency;
    }

    /**
     * Parse date string to MySQL format
     */
    public static function parse_date($date_string) {
        $timestamp = strtotime($date_string);
        if ($timestamp === false) {
            return current_time('mysql');
        }
        return date('Y-m-d H:i:s', $timestamp);
    }

    /**
     * Get pagination parameters
     */
    public static function get_pagination_params($request) {
        $page = max(1, intval($request->get_param('page') ?: 1));
        $per_page = min(100, max(1, intval($request->get_param('per_page') ?: 20)));
        $offset = ($page - 1) * $per_page;

        return [
            'page' => $page,
            'per_page' => $per_page,
            'offset' => $offset
        ];
    }

    /**
     * Build pagination meta
     */
    public static function build_pagination_meta($total, $page, $per_page) {
        return [
            'total' => (int) $total,
            'page' => (int) $page,
            'per_page' => (int) $per_page,
            'total_pages' => (int) ceil($total / $per_page)
        ];
    }

    /**
     * Validate color hex code
     */
    public static function validate_color($color) {
        if (preg_match('/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color)) {
            return $color;
        }
        return '#3B82F6'; // Default blue
    }

    /**
     * Get user setting
     */
    public static function get_user_setting($user_id, $key, $default = null) {
        global $wpdb;

        $table = $wpdb->prefix . 'pika_user_settings';
        $value = $wpdb->get_var($wpdb->prepare(
            "SELECT setting_value FROM $table WHERE user_id = %d AND setting_key = %s",
            $user_id,
            $key
        ));

        return $value !== null ? $value : $default;
    }

    /**
     * Set user setting
     */
    public static function set_user_setting($user_id, $key, $value) {
        global $wpdb;

        $table = $wpdb->prefix . 'pika_user_settings';

        return $wpdb->replace(
            $table,
            [
                'user_id' => $user_id,
                'setting_key' => $key,
                'setting_value' => $value
            ],
            ['%d', '%s', '%s']
        );
    }

    /**
     * Log error for debugging
     */
    public static function log($message, $data = [], $log_mode = 'json') {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            if ($log_mode === 'json') {
                error_log('Pika Log: ' . $message . ($data != [] ? ' - ' . json_encode($data) : ''));
            } else {
                error_log('Pika Log: ' . $message . ($data != [] ? ' - ' . print_r($data, true) : ''));
            }
        }
    }

    /**
     * Convert MySQL datetime to ISO 8601 (UTC) format with Z
     *
     * @param string|null $datetime_string MySQL datetime (Y-m-d H:i:s)
     * @return string|null ISO 8601 datetime (e.g., 2025-07-31T10:57:04Z) or null on failure
     */
    public static function to_iso8601_utc($datetime_string) {
        if (empty($datetime_string)) {
            return null;
        }

        try {
            $dt = new DateTime($datetime_string, new DateTimeZone('UTC'));
            return $dt->format('c'); // ISO 8601 with Z
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Convert PHP timezone to MySQL format for CONVERT_TZ
     */
    public static function get_gmt_offset_str($timezone) {
        $tz = new DateTimeZone($timezone);
        $offset = $tz->getOffset(new DateTime('now', $tz));
        $hours = floor($offset / 3600);
        $minutes = abs(($offset % 3600) / 60);
        return sprintf('%+03d:%02d', $hours, $minutes);
    }

    /**
     * Get user device info
     */
    public static function get_user_device_info() {
        if ( empty( $_SERVER['HTTP_USER_AGENT'] ) ) {
            return [];
        }

        $dd = new DeviceDetector( $_SERVER['HTTP_USER_AGENT'] );
        $dd->parse();

        if ( $dd->isBot() ) {
            // If it's a bot, you may want to handle separately
            return [
                'device_type' => 'bot',
                'brand'       => null,
                'model'       => null,
                'client_type' => null,
                'client_name' => null,
                'os_name'     => null,
            ];
        }

        $deviceType = $dd->getDeviceName(); // e.g. smartphone, desktop, tablet
        $brand      = $dd->getBrandName();  // e.g. Apple, Samsung
        $model      = $dd->getModel();      // e.g. iPhone 13
        $clientInfo = $dd->getClient();     // array with type, name, version, engine
        $osInfo     = $dd->getOs();         // array with name, short_name, version, platform

        return [
            'device_type' => $deviceType ?? 'unknown',
            'brand'       => $brand ?? null,
            'model'       => $model ?? null,
            'client_type' => $clientInfo['type'] ?? null,
            'client_name' => $clientInfo['name'] ?? null,
            'os_name'     => $osInfo['name'] ?? null,
        ];
    }
}
