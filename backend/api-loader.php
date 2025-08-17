<?php

/**
 * API loader for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_API_Loader {

    private $controllers = [
        'auth',
        'accounts',
        'people',
        'categories',
        'tags',
        'transactions',
        'analytics',
        'upload',
        'settings',
        'ai',
        'reminders',
        'import-export',
        'push-notifications'
    ];

    /**
     * Initialize the API loader
     */
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    /**
     * Register all API routes
     */
    public function register_routes() {
        $this->load_controllers();

        foreach ($this->controllers as $controller) {
            $this->register_controller_routes($controller);
        }
    }

    /**
     * Load controller files
     */
    private function load_controllers() {
        // Include base files first
        require_once PIKA_PLUGIN_PATH . 'backend/managers/base-manager.php';
        require_once PIKA_PLUGIN_PATH . 'backend/controllers/base-controller.php';

        // Load managers
        foreach ($this->controllers as $controller) {
            require_once PIKA_PLUGIN_PATH . "backend/managers/{$controller}-manager.php";
        }

        // Load controllers
        foreach ($this->controllers as $controller) {
            require_once PIKA_PLUGIN_PATH . "backend/controllers/{$controller}-controller.php";
        }
    }

    /**
     * Register routes for a specific controller
     */
    private function register_controller_routes($controller) {
        // Convert hyphenated names to underscored class names
        $class_suffix = str_replace('-', '_', ucwords($controller, '-'));
        $class_name = 'Pika_' . $class_suffix . '_Controller';
        $controller_instance = new $class_name();
        $controller_instance->register_routes();
    }
}
