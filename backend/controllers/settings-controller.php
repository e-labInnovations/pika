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
        $user_id = $this->utils->get_current_user_id();

        if (!$user_id) {
            return $this->settings_manager->get_error('unauthorized');
        }

        $settings = $this->settings_manager->get_all_settings($user_id);

        return $settings;
    }

    /**
     * Update settings
     */
    public function update_settings($request) {
        $user_id = $this->utils->get_current_user_id();

        if (!$user_id) {
            return $this->settings_manager->get_error('unauthorized');
        }

        $body = $request->get_json_params();

        if (!$body || !is_array($body)) {
            return $this->settings_manager->get_error('invalid_request');
        }

        // Validate that all keys are allowed
        foreach ($body as $key => $value) {
            if (!is_string($key) || empty($key)) {
                return $this->settings_manager->get_error('invalid_key');
            }

            // Check if the key is allowed
            if (!$this->settings_manager->is_allowed_setting($key)) {
                return $this->settings_manager->get_error('invalid_key');
            }
        }

        if (empty($body)) {
            return $this->settings_manager->get_error('invalid_request');
        }

        $results = $this->settings_manager->update_settings($user_id, $body);

        if (is_wp_error($results)) {
            return $results;
        }

        return $results;
    }
}
