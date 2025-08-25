<?php

/**
 * Admin controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Admin_Controller extends Pika_Base_Controller {

    public $admin_manager;

    public function __construct() {
        parent::__construct();
        $this->admin_manager = new Pika_Admin_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/admin/stats', [
            'methods' => 'GET',
            'callback' => [$this, 'get_stats'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        register_rest_route($this->namespace, '/admin/users', [
            'methods' => 'GET',
            'callback' => [$this, 'get_users'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        register_rest_route($this->namespace, '/admin/activities', [
            'methods' => 'GET',
            'callback' => [$this, 'get_activities'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        register_rest_route($this->namespace, '/admin/user-growth', [
            'methods' => 'GET',
            'callback' => [$this, 'get_user_growth'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        // AI Settings endpoints
        register_rest_route($this->namespace, '/admin/ai-settings', [
            'methods' => 'GET',
            'callback' => [$this, 'get_ai_settings'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        register_rest_route($this->namespace, '/admin/ai-settings', [
            'methods' => 'POST',
            'callback' => [$this, 'save_ai_settings'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        // AI Usage Statistics endpoint
        register_rest_route($this->namespace, '/admin/ai-usage-stats', [
            'methods' => 'GET',
            'callback' => [$this, 'get_ai_usage_stats'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        // AI Usage Chart Data endpoint
        register_rest_route($this->namespace, '/admin/ai-usage-chart', [
            'methods' => 'GET',
            'callback' => [$this, 'get_ai_usage_chart'],
            'permission_callback' => [$this, 'is_admin']
        ]);
    }

    public function is_admin($request) {
        return current_user_can('manage_options');
    }

    public function get_stats($request) {
        return $this->admin_manager->get_stats();
    }

    public function get_users($request) {
        return $this->admin_manager->get_users();
    }

    public function get_activities($request) {
        // TODO: Implement this
        return [];
    }

    public function get_user_growth($request) {
        return $this->admin_manager->get_user_growth();
    }

    /**
     * Get global AI settings
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function get_ai_settings($request) {
        return $this->admin_manager->get_ai_settings();
    }

    /**
     * Save global AI settings
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function save_ai_settings($request) {
        $api_key = sanitize_text_field($request->get_param('api_key'));
        $is_enabled = (bool) $request->get_param('is_enabled');
        
        return $this->admin_manager->save_ai_settings($api_key, $is_enabled);
    }

    /**
     * Get AI usage statistics
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function get_ai_usage_stats($request) {
        return $this->admin_manager->get_ai_usage_stats();
    }

    /**
     * Get AI usage chart data
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function get_ai_usage_chart($request) {
        $days = (int) $request->get_param('days') ?: 30;
        return $this->admin_manager->get_ai_usage_chart($days);
    }
}
