<?php

/**
 * Reminders manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Reminders_Manager extends Pika_Base_Manager {

  protected $table_name = 'reminders';
  protected $categories_manager;
  protected $accounts_manager;
  protected $people_manager;
  protected $tags_manager;
  public $allowed_types = ['income', 'expense', 'transfer'];
  public $allowed_recurrence_types = ['postpaid', 'prepaid'];

  public $errors = [
    'invalid_title' => ['message' => 'Invalid title', 'status' => 400],
    'invalid_amount' => ['message' => 'Invalid amount, must be greater than 0', 'status' => 400],
    'invalid_date' => ['message' => 'Invalid date', 'status' => 400],
    'invalid_type' => ['message' => 'Invalid type, must be "income", "expense" or "transfer"', 'status' => 400],
    'invalid_recurrence_type' => ['message' => 'Invalid recurrence type, must be "postpaid" or "prepaid"', 'status' => 400],
    'invalid_category_id' => ['message' => 'Invalid category id', 'status' => 400],
    'invalid_account_id' => ['message' => 'Invalid account id', 'status' => 400],
    'invalid_member_id' => ['message' => 'Invalid member id', 'status' => 400],
    'invalid_tags' => ['message' => 'Invalid tags', 'status' => 400],
    'reminder_not_found' => ['message' => 'Reminder not found', 'status' => 404],
  ];

  public function __construct() {
    parent::__construct();
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
   * Sanitize recurrence type
   */
  public function sanitize_recurrence_type($type) {
    return in_array($type, $this->allowed_recurrence_types) ? $type : null;
  }

  /**
   * Sanitize amount
   */
  public function sanitize_amount($amount) {
    $amount = floatval($amount);
    return $amount > 0 ? $amount : null;
  }

  /**
   * Sanitize date
   */
  public function sanitize_date($date) {
    if (empty($date) || is_null($date)) {
      return null;
    }
    $timestamp = strtotime($date);
    if ($timestamp === false) {
      return null;
    }
    return date('Y-m-d', $timestamp);
  }

  /**
   * Sanitize datetime
   */
  public function sanitize_datetime($datetime) {
    if (empty($datetime) || is_null($datetime)) {
      return null;
    }
    $timestamp = strtotime($datetime);
    if ($timestamp === false) {
      return null;
    }
    return date('Y-m-d H:i:s', $timestamp);
  }

  /**
   * Sanitize JSON array
   */
  public function sanitize_json_array($data) {
    if (is_string($data)) {
      $decoded = json_decode($data, true);
      return (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) ? $decoded : null;
    } elseif (is_array($data)) {
      return $data;
    }
    return null;
  }

  /**
   * Format reminder
   */
  public function format_reminder($reminder) {
    if (!$reminder) return null;

    // Decode JSON fields
    $tag_ids = $reminder->tag_ids ? json_decode($reminder->tag_ids, true) : [];
    $completed_dates = $reminder->completed_dates ? json_decode($reminder->completed_dates, true) : [];

    // Get full objects instead of just IDs
    $category = $reminder->category_id ? $this->categories_manager->get_category_by_id($reminder->category_id, true) : null;
    $account = $this->accounts_manager->get_account_by_id($reminder->account_id, true);
    $member = $reminder->member_id ? $this->people_manager->get_person($reminder->member_id, true) : null;
    $from_member = $reminder->from_member_id ? $this->people_manager->get_person($reminder->from_member_id, true) : null;
    $to_member = $reminder->to_member_id ? $this->people_manager->get_person($reminder->to_member_id, true) : null;

    // Get tag objects from tag IDs
    $tags = [];
    if (!empty($tag_ids)) {
      foreach ($tag_ids as $tag_id) {
        $tag = $this->tags_manager->get_tag_by_id($tag_id, true);
        if (!is_wp_error($tag)) {
          $tags[] = $tag;
        }
      }
    }

    return [
      'id' => intval($reminder->id),
      'title' => $reminder->title,
      'description' => $reminder->description,
      'amount' => floatval($reminder->amount),
      'type' => $reminder->type,
      'date' => $this->utils->to_iso8601_utc($reminder->date),
      'category' => $category,
      'account' => $account,
      'member' => $member,
      'fromMember' => $from_member,
      'toMember' => $to_member,
      'tags' => $tags,
      'isRecurring' => boolval($reminder->is_recurring),
      'recurrencePeriod' => $reminder->recurrence_period,
      'recurrenceType' => $reminder->recurrence_type,
      'nextDueDate' => $reminder->next_due_date,
      'completedDates' => $completed_dates
    ];
  }

  /**
   * Get reminder by ID
   */
  public function get_reminder_by_id($id, $format = true) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();

    $reminder = $this->db()->get_row(
      $this->db()->prepare(
        "SELECT * FROM {$table_name} WHERE id = %d AND user_id = %d AND archived = 0",
        $id,
        $user_id
      )
    );

    if (!$reminder) {
      return $this->get_error('reminder_not_found');
    }

    return $format ? $this->format_reminder($reminder) : $reminder;
  }

  /**
   * Get all reminders for user
   */
  public function get_all_reminders($archived = false) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();

    $archived_filter = $archived ? '' : 'AND archived = 0';

    $reminders = $this->db()->get_results(
      $this->db()->prepare(
        "SELECT * FROM {$table_name} WHERE user_id = %d {$archived_filter} ORDER BY next_due_date ASC, date ASC",
        $user_id
      )
    );

    if (is_wp_error($reminders)) {
      return $reminders;
    }

    return array_map([$this, 'format_reminder'], $reminders);
  }

  /**
   * Get due reminders
   */
  public function get_due_reminders($date = null) {
    if (!$date) {
      $date = current_time('Y-m-d');
    }

    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();

    $reminders = $this->db()->get_results(
      $this->db()->prepare(
        "SELECT * FROM {$table_name} WHERE user_id = %d AND next_due_date <= %s AND archived = 0 ORDER BY next_due_date ASC",
        $user_id,
        $date
      )
    );

    if (is_wp_error($reminders)) {
      return $reminders;
    }

    return array_map([$this, 'format_reminder'], $reminders);
  }

  /**
   * Create reminder
   */
  public function create_reminder($data) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();

    // Set next_due_date to initial date if not recurring
    if (!$data['is_recurring'] || !$data['next_due_date']) {
      $data['next_due_date'] = $data['date'];
    }

    $data['user_id'] = $user_id;

    // Encode JSON fields - ensure they're always valid JSON strings
    if (isset($data['tag_ids'])) {
      $data['tag_ids'] = is_array($data['tag_ids']) ? json_encode($data['tag_ids']) : '[]';
    } else {
      $data['tag_ids'] = '[]';
    }

    if (isset($data['completed_dates'])) {
      $data['completed_dates'] = is_array($data['completed_dates']) ? json_encode($data['completed_dates']) : '[]';
    } else {
      $data['completed_dates'] = '[]';
    }

    $result = $this->db()->insert($table_name, $data);

    if ($result === false) {
      return $this->get_error('db_insert_error');
    }

    $reminder_id = $this->db()->insert_id;
    return $this->get_reminder_by_id($reminder_id);
  }

  /**
   * Update reminder
   */
  public function update_reminder($id, $data) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();

    // Encode JSON fields - ensure they're always valid JSON strings
    if (isset($data['tag_ids'])) {
      $data['tag_ids'] = is_array($data['tag_ids']) ? json_encode($data['tag_ids']) : '[]';
    }
    if (isset($data['completed_dates'])) {
      $data['completed_dates'] = is_array($data['completed_dates']) ? json_encode($data['completed_dates']) : '[]';
    }

    $format = [];
    foreach ($data as $key => $value) {
      switch ($key) {
        case 'amount':
          $format[] = '%f';
          break;
        case 'member_id':
        case 'from_member_id':
        case 'to_member_id':
        case 'category_id':
        case 'account_id':
        case 'is_recurring':
        case 'archived':
          $format[] = '%d';
          break;
        default:
          $format[] = '%s';
      }
    }

    $result = $this->db()->update(
      $table_name,
      $data,
      ['id' => $id, 'user_id' => $user_id],
      $format,
      ['%d', '%d']
    );

    if ($result === false) {
      return $this->get_error('db_update_error');
    }

    return $this->get_reminder_by_id($id);
  }

  /**
   * Archive reminder (soft delete)
   */
  public function archive_reminder($id) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();

    // First check if reminder exists and is not already archived
    $reminder = $this->db()->get_row(
      $this->db()->prepare(
        "SELECT * FROM {$table_name} WHERE id = %d AND user_id = %d AND archived = 0",
        $id,
        $user_id
      )
    );

    if (!$reminder) {
      return $this->get_error('reminder_not_found');
    }

    // Update the reminder to set archived = 1
    $result = $this->db()->update(
      $table_name,
      ['archived' => 1],
      ['id' => $id, 'user_id' => $user_id],
      ['%d'],
      ['%d', '%d']
    );

    if ($result === false) {
      return $this->get_error('db_update_error');
    }

    // Return success message instead of trying to fetch the archived reminder
    return ['message' => 'Reminder archived successfully', 'id' => $id];
  }

  /**
   * Mark reminder as completed for a specific date
   */
  public function mark_completed($id, $completion_date = null) {
    if (!$completion_date) {
      $completion_date = current_time('Y-m-d');
    }

    $reminder = $this->get_reminder_by_id($id, true);
    if (is_wp_error($reminder)) {
      return $reminder;
    }

    $completed_dates = $reminder['completed_dates'] ?? [];

    // Add completion date if not already there
    if (!in_array($completion_date, $completed_dates)) {
      $completed_dates[] = $completion_date;
    }

    $update_data = [
      'completed_dates' => $completed_dates,
      'last_triggered_at' => current_time('mysql')
    ];

    // Calculate next due date if recurring
    if ($reminder['is_recurring'] && $reminder['recurrence_period']) {
      $update_data['next_due_date'] = $this->calculate_next_due_date(
        $reminder,
        $completion_date
      );
    }

    return $this->update_reminder($id, $update_data);
  }

  /**
   * Calculate next due date based on recurrence settings
   */
  private function calculate_next_due_date($reminder, $completion_date) {
    if (!$reminder['recurrence_period']) {
      return null;
    }

    // Parse recurrence period (e.g., "1 month", "3 months", "1 week")
    $base_date = ($reminder['recurrence_type'] === 'prepaid')
      ? $completion_date
      : $reminder['next_due_date'];

    return date('Y-m-d', strtotime($base_date . ' + ' . $reminder['recurrence_period']));
  }

  /**
   * Convert reminder to transaction
   */
  public function convert_to_transaction($reminder_id, $transaction_date = null) {
    // Get raw reminder data to access database column names
    $reminder_raw = $this->get_reminder_by_id($reminder_id, false);
    if (is_wp_error($reminder_raw)) {
      return $reminder_raw;
    }

    // Also get formatted reminder for description
    $reminder_formatted = $this->get_reminder_by_id($reminder_id, true);
    if (is_wp_error($reminder_formatted)) {
      return $reminder_formatted;
    }

    if (!$transaction_date) {
      $transaction_date = current_time('Y-m-d H:i:s');
    }

    // Create transaction data from reminder using raw data for IDs
    $transaction_data = [
      'title' => $reminder_raw->title,
      'amount' => $reminder_raw->amount,
      'date' => $transaction_date,
      'type' => $reminder_raw->type,
      'category_id' => $reminder_raw->category_id,
      'account_id' => $reminder_raw->account_id,
      'to_account_id' => $reminder_raw->to_member_id, // For transfers
      'person_id' => $reminder_raw->member_id,
      'note' => $reminder_formatted['description'] ? 'From reminder: ' . $reminder_formatted['description'] : 'From reminder'
    ];

    // Create transaction using transactions manager
    require_once PIKA_PLUGIN_PATH . 'backend/managers/transactions-manager.php';
    $transactions_manager = new Pika_Transactions_Manager();

    // Decode tag_ids from JSON string in raw data
    $tag_ids = $reminder_raw->tag_ids ? json_decode($reminder_raw->tag_ids, true) : [];

    return $transactions_manager->create_transaction(
      $transaction_data['title'],
      $transaction_data['amount'],
      $transaction_data['date'],
      $transaction_data['type'],
      $transaction_data['category_id'],
      $transaction_data['account_id'],
      $transaction_data['person_id'],
      $transaction_data['to_account_id'],
      $transaction_data['note'],
      [], // attachments
      $tag_ids // tags
    );
  }
}
