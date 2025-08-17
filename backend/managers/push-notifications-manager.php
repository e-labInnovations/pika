<?php

/**
 * Push Notifications Manager for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\MessageSentReport;

class Pika_Push_Notifications_Manager extends Pika_Base_Manager {

  protected $table_name = 'notifications';
  protected $device_subscriptions_table_name = 'device_subscriptions';
  private $web_push;
  private $vapid_keys;
  public $errors = [
    'vapid_key_error' => ['message' => 'Failed to generate VAPID key.', 'status' => 500],
    'invalid_subscription' => ['message' => 'Invalid subscription data', 'status' => 400],
    'subscription_error' => ['message' => 'Failed to save subscription', 'status' => 500],
    'unsubscription_error' => ['message' => 'Failed to remove subscription', 'status' => 500],
    'enable_error' => ['message' => 'Failed to enable notifications', 'status' => 500],
    'disable_error' => ['message' => 'Failed to disable notifications', 'status' => 500],
    'invalid_notification' => ['message' => 'Missing required fields', 'status' => 400],
    'invalid_notification_title' => ['message' => 'Invalid notification title', 'status' => 400],
    'invalid_notification_body' => ['message' => 'Invalid notification body', 'status' => 400],
    'invalid_notification_icon' => ['message' => 'Invalid notification icon', 'status' => 400],
    'notification_not_found' => ['message' => 'Notification not found', 'status' => 404],
    'invalid_update' => ['message' => 'No valid fields to update', 'status' => 400],
    'update_error' => ['message' => 'Failed to update notification', 'status' => 500],
    'delete_error' => ['message' => 'Failed to delete notification', 'status' => 500],
    'notifications_error' => ['message' => 'Failed to get notifications', 'status' => 500],
    'not_ready' => ['message' => 'User does not have notifications enabled or no subscription found', 'status' => 400],
    'send_error' => ['message' => 'Failed to send test notification', 'status' => 500],
  ];

  public function __construct() {
    parent::__construct();

    $this->init_web_push();
  }

  /**
   * Initialize WebPush with VAPID keys
   */
  private function init_web_push() {
    $this->vapid_keys = $this->get_vapid_keys();

    if (!$this->vapid_keys) {
      $this->utils->log('No existing VAPID keys, generating new ones...');
      $this->vapid_keys = $this->generate_vapid_keys();
    }

    $this->web_push = new WebPush([
      'VAPID' => [
        'subject' => get_site_url(),
        'publicKey' => $this->vapid_keys['public_key'],
        'privateKey' => $this->vapid_keys['private_key'],
      ],
    ]);

    // Set automatic padding for better security
    $this->web_push->setAutomaticPadding(true);
  }

  /**
   * Get VAPID keys from WordPress options
   */
  private function get_vapid_keys() {
    $public_key = get_option('pika_vapid_public_key');
    $private_key = get_option('pika_vapid_private_key');

    if ($public_key && $private_key) {
      $keys = [
        'public_key' => $public_key,
        'private_key' => $private_key
      ];
      return $keys;
    }
    return false;
  }

  /**
   * Generate new VAPID keys
   */
  private function generate_vapid_keys() {
    try {
      $keys = \Minishlink\WebPush\VAPID::createVapidKeys();

      // Store keys in user settings
      $this->save_vapid_keys($keys);

      // Return keys in the expected format (snake_case)
      $formatted_keys = [
        'public_key' => $keys['publicKey'],
        'private_key' => $keys['privateKey']
      ];

      return $formatted_keys;
    } catch (Exception $e) {
      $this->utils->log('Error generating VAPID keys', ['error' => $e->getMessage()]);
      throw $e;
    }
  }

  /**
   * Save VAPID keys to WordPress options
   */
  private function save_vapid_keys($keys) {
    update_option('pika_vapid_public_key', $keys['publicKey']);
    update_option('pika_vapid_private_key', $keys['privateKey']);
  }

  /**
   * Save user device subscription
   */
  public function save_subscription($subscription_data, $device_id = null) {
    $user_id = get_current_user_id();
    $device_subscription_table = $this->get_table_name($this->device_subscriptions_table_name);

    if (!$device_id) {
      $device_id = $this->generate_device_id($subscription_data);
    }

    $result = $this->db()->replace($device_subscription_table, [
      'user_id' => $user_id,
      'device_id' => $device_id,
      'device_name' => $this->detect_device_name(),
      'device_type' => $this->detect_device_type(),
      'subscription_data' => json_encode($subscription_data),
      'is_active' => 1,
      'last_seen' => current_time('mysql'),
      'created_at' => current_time('mysql'),
      'updated_at' => current_time('mysql')
    ]);

    if (is_wp_error($result)) {
      return $this->get_error('db_error');
    }

    return $result !== false;
  }

  /**
   * Get user device subscriptions
   */
  public function get_subscriptions() {
    $user_id = get_current_user_id();
    $device_subscription_table = $this->get_table_name($this->device_subscriptions_table_name);

    $sql = $this->db()->prepare(
      "SELECT * FROM $device_subscription_table WHERE user_id = %d AND is_active = 1",
      $user_id
    );
    $subscriptions = $this->db()->get_results($sql);

    if (is_wp_error($subscriptions)) {
      return $this->get_error('db_error');
    }

    $result = [];
    foreach ($subscriptions as $sub) {
      $result[] = [
        'id' => $sub->id,
        'device_id' => $sub->device_id,
        'device_name' => $sub->device_name,
        'device_type' => $sub->device_type,
        'subscription' => json_decode($sub->subscription_data, true)
      ];
    }

    return $result;
  }

  /**
   * Get user push subscription (backward compatibility)
   */
  public function get_subscription() {
    $subscriptions = $this->get_subscriptions();

    if (is_wp_error($subscriptions)) {
      return $subscriptions;
    }

    return !empty($subscriptions) ? $subscriptions[0]['subscription'] : false;
  }

  /**
   * Delete user device subscription
   */
  public function delete_subscription($device_id = null) {
    $user_id = get_current_user_id();
    $device_subscription_table = $this->get_table_name($this->device_subscriptions_table_name);

    if ($device_id) {
      // Delete specific device
      $result = $this->db()->delete($device_subscription_table, [
        'user_id' => $user_id,
        'device_id' => $device_id
      ]);
    } else {
      // Delete all devices for user
      $result = $this->db()->delete($device_subscription_table, [
        'user_id' => $user_id
      ]);
    }

    if (is_wp_error($result)) {
      return $this->get_error('db_error');
    }

    return $result !== false;
  }

  /**
   * Send push notification to a specific user
   */
  public function send_notification_to_user($user_id, $notification_data) {
    $subscription = $this->get_subscription($user_id);

    if (!$subscription || is_wp_error($subscription)) {
      return false;
    }

    return $this->send_notification($subscription, $notification_data);
  }

  /**
   * Send push notification to multiple users
   */
  public function send_notification_to_users($user_ids, $notification_data) {
    $results = [];

    foreach ($user_ids as $user_id) {
      $results[$user_id] = $this->send_notification_to_user($user_id, $notification_data);
    }

    return $results;
  }

  /**
   * Send push notification to all subscribed users
   */
  public function send_notification_to_all($notification_data) {
    $device_subscription_table = $this->get_table_name($this->device_subscriptions_table_name);

    $sql = $this->db()->prepare(
      "SELECT user_id, subscription_data FROM $device_subscription_table WHERE is_active = 1"
    );
    $subscriptions = $this->db()->get_results($sql);

    if (is_wp_error($subscriptions)) {
      return $this->get_error('db_error');
    }

    $results = [];

    foreach ($subscriptions as $sub) {
      $subscription_data = json_decode($sub->subscription_data, true);
      $results[$sub->user_id] = $this->send_notification($subscription_data, $notification_data);
    }

    return $results;
  }

  /**
   * Send push notification using WebPush
   */
  private function send_notification($subscription_data, $notification_data) {
    try {
      // Validate subscription data has required fields
      if (!isset($subscription_data['endpoint']) || !isset($subscription_data['keys']['p256dh']) || !isset($subscription_data['keys']['auth'])) {
        return false;
      }

      $subscription = Subscription::create($subscription_data);

      $payload = json_encode([
        'title' => $notification_data['title'],
        'body' => $notification_data['body'],
        'icon' => $notification_data['icon'] ?? null,
        'badge' => $notification_data['badge'] ?? null,
        'image' => $notification_data['image'] ?? null,
        'tag' => $notification_data['tag'] ?? null,
        'data' => $notification_data['data'] ?? null,
        'actions' => $notification_data['actions'] ?? null,
        'requireInteraction' => $notification_data['require_interaction'] ?? false,
        'silent' => $notification_data['silent'] ?? false,
        'timestamp' => time()
      ]);

      $this->web_push->queueNotification($subscription, $payload);

      // Store notification in database
      $this->store_notification($subscription_data['user_id'] ?? 0, $notification_data);

      return true;
    } catch (Exception $e) {
      $this->utils->log('Push notification error', ['error' => $e->getMessage()]);
      return false;
    }
  }

  /**
   * Store notification in database
   */
  private function store_notification($user_id, $notification_data) {
    $table_name = $this->get_table_name();

    $this->db()->insert($table_name, [
      'user_id' => $user_id,
      'title' => $notification_data['title'],
      'body' => $notification_data['body'],
      'icon' => $notification_data['icon'] ?? null,
      'badge' => $notification_data['badge'] ?? null,
      'image' => $notification_data['image'] ?? null,
      'tag' => $notification_data['tag'] ?? null,
      'data' => json_encode($notification_data['data'] ?? null),
      'actions' => json_encode($notification_data['actions'] ?? null),
      'require_interaction' => $notification_data['require_interaction'] ?? 0,
      'silent' => $notification_data['silent'] ?? 0,
      'timestamp' => current_time('mysql'),
      'created_at' => current_time('mysql'),
      'updated_at' => current_time('mysql')
    ]);
  }

  /**
   * Flush all pending notifications
   */
  public function flush_notifications() {
    try {
      $reports = $this->web_push->flush();

      foreach ($reports as $report) {
        $endpoint = $report->getEndpoint();

        if ($report->isSuccess()) {
          // $this->utils->log("Push notification sent successfully to: $endpoint");
        } else {
          $this->utils->log("Push notification failed to: $endpoint - " . $report->getReason());

          // Handle expired subscriptions
          if ($report->isSubscriptionExpired()) {
            $this->handle_expired_subscription($endpoint);
          }
        }
      }

      return true;
    } catch (Exception $e) {
      $this->utils->log('Error flushing notifications', ['error' => $e->getMessage()]);
      return false;
    }
  }

  /**
   * Handle expired subscriptions
   */
  private function handle_expired_subscription($endpoint) {
    $table_name = $this->get_table_name($this->device_subscriptions_table_name);

    // Find and remove expired subscription
    $sql = $this->db()->prepare(
      "DELETE FROM $table_name WHERE subscription_data LIKE %s",
      '%' . $this->db()->esc_like($endpoint) . '%'
    );
    $result = $this->db()->query($sql);

    if (is_wp_error($result)) {
      return $this->get_error('db_error');
    }

    return $result !== false;
  }

  /**
   * Get VAPID public key for client
   */
  public function get_vapid_public_key() {
    // If WebPush isn't initialized, try to get keys directly
    if (!isset($this->vapid_keys)) {
      $keys = $this->get_vapid_keys();
      if ($keys) {
        return $keys['public_key'];
      }

      // If no keys exist, generate them
      try {
        $keys = $this->generate_vapid_keys();
        return $keys['public_key'];
      } catch (Exception $e) {
        error_log('Pika: Failed to generate VAPID keys: ' . $e->getMessage());
        return null;
      }
    }

    return $this->vapid_keys['public_key'] ?? null;
  }

  /**
   * Check if WebPush is properly initialized
   */
  public function is_web_push_ready() {
    return isset($this->web_push) && isset($this->vapid_keys);
  }

  /**
   * Check if push notifications are enabled for user
   */
  public function is_enabled_for_user() {
    $user_id = get_current_user_id();
    return get_user_meta($user_id, 'pika_push_notifications_enabled', true) === '1';
  }

  /**
   * Enable/disable push notifications for user
   */
  public function set_enabled_for_user($enabled) {
    $user_id = get_current_user_id();
    return update_user_meta($user_id, 'pika_push_notifications_enabled', $enabled ? '1' : '0');
  }

  /**
   * Generate unique device ID from subscription data
   */
  private function generate_device_id($subscription_data) {
    $endpoint = $subscription_data['endpoint'] ?? '';
    $auth = $subscription_data['keys']['auth'] ?? '';
    return md5($endpoint . $auth);
  }

  /**
   * Detect device name
   */
  private function detect_device_name() {
    if (isset($_SERVER['HTTP_USER_AGENT'])) {
      $user_agent = $_SERVER['HTTP_USER_AGENT'];

      if (strpos($user_agent, 'Mobile') !== false) {
        return 'Mobile Device';
      } elseif (strpos($user_agent, 'Tablet') !== false) {
        return 'Tablet';
      } elseif (strpos($user_agent, 'Windows') !== false) {
        return 'Windows Desktop';
      } elseif (strpos($user_agent, 'Mac') !== false) {
        return 'Mac Desktop';
      } elseif (strpos($user_agent, 'Linux') !== false) {
        return 'Linux Desktop';
      }
    }

    return 'Unknown Device';
  }

  /**
   * Detect device type
   */
  private function detect_device_type() {
    if (isset($_SERVER['HTTP_USER_AGENT'])) {
      $user_agent = $_SERVER['HTTP_USER_AGENT'];

      if (strpos($user_agent, 'Mobile') !== false || strpos($user_agent, 'Tablet') !== false) {
        return 'mobile';
      }
    }

    return 'web';
  }

  /**
   * Get notification
   */
  public function get_notification($notification_id) {
    $table_name = $this->get_table_name();
    $sql = $this->db()->prepare(
      "SELECT * FROM $table_name WHERE id = %d",
      $notification_id
    );
    $notification = $this->db()->get_row($sql);

    if (is_wp_error($notification)) {
      return $this->get_error('db_error');
    }

    return $notification;
  }

  /**
   * Get user notifications
   * 
   * @param int $page Page number
   * @param int $per_page Number of notifications per page
   * @return array|WP_Error Notifications data on success, WP_Error on failure
   */
  public function get_user_notifications($page, $per_page) {
    $user_id = get_current_user_id();
    $table_name = $this->get_table_name();

    $offset = ($page - 1) * $per_page;

    $sql = $this->db()->prepare(
      "SELECT * FROM $table_name WHERE user_id = %d ORDER BY timestamp DESC LIMIT %d OFFSET %d",
      $user_id,
      $per_page,
      $offset
    );

    $notifications = $this->db()->get_results($sql);

    if (is_wp_error($notifications)) {
      return $this->get_error('db_error');
    }

    $total = $this->db()->get_var($this->db()->prepare(
      "SELECT COUNT(*) FROM $table_name WHERE user_id = %d",
      $user_id
    ));

    if (is_wp_error($total)) {
      return $this->get_error('db_error');
    }

    return [
      'notifications' => $notifications,
      'pagination' => [
        'page' => $page,
        'per_page' => $per_page,
        'total' => intval($total),
        'total_pages' => ceil(intval($total) / $per_page)
      ]
    ];
  }

  /**
   * Update notification status
   */
  public function update_notification_status($notification_id, $data = [], $format = []) {
    $user_id = get_current_user_id();
    $table_name = $this->get_table_name();

    // Verify notification belongs to user
    $notification = $this->get_notification($notification_id);

    if (!$notification || is_wp_error($notification)) {
      return $this->get_error('notification_not_found');
    }

    $result = $this->db()->update(
      $table_name,
      $data,
      ['id' => $notification_id, 'user_id' => $user_id],
      $format
    );

    if (is_wp_error($result) || $result === false) {
      return $this->get_error('update_error');
    }

    return true;
  }

  /**
   * Delete notification
   */
  public function delete_notification($notification_id) {
    $user_id = get_current_user_id();
    $table_name = $this->get_table_name();

    // Verify notification belongs to user
    $notification = $this->get_notification($notification_id);

    if (!$notification || is_wp_error($notification)) {
      return $this->get_error('notification_not_found');
    }

    $result = $this->db()->delete(
      $table_name,
      ['id' => $notification_id, 'user_id' => $user_id],
      ['%d', '%d']
    );

    if (is_wp_error($result) || $result === false) {
      return $this->get_error('delete_error');
    }

    return true;
  }
}
