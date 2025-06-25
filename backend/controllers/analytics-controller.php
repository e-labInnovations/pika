<?php

/**
 * Analytics controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Analytics_Controller extends Pika_Base_Controller {

    public $analytics_manager;

    public function __construct() {
        parent::__construct();
        $this->analytics_manager = new Pika_Analytics_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/analytics/monthly-summary', [
            'methods' => 'GET',
            'callback' => [$this, 'get_monthly_summary'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }

    public function get_monthly_summary($request) {
        // TODO: Implement analytics logic
        return [];
    }
}
