<?php

/**
 * People manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_People_Manager extends Pika_Base_Manager {

  protected $table_name = 'people';
  protected $upload_type = 'avatar';
  protected $upload_manager;
  protected $analytics_manager;
  public $errors = [
    'person_not_found' => ['message' => 'Person not found', 'status' => 404],
    'invalid_name' => ['message' => 'Invalid person name', 'status' => 400],
    'invalid_avatar' => ['message' => 'Invalid avatar id', 'status' => 400],
    'invalid_email' => ['message' => 'Invalid email', 'status' => 400],
    'person_already_exists' => ['message' => 'Person with same name and email already exists', 'status' => 400],
    'person_has_transactions' => ['message' => 'Person has transactions. Please delete the transactions first.', 'status' => 400],
    'invalid_person_id' => ['message' => 'Person id is invalid', 'status' => 400],
  ];

  public function __construct() {
    parent::__construct();
    $this->upload_manager = new Pika_Upload_Manager();
    $this->analytics_manager = new Pika_Analytics_Manager();
  }

  /**
   * Format person
   * 
   * @param object $person
   * @return array
   */
  public function format_person($person) {
    $avatar = is_null($person->avatar_id) ? null : $this->upload_manager->get_file_by_id($person->avatar_id, true);
    $last_transaction_at = null;
    $total_transactions = 0;
    $balance = 0;
    $person_summary = $this->analytics_manager->get_person_summary($person->id);
    if (!is_wp_error($person_summary)) {
      $balance = $person_summary->balance;
      $last_transaction_at = $person_summary->last_transaction_at;
      $total_transactions = $person_summary->total_transactions;
    }

    return [
      'id' => $person->id,
      'name' => $person->name,
      'description' => $person->description,
      'email' => $person->email,
      'phone' => $person->phone,
      'avatar' => $avatar,
      'lastTransactionAt' => $last_transaction_at,
      'totalTransactions' => $total_transactions,
      'balance' => $balance,
    ];
  }

  /**
   * Is valid avatar id
   * 
   * @param int $id Avatar ID
   * @return bool True if valid, false otherwise
   */
  public function is_valid_avatar_id($id) {
    $avatar = $this->upload_manager->get_file_by_id($id);
    return ($avatar !== null && $avatar->attachment_type === 'image' && $avatar->entity_type === 'person' && $avatar->user_id === strval(get_current_user_id()));
  }

  /**
   * Is valid person id
   * 
   * @param int $id Person ID
   * @return int|null Sanitized person id on success, null on failure
   */
  public function sanitize_person_id($id) {
    $id = intval($id);
    if (!is_numeric($id)) return null;

    $person = $this->get_person($id);
    if (is_wp_error($person) || $person->user_id !== strval(get_current_user_id())) return null;

    return $id;
  }

  /**
   * Check if person with same name and email already exists
   * 
   * @param string $name Person name
   * @param string $email Person email
   * @return bool True if exists, false otherwise
   */
  public function is_person_exists($name, $email, $filter_id = null) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $sql = $this->db()->prepare("SELECT * FROM {$table_name} WHERE name = %s AND email = %s AND user_id = %d AND id != %d", $name, $email, $user_id, $filter_id);
    $person = $this->db()->get_row($sql);
    return $person !== null;
  }

  /**
   * Check if person has transactions
   * 
   * @param int $person_id Person ID
   * @return bool True if person has transactions, false otherwise
   */
  public function person_has_transactions($person_id) {
    $table_name = $this->get_table_name('transactions');
    $sql = $this->db()->prepare("SELECT COUNT(*) FROM {$table_name} WHERE person_id = %d", $person_id);
    $count = $this->db()->get_var($sql);
    return $count > 0;
  }

  /**
   * Get person
   * 
   * @param int $id Person ID
   * @param bool $format
   * @return array|WP_Error Person data on success, WP_Error on failure
   */
  public function get_person($id, $format = false) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $sql = $this->db()->prepare("SELECT * FROM {$table_name} WHERE id = %d", $id);
    $person = $this->db()->get_row($sql);
    if (!$person) {
      return $this->get_error('person_not_found');
    }

    if ($person->user_id !== strval($user_id)) {
      return $this->get_error('unauthorized');
    }

    if ($format) {
      return $this->format_person($person);
    }

    return $person;
  }

  /**
   * Get detailed person
   * 
   * @param int $id Person ID
   * @return array|WP_Error Person data on success, WP_Error on failure
   */
  public function get_detailed_person($id) {
    $person = $this->get_person($id, true);
    if (is_wp_error($person)) {
      return $person;
    }

    $person_total_summary = $this->analytics_manager->get_person_total_summary($id);
    if (is_wp_error($person_total_summary)) {
      return $person_total_summary;
    }

    $person['totalSummary'] = [
      'totalSpent' => $person_total_summary->total_spent,
      'totalReceived' => $person_total_summary->total_received,
    ];

    return $person;
  }

  /**
   * Get all people
   * 
   * @return array|WP_Error People data on success, WP_Error on failure
   */
  public function get_all_people() {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $sql = $this->db()->prepare("SELECT * FROM {$table_name} WHERE user_id = %d ORDER BY name ASC", $user_id);
    $people = $this->db()->get_results($sql);
    if (is_wp_error($people)) {
      return $this->get_error('db_error');
    }

    $formatted_people = [];
    foreach ($people as $person) {
      $formatted_people[] = $this->format_person($person);
    }

    return $formatted_people;
  }

  /**
   * Create person
   * 
   * @param string $name Person name
   * @param string $email Person email
   * @param string $phone Person phone
   * @param int $avatar_id Avatar ID
   * @param string $description Person description
   * @return array|WP_Error Person data on success, WP_Error on failure
   */
  public function create_person($name, $email = '', $phone = '', $avatar_id = null, $description = '') {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $data = [
      'name' => $name,
      'email' => $email,
      'phone' => $phone,
      'avatar_id' => $avatar_id,
      'description' => $description,
      'user_id' => $user_id,
    ];

    $format = ['%s', '%s', '%s', '%d', '%s', '%d'];
    $this->db()->insert($table_name, $data, $format);
    $person_id = $this->db()->insert_id;

    if ($person_id === 0) {
      return $this->get_error('db_error');
    }

    return $this->get_person($person_id);
  }

  /**
   * Update person
   * 
   * @param int $id Person ID
   * @param array $data Person data
   * @param array $format Format data
   * @return array|WP_Error Person data on success, WP_Error on failure
   */
  public function update_person($id, $data, $format) {
    $table_name = $this->get_table_name();
    $result = $this->db()->update($table_name, $data, ['id' => $id], $format);
    if ($result === false) {
      return $this->get_error('db_update_error');
    }

    $person = $this->get_person($id, true);
    if (is_wp_error($person)) {
      return $this->get_error('db_error');
    }

    return $person;
  }

  /**
   * Delete person
   * 
   * @param int $id Person ID
   * @return bool|WP_Error True on success, WP_Error on failure
   */
  public function delete_person($id) {
    $table_name = $this->get_table_name();
    $result = $this->db()->delete($table_name, ['id' => $id]);
    if ($result === false) {
      return $this->get_error('db_delete_error');
    }

    return true;
  }
}
