<?php

/**
 * Base controller for Pika API endpoints
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

abstract class Pika_Base_Controller extends WP_REST_Controller {
    /**
     * Namespace for the API
     */
    protected $namespace;
    protected $rest_base;

    public $utils;

    public $manager;

    /**
     * Constructor
     */
    public function __construct() {
        $this->namespace = 'pika/v1';
        $this->rest_base = 'pika';
        $this->utils = new Pika_Utils();
        $this->manager = new Pika_Auth_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Default implementation - child classes should override this
        // This prevents the fatal error while maintaining the expected interface
    }

    /**
     * Check if user is authenticated
     */
    public function check_auth($request = null) {
        if (!is_user_logged_in()) {
            return $this->manager->get_error('unauthorized');
        }
        return true;
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
            return new WP_Error('missing_fields', 'Missing required fields: ' . implode(', ', $missing_fields), ['status' => 400]);
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
}
