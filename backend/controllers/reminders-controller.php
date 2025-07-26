<?php

/**
 * Reminders controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Reminders_Controller extends Pika_Base_Controller {

  public $reminders_manager;

  public function __construct() {
    parent::__construct();
    $this->reminders_manager = new Pika_Reminders_Manager();
  }

  /**
   * Register routes
   */
  public function register_routes() {
    // Get all reminders
    register_rest_route($this->namespace, '/reminders', [
      'methods' => 'GET',
      'callback' => [$this, 'get_reminders'],
      'permission_callback' => [$this, 'check_auth']
    ]);

    // Get due reminders
    register_rest_route($this->namespace, '/reminders/due', [
      'methods' => 'GET',
      'callback' => [$this, 'get_due_reminders'],
      'permission_callback' => [$this, 'check_auth']
    ]);

    // Get single reminder
    register_rest_route($this->namespace, '/reminders/(?P<id>[0-9]+)', [
      'methods' => 'GET',
      'callback' => [$this, 'get_reminder'],
      'permission_callback' => [$this, 'check_auth']
    ]);

    // Create reminder
    register_rest_route($this->namespace, '/reminders', [
      'methods' => 'POST',
      'callback' => [$this, 'create_reminder'],
      'permission_callback' => [$this, 'check_auth']
    ]);

    // Update reminder
    register_rest_route($this->namespace, '/reminders/(?P<id>[0-9]+)', [
      'methods' => 'PUT',
      'callback' => [$this, 'update_reminder'],
      'permission_callback' => [$this, 'check_auth']
    ]);

    // Archive reminder
    register_rest_route($this->namespace, '/reminders/(?P<id>[0-9]+)/archive', [
      'methods' => 'POST',
      'callback' => [$this, 'archive_reminder'],
      'permission_callback' => [$this, 'check_auth']
    ]);

    // Mark reminder as completed
    register_rest_route($this->namespace, '/reminders/(?P<id>[0-9]+)/complete', [
      'methods' => 'POST',
      'callback' => [$this, 'mark_completed'],
      'permission_callback' => [$this, 'check_auth']
    ]);

    // Convert reminder to transaction
    register_rest_route($this->namespace, '/reminders/(?P<id>[0-9]+)/convert', [
      'methods' => 'POST',
      'callback' => [$this, 'convert_to_transaction'],
      'permission_callback' => [$this, 'check_auth']
    ]);
  }

  /**
   * Get all reminders
   */
  public function get_reminders($request) {
    $params = $request->get_params();
    $archived = isset($params['archived']) ? filter_var($params['archived'], FILTER_VALIDATE_BOOLEAN) : false;

    $reminders = $this->reminders_manager->get_all_reminders($archived);

    if (is_wp_error($reminders)) {
      return $reminders;
    }

    return $reminders;
  }

  /**
   * Get due reminders
   */
  public function get_due_reminders($request) {
    $params = $request->get_params();
    $date = isset($params['date']) ? $params['date'] : null;

    $reminders = $this->reminders_manager->get_due_reminders($date);

    if (is_wp_error($reminders)) {
      return $reminders;
    }

    return $reminders;
  }

  /**
   * Get single reminder
   */
  public function get_reminder($request) {
    $id = intval($request['id']);
    $reminder = $this->reminders_manager->get_reminder_by_id($id);

    if (is_wp_error($reminder)) {
      return $reminder;
    }

    return $reminder;
  }

  /**
   * Create reminder
   */
  public function create_reminder($request) {
    $params = $request->get_json_params();

    // Validate required fields
    $title = sanitize_text_field($params['title'] ?? '');
    if (!$title) {
      return $this->reminders_manager->get_error('invalid_title');
    }

    $amount = $this->reminders_manager->sanitize_amount($params['amount'] ?? null);
    if (!$amount) {
      return $this->reminders_manager->get_error('invalid_amount');
    }

    $type = $this->reminders_manager->sanitize_type($params['type'] ?? null);
    if (!$type) {
      return $this->reminders_manager->get_error('invalid_type');
    }

    $account_id = intval($params['accountId'] ?? 0);
    if (!$account_id) {
      return $this->reminders_manager->get_error('invalid_account_id');
    }

    $date = $this->reminders_manager->sanitize_date($params['date'] ?? null);
    if (!$date) {
      return $this->reminders_manager->get_error('invalid_date');
    }

    // Optional fields
    $member_id = !empty($params['memberId']) ? intval($params['memberId']) : null;
    $description = !empty($params['description']) ? sanitize_text_field($params['description']) : null;
    $from_member_id = !empty($params['fromMemberId']) ? intval($params['fromMemberId']) : null;
    $to_member_id = !empty($params['toMemberId']) ? intval($params['toMemberId']) : null;
    $category_id = !empty($params['categoryId']) ? intval($params['categoryId']) : null;
    $tag_ids = $this->reminders_manager->sanitize_json_array($params['tagIds'] ?? []) ?? [];

    // Recurring fields
    $is_recurring = filter_var($params['isRecurring'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $recurrence_period = !empty($params['recurrencePeriod']) ? sanitize_text_field($params['recurrencePeriod']) : null;
    $recurrence_type = $this->reminders_manager->sanitize_recurrence_type($params['recurrenceType'] ?? null);
    $next_due_date = $this->reminders_manager->sanitize_date($params['nextDueDate'] ?? null);

    // Validate recurrence type if recurring
    if ($is_recurring && $recurrence_type && !in_array($recurrence_type, $this->reminders_manager->allowed_recurrence_types)) {
      return $this->reminders_manager->get_error('invalid_recurrence_type');
    }

    $data = [
      'title' => $title,
      'description' => $description,
      'amount' => $amount,
      'type' => $type,
      'member_id' => $member_id,
      'from_member_id' => $from_member_id,
      'to_member_id' => $to_member_id,
      'category_id' => $category_id,
      'tag_ids' => $tag_ids,
      'account_id' => $account_id,
      'date' => $date,
      'is_recurring' => $is_recurring ? 1 : 0,
      'recurrence_period' => $recurrence_period,
      'recurrence_type' => $recurrence_type,
      'next_due_date' => $next_due_date,
      'completed_dates' => [],
      'archived' => 0
    ];

    $reminder = $this->reminders_manager->create_reminder($data);

    if (is_wp_error($reminder)) {
      return $reminder;
    }

    return $reminder;
  }

  /**
   * Update reminder
   */
  public function update_reminder($request) {
    $id = intval($request['id']);
    $params = $request->get_json_params();

    $data = [];

    // Optional updates
    if (isset($params['title'])) {
      $title = sanitize_text_field($params['title']);
      if (!$title) {
        return $this->reminders_manager->get_error('invalid_title');
      }
      $data['title'] = $title;
    }

    if (isset($params['description'])) {
      $data['description'] = !empty($params['description']) ? sanitize_text_field($params['description']) : null;
    }

    if (isset($params['amount'])) {
      $amount = $this->reminders_manager->sanitize_amount($params['amount']);
      if (!$amount) {
        return $this->reminders_manager->get_error('invalid_amount');
      }
      $data['amount'] = $amount;
    }

    if (isset($params['type'])) {
      $type = $this->reminders_manager->sanitize_type($params['type']);
      if (!$type) {
        return $this->reminders_manager->get_error('invalid_type');
      }
      $data['type'] = $type;
    }

    if (isset($params['date'])) {
      $date = $this->reminders_manager->sanitize_date($params['date']);
      if (!$date) {
        return $this->reminders_manager->get_error('invalid_date');
      }
      $data['date'] = $date;
    }

    if (isset($params['memberId'])) {
      $data['member_id'] = !empty($params['memberId']) ? intval($params['memberId']) : null;
    }

    if (isset($params['fromMemberId'])) {
      $data['from_member_id'] = !empty($params['fromMemberId']) ? intval($params['fromMemberId']) : null;
    }

    if (isset($params['toMemberId'])) {
      $data['to_member_id'] = !empty($params['toMemberId']) ? intval($params['toMemberId']) : null;
    }

    if (isset($params['categoryId'])) {
      $data['category_id'] = !empty($params['categoryId']) ? intval($params['categoryId']) : null;
    }

    if (isset($params['accountId'])) {
      $account_id = intval($params['accountId']);
      if (!$account_id) {
        return $this->reminders_manager->get_error('invalid_account_id');
      }
      $data['account_id'] = $account_id;
    }

    if (isset($params['tagIds'])) {
      $data['tag_ids'] = $this->reminders_manager->sanitize_json_array($params['tagIds']) ?? [];
    }

    if (isset($params['isRecurring'])) {
      $data['is_recurring'] = filter_var($params['isRecurring'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
    }

    if (isset($params['recurrencePeriod'])) {
      $data['recurrence_period'] = !empty($params['recurrencePeriod']) ? sanitize_text_field($params['recurrencePeriod']) : null;
    }

    if (isset($params['recurrenceType'])) {
      $recurrence_type = $this->reminders_manager->sanitize_recurrence_type($params['recurrenceType']);
      if ($params['recurrenceType'] && !$recurrence_type) {
        return $this->reminders_manager->get_error('invalid_recurrence_type');
      }
      $data['recurrence_type'] = $recurrence_type;
    }

    if (isset($params['nextDueDate'])) {
      $data['next_due_date'] = $this->reminders_manager->sanitize_date($params['nextDueDate']);
    }

    if (empty($data)) {
      return $this->reminders_manager->get_error('no_update');
    }

    $reminder = $this->reminders_manager->update_reminder($id, $data);

    if (is_wp_error($reminder)) {
      return $reminder;
    }

    return $reminder;
  }

  /**
   * Archive reminder
   */
  public function archive_reminder($request) {
    $id = intval($request['id']);

    $result = $this->reminders_manager->archive_reminder($id);

    if (is_wp_error($result)) {
      return $result;
    }

    return $result;
  }

  /**
   * Mark reminder as completed
   */
  public function mark_completed($request) {
    $id = intval($request['id']);
    $params = $request->get_json_params();

    $completion_date = isset($params['completionDate'])
      ? $this->reminders_manager->sanitize_date($params['completionDate'])
      : null;

    $result = $this->reminders_manager->mark_completed($id, $completion_date);

    if (is_wp_error($result)) {
      return $result;
    }

    return $result;
  }

  /**
   * Convert reminder to transaction
   */
  public function convert_to_transaction($request) {
    $id = intval($request['id']);
    $params = $request->get_json_params();

    $transaction_date = isset($params['transactionDate'])
      ? $this->reminders_manager->sanitize_datetime($params['transactionDate'])
      : null;

    $transaction = $this->reminders_manager->convert_to_transaction($id, $transaction_date);

    if (is_wp_error($transaction)) {
      return $transaction;
    }

    return $transaction;
  }
}
