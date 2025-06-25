<?php

/**
 * Accounts controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Accounts_Controller extends Pika_Base_Controller {

    public $accounts_manager;

    public function __construct() {
        parent::__construct();
        $this->accounts_manager = new Pika_Accounts_Manager();
    }

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
        return [];
    }
}
