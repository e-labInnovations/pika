<?php

/**
 * Transactions manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Transactions_Manager extends Pika_Base_Manager {

  protected $table_name = 'transactions';
  protected $transaction_attachments_table = 'transaction_attachments';
  protected $transaction_tags_table = 'transaction_tags';
  protected $upload_manager;
  protected $categories_manager;
  protected $accounts_manager;
  protected $people_manager;
  protected $tags_manager;
  public $allowed_types = ['income', 'expense', 'transfer'];
  public $errors = [
    'invalid_title' => ['message' => 'Invalid title', 'status' => 400],
    'invalid_amount' => ['message' => 'Invalid amount, must be greater than 0', 'status' => 400],
    'invalid_date' => ['message' => 'Invalid date', 'status' => 400],
    'invalid_type' => ['message' => 'Invalid type, must be "income", "expense" or "transfer"', 'status' => 400],
    'invalid_category_id' => ['message' => 'Invalid category id', 'status' => 400],
    'invalid_account_id' => ['message' => 'Invalid account id', 'status' => 400],
    'invalid_person_id' => ['message' => 'Invalid person id', 'status' => 400],
    'invalid_to_account_id' => ['message' => 'Invalid to account id', 'status' => 400],
    'invalid_tags' => ['message' => 'Invalid tags', 'status' => 400],
    'invalid_attachments' => ['message' => 'Invalid attachments', 'status' => 400],
    'not_found' => ['message' => 'Transaction not found', 'status' => 404],
  ];

  public function __construct() {
    parent::__construct();
    $this->upload_manager = new Pika_Upload_Manager();
    $this->categories_manager = new Pika_Categories_Manager();
    $this->accounts_manager = new Pika_Accounts_Manager();
    $this->people_manager = new Pika_People_Manager();
    $this->tags_manager = new Pika_Tags_Manager();
  }

  /**
   * Sanitize type
   */
  public function sanitize_type($type) {
    return in_array($type, $this->allowed_types) ? $type : null;
  }

  /**
   * Is valid category id
   */
  public function is_valid_category_id($category_id, $type) {
    $category = $this->categories_manager->get_category_by_id($category_id);
    if (is_wp_error($category)) {
      return false;
    }

    return ($category->user_id === strval(get_current_user_id()) || $category->user_id === '0') && $category->type === $type;
  }

  /**
   * Is valid account id
   */
  public function is_valid_account_id($account_id) {
    $account = $this->accounts_manager->get_account_by_id($account_id);
    if (is_wp_error($account)) {
      return false;
    }

    return $account->user_id === strval(get_current_user_id());
  }

  /**
   * Is valid person id
   */
  public function is_valid_person_id($person_id) {
    $person = $this->people_manager->get_person($person_id);
    if (is_wp_error($person)) {
      return false;
    }

    return $person->user_id === strval(get_current_user_id());
  }

  /**
   * Is valid tag ids
   * 
   * @param array $tag_ids
   * @return bool
   */
  public function is_valid_tag_ids($tag_ids) {
    if (!is_array($tag_ids)) {
      return false;
    }

    foreach ($tag_ids as $tag_id) {
      $tag = $this->tags_manager->get_tag_by_id($tag_id);
      if (is_wp_error($tag)) {
        return false;
      }

      if ($tag->user_id !== strval(get_current_user_id()) && $tag->user_id !== '0') {
        return false;
      }
    }

    return true;
  }

  /**
   * Is valid attachments
   * 
   * @param array $attachments
   * @return bool
   */
  public function is_valid_attachments($attachments) {
    if (!is_array($attachments)) {
      return false;
    }

    foreach ($attachments as $attachment) {
      $attachment = $this->upload_manager->get_file_by_id($attachment);
      if (is_wp_error($attachment)) {
        return false;
      }

      if ($attachment->user_id !== strval(get_current_user_id()) || $attachment->type !== 'attachment') {
        return false;
      }
    }

    return true;
  }

  /**
   * Format transaction
   * 
   * @param object $transaction
   * @return array
   */
  public function format_transaction($transaction) {
    $category = $this->categories_manager->get_category_by_id($transaction->category_id, true);
    $account = $this->accounts_manager->get_account_by_id($transaction->account_id, true  );
    $person = $transaction->person_id ? $this->people_manager->get_person($transaction->person_id, true) : null;
    $to_account = $transaction->to_account_id ? $this->accounts_manager->get_account_by_id($transaction->to_account_id, true) : null;
    $attachments = $this->upload_manager->get_all_transaction_attachments($transaction->id);
    $tags = $this->tags_manager->get_all_transaction_tags($transaction->id);

    return [
      'id' => $transaction->id,
      'title' => $transaction->title,
      'amount' => $transaction->amount,
      'date' => $transaction->date,
      'type' => $transaction->type,
      'category' => $category,
      'account' => $account,
      'person' => $person,
      'toAccount' => $to_account,
      'note' => $transaction->note,
      'attachments' => $attachments,
      'tags' => $tags,
    ];
  }

  /**
   * Get all transactions
   * 
   * @param int|null $person_id
   * @param int|null $account_id
   * @param int|null $category_id
   * @param string|null $date_from
   * @param string|null $date_to
   * @param int|null $limit
   * @param int|null $offset
   * @return array|WP_Error
   */
  public function get_all_transactions($person_id = null, $account_id = null, $category_id = null, $date_from = null, $date_to = null, $limit = null, $offset = null) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $sql = $this->db()->prepare("SELECT * FROM {$table_name} WHERE user_id = %d", $user_id);

    if (!is_null($person_id)) {
      $sql .= $this->db()->prepare(" AND person_id = %d", $person_id);
    }
    if (!is_null($account_id)) {
      $sql .= $this->db()->prepare(" AND (account_id = %d OR to_account_id = %d)", $account_id, $account_id);
    }
    if (!is_null($category_id)) {
      $sql .= $this->db()->prepare(" AND category_id = %d", $category_id);
    }
    if (!is_null($date_from)) {
      $sql .= $this->db()->prepare(" AND date >= %s", $date_from);
    }
    if (!is_null($date_to)) {
      $sql .= $this->db()->prepare(" AND date <= %s", $date_to);
    }

    $sql .= $this->db()->prepare(" ORDER BY date DESC");

    if (!is_null($limit)) {
      $sql .= $this->db()->prepare(" LIMIT %d", $limit);
    }
    if (!is_null($offset)) {
      $sql .= $this->db()->prepare(" OFFSET %d", $offset);
    }

    $this->utils->log('SQL', $sql, 'debug');

    $transactions = $this->db()->get_results($sql);

    if (is_wp_error($transactions)) {
      return $this->get_error('db_error');
    }

    return array_map([$this, 'format_transaction'], $transactions);
  }

  /**
   * Get transaction by id
   * 
   * @param int $id
   * @return array|WP_Error
   */
  public function get_transaction_by_id($id, $format = false) {
    $user_id = get_current_user_id();
    $table_name = $this->get_table_name();
    $sql = $this->db()->prepare("SELECT * FROM {$table_name} WHERE id = %d", $id);
    $transaction = $this->db()->get_row($sql);

    if (is_wp_error($transaction)) {
      return $this->get_error('db_error');
    }

    if (is_null($transaction)) {
      return $this->get_error('not_found');
    }

    if ($transaction->user_id !== strval($user_id)) {
      return $this->get_error('unauthorized');
    }

    return $format ? $this->format_transaction($transaction) : $transaction;
  }

  /**
   * Create a new transaction
   * 
   * @param string $title
   * @param float $amount
   * @param string $date
   * @param string $type
   * @param int $category_id
   * @param int $account_id
   * @param int $person_id
   * @param int $to_account_id
   * @param string $note
   * @param array $attachments
   * @param array $tags
   * @return array|WP_Error
   */
  public function create_transaction($title, $amount, $date, $type, $category_id, $account_id, $person_id, $to_account_id, $note, $attachments, $tags) {
    $transaction_table = $this->get_table_name();
    $transaction_attachments_table = $this->get_table_name($this->transaction_attachments_table);
    $transaction_tags_table = $this->get_table_name($this->transaction_tags_table);

    $data = [
      'title' => $title,
      'amount' => $amount,
      'date' => $date,
      'type' => $type,
      'category_id' => $category_id,
      'account_id' => $account_id,
      'person_id' => $person_id,
      'to_account_id' => $to_account_id,
      'note' => $note,
      'user_id' => get_current_user_id(),
    ];

    $result = $this->db()->insert($transaction_table, $data);
    if ($result === false) {
      return $this->get_error('db_error');
    }

    $transaction_id = $this->db()->insert_id;
    if ($transaction_id === 0) {
      return $this->get_error('db_error');
    }

    if (!empty($attachments) && is_array($attachments)) {
      foreach ($attachments as $upload_id) {
          $upload_id = intval($upload_id);
          if ($upload_id > 0) {
              $this->db()->insert($transaction_attachments_table, [
                  'transaction_id' => $transaction_id,
                  'upload_id' => $upload_id,
              ]);
          }
      }
    }

  if (!empty($tags) && is_array($tags)) {
    foreach ($tags as $tag_id) {
        $tag_id = intval($tag_id);
        if ($tag_id > 0) {
            $this->db()->insert($transaction_tags_table, [
                'transaction_id' => $transaction_id,
                'tag_id' => $tag_id,
            ]);
        }
    }
  }

    return $this->get_transaction_by_id($transaction_id, true);
  }

  /**
   * Update a transaction
   * 
   * @param int $id
   * @param array $data
   * @param array $format
   * @param array $tags_to_add
   * @param array $tags_to_remove
   * @param array $attachments_to_add
   * @param array $attachments_to_remove
   * @return array|WP_Error
   */
  public function update_transaction($id, $data, $format, $tags_to_add, $tags_to_remove, $attachments_to_add, $attachments_to_remove) {
    $table_name = $this->get_table_name();
    $transaction_tags_table = $this->get_table_name($this->transaction_tags_table);
    $transaction_attachments_table = $this->get_table_name($this->transaction_attachments_table);

    $this->utils->log('Tags to add', $tags_to_add, 'debug');
    $this->utils->log('Tags to remove', $tags_to_remove, 'debug');
    $this->utils->log('Attachments to add', $attachments_to_add, 'debug');
    $this->utils->log('Attachments to remove', $attachments_to_remove, 'debug');

    // 🛠️ Update transaction data
    $result = $this->db()->update($table_name, $data, ['id' => $id], $format);
    if ($result === false) {
      return $this->get_error('db_update_error');
    }

    // 🔗 Handle tags to add
    if (!empty($tags_to_add)) {
      foreach ($tags_to_add as $tag_id) {
          $this->db()->insert(
              $transaction_tags_table,
              ['transaction_id' => intval($id), 'tag_id' => intval($tag_id)]
          );
      }
    }

    // 🔗 Handle tags to remove
    if (!empty($tags_to_remove)) {
        foreach ($tags_to_remove as $tag_id) {
            $this->db()->delete(
                $transaction_tags_table,
                ['transaction_id' => intval($id), 'tag_id' => intval($tag_id)]
            );
        }
    }

    // 📎 Handle attachments to add
    if (!empty($attachments_to_add)) {
        foreach ($attachments_to_add as $upload_id) {
            $this->db()->insert(
                $transaction_attachments_table,
                ['transaction_id' => intval($id), 'upload_id' => intval($upload_id)]
            );
        }
    }

    // 📎 Handle attachments to remove
    if (!empty($attachments_to_remove)) {
        foreach ($attachments_to_remove as $upload_id) {
            $this->db()->delete(
                $transaction_attachments_table,
                ['transaction_id' => intval($id), 'upload_id' => intval($upload_id)]
            );
        }
    }

    return $this->get_transaction_by_id($id, true);
  }

  /**
   * Delete a transaction
   * 
   * @param int $id
   * @return bool|WP_Error
   */
  public function delete_transaction($id) {
    $table_name = $this->get_table_name();
    $result = $this->db()->delete($table_name, ['id' => $id]);
    if ($result === false) {
      return $this->get_error('db_delete_error');
    }

    return true;
  }
}
