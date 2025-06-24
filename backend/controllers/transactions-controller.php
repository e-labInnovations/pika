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
        $user_id = $this->get_current_user_id();
        $transactions_manager = pika_get_manager('transactions');

        if (!$transactions_manager) {
            return $this->get_error('manager_not_found');
        }

        $args = [
            'account_id' => $request->get_param('account_id'),
            'category_id' => $request->get_param('category_id')
        ];

        $transactions = $transactions_manager->get_user_transactions($user_id, $args);

        return $this->prepare_collection_for_response($transactions, $request);
    }
}
