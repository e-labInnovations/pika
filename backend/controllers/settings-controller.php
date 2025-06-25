<?php

/**
 * Settings controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Settings_Controller extends Pika_Base_Controller {

    public $settings_manager;

    public function __construct() {
        parent::__construct();
        $this->settings_manager = new Pika_Settings_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/settings', [
            'methods' => 'GET',
            'callback' => [$this, 'get_settings'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/settings', [
            'methods' => 'PUT',
            'callback' => [$this, 'update_settings'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }

    /**
     * Get settings
     */
    public function get_settings($request) {
        // TODO: Implement get settings logic
        return [];
    }

    /**
     * Update settings
     */
    public function update_settings($request) {
        // TODO: Implement update settings logic
        return [];
    }
}
