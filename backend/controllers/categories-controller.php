<?php

/**
 * Categories controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Categories_Controller extends Pika_Base_Controller {

    public $categories_manager;

    public function __construct() {
        parent::__construct();
        $this->categories_manager = new Pika_Categories_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/categories', [
            'methods' => 'GET',
            'callback' => [$this, 'get_categories'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }

    /**
     * Get categories
     */
    public function get_categories($request) {
        return [];
    }
}
