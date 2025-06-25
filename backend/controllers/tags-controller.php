<?php

/**
 * Tags controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Tags_Controller extends Pika_Base_Controller {

    public $tags_manager;

    public function __construct() {
        parent::__construct();
        $this->tags_manager = new Pika_Tags_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/tags', [
            'methods' => 'GET',
            'callback' => [$this, 'get_tags'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }

    /**
     * Get tags
     */
    public function get_tags($request) {
        // TODO: Implement tags logic
        return [];
    }
}
