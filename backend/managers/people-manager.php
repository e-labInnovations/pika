<?php

/**
 * People manager for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_People_Manager extends Pika_Base_Manager {

  /**
   * Get table suffix
   */
  protected function get_table_suffix() {
    return 'people';
  }

  /**
   * Get all people for a user
   */
  public function get_user_people($user_id) {
    $db = $this->get_db();

    $sql = $db->prepare(
      "SELECT * FROM {$this->table_name} WHERE user_id = %d ORDER BY name ASC",
      $user_id
    );

    return $db->get_results($sql);
  }

  /**
   * Get person by ID
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
   * Create new person
   */
  public function create($data) {
    $db = $this->get_db();

    $result = $db->insert(
      $this->table_name,
      [
        'user_id' => $data['user_id'],
        'name' => $data['name'],
        'email' => $data['email'] ?? '',
        'phone' => $data['phone'] ?? '',
        'type' => $data['type'] ?? 'contact',
        'notes' => $data['notes'] ?? '',
        'created_at' => current_time('mysql'),
        'updated_at' => current_time('mysql')
      ],
      ['%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s']
    );

    return $result ? $db->insert_id : false;
  }
}
