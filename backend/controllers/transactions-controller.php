<?php
/**
 * Transactions controller for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_Transactions_Controller extends Pika_Base_Controller {
    
    public function register_routes() {
        register_rest_route($this->namespace, '/transactions', [
            'methods' => 'GET',
            'callback' => [$this, 'get_transactions'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }
    
    public function get_transactions($request) {
        // TODO: Implement transactions logic
        return [];
    }
} 