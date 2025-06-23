<?php
/**
 * Tags controller for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_Tags_Controller extends Pika_Base_Controller {
    
    public function register_routes() {
        register_rest_route($this->namespace, '/tags', [
            'methods' => 'GET',
            'callback' => [$this, 'get_tags'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }
    
    public function get_tags($request) {
        // TODO: Implement tags logic
        return [];
    }
} 