<?php

/**
 * Transactions manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Transactions_Manager extends Pika_Base_Manager {

  protected $table_name = 'transactions';
  protected $upload_manager;

  public $errors = [
  ];

  public function __construct() {
    parent::__construct();
    $this->upload_manager = new Pika_Upload_Manager();
  }

  /**
   * Check if person has transactions
   * 
   * @param int $person_id Person ID
   * @return bool True if person has transactions, false otherwise
   */
  public function person_has_transactions($person_id) {
    $table_name = $this->get_table_name();
    $sql = $this->db()->prepare("SELECT COUNT(*) FROM {$table_name} WHERE person_id = %d", $person_id);
    $count = $this->db()->get_var($sql);
    return $count > 0;
  }

  /**
   * Is account has transactions
   * 
   * @param int $id
   * @return bool
   */
  public function account_has_transactions($id) {
    $table_name = $this->get_table_name();
    $sql = $this->db()->prepare("SELECT COUNT(*) FROM {$table_name} WHERE account_id = %d OR to_account_id = %d", $id, $id);
    $count = $this->db()->get_var($sql);
    return $count > 0;
  }
}
