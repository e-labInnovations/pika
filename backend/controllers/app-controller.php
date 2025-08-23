<?php

/**
 * Authentication controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_App_Controller extends Pika_Base_Controller {

    private $app_manager;

    public function __construct() {
        parent::__construct();

        $this->app_manager = new Pika_App_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/app/info', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_app_info'],
                'permission_callback' => '__return_true',
            ],
        ]);

        register_rest_route($this->namespace, '/app/lists', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_app_lists'],
                'permission_callback' => '__return_true',
            ],
        ]);
    }

    /**
     * Get app info
     */
    public function get_app_info($request) {
        return $this->app_manager->get_app_details();
    }

    /**
     * Get the lists of categories, accounts, people and tags
     */
    public function get_app_lists($request) {
        return $this->app_manager->get_app_lists();
    }
}
