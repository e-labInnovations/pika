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
        $user_id = $this->get_current_user_id();
        $categories_manager = pika_get_manager('categories');

        if (!$categories_manager) {
            return $this->get_error('manager_not_found');
        }

        $categories = $categories_manager->get_user_categories($user_id);

        return $this->prepare_collection_for_response($categories, $request);
    }
}
