<?php

/**
 * Admin manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Admin_Manager extends Pika_Base_Manager {

    public $errors = [
        'not_admin' => ['message' => 'You are not authorized to access this resource', 'status' => 403],
        'invalid_notification_title' => ['message' => 'Invalid notification title', 'status' => 400],
        'invalid_notification_body' => ['message' => 'Invalid notification body', 'status' => 400],
        'not_ready' => ['message' => 'User does not have notifications enabled or no subscription found', 'status' => 400],
        'send_error' => ['message' => 'Failed to send test notification', 'status' => 500],
        'notification_not_found' => ['message' => 'Notification not found', 'status' => 404],
        'delete_error' => ['message' => 'Failed to delete notification', 'status' => 500],
        'db_error' => ['message' => 'Database error occurred', 'status' => 500],
    ];

    public function __construct() {
        parent::__construct();
    }

    private function get_stat_data($key, $row) {
        $total_items     = (int) $row->total;
        $current_period  = (int) $row->current_period;
        $previous_period = (int) $row->previous_period;

        $change_value = 0;
        $is_positive  = true;

        if ($previous_period > 0) {
            $change_value = (($current_period - $previous_period) / $previous_period) * 100;
            $is_positive  = $change_value >= 0;
        }

        $data = [
            'value' => $total_items,
            'change' => [
                'value' => $change_value,
                'isPositive' => $is_positive,
            ],
        ];

        return $data;
    }

    private function get_database_size() {
        return 0; // TODO: Implement this
    }

    public function get_stats() {
        $days = 30;
        $tnx_table_name = $this->get_table_name('transactions');
        $users_table_name = $this->db()->users;
        $ai_usages_table_name = $this->get_table_name('ai_usages');

        // --- Total Users ---
        $users_sql = $this->db()->prepare("
            SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN user_registered >= DATE_SUB(NOW(), INTERVAL %d DAY) THEN 1 ELSE 0 END) AS current_period,
                SUM(CASE WHEN user_registered >= DATE_SUB(NOW(), INTERVAL %d DAY) 
                        AND user_registered < DATE_SUB(NOW(), INTERVAL %d DAY) THEN 1 ELSE 0 END) AS previous_period
            FROM {$users_table_name}
        ", $days, $days * 2, $days);
        $users_row = $this->db()->get_row($users_sql);

        // --- Active Users (users who made transactions in the last X days) ---
        $active_users_sql = $this->db()->prepare("
            SELECT 
                COUNT(DISTINCT user_id) AS total,
                COUNT(DISTINCT CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL %d DAY) THEN user_id END) AS current_period,
                COUNT(DISTINCT CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL %d DAY) 
                                    AND created_at < DATE_SUB(NOW(), INTERVAL %d DAY) THEN user_id END) AS previous_period
            FROM {$tnx_table_name}
            WHERE is_active = 1
        ", $days, $days * 2, $days);
        $active_users_row = $this->db()->get_row($active_users_sql);

        // --- Total Transactions ---
        $tnx_sql = $this->db()->prepare("
            SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01') THEN 1 ELSE 0 END) AS current_period,
                SUM(CASE WHEN created_at >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01') 
                        AND created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01') THEN 1 ELSE 0 END) AS previous_period
            FROM {$tnx_table_name}
        ");
        $tnx_row = $this->db()->get_row($tnx_sql);

        // --- Gemini API Calls ---
        $gemini_api_calls_sql = $this->db()->prepare("
            SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01') THEN 1 ELSE 0 END) AS current_period,
                SUM(CASE WHEN created_at >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01') 
                        AND created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01') THEN 1 ELSE 0 END) AS previous_period
            FROM {$ai_usages_table_name}
            WHERE provider = 'gemini'
        ");
        $gemini_api_calls_row = $this->db()->get_row($gemini_api_calls_sql);

        if (is_wp_error($users_row) || is_wp_error($active_users_row) || is_wp_error($tnx_row) || is_wp_error($gemini_api_calls_row)) {
            return $this->get_error('db_error');
        }

        // Format stats using helper
        $users_data  = $this->get_stat_data('totalUsers', $users_row);
        $active_data = $this->get_stat_data('activeUsers', $active_users_row);
        $tnx_data    = $this->get_stat_data('totalTransactions', $tnx_row);
        $gemini_api_calls_data = $this->get_stat_data('geminiApiCalls', $gemini_api_calls_row);

        return [
            'totalUsers'   => $users_data,
            'activeUsers'  => $active_data,
            'totalTransactions' => $tnx_data,
            'geminiApiCalls' => $gemini_api_calls_data,
            'systemHealth' => 'healthy',
            'databaseSize' => $this->get_database_size(),
            'geminiApiCost' => 0,
            'pushNotificationsSent' => 0,
            'lastBackup' => 'N/A',
        ];
    }

    public function get_users() {
        $tnx_table_name = $this->get_table_name('transactions');
        $sql = $this->db()->prepare("
            SELECT 
                user_id,
                COUNT(*) AS transaction_count
            FROM {$tnx_table_name}
            WHERE is_active = 1
            GROUP BY user_id
            ORDER BY transaction_count DESC
            LIMIT 10;
        ");
        $users_data = $this->db()->get_results($sql);

        if (is_wp_error($users_data)) {
            return $this->get_error('db_error');
        }

        // Extract just the user IDs from the query
        $user_ids = array_column($users_data, 'user_id');

        if (empty($user_ids)) {
            return [];
        }

        // Get WP user objects
        $wp_users = get_users([
            'include' => $user_ids,
            'orderby' => 'include', // preserve order of our SQL result
        ]);

        // Index users by ID for quick lookup
        $wp_users_indexed = [];
        foreach ($wp_users as $user) {
            $wp_users_indexed[$user->ID] = $user;
        }

        // Merge both datasets
        $result = [];
        foreach ($users_data as $row) {
            $uid = (int) $row->user_id;

            if (!isset($wp_users_indexed[$uid])) {
                continue; // skip if user not found
            }

            $wp_user = $wp_users_indexed[$uid];

            $result[] = [
                'user_id'          => (string) $uid,
                'transaction_count'=> (int) $row->transaction_count,
                'name'             => $wp_user->display_name,
                'email'            => $wp_user->user_email,
                'status'           => $wp_user->user_status == 0 ? 'active' : 'inactive',
                'user_registered'  => $wp_user->user_registered,
            ];
        }

        return $result;
    }

    public function get_user_growth() {
        $users_table_name = $this->db()->users;
        
        // Get user growth data for the last 6 months
        $sql = $this->db()->prepare("
            SELECT 
                DATE_FORMAT(user_registered, '%Y-%m') AS month,
                COUNT(*) AS new_users,
                (
                    SELECT COUNT(*) 
                    FROM {$users_table_name} u2 
                    WHERE DATE_FORMAT(u2.user_registered, '%Y-%m') <= DATE_FORMAT(u1.user_registered, '%Y-%m')
                ) AS total_users
            FROM {$users_table_name} u1
            WHERE user_registered >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(user_registered, '%Y-%m')
            ORDER BY month ASC
        ");
        
        $growth_data = $this->db()->get_results($sql);
        
        if (is_wp_error($growth_data)) {
            return $this->get_error('db_error');
        }
        
        // Calculate growth rate and format data
        $result = [];
        $previous_total = 0;
        
        foreach ($growth_data as $row) {
            $month = date('M', strtotime($row->month . '-01'));
            $new_users = (int) $row->new_users;
            $total_users = (int) $row->total_users;
            
            // Calculate growth rate
            $growth_rate = 0;
            if ($previous_total > 0) {
                $growth_rate = (($total_users - $previous_total) / $previous_total) * 100;
            }
            
            $result[] = [
                'month' => $month,
                'new_users' => $new_users,
                'total_users' => $total_users,
                'growth_rate' => round($growth_rate, 1)
            ];
            
            $previous_total = $total_users;
        }
        
        return $result;
    }

    /**
     * Get global AI settings
     * 
     * @return array
     */
    public function get_ai_settings() {
        $ai_manager = new Pika_AI_Manager();
        $settings = $ai_manager->get_global_gemini_api_key();
        
        return [
            'success' => true,
            'data' => $settings
        ];
    }

    /**
     * Save global AI settings
     * 
     * @param string $api_key
     * @param bool $is_enabled
     * @return array
     */
    public function save_ai_settings($api_key, $is_enabled) {
        $ai_manager = new Pika_AI_Manager();
        $result = $ai_manager->save_global_ai_settings($api_key, $is_enabled);
        
        if (is_wp_error($result)) {
            return $result;
        }
        
        return [
            'success' => true,
            'message' => 'AI settings saved successfully'
        ];
    }

    /**
     * Get AI usage statistics
     * 
     * @return array
     */
    public function get_ai_usage_stats() {
        $ai_usages_table_name = $this->get_table_name('ai_usages');
        $users_table_name = $this->db()->users;
        
        // Get total API calls
        $total_api_calls_sql = $this->db()->prepare("
            SELECT COUNT(*) as total
            FROM {$ai_usages_table_name}
            WHERE provider = 'gemini'
        ");
        $total_api_calls_result = $this->db()->get_var($total_api_calls_sql);
        
        // Get monthly API calls
        $monthly_api_calls_sql = $this->db()->prepare("
            SELECT COUNT(*) as total
            FROM {$ai_usages_table_name}
            WHERE provider = 'gemini'
            AND created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
        ");
        $monthly_api_calls_result = $this->db()->get_var($monthly_api_calls_sql);
        
        // Get total tokens used
        $total_tokens_sql = $this->db()->prepare("
            SELECT SUM(total_tokens) as total
            FROM {$ai_usages_table_name}
            WHERE provider = 'gemini'
            AND total_tokens IS NOT NULL
        ");
        $total_tokens_result = $this->db()->get_var($total_tokens_sql);
        
        // Get monthly tokens
        $monthly_tokens_sql = $this->db()->prepare("
            SELECT SUM(total_tokens) as total
            FROM {$ai_usages_table_name}
            WHERE provider = 'gemini'
            AND total_tokens IS NOT NULL
            AND created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
        ");
        $monthly_tokens_result = $this->db()->get_var($monthly_tokens_sql);
        
        // Get unique users using AI
        $unique_users_sql = $this->db()->prepare("
            SELECT COUNT(DISTINCT user_id) as total
            FROM {$ai_usages_table_name}
            WHERE provider = 'gemini'
        ");
        $unique_users_result = $this->db()->get_var($unique_users_sql);
        
        // Get global API key status
        $global_api_key = get_option('pika_gemini_api_key', '');
        $ai_features_enabled = get_option('pika_ai_features_enabled', true);
        
        // Calculate monthly cost (assuming $0.0001 per 1K tokens for Gemini)
        $monthly_cost = 0;
        if ($monthly_tokens_result) {
            $monthly_cost = ($monthly_tokens_result / 1000) * 0.0001;
        }
        
        // Get API key status
        $api_key_status = 'Not Configured';
        if (!empty($global_api_key)) {
            $api_key_status = 'Global Key Active';
        } else {
            // Check if any users have personal API keys
            $personal_keys_sql = $this->db()->prepare("
                SELECT COUNT(DISTINCT user_id) as total
                FROM {$this->get_table_name('user_settings')}
                WHERE setting_key = 'gemini_api_key'
                AND setting_value IS NOT NULL
                AND setting_value != ''
            ");
            $personal_keys_result = $this->db()->get_var($personal_keys_sql);
            
            if ($personal_keys_result > 0) {
                $api_key_status = 'Personal Keys Only';
            }
        }
        
        // Get recent usage (last 7 days)
        $recent_usage_sql = $this->db()->prepare("
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as calls,
                SUM(total_tokens) as tokens,
                COUNT(DISTINCT user_id) as users
            FROM {$ai_usages_table_name}
            WHERE provider = 'gemini'
            AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        ");
        $recent_usage_result = $this->db()->get_results($recent_usage_sql);

        if (is_wp_error($recent_usage_result) || is_wp_error($total_api_calls_result) || is_wp_error($monthly_api_calls_result) || is_wp_error($total_tokens_result) || is_wp_error($monthly_tokens_result) || is_wp_error($unique_users_result)) {
            return $this->get_error('db_error');
        }
        
        return [
            'success' => true,
            'data' => [
                'totalApiCalls' => (int) ($total_api_calls_result ?: 0),
                'monthlyApiCalls' => (int) ($monthly_api_calls_result ?: 0),
                'totalTokens' => (int) ($total_tokens_result ?: 0),
                'monthlyTokens' => (int) ($monthly_tokens_result ?: 0),
                'uniqueUsers' => (int) ($unique_users_result ?: 0),
                'apiKeyStatus' => $api_key_status,
                'aiFeaturesEnabled' => $ai_features_enabled,
                'monthlyCost' => round($monthly_cost, 6),
                'recentUsage' => $recent_usage_result ?: []
            ]
        ];
    }

    /**
     * Get AI usage chart data
     * 
     * @param int $days Number of days to fetch
     * @return array
     */
    public function get_ai_usage_chart($days = 30) {
        $ai_usages_table_name = $this->get_table_name('ai_usages');
        
        // Get daily usage data for the specified period
        $daily_usage_sql = $this->db()->prepare("
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as total_calls,
                SUM(total_tokens) as total_tokens,
                COUNT(DISTINCT user_id) as unique_users,
                SUM(CASE WHEN prompt_type = 'TEXT' THEN 1 ELSE 0 END) as text_calls,
                SUM(CASE WHEN prompt_type = 'IMAGE' THEN 1 ELSE 0 END) as image_calls,
                SUM(CASE WHEN prompt_type = 'TEXT' THEN total_tokens ELSE 0 END) as text_tokens,
                SUM(CASE WHEN prompt_type = 'IMAGE' THEN total_tokens ELSE 0 END) as image_tokens,
                AVG(latency_ms) as avg_latency,
                COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_calls,
                COUNT(CASE WHEN status = 'error' THEN 1 END) as failed_calls
            FROM {$ai_usages_table_name}
            WHERE provider = 'gemini'
            AND created_at >= DATE_SUB(CURDATE(), INTERVAL %d DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        ", $days);
        
        $daily_usage_result = $this->db()->get_results($daily_usage_sql);
        
        if (is_wp_error($daily_usage_result)) {
            return $this->get_error('db_error');
        }
        
        // Get model usage breakdown
        $model_usage_sql = $this->db()->prepare("
            SELECT 
                model,
                COUNT(*) as call_count,
                SUM(total_tokens) as total_tokens,
                AVG(latency_ms) as avg_latency
            FROM {$ai_usages_table_name}
            WHERE provider = 'gemini'
            AND created_at >= DATE_SUB(CURDATE(), INTERVAL %d DAY)
            GROUP BY model
            ORDER BY call_count DESC
        ", $days);
        
        $model_usage_result = $this->db()->get_results($model_usage_sql);
        
        if (is_wp_error($model_usage_result)) {
            return $this->get_error('db_error');
        }
        
        // Get hourly usage pattern for the last 7 days
        $hourly_usage_sql = $this->db()->prepare("
            SELECT 
                HOUR(created_at) as hour,
                COUNT(*) as call_count,
                SUM(total_tokens) as total_tokens
            FROM {$ai_usages_table_name}
            WHERE provider = 'gemini'
            AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY HOUR(created_at)
            ORDER BY hour ASC
        ");
        
        $hourly_usage_result = $this->db()->get_results($hourly_usage_sql);
        
        if (is_wp_error($hourly_usage_result)) {
            return $this->get_error('db_error');
        }
        
        // Format daily data for charts
        $formatted_daily_data = [];
        foreach ($daily_usage_result as $day) {
            $formatted_daily_data[] = [
                'date' => $day->date,
                'formatted_date' => date('M j', strtotime($day->date)),
                'total_calls' => (int) $day->total_calls,
                'total_tokens' => (int) ($day->total_tokens ?: 0),
                'unique_users' => (int) $day->unique_users,
                'text_calls' => (int) $day->text_calls,
                'image_calls' => (int) $day->image_calls,
                'text_tokens' => (int) ($day->text_tokens ?: 0),
                'image_tokens' => (int) ($day->image_tokens ?: 0),
                'avg_latency' => round((float) ($day->avg_latency ?: 0), 2),
                'success_rate' => $day->total_calls > 0 ? round(($day->successful_calls / $day->total_calls) * 100, 1) : 0,
                'cost' => round((($day->total_tokens ?: 0) / 1000) * 0.0001, 6)
            ];
        }
        
        // Format model data
        $formatted_model_data = [];
        foreach ($model_usage_result as $model) {
            $formatted_model_data[] = [
                'model' => $model->model,
                'call_count' => (int) $model->call_count,
                'total_tokens' => (int) ($model->total_tokens ?: 0),
                'avg_latency' => round((float) ($model->avg_latency ?: 0), 2),
                'percentage' => 0 // Will be calculated below
            ];
        }
        
        // Calculate percentages for model usage
        $total_model_calls = array_sum(array_column($formatted_model_data, 'call_count'));
        if ($total_model_calls > 0) {
            foreach ($formatted_model_data as &$model) {
                $model['percentage'] = round(($model['call_count'] / $total_model_calls) * 100, 1);
            }
        }
        
        // Format hourly data
        $formatted_hourly_data = [];
        foreach ($hourly_usage_result as $hour) {
            $formatted_hourly_data[] = [
                'hour' => (int) $hour->hour,
                'formatted_hour' => sprintf('%02d:00', $hour->hour),
                'call_count' => (int) $hour->call_count,
                'total_tokens' => (int) ($hour->total_tokens ?: 0)
            ];
        }
        
        // Calculate summary statistics
        $total_calls = array_sum(array_column($formatted_daily_data, 'total_calls'));
        $total_tokens = array_sum(array_column($formatted_daily_data, 'total_tokens'));
        $avg_daily_calls = $total_calls > 0 ? round($total_calls / count($formatted_daily_data), 1) : 0;
        $avg_daily_tokens = $total_tokens > 0 ? round($total_tokens / count($formatted_daily_data), 1) : 0;
        $total_cost = array_sum(array_column($formatted_daily_data, 'cost'));
        
        return [
            'success' => true,
            'data' => [
                'daily_usage' => $formatted_daily_data,
                'model_breakdown' => $formatted_model_data,
                'hourly_pattern' => $formatted_hourly_data,
                'summary' => [
                    'total_calls' => $total_calls,
                    'total_tokens' => $total_tokens,
                    'avg_daily_calls' => $avg_daily_calls,
                    'avg_daily_tokens' => $avg_daily_tokens,
                    'total_cost' => round($total_cost, 6),
                    'period_days' => $days
                ]
            ]
        ];
    }

    /**
     * Send push notification to users
     * 
     * @param array $notification_data
     * @param array|null $user_ids
     * @return array
     */
    public function send_push_notification($notification_data, $user_ids = null) {
        $push_manager = new Pika_Push_Notifications_Manager();
        
        if ($user_ids) {
            $result = $push_manager->send_notification_to_users($user_ids, $notification_data);
        } else {
            $result = $push_manager->send_notification_to_all($notification_data);
        }

        // Flush notifications to ensure they are sent immediately
        $push_manager->flush_notifications();

        // Calculate summary statistics
        $total_users = count($result);
        $successful_users = 0;
        $total_devices = 0;
        $successful_devices = 0;

        foreach ($result as $user_result) {
            if (isset($user_result['success']) && $user_result['success']) {
                $successful_users++;
            }
            if (isset($user_result['total_devices'])) {
                $total_devices += $user_result['total_devices'];
            }
            if (isset($user_result['devices_sent'])) {
                $successful_devices += $user_result['devices_sent'];
            }
        }

        return [
            'success' => true,
            'message' => 'Notification sent successfully',
            'summary' => [
                'total_users' => $total_users,
                'successful_users' => $successful_users,
                'total_devices' => $total_devices,
                'successful_devices' => $successful_devices
            ],
            'detailed_results' => $result
        ];
    }

    /**
     * Get push notification statistics
     * 
     * @return array
     */
    public function get_push_statistics() {
        $push_manager = new Pika_Push_Notifications_Manager();
        $stats = $push_manager->get_device_statistics();
        
        if (is_wp_error($stats)) {
            return $stats;
        }

        return [
            'success' => true,
            'data' => $stats
        ];
    }

    /**
     * Send test push notification
     * 
     * @return array
     */
    public function send_test_push_notification() {
        $push_manager = new Pika_Push_Notifications_Manager();
        $user_id = get_current_user_id();

        // Check if user has notifications enabled and has a subscription
        $enabled = $push_manager->is_enabled_for_user();
        $subscription = $push_manager->get_subscriptions($user_id);
        $has_subscription = $subscription !== false && !empty($subscription) && !is_wp_error($subscription);

        if (!$enabled || !$has_subscription) {
            return $this->get_error('not_ready');
        }

        // Send test notification
        $notification_data = [
            'title' => 'Test Notification',
            'body' => 'This is a test notification from Pika Finance',
            'icon' => '/pika/icons/pwa-192x192.png',
            'tag' => 'test-notification',
            'data' => ['type' => 'test', 'timestamp' => time()],
            'require_interaction' => false,
            'silent' => false
        ];

        $result = $push_manager->send_notification_to_users([$user_id], $notification_data);

        if (!$result || !isset($result[$user_id])) {
            return $this->get_error('send_error');
        }

        $user_result = $result[$user_id];

        // Flush notifications to ensure they are sent immediately
        $push_manager->flush_notifications();

        return [
            'success' => true,
            'message' => 'Test notification sent successfully',
            'devices_sent' => $user_result['devices_sent'],
            'total_devices' => $user_result['total_devices'],
            'success' => $user_result['success']
        ];
    }

    /**
     * Get admin notifications with filters and pagination
     * 
     * @param int $page
     * @param int $per_page
     * @param string $status
     * @param string $target
     * @param string $search
     * @param string $date_range
     * @return array
     */
    public function get_admin_notifications($page, $per_page, $status = 'all', $target = 'all', $search = '', $date_range = 'all') {
        $notifications_table_name = $this->get_table_name('notifications');
        $device_subscriptions_table_name = $this->get_table_name('device_subscriptions');
        
        // Build WHERE clause based on filters
        $where_conditions = [];
        $where_values = [];
        
        // Note: notifications table doesn't have a status column, so we'll filter by is_active instead
        if ($status !== 'all') {
            if ($status === 'active') {
                $where_conditions[] = 'n.is_active = 1';
            } elseif ($status === 'inactive') {
                $where_conditions[] = 'n.is_active = 0';
            } elseif ($status === 'delivered') {
                // Delivered notifications (read, clicked, or dismissed)
                $where_conditions[] = '(n.read_at IS NOT NULL OR n.clicked_at IS NOT NULL OR n.dismissed_at IS NOT NULL)';
            } elseif ($status === 'read') {
                $where_conditions[] = 'n.read_at IS NOT NULL';
            } elseif ($status === 'clicked') {
                $where_conditions[] = 'n.clicked_at IS NOT NULL';
            } elseif ($status === 'dismissed') {
                $where_conditions[] = 'n.dismissed_at IS NOT NULL';
            } elseif ($status === 'unread') {
                // Unread notifications (none of the interaction fields are set)
                $where_conditions[] = '(n.read_at IS NULL AND n.clicked_at IS NULL AND n.dismissed_at IS NULL)';
            }
        }
        
        // Target filter - notifications table has user_id (singular), not user_ids
        if ($target !== 'all') {
            if ($target === 'all_users') {
                // For admin notifications, we'll consider them as "all users" if they're system-wide
                // This is a simplified approach since the current table structure doesn't support multi-user targeting
                $where_conditions[] = 'n.user_id = 0 OR n.user_id IS NULL';
            } else {
                // Specific user notifications
                $where_conditions[] = 'n.user_id > 0';
            }
        }
        
        if ($search) {
            $where_conditions[] = '(n.title LIKE %s OR n.body LIKE %s)';
            $search_term = '%' . $this->db()->esc_like($search) . '%';
            $where_values[] = $search_term;
            $where_values[] = $search_term;
        }
        
        if ($date_range !== 'all') {
            switch ($date_range) {
                case 'today':
                    $where_conditions[] = 'DATE(n.created_at) = CURDATE()';
                    break;
                case '7days':
                    $where_conditions[] = 'n.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
                    break;
                case '30days':
                    $where_conditions[] = 'n.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
                    break;
                case '90days':
                    $where_conditions[] = 'n.created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)';
                    break;
            }
        }
        
        $where_clause = '';
        if (!empty($where_conditions)) {
            $where_clause = 'WHERE ' . implode(' AND ', $where_conditions);
        }
        
        // Get total count
        $count_sql = "SELECT COUNT(*) FROM {$notifications_table_name} n {$where_clause}";
        if (!empty($where_values)) {
            $count_sql = $this->db()->prepare($count_sql, $where_values);
        }
        $total_count = $this->db()->get_var($count_sql);
        
        if (is_wp_error($total_count)) {
            return $this->get_error('db_error');
        }
        
        // Get notifications with pagination
        $offset = ($page - 1) * $per_page;
        $notifications_sql = "
            SELECT 
                n.*,
                COUNT(DISTINCT ds.user_id) as target_users,
                COUNT(ds.id) as total_devices,
                CASE 
                    WHEN n.read_at IS NOT NULL THEN 'read'
                    WHEN n.clicked_at IS NOT NULL THEN 'clicked'
                    WHEN n.dismissed_at IS NOT NULL THEN 'dismissed'
                    ELSE 'unread'
                END as delivery_status
            FROM {$notifications_table_name} n
            LEFT JOIN {$device_subscriptions_table_name} ds ON ds.user_id = n.user_id AND ds.is_active = 1
            {$where_clause}
            GROUP BY n.id
            ORDER BY n.created_at DESC
            LIMIT %d OFFSET %d
        ";
        
        $sql_values = array_merge($where_values, [$per_page, $offset]);
        $notifications_sql = $this->db()->prepare($notifications_sql, $sql_values);
        $notifications = $this->db()->get_results($notifications_sql);
        
        if (is_wp_error($notifications)) {
            return $this->get_error('db_error');
        }
        
        // Format notifications to match the expected interface
        $formatted_notifications = [];
        foreach ($notifications as $notification) {
            // Determine target type based on user_id
            $target_type = ($notification->user_id == 0 || $notification->user_id === null) ? 'all_users' : 'specific_users';
            
            // Determine status based on available fields
            $status = 'delivered'; // Default status since we don't have a status column
            if ($notification->dismissed_at) {
                $status = 'dismissed';
            } elseif ($notification->clicked_at) {
                $status = 'clicked';
            } elseif ($notification->read_at) {
                $status = 'read';
            }
            
            $formatted_notifications[] = [
                'id' => (int) $notification->id,
                'title' => $notification->title,
                'body' => $notification->body,
                'status' => $status,
                'target' => $target_type,
                'sent_at' => $notification->created_at, // Use created_at as sent_at
                'delivered_count' => (int) ($notification->total_devices ?: 0), // Simplified delivery count
                'total_count' => (int) ($notification->total_devices ?: 0),
                'user_ids' => $notification->user_id > 0 ? [(int) $notification->user_id] : null,
                'icon' => $notification->icon,
                'tag' => $notification->tag,
                'created_at' => $notification->created_at,
                'updated_at' => $notification->updated_at,
                'target_users' => (int) ($notification->target_users ?: 0),
                'total_devices' => (int) ($notification->total_devices ?: 0)
            ];
        }
        
        return [
            'success' => true,
            'data' => [
                'notifications' => $formatted_notifications,
                'pagination' => [
                    'page' => $page,
                    'per_page' => $per_page,
                    'total' => (int) $total_count,
                    'total_pages' => ceil((int) $total_count / $per_page)
                ]
            ]
        ];
    }

    /**
     * Get admin notification details
     * 
     * @param int $notification_id
     * @return array
     */
    public function get_admin_notification_details($notification_id) {
        $notifications_table_name = $this->get_table_name('notifications');
        $device_subscriptions_table_name = $this->get_table_name('device_subscriptions');
        
        $sql = $this->db()->prepare("
            SELECT 
                n.*,
                COUNT(DISTINCT ds.user_id) as target_users,
                COUNT(ds.id) as total_devices
            FROM {$notifications_table_name} n
            LEFT JOIN {$device_subscriptions_table_name} ds ON ds.user_id = n.user_id AND ds.is_active = 1
            WHERE n.id = %d
            GROUP BY n.id
        ", $notification_id);
        
        $notification = $this->db()->get_row($sql);
        
        if (!$notification || is_wp_error($notification)) {
            return $this->get_error('notification_not_found');
        }
        
        // Determine target type and status
        $target_type = ($notification->user_id == 0 || $notification->user_id === null) ? 'all_users' : 'specific_users';
        $status = 'delivered';
        if ($notification->dismissed_at) {
            $status = 'dismissed';
        } elseif ($notification->clicked_at) {
            $status = 'clicked';
        } elseif ($notification->read_at) {
            $status = 'read';
        }
        
        return [
            'success' => true,
            'data' => [
                'id' => (int) $notification->id,
                'title' => $notification->title,
                'body' => $notification->body,
                'status' => $status,
                'target' => $target_type,
                'sent_at' => $notification->created_at,
                'delivered_count' => (int) ($notification->total_devices ?: 0),
                'total_count' => (int) ($notification->total_devices ?: 0),
                'user_ids' => $notification->user_id > 0 ? [(int) $notification->user_id] : null,
                'icon' => $notification->icon,
                'tag' => $notification->tag,
                'created_at' => $notification->created_at,
                'updated_at' => $notification->updated_at,
                'target_users' => (int) ($notification->target_users ?: 0),
                'total_devices' => (int) ($notification->total_devices ?: 0),
                'data' => json_decode($notification->data, true),
                'actions' => json_decode($notification->actions, true),
                'require_interaction' => (bool) $notification->require_interaction,
                'silent' => (bool) $notification->silent,
                'read_at' => $notification->read_at,
                'clicked_at' => $notification->clicked_at,
                'dismissed_at' => $notification->dismissed_at,
                'is_active' => (bool) $notification->is_active
            ]
        ];
    }

    /**
     * Delete admin notification
     * 
     * @param int $notification_id
     * @return array
     */
    public function delete_admin_notification($notification_id) {
        $notifications_table_name = $this->get_table_name('notifications');
        
        $result = $this->db()->delete(
            $notifications_table_name,
            ['id' => $notification_id],
            ['%d']
        );
        
        if (is_wp_error($result) || $result === false) {
            return $this->get_error('delete_error');
        }
        
        return [
            'success' => true,
            'message' => 'Notification deleted successfully'
        ];
    }

    /**
     * Send broadcast notification to all users
     * 
     * @param array $notification_data
     * @return array
     */
    public function send_broadcast_notification($notification_data) {
        $push_manager = new Pika_Push_Notifications_Manager();
        
        // Send to all users
        $result = $push_manager->send_notification_to_all($notification_data);
        
        // Flush notifications to ensure they are sent immediately
        $push_manager->flush_notifications();
        
        // Calculate summary statistics
        $total_users = count($result);
        $successful_users = 0;
        $total_devices = 0;
        $successful_devices = 0;

        foreach ($result as $user_result) {
            if (isset($user_result['success']) && $user_result['success']) {
                $successful_users++;
            }
            if (isset($user_result['total_devices'])) {
                $total_devices += $user_result['total_devices'];
            }
            if (isset($user_result['devices_sent'])) {
                $successful_devices += $user_result['devices_sent'];
            }
        }

        return [
            'success' => true,
            'message' => 'Broadcast notification sent successfully',
            'summary' => [
                'total_users' => $total_users,
                'successful_users' => $successful_users,
                'total_devices' => $total_devices,
                'successful_devices' => $successful_devices
            ],
            'detailed_results' => $result
        ];
    }
}
