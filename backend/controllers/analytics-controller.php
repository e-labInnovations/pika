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
        register_rest_route($this->namespace, '/analytics/weekly-expenses', [
            'methods' => 'GET',
            'callback' => [$this, 'get_weekly_expenses'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/analytics/monthly-expenses', [
            'methods' => 'GET',
            'callback' => [$this, 'get_monthly_expenses'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }

    public function get_weekly_expenses($request) {
        $weekly_expenses = $this->analytics_manager->get_weekly_expenses();
        return $weekly_expenses;
    }

    public function get_monthly_expenses($request) {
        $monthly_expenses = $this->analytics_manager->get_monthly_expenses();
        return $monthly_expenses;
    }
}
