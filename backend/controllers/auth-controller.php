<?php

/**
 * Authentication controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Auth_Controller extends Pika_Base_Controller {

    private $auth_manager;

    public function __construct() {
        parent::__construct();

        $this->auth_manager = new Pika_Auth_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/auth/me', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_current_user'],
                'permission_callback' => [$this, 'check_auth'],
            ],
        ]);

        register_rest_route($this->namespace, '/auth/login', [
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'login'],
                'permission_callback' => '__return_true',
            ],
        ]);

        register_rest_route($this->namespace, '/auth/logout', [
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'logout'],
                'permission_callback' => '__return_true',
            ],
        ]);
    }

    /**
     * Get current user
     */
    public function get_current_user($request) {
        $user_data = $this->auth_manager->get_current_user_data();

        return $user_data;
    }

    /**
     * Login user and set pika_token cookie
     */
    public function login($request) {
        $params = $request->get_params();
        
        // Validate required fields
        $validation = $this->validate_required_fields($params, ['user_login', 'password']);
        if (is_wp_error($validation)) {
            return $validation;
        }

        $user_login = sanitize_text_field($params['user_login']);
        $password = $params['password'];

        // Authenticate user using application password authentication
        $user = wp_authenticate_application_password(null, $user_login, $password);
        
        if (is_wp_error($user)) {
            return new WP_Error(
                'invalid_credentials',
                'Invalid username or password',
                ['status' => 401]
            );
        }

        // Set pika_token cookie
        $token_value = base64_encode("$user_login:$password");
        setcookie(
            "pika_token",
            $token_value,
            [
                "httponly" => true,
                "secure" => true,
                "samesite" => "Strict",
                "path" => "/"
            ]
        );

        // Return user details
        return $this->auth_manager->get_user_data_by_id($user->ID);
    }

    /**
     * Logout user and remove pika_token cookie
     */
    public function logout($request) {
        // Remove pika_token cookie by setting it to expire in the past
        setcookie(
            "pika_token",
            "",
            [
                "expires" => time() - 3600, // Expire 1 hour ago
                "httponly" => true,
                "secure" => true,
                "samesite" => "Strict",
                "path" => "/"
            ]
        );

        return [
            'message' => 'Logged out successfully'
        ];
    }
}
