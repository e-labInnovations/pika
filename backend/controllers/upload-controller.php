<?php

/**
 * Upload controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Upload_Controller extends Pika_Base_Controller {

    public $upload_manager;

    public function __construct() {
        parent::__construct();
        $this->upload_manager = new Pika_Upload_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/upload/(?P<type>[a-zA-Z]+)', [
            'methods' => 'POST',
            'callback' => [$this, 'upload_file'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }

    /**
     * Upload file
     */
    public function upload_file($request) {
        // TODO: Implement upload logic
        return [];
    }
}
