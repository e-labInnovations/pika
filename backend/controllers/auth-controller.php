<?php

/**
 * Authentication controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Auth_Controller extends Pika_Base_Controller {

    private $auth_manager;
    private $push_manager;

    public function __construct() {
        parent::__construct();

        $this->auth_manager = new Pika_Auth_Manager();
        $this->push_manager = new Pika_Push_Notifications_Manager();
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

        register_rest_route($this->namespace, '/auth/sessions', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_sessions'],
                'permission_callback' => [$this, 'check_auth'],
            ],
        ]);

        register_rest_route($this->namespace, '/auth/sessions/revoke', [
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'revoke_session'],
                'permission_callback' => [$this, 'check_auth'],
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
        $lifetime = time() + (1 * YEAR_IN_SECONDS);
        setcookie(
            "pika_token",
            $token_value,
            [
                "expires" => $lifetime,
                "httponly" => true,
                "secure" => true,
                "samesite" => "Lax",
                "path" => "/"
            ]
        );

        // Save user session device info
        $user_id = get_current_user_id();
        $currently_using_password_uuid = rest_get_authenticated_app_password();
        $this->auth_manager->save_user_session_device_info($user_id, $currently_using_password_uuid, Pika_Utils::get_user_device_info());

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

        // delete current using application password
        $user_id = get_current_user_id();
        $currently_using_password_uuid = rest_get_authenticated_app_password();
        WP_Application_Passwords::delete_application_password($user_id, $currently_using_password_uuid);

        // delete user session device info
        $this->auth_manager->delete_user_session_device_info($user_id, $currently_using_password_uuid);

        // delete device subscription
        $this->push_manager->delete_subscription($currently_using_password_uuid);

        return [
            'message' => 'Logged out successfully'
        ];
    }

    /**
     * Get all sessions
     */
    public function get_sessions($request) {
        $sessions = $this->auth_manager->get_all_application_passwords();
        return $sessions;
    }

    /**
     * Revoke session
     */
    public function revoke_session($request) {
        $params = $request->get_params();
        $uuid = $params['uuid'];

        if (!$uuid || !wp_is_uuid($uuid)) {
            return $this->auth_manager->get_error('invalid_uuid');
        }
        $user_id = get_current_user_id();
        $app_id = $this->auth_manager->get_app_id();

        $application_password = WP_Application_Passwords::get_user_application_password($user_id, $uuid);
        if (!$application_password || $application_password['app_id'] !== $app_id) {
            return $this->auth_manager->get_error('session_not_found');
        }

        $success = WP_Application_Passwords::delete_application_password($user_id, $uuid);
        if (!$success) {
            return $this->auth_manager->get_error('unknown');
        }

        return [
            'message' => 'Session revoked successfully'
        ];
    }
}
