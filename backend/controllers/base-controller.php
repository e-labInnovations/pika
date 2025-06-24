<?php

/**
 * Base controller for Pika API endpoints
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

abstract class Pika_Base_Controller extends WP_REST_Controller {
    /**
     * Namespace for the API
     */
    protected $namespace = 'pika/v1';

    /**
     * Register routes
     */
    public function register_routes() {
        // Default implementation - child classes should override this
        // This prevents the fatal error while maintaining the expected interface
    }

    /**
     * Combines base + child errors
     */
    protected function get_all_errors() {
        return array_merge($this->_errors, $this->errors);
    }

    /**
     * Check if user is authenticated
     */
    protected function check_auth() {
        if (!is_user_logged_in()) {
            return $this->get_error('unauthorized');
        }
        return true;
    }

    /**
     * Get current user ID
     */
    protected function get_current_user_id() {
        return pika_get_current_user_id();
    }

    /**
     * Get sanitized request data
     */
    protected function get_sanitized_data($request, $fields) {
        $data = $request->get_params();
        return pika_sanitize_request_data($data, $fields);
    }

    /**
     * Get pagination parameters
     */
    protected function get_pagination_params($request) {
        return pika_get_pagination_params($request);
    }

    /**
     * Build pagination meta
     */
    protected function build_pagination_meta($total, $page, $per_page) {
        return pika_build_pagination_meta($total, $page, $per_page);
    }

    /**
     * Validate required fields
     */
    protected function validate_required_fields($data, $required_fields) {
        $missing_fields = [];

        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                $missing_fields[] = $field;
            }
        }

        if (!empty($missing_fields)) {
            return $this->error_response(
                'Missing required fields: ' . implode(', ', $missing_fields),
                'missing_fields',
                400,
                ['missing_fields' => $missing_fields]
            );
        }

        return true;
    }

    /**
     * Get search parameter
     */
    protected function get_search_param($request) {
        $search = $request->get_param('search');
        return $search ? sanitize_text_field($search) : '';
    }

    /**
     * Build search query
     */
    protected function build_search_query($search, $fields) {
        global $wpdb;

        if (empty($search)) {
            return '';
        }

        $search_terms = [];
        foreach ($fields as $field) {
            $search_terms[] = $wpdb->prepare("$field LIKE %s", '%' . $wpdb->esc_like($search) . '%');
        }

        return ' AND (' . implode(' OR ', $search_terms) . ')';
    }

    /**
     * Get sort parameters
     */
    protected function get_sort_params($request, $default_sort = 'created_at', $default_direction = 'desc') {
        $sort_by = $request->get_param('sort_by') ?: $default_sort;
        $sort_direction = strtolower($request->get_param('sort_direction') ?: $default_direction);

        // Validate sort direction
        if (!in_array($sort_direction, ['asc', 'desc'])) {
            $sort_direction = $default_direction;
        }

        return [
            'sort_by' => $sort_by,
            'sort_direction' => $sort_direction
        ];
    }

    /**
     * Build order by clause
     */
    protected function build_order_by($sort_by, $sort_direction) {
        return "ORDER BY $sort_by $sort_direction";
    }

    /**
     * Get date range parameters
     */
    protected function get_date_range_params($request) {
        $date_from = $request->get_param('date_from');
        $date_to = $request->get_param('date_to');

        return [
            'date_from' => $date_from ? pika_parse_date($date_from) : null,
            'date_to' => $date_to ? pika_parse_date($date_to) : null
        ];
    }

    /**
     * Build date range query
     */
    protected function build_date_range_query($date_from, $date_to, $date_field = 'date') {
        global $wpdb;

        $conditions = [];

        if ($date_from) {
            $conditions[] = $wpdb->prepare("$date_field >= %s", $date_from);
        }

        if ($date_to) {
            $conditions[] = $wpdb->prepare("$date_field <= %s", $date_to);
        }

        return !empty($conditions) ? ' AND ' . implode(' AND ', $conditions) : '';
    }

    /**
     * Get amount range parameters
     */
    protected function get_amount_range_params($request) {
        $amount_min = $request->get_param('amount_min');
        $amount_max = $request->get_param('amount_max');

        return [
            'amount_min' => $amount_min ? floatval($amount_min) : null,
            'amount_max' => $amount_max ? floatval($amount_max) : null
        ];
    }

    /**
     * Build amount range query
     */
    protected function build_amount_range_query($amount_min, $amount_max, $amount_field = 'amount') {
        global $wpdb;

        $conditions = [];

        if ($amount_min !== null) {
            $conditions[] = $wpdb->prepare("$amount_field >= %f", $amount_min);
        }

        if ($amount_max !== null) {
            $conditions[] = $wpdb->prepare("$amount_field <= %f", $amount_max);
        }

        return !empty($conditions) ? ' AND ' . implode(' AND ', $conditions) : '';
    }

    /**
     * Get collection parameters for schema
     */
    public function get_collection_params() {
        $params = parent::get_collection_params();

        $params['search'] = [
            'description' => __('Search term to filter results.', 'pika-financial'),
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
        ];

        $params['sort_by'] = [
            'description' => __('Sort field.', 'pika-financial'),
            'type' => 'string',
            'default' => 'created_at',
            'enum' => ['id', 'name', 'amount', 'date', 'created_at', 'updated_at'],
        ];

        $params['sort_direction'] = [
            'description' => __('Sort direction.', 'pika-financial'),
            'type' => 'string',
            'default' => 'desc',
            'enum' => ['asc', 'desc'],
        ];

        return $params;
    }

    /**
     * Prepare item for response
     */
    public function prepare_item_for_response($item, $request) {
        // This can be overridden in child classes for specific formatting
        return $item;
    }

    /**
     * Prepare collection for response
     */
    public function prepare_collection_for_response($items, $request, $total = null) {
        $formatted_items = [];

        foreach ($items as $item) {
            $formatted_items[] = $this->prepare_item_for_response($item, $request);
        }

        $response = rest_ensure_response($formatted_items);

        if ($total !== null) {
            $response->header('X-WP-Total', $total);
            $response->header('X-WP-TotalPages', ceil($total / $this->get_items_per_page($request)));
        }

        return $response;
    }

    /**
     * Get items per page
     */
    protected function get_items_per_page($request) {
        $per_page = $request->get_param('per_page');
        return $per_page ? min(100, max(1, intval($per_page))) : 20;
    }
}
