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
    }

    public function is_admin($request) {
        return true;
        // return current_user_can('manage_options');
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
}
