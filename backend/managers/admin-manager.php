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

        // --- Gemini API Calls - 0 now, will be implemented later ---
        $gemini_api_calls_row = (object) [
            'total' => 0,
            'current_period' => 0,
            'previous_period' => 0,
        ];

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
}
