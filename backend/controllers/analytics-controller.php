<?php

/**
 * Analytics controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Analytics_Controller extends Pika_Base_Controller {

    public $analytics_manager;
    public $people_manager;

    public function __construct() {
        parent::__construct();
        $this->analytics_manager = new Pika_Analytics_Manager();
        $this->people_manager = new Pika_People_Manager();
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

        register_rest_route($this->namespace, '/analytics/monthly-category-spending', [
            'methods' => 'GET',
            'callback' => [$this, 'get_monthly_category_spending'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/analytics/monthly-tag-activity', [
            'methods' => 'GET',
            'callback' => [$this, 'get_monthly_tag_activity'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/analytics/monthly-person-activity', [
            'methods' => 'GET',
            'callback' => [$this, 'get_monthly_person_activity'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/analytics/person-transaction-summary', [
            'methods' => 'GET',
            'callback' => [$this, 'get_person_transaction_summary'],
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

    public function get_monthly_category_spending($request) {
        $params = $request->get_params();
        $month = $params['month'];
        $year = $params['year'];

        $month = $this->analytics_manager->sanitize_month($month);
        $year = $this->analytics_manager->sanitize_year($year);

        if (is_wp_error($month)) {
            return $month;
        }

        if (is_wp_error($year)) {
            return $year;
        }

        $monthly_category_spending = $this->analytics_manager->get_monthly_category_spending($month, $year);
        return $monthly_category_spending;
    }

    public function get_monthly_tag_activity($request) {
        $params = $request->get_params();
        $month = $params['month'];
        $year = $params['year'];

        $month = $this->analytics_manager->sanitize_month($month);
        $year = $this->analytics_manager->sanitize_year($year);

        if (is_wp_error($month)) {
            return $month;
        }

        if (is_wp_error($year)) {
            return $year;
        }

        $monthly_tag_activity = $this->analytics_manager->get_monthly_tag_activity($month, $year);
        return $monthly_tag_activity;
    }

    public function get_monthly_person_activity($request) {
        $params = $request->get_params();
        $month = $params['month'];
        $year = $params['year'];

        $month = $this->analytics_manager->sanitize_month($month);
        $year = $this->analytics_manager->sanitize_year($year);

        if (is_wp_error($month)) {
            return $month;
        }

        if (is_wp_error($year)) {
            return $year;
        }

        $monthly_person_activity = $this->analytics_manager->get_monthly_person_activity($month, $year);
        return $monthly_person_activity;
    }

    public function get_person_transaction_summary($request) {
        $params = $request->get_params();
        $person_id = $params['personId'];
        $start_date = $params['startDate'] ?? null;
        $end_date = $params['endDate'] ?? null;
        $time_bucket = $params['timeBucket'] ?? null;

        $person_id = $this->people_manager->sanitize_person_id($person_id);
        if (is_null($person_id)) {
            return $this->people_manager->get_error('invalid_person_id');
        }

        $start_date = $this->analytics_manager->sanitize_date($start_date);
        $end_date = $this->analytics_manager->sanitize_date($end_date);
        $time_bucket = $this->analytics_manager->sanitize_time_bucket($time_bucket);

        $person_transaction_summary = $this->analytics_manager->get_person_transaction_summary($person_id, $start_date, $end_date, $time_bucket);
        return $person_transaction_summary;
    }
}
