<?php
/**
 * Categories controller for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_Categories_Controller extends Pika_Base_Controller {
    
    public function register_routes() {
        register_rest_route($this->namespace, '/categories', [
            'methods' => 'GET',
            'callback' => [$this, 'get_categories'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }
    
    public function get_categories($request) {
        // TODO: Implement categories logic
        return [];
    }
} 