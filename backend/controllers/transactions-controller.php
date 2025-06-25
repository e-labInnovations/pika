<?php

/**
 * Transactions controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Transactions_Controller extends Pika_Base_Controller {

    public $transactions_manager;

    public function __construct() {
        parent::__construct();
        $this->transactions_manager = new Pika_Transactions_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/transactions', [
            'methods' => 'GET',
            'callback' => [$this, 'get_transactions'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }

    /**
     * Get transactions
     */
    public function get_transactions($request) {
        return [];
    }
}
