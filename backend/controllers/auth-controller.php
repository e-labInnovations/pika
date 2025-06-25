<?php

/**
 * Authentication controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Auth_Controller extends Pika_Base_Controller {

    private $auth_manager;

    public function __construct() {
        parent::__construct();

        $this->auth_manager = new Pika_Auth_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {

        register_rest_route($this->namespace, '/auth/me', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_current_user'],
                'permission_callback' => [$this, 'permission_callback'],
            ],
        ]);
    }

    /**
     * Get current user
     */
    public function get_current_user($request) {
        $user_id = $this->utils->get_current_user_id();

        $user_data = $this->auth_manager->get_current_user_data($user_id);

        if (!$user_data) {
            return $this->auth_manager->get_error('user_not_found');
        }

        return $user_data;
    }

    /**
     * Public permission callback for REST API
     */
    public function permission_callback($request) {
        return $this->check_auth();
    }
}
