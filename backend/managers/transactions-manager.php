<?php

/**
 * Transactions manager for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Transactions_Manager extends Pika_Base_Manager {

  /**
   * Get table suffix
   */
  protected function get_table_suffix() {
    return 'transactions';
  }

  /**
   * Get all transactions for a user
   */
  public function get_user_transactions($user_id, $args = []) {
    $db = $this->get_db();

    $where = "WHERE user_id = %d";
    $params = [$user_id];

    // Add filters
    if (!empty($args['account_id'])) {
      $where .= " AND account_id = %d";
      $params[] = $args['account_id'];
    }

    if (!empty($args['category_id'])) {
      $where .= " AND category_id = %d";
      $params[] = $args['category_id'];
    }

    $sql = $db->prepare(
      "SELECT * FROM {$this->table_name} {$where} ORDER BY date DESC, created_at DESC",
      ...$params
    );

    return $db->get_results($sql);
  }

  /**
   * Get transaction by ID
   */
  public function get_by_id($id) {
    $db = $this->get_db();

    $sql = $db->prepare(
      "SELECT * FROM {$this->table_name} WHERE id = %d",
      $id
    );

    return $db->get_row($sql);
  }

  /**
   * Create new transaction
   */
  public function create($data) {
    $db = $this->get_db();

    $result = $db->insert(
      $this->table_name,
      [
        'user_id' => $data['user_id'],
        'account_id' => $data['account_id'],
        'category_id' => $data['category_id'],
        'amount' => $data['amount'],
        'type' => $data['type'],
        'description' => $data['description'],
        'date' => $data['date'],
        'created_at' => current_time('mysql'),
        'updated_at' => current_time('mysql')
      ],
      ['%d', '%d', '%d', '%f', '%s', '%s', '%s', '%s', '%s']
    );

    return $result ? $db->insert_id : false;
  }
}
