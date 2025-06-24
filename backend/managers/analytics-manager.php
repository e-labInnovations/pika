<?php

/**
 * Analytics manager for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Analytics_Manager extends Pika_Base_Manager {

  /**
   * Get table suffix
   */
  protected function get_table_suffix() {
    return 'analytics';
  }

  /**
   * Get user spending summary
   */
  public function get_spending_summary($user_id, $period = 'month') {
    $db = $this->get_db();

    $date_condition = $this->get_date_condition($period);

    $sql = $db->prepare(
      "SELECT 
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                COUNT(*) as total_transactions
            FROM {$db->prefix}pika_transactions 
            WHERE user_id = %d {$date_condition}",
      $user_id
    );

    return $db->get_row($sql);
  }

  /**
   * Get spending by category
   */
  public function get_spending_by_category($user_id, $period = 'month') {
    $db = $this->get_db();

    $date_condition = $this->get_date_condition($period);

    $sql = $db->prepare(
      "SELECT 
                c.name as category_name,
                c.color as category_color,
                SUM(t.amount) as total_amount,
                COUNT(*) as transaction_count
            FROM {$db->prefix}pika_transactions t
            LEFT JOIN {$db->prefix}pika_categories c ON t.category_id = c.id
            WHERE t.user_id = %d AND t.type = 'expense' {$date_condition}
            GROUP BY t.category_id
            ORDER BY total_amount DESC",
      $user_id
    );

    return $db->get_results($sql);
  }

  /**
   * Get date condition for period filtering
   */
  private function get_date_condition($period) {
    switch ($period) {
      case 'week':
        return "AND t.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
      case 'month':
        return "AND t.date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)";
      case 'year':
        return "AND t.date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)";
      default:
        return "";
    }
  }
}
