<?php

/**
 * Accounts controller for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_Accounts_Controller extends Pika_Base_Controller {

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
        $user_id = $this->get_current_user_id();
        $accounts_manager = pika_get_manager('accounts');

        if (!$accounts_manager) {
            return $this->get_error('manager_not_found');
        }

        $accounts = $accounts_manager->get_user_accounts($user_id);

        return $this->prepare_collection_for_response($accounts, $request);
    }
}
