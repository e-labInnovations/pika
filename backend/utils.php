<?php

/**
 * Utility functions for Pika plugin
 * 
 * @package Pika
 */

function reject_abs_path() {
    if (!defined('ABSPATH')) {
        exit;
    }
}

reject_abs_path();

/**
 * Get current user ID with validation
 */
function pika_get_current_user_id() {
    if (!is_user_logged_in()) {
        return false;
    }
    return get_current_user_id();
}

/**
 * Validate and sanitize request data
 */
function pika_sanitize_request_data($data, $fields) {
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
function pika_generate_unique_filename($original_name, $extension = null) {
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
function pika_get_upload_dir($type = 'avatars') {
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
function pika_get_upload_url($type = 'avatars') {
    $upload_dir = wp_upload_dir();
    return $upload_dir['baseurl'] . '/pika/' . $type;
}

/**
 * Handle file upload
 */
function pika_handle_file_upload($file, $type = 'avatars') {
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

    $upload_dir = pika_get_upload_dir($type);
    $filename = pika_generate_unique_filename($file['name']);
    $filepath = $upload_dir . '/' . $filename;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        return new WP_Error('upload_failed', 'Failed to move uploaded file');
    }

    // Generate URL
    $upload_url = pika_get_upload_url($type);
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
function pika_format_currency($amount, $currency = 'INR') {
    return number_format($amount, 2) . ' ' . $currency;
}

/**
 * Parse date string to MySQL format
 */
function pika_parse_date($date_string) {
    $timestamp = strtotime($date_string);
    if ($timestamp === false) {
        return current_time('mysql');
    }
    return date('Y-m-d H:i:s', $timestamp);
}

/**
 * Get pagination parameters
 */
function pika_get_pagination_params($request) {
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
function pika_build_pagination_meta($total, $page, $per_page) {
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
function pika_validate_color($color) {
    if (preg_match('/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color)) {
        return $color;
    }
    return '#3B82F6'; // Default blue
}

/**
 * Get user setting
 */
function pika_get_user_setting($user_id, $key, $default = null) {
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
function pika_set_user_setting($user_id, $key, $value) {
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
function pika_log_error($message, $data = []) {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('Pika Error: ' . $message . ' - ' . json_encode($data));
    }
}
