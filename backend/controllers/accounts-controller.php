<?php
/**
 * Accounts controller for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_Accounts_Controller extends Pika_Base_Controller {
    
    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/accounts', [
            'methods' => 'GET',
            'callback' => [$this, 'get_accounts'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }

    public function get_accounts($request) {
        // TODO: Implement get accounts logic
        return [];
    }
} 