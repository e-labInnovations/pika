<?php

/**
 * Admin controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Admin_Controller extends Pika_Base_Controller {

    public $admin_manager;

    public function __construct() {
        parent::__construct();
        $this->admin_manager = new Pika_Admin_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/admin/stats', [
            'methods' => 'GET',
            'callback' => [$this, 'get_stats'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        register_rest_route($this->namespace, '/admin/users', [
            'methods' => 'GET',
            'callback' => [$this, 'get_users'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        register_rest_route($this->namespace, '/admin/activities', [
            'methods' => 'GET',
            'callback' => [$this, 'get_activities'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        register_rest_route($this->namespace, '/admin/user-growth', [
            'methods' => 'GET',
            'callback' => [$this, 'get_user_growth'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        // AI Settings endpoints
        register_rest_route($this->namespace, '/admin/ai-settings', [
            'methods' => 'GET',
            'callback' => [$this, 'get_ai_settings'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        register_rest_route($this->namespace, '/admin/ai-settings', [
            'methods' => 'POST',
            'callback' => [$this, 'save_ai_settings'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        // AI Usage Statistics endpoint
        register_rest_route($this->namespace, '/admin/ai-usage-stats', [
            'methods' => 'GET',
            'callback' => [$this, 'get_ai_usage_stats'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        // AI Usage Chart Data endpoint
        register_rest_route($this->namespace, '/admin/ai-usage-chart', [
            'methods' => 'GET',
            'callback' => [$this, 'get_ai_usage_chart'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        // Push Notification endpoints
        register_rest_route($this->namespace, '/admin/push/send', [
            'methods' => 'POST',
            'callback' => [$this, 'send_push_notification'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        register_rest_route($this->namespace, '/admin/push/statistics', [
            'methods' => 'GET',
            'callback' => [$this, 'get_push_statistics'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        register_rest_route($this->namespace, '/admin/push/test', [
            'methods' => 'POST',
            'callback' => [$this, 'send_test_push_notification'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        register_rest_route($this->namespace, '/admin/notifications', [
            'methods' => 'GET',
            'callback' => [$this, 'get_admin_notifications'],
            'permission_callback' => [$this, 'is_admin']
        ]);

        register_rest_route($this->namespace, '/admin/notifications/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_admin_notification_details'],
            'permission_callback' => [$this, 'is_admin'],
            'args' => [
                'id' => [
                    'validate_callback' => function ($param) {
                        return is_numeric($param);
                    }
                ]
            ]
        ]);

        register_rest_route($this->namespace, '/admin/notifications/(?P<id>\d+)', [
            'methods' => 'DELETE',
            'callback' => [$this, 'delete_admin_notification'],
            'permission_callback' => [$this, 'is_admin'],
            'args' => [
                'id' => [
                    'validate_callback' => function ($param) {
                        return is_numeric($param);
                    }
                ]
            ]
        ]);

        register_rest_route($this->namespace, '/admin/notifications/broadcast', [
            'methods' => 'POST',
            'callback' => [$this, 'send_broadcast_notification'],
            'permission_callback' => [$this, 'is_admin']
        ]);
    }

    public function is_admin($request) {
        return current_user_can('manage_options');
    }

    public function get_stats($request) {
        return $this->admin_manager->get_stats();
    }

    public function get_users($request) {
        return $this->admin_manager->get_users();
    }

    public function get_activities($request) {
        // TODO: Implement this
        return [];
    }

    public function get_user_growth($request) {
        return $this->admin_manager->get_user_growth();
    }

    /**
     * Get global AI settings
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function get_ai_settings($request) {
        return $this->admin_manager->get_ai_settings();
    }

    /**
     * Save global AI settings
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function save_ai_settings($request) {
        $api_key = sanitize_text_field($request->get_param('api_key'));
        $is_enabled = (bool) $request->get_param('is_enabled');
        
        return $this->admin_manager->save_ai_settings($api_key, $is_enabled);
    }

    /**
     * Get AI usage statistics
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function get_ai_usage_stats($request) {
        return $this->admin_manager->get_ai_usage_stats();
    }

    /**
     * Get AI usage chart data
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function get_ai_usage_chart($request) {
        $days = (int) $request->get_param('days') ?: 30;
        return $this->admin_manager->get_ai_usage_chart($days);
    }

    /**
     * Send push notification to users
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function send_push_notification($request) {
        $params = $request->get_json_params();
        
        if (empty($params['title'])) {
            return $this->admin_manager->get_error('invalid_notification_title');
        }

        if (empty($params['body'])) {
            return $this->admin_manager->get_error('invalid_notification_body');
        }

        $notification_data = [
            'title' => sanitize_text_field($params['title']),
            'body' => sanitize_textarea_field($params['body']),
            'icon' => isset($params['icon']) ? esc_url_raw($params['icon']) : null,
            'badge' => isset($params['badge']) ? esc_url_raw($params['badge']) : null,
            'image' => isset($params['image']) ? esc_url_raw($params['image']) : null,
            'tag' => isset($params['tag']) ? sanitize_text_field($params['tag']) : null,
            'data' => isset($params['data']) ? $params['data'] : null,
            'actions' => isset($params['actions']) ? $params['actions'] : null,
            'require_interaction' => isset($params['require_interaction']) ? (bool) $params['require_interaction'] : false,
            'silent' => isset($params['silent']) ? (bool) $params['silent'] : false
        ];

        $user_ids = isset($params['user_ids']) ? array_map('intval', $params['user_ids']) : null;

        return $this->admin_manager->send_push_notification($notification_data, $user_ids);
    }

    /**
     * Get push notification statistics (admin only)
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function get_push_statistics($request) {
        return $this->admin_manager->get_push_statistics();
    }

    /**
     * Send test push notification (admin only)
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function send_test_push_notification($request) {
        return $this->admin_manager->send_test_push_notification();
    }

    /**
     * Get admin notifications list with filters and pagination
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function get_admin_notifications($request) {
        $page = max(1, intval($request->get_param('page') ?? 1));
        $per_page = min(100, max(1, intval($request->get_param('per_page') ?? 20)));
        $status = $request->get_param('status') ?? 'all';
        $target = $request->get_param('target') ?? 'all';
        $search = $request->get_param('search') ?? '';
        $date_range = $request->get_param('date_range') ?? 'all';
        
        return $this->admin_manager->get_admin_notifications($page, $per_page, $status, $target, $search, $date_range);
    }

    /**
     * Get admin notification details
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function get_admin_notification_details($request) {
        $notification_id = intval($request->get_param('id'));
        return $this->admin_manager->get_admin_notification_details($notification_id);
    }

    /**
     * Delete admin notification
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function delete_admin_notification($request) {
        $notification_id = intval($request->get_param('id'));
        return $this->admin_manager->delete_admin_notification($notification_id);
    }

    /**
     * Send broadcast notification to all users
     * 
     * @param WP_REST_Request $request
     * @return array|WP_Error
     */
    public function send_broadcast_notification($request) {
        $params = $request->get_json_params();
        
        if (empty($params['title'])) {
            return $this->admin_manager->get_error('invalid_notification_title');
        }

        if (empty($params['body'])) {
            return $this->admin_manager->get_error('invalid_notification_body');
        }

        $notification_data = [
            'title' => sanitize_text_field($params['title']),
            'body' => sanitize_textarea_field($params['body']),
            'icon' => isset($params['icon']) ? esc_url_raw($params['icon']) : null,
            'tag' => isset($params['tag']) ? sanitize_text_field($params['tag']) : 'broadcast',
            'data' => ['type' => 'broadcast', 'timestamp' => time()],
            'require_interaction' => isset($params['require_interaction']) ? (bool) $params['require_interaction'] : false,
            'silent' => isset($params['silent']) ? (bool) $params['silent'] : false
        ];

        return $this->admin_manager->send_broadcast_notification($notification_data);
    }
}
