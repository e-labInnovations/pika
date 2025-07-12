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

        register_rest_route($this->namespace, '/analytics/monthly-summary', [
            'methods' => 'GET',
            'callback' => [$this, 'get_monthly_summary'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/analytics/daily-summaries', [
            'methods' => 'GET',
            'callback' => [$this, 'get_daily_summaries'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }

    public function get_weekly_expenses($request) {
        $weekly_expenses = $this->analytics_manager->get_weekly_expenses();
        return $weekly_expenses;
    }

    public function get_monthly_summary($request) {
        $params = $request->get_params();
        $month = $params['month'];
        $year = $params['year'];

        $this->utils->log('Month', $month, 'debug');
        $this->utils->log('Year', $year, 'debug');

        $month = $this->analytics_manager->sanitize_month($month);
        $year = $this->analytics_manager->sanitize_year($year);

        if (is_wp_error($month)) {
            return $month;
        }

        if (is_wp_error($year)) {
            return $year;
        }

        $monthly_summary = $this->analytics_manager->get_monthly_summary($month, $year);
        return $monthly_summary;
    }

    public function get_daily_summaries($request) {
        $params = $request->get_params();
        $month = $params['month'];
        $year = $params['year'];

        $this->utils->log('Month', $month, 'debug');
        $this->utils->log('Year', $year, 'debug');

        $month = $this->analytics_manager->sanitize_month($month);
        $year = $this->analytics_manager->sanitize_year($year);

        if (is_wp_error($month)) {
            return $month;
        }

        if (is_wp_error($year)) {
            return $year;
        }

        $daily_summaries = $this->analytics_manager->get_daily_summaries($month, $year);
        return $daily_summaries;
    }
}
