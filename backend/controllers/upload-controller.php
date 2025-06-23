<?php
/**
 * Upload controller for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_Upload_Controller extends Pika_Base_Controller {
    
    public function register_routes() {
        register_rest_route($this->namespace, '/upload/(?P<type>[a-zA-Z]+)', [
            'methods' => 'POST',
            'callback' => [$this, 'upload_file'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }
    
    public function upload_file($request) {
        // TODO: Implement upload logic
        return [];
    }
} 