<?php

/**
 * Accounts manager for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Accounts_Manager extends Pika_Base_Manager {

  /**
   * Get table suffix
   */
  protected function get_table_suffix() {
    return 'accounts';
  }

  /**
   * Get all accounts for a user
   */
  public function get_user_accounts($user_id) {
    $db = $this->get_db();

    $sql = $db->prepare(
      "SELECT * FROM {$this->table_name} WHERE user_id = %d ORDER BY name ASC",
      $user_id
    );

    return $db->get_results($sql);
  }

  /**
   * Get account by ID
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
   * Create new account
   */
  public function create($data) {
    $db = $this->get_db();

    $result = $db->insert(
      $this->table_name,
      [
        'user_id' => $data['user_id'],
        'name' => $data['name'],
        'type' => $data['type'],
        'balance' => $data['balance'] ?? 0,
        'currency' => $data['currency'] ?? 'INR',
        'created_at' => current_time('mysql'),
        'updated_at' => current_time('mysql')
      ],
      ['%d', '%s', '%s', '%f', '%s', '%s', '%s']
    );

    return $result ? $db->insert_id : false;
  }
}
