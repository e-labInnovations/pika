<?php

/**
 * Accounts manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Accounts_Manager extends Pika_Base_Manager {

  protected $table_name = 'accounts';
  protected $upload_manager;

  public $errors = [
    'invalid_account_id' => ['message' => 'Invalid account id', 'status' => 400],
    'account_not_found' => ['message' => 'Account not found', 'status' => 404],
    'account_name_not_unique' => ['message' => 'Account with this name already exists', 'status' => 400],
    'account_has_transactions' => ['message' => 'Account has transactions. Please delete the transactions first.', 'status' => 400],
    'invalid_avatar_id' => ['message' => 'Invalid avatar id', 'status' => 400],
  ];

  public function __construct() {
    parent::__construct();
    $this->upload_manager = new Pika_Upload_Manager();
  }

  /**
   * Is valid avatar id
   * 
   * @param int $id
   * @return bool
   */
  public function is_valid_avatar_id($id) {
    $avatar = $this->upload_manager->get_file_by_id($id);
    return ($avatar !== null && $avatar->attachment_type === 'image' && $avatar->entity_type === 'account' && $avatar->user_id === strval(get_current_user_id()));
  }

  /**
   * Is account name unique
   * 
   * @param string $name
   * @return bool
   */
  public function is_account_name_unique($name, $filter_id = null) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $sql = $this->db()->prepare("SELECT * FROM {$table_name} WHERE name = %s AND user_id = %d AND id != %d", $name, $user_id, $filter_id);
    $account = $this->db()->get_row($sql);

    if (is_wp_error($account)) {
      return false;
    }

    return $account === null;
  }

  /**
   * Is account has transactions
   * 
   * @param int $id
   * @return bool
   */
  public function account_has_transactions($id) {
    $table_name = $this->get_table_name('transactions');
    $sql = $this->db()->prepare("SELECT COUNT(*) FROM {$table_name} WHERE account_id = %d OR to_account_id = %d", $id, $id);
    $count = $this->db()->get_var($sql);
    return $count > 0;
  }

  /**
   * Format account
   * 
   * @param object $account
   * @return array
   */
  public function format_account($account) {
    $avatar = $account->avatar_id ? $this->upload_manager->get_file_by_id($account->avatar_id, true) : null;
    $last_transaction_at = null;
    $total_transactions = 0;
    $balance = 0;

    return [
      'id' => $account->id,
      'name' => $account->name,
      'description' => $account->description,
      'avatar' => $avatar,
      'lastTransactionAt' => $last_transaction_at,
      'totalTransactions' => $total_transactions,
      'balance' => $balance,
      'icon' => $account->icon,
      'bgColor' => $account->bg_color,
      'color' => $account->color,
    ];
  }

  /**
   * Get account by id
   * 
   * @param int $id
   * @return array|WP_Error
   */
  public function get_account_by_id($id, $format = false) {
    $table_name = $this->get_table_name();
    $sql = $this->db()->prepare("SELECT * FROM {$table_name} WHERE id = %d", $id);
    $account = $this->db()->get_row($sql);

    if (is_wp_error($account)) {
      return $account;
    }

    if (!$account) {
      return $this->get_error('account_not_found');
    }

    if ($account->user_id !== strval(get_current_user_id())) {
      return $this->get_error('unauthorized');
    }

    if ($format) {
      return $this->format_account($account);
    }
    
    return $account;
  }

  /**
   * Get all accounts
   * 
   * @return array|WP_Error
   */
  public function get_all_accounts() {
    $table_name = $this->get_table_name();
    $sql = $this->db()->prepare("SELECT * FROM {$table_name}");
    $accounts = $this->db()->get_results($sql);

    if (is_wp_error($accounts)) {
      return $accounts;
    }

    return array_map([$this, 'format_account'], $accounts);
  }

  /**
   * Create account
   * 
   * @param string $name
   * @param string $description
   * @param int $avatar_id
   * @param string $icon
   * @param string $bg_color
   * @param string $color
   * @return array|WP_Error
   */
  public function create_account($name, $description, $avatar_id, $icon, $bg_color, $color) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $data = [
      'name' => $name,
      'description' => $description,
      'avatar_id' => $avatar_id,
      'icon' => $icon,
      'bg_color' => $bg_color,
      'color' => $color,
      'user_id' => $user_id,
    ];

    $format = ['%s', '%s', '%d', '%s', '%s', '%s', '%d'];
    $this->db()->insert($table_name, $data, $format);
    $account_id = $this->db()->insert_id;

    if ($account_id === 0) {
      return $this->get_error('db_error');
    }

    return $this->get_account_by_id($account_id, true);
  }

  /**
   * Update account
   * 
   * @param int $id
   * @param array $data
   * @return array|WP_Error
   */
  public function update_account($id, $data, $format) {
    $table_name = $this->get_table_name();
    $result = $this->db()->update($table_name, $data, ['id' => $id], $format);
    if ($result === false) {
      return $this->get_error('db_update_error');
    }

    return $this->get_account_by_id($id, true);
  }

  /**
   * Delete account
   * 
   * @param int $id
   * @return bool|WP_Error
   */
  public function delete_account($id) {
    $table_name = $this->get_table_name();
    $result = $this->db()->delete($table_name, ['id' => $id]);
    if ($result === false) {
      return $this->get_error('db_delete_error');
    }

    return true;
  }
}
