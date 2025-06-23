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
                'permission_callback' => [$this, 'check_auth'],
            ],
        ]);
    }
    
    /**
     * Get current user
     */
    public function get_current_user($request) {
        $user_id = $this->get_current_user_id();
        $user = get_user_by('id', $user_id);
        
        if (!$user) {
            return $this->get_error('user_not_found');
        }
        
        return []
    }
} 