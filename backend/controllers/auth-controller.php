<?php

/**
 * Authentication controller for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_Auth_Controller extends Pika_Base_Controller {

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
        $user_id = $this->get_current_user_id();
        $auth_manager = pika_get_manager('auth');

        if (!$auth_manager) {
            return $this->get_error('manager_not_found');
        }

        $user_data = $auth_manager->get_current_user_data($user_id);

        if (!$user_data) {
            return $this->get_error('user_not_found');
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
