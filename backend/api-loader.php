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
        $this->setup_auth_middleware();
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

    /**
     * Set up authentication middleware.
     *
     * This middleware authenticates users using the pika_token cookie.
     * It retrieves the pika_token from the cookie and authenticates the user via the wp_authenticate_application_password method.
     * Since wp_authenticate_application_password is intended for use within REST API requests,
     * we use the application_password_is_api_request filter to treat Pika routes as valid API requests,
     * allowing authentication within the determine_current_user filter hook.
     */
    private function setup_auth_middleware() {
        // Log API requests
        add_filter('application_password_is_api_request', function ($is_api_request) {
            $request_uri = $_SERVER['REQUEST_URI'] ?? '';
            if (strpos($request_uri, '/wp-json/pika/') !== false) {
                return true;
            }
            return $is_api_request;
        });

        // determine_current_user
        add_filter('determine_current_user', function ($user_id) {
            // Skip if not a Pika route
            $request_uri = $_SERVER['REQUEST_URI'] ?? '';
            if (strpos($request_uri, '/wp-json/pika/') === false) {
                return $user_id;
            }

            // Get token from cookie
            $token = $_COOKIE['pika_token'] ?? '';
            if (!$token) {
                return false; // not authenticated if no token
            }
            $auth = base64_decode($_COOKIE['pika_token'], true);
            if (!$auth || strpos($auth, ':') === false) {
                return false; // not authenticated if no auth
            }

            // Validate using core function
            list($username, $password) = explode(':', $auth, 2);
            $pika_user = wp_authenticate_application_password(null, $username, $password);

            if (is_wp_error($pika_user) || !$pika_user) {
                return false; // not authenticated if error
            }

            return $pika_user->ID; // authenticated with pika_token
        }, 20);
    }
}
