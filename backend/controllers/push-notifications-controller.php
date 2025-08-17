<?php

/**
 * Push Notifications Controller for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Push_Notifications_Controller extends Pika_Base_Controller {

  private $push_manager;

  public function __construct() {
    parent::__construct();
    $this->push_manager = new Pika_Push_Notifications_Manager();
  }

  /**
   * Register REST API routes
   */
  public function register_routes() {
    register_rest_route('pika/v1', '/push/vapid-key', [
      'methods' => 'GET',
      'callback' => [$this, 'get_vapid_key'],
      'permission_callback' => [$this, 'check_auth'],
    ]);

    register_rest_route('pika/v1', '/push/subscribe', [
      'methods' => 'POST',
      'callback' => [$this, 'subscribe_user'],
      'permission_callback' => [$this, 'check_auth'],
    ]);

    register_rest_route('pika/v1', '/push/unsubscribe', [
      'methods' => 'POST',
      'callback' => [$this, 'unsubscribe_user'],
      'permission_callback' => [$this, 'check_auth'],
    ]);

    register_rest_route('pika/v1', '/push/enable', [
      'methods' => 'POST',
      'callback' => [$this, 'enable_notifications'],
      'permission_callback' => [$this, 'check_auth'],
    ]);

    register_rest_route('pika/v1', '/push/disable', [
      'methods' => 'POST',
      'callback' => [$this, 'disable_notifications'],
      'permission_callback' => [$this, 'check_auth'],
    ]);

    register_rest_route('pika/v1', '/push/status', [
      'methods' => 'GET',
      'callback' => [$this, 'get_notification_status'],
      'permission_callback' => [$this, 'check_auth'],
    ]);

    register_rest_route('pika/v1', '/push/test', [
      'methods' => 'POST',
      'callback' => [$this, 'send_test_notification'],
      'permission_callback' => [$this, 'check_auth'],
    ]);

    register_rest_route('pika/v1', '/push/send', [
      'methods' => 'POST',
      'callback' => [$this, 'send_notification'],
      'permission_callback' => [$this, 'check_admin_permission'],
    ]);

    register_rest_route('pika/v1', '/push/notifications', [
      'methods' => 'GET',
      'callback' => [$this, 'get_user_notifications'],
      'permission_callback' => [$this, 'check_auth'],
    ]);

    register_rest_route('pika/v1', '/push/notifications/(?P<id>\d+)', [
      'methods' => 'PUT',
      'callback' => [$this, 'update_notification_status'],
      'permission_callback' => [$this, 'check_auth'],
      'args' => [
        'id' => [
          'validate_callback' => function ($param) {
            return is_numeric($param);
          }
        ]
      ]
    ]);

    register_rest_route('pika/v1', '/push/notifications/(?P<id>\d+)', [
      'methods' => 'DELETE',
      'callback' => [$this, 'delete_notification'],
      'permission_callback' => [$this, 'check_auth'],
      'args' => [
        'id' => [
          'validate_callback' => function ($param) {
            return is_numeric($param);
          }
        ]
      ]
    ]);

    register_rest_route('pika/v1', '/push/devices', [
      'methods' => 'GET',
      'callback' => [$this, 'get_user_devices'],
      'permission_callback' => [$this, 'check_auth'],
    ]);

    register_rest_route('pika/v1', '/push/devices/(?P<device_id>[a-zA-Z0-9]+)', [
      'methods' => 'DELETE',
      'callback' => [$this, 'delete_user_device'],
      'permission_callback' => [$this, 'check_auth'],
      'args' => [
        'device_id' => [
          'validate_callback' => function ($param) {
            return !empty($param);
          }
        ]
      ]
    ]);

    register_rest_route('pika/v1', '/push/statistics', [
      'methods' => 'GET',
      'callback' => [$this, 'get_device_statistics'],
      'permission_callback' => [$this, 'check_admin_permission'],
    ]);
  }

  /**
   * Check if user has admin permission
   */
  public function check_admin_permission($request) {
    return current_user_can('manage_options');
  }

  /**
   * Get VAPID public key
   */
  public function get_vapid_key($request) {
    $public_key = $this->push_manager->get_vapid_public_key();

    if (!$public_key) {
      return $this->push_manager->get_error('vapid_key_error');
    }

    return [
      'public_key' => $public_key,
      'web_push_ready' => $this->push_manager->is_web_push_ready()
    ];
  }

  /**
   * Subscribe user to push notifications
   */
  public function subscribe_user($request) {
    $subscription_data = $request->get_json_params();

    if (!$subscription_data || !isset($subscription_data['subscription'])) {
      return $this->push_manager->get_error('invalid_subscription');
    }

    $device_id = $subscription_data['device_id'] ?? null;
    $result = $this->push_manager->save_subscription($subscription_data['subscription'], $device_id);

    if (is_wp_error($result)) {
      return $result;
    }

    if (!$result) {
      return $this->push_manager->get_error('subscription_error');
    }

    // Enable notifications for user
    $this->push_manager->set_enabled_for_user(true);

    return [
      'message' => 'Successfully subscribed to push notifications'
    ];
  }

  /**
   * Unsubscribe user from push notifications
   */
  public function unsubscribe_user($request) {
    $result = $this->push_manager->delete_subscription();

    if (is_wp_error($result)) {
      return $result;
    }

    if (!$result) {
      return $this->push_manager->get_error('unsubscription_error');
    }

    // Disable notifications for user
    $this->push_manager->set_enabled_for_user(false);

    return [
      'message' => 'Successfully unsubscribed from push notifications'
    ];
  }

  /**
   * Enable push notifications for user
   */
  public function enable_notifications($request) {
    $result = $this->push_manager->set_enabled_for_user(true);

    if (!$result) {
      return $this->push_manager->get_error('enable_error');
    }

    return [
      'message' => 'Push notifications enabled'
    ];
  }

  /**
   * Disable push notifications for user
   */
  public function disable_notifications($request) {
    $result = $this->push_manager->set_enabled_for_user(false);

    if (!$result) {
      return $this->push_manager->get_error('disable_error');
    }

    return [
      'message' => 'Push notifications disabled'
    ];
  }

  /**
   * Get notification status for user
   */
  public function get_notification_status($request) {
    $enabled = $this->push_manager->is_enabled_for_user();
    $has_subscription = $this->push_manager->get_subscription();

    if (is_wp_error($enabled) || is_wp_error($has_subscription)) {
      return $this->push_manager->get_error('db_error');
    }

    $has_subscription = $has_subscription !== false;

    return [
      'enabled' => $enabled,
      'has_subscription' => $has_subscription,
      'can_receive' => $enabled && $has_subscription
    ];
  }

  /**
   * Send notification (admin only)
   */
  public function send_notification($request) {
    $params = $request->get_json_params();

    if (empty($params['title'])) {
      return $this->push_manager->get_error('invalid_notification_title');
    }

    if (empty($params['body'])) {
      return $this->push_manager->get_error('invalid_notification_body');
    }

    $notification_data = [
      'title' => sanitize_text_field($params['title']),
      'body' => sanitize_textarea_field($params['body']),
      'icon' => isset($params['icon']) ? esc_url_raw($params['icon']) : null,
      'badge' => isset($params['badge']) ? esc_url_raw($params['badge']) : null,
      'image' => isset($params['image']) ? esc_url_raw($params['image']) : null,
      'tag' => isset($params['tag']) ? sanitize_text_field($params['tag']) : null,
      'data' => isset($params['data']) ? $params['data'] : null,
      'actions' => isset($params['actions']) ? $params['actions'] : null,
      'require_interaction' => isset($params['require_interaction']) ? (bool) $params['require_interaction'] : false,
      'silent' => isset($params['silent']) ? (bool) $params['silent'] : false
    ];

    $user_ids = isset($params['user_ids']) ? array_map('intval', $params['user_ids']) : null;

    if ($user_ids) {
      $result = $this->push_manager->send_notification_to_users($user_ids, $notification_data);
    } else {
      $result = $this->push_manager->send_notification_to_all($notification_data);
    }

    // Flush notifications
    $this->push_manager->flush_notifications();

    // Calculate summary statistics
    $total_users = count($result);
    $successful_users = 0;
    $total_devices = 0;
    $successful_devices = 0;

    foreach ($result as $user_result) {
      if (isset($user_result['success']) && $user_result['success']) {
        $successful_users++;
      }
      if (isset($user_result['total_devices'])) {
        $total_devices += $user_result['total_devices'];
      }
      if (isset($user_result['devices_sent'])) {
        $successful_devices += $user_result['devices_sent'];
      }
    }

    return [
      'message' => 'Notification sent successfully',
      'summary' => [
        'total_users' => $total_users,
        'successful_users' => $successful_users,
        'total_devices' => $total_devices,
        'successful_devices' => $successful_devices
      ],
      'detailed_results' => $result
    ];
  }

  /**
   * Get user notifications
   */
  public function get_user_notifications($request) {
    $page = max(1, intval($request->get_param('page') ?? 1));
    $per_page = min(50, max(1, intval($request->get_param('per_page') ?? 20)));

    $result = $this->push_manager->get_user_notifications($page, $per_page);
    return $result;
  }

  /**
   * Update notification status (mark as read, clicked, dismissed)
   */
  public function update_notification_status($request) {
    $notification_id = $request->get_param('id');
    $params = $request->get_json_params();
    $data = [];
    $format = [];

    if (isset($params['read_at'])) {
      $data['read_at'] = $params['read_at'] ? current_time('mysql') : null;
      $format[] = '%s';
    }

    if (isset($params['clicked_at'])) {
      $data['clicked_at'] = $params['clicked_at'] ? current_time('mysql') : null;
      $format[] = '%s';
    }

    if (isset($params['dismissed_at'])) {
      $data['dismissed_at'] = $params['dismissed_at'] ? current_time('mysql') : null;
      $format[] = '%s';
    }

    if (empty($data)) {
      return $this->push_manager->get_error('invalid_update');
    }

    $result = $this->push_manager->update_notification_status($notification_id, $data, $format);

    if (is_wp_error($result)) {
      return $result;
    }

    return [
      'message' => 'Notification updated successfully'
    ];
  }

  /**
   * Delete notification
   */
  public function delete_notification($request) {
    $notification_id = $request->get_param('id');
    $result = $this->push_manager->delete_notification($notification_id);

    if (is_wp_error($result)) {
      return $result;
    }

    if (!$result) {
      return $this->push_manager->get_error('delete_error');
    }

    return [
      'message' => 'Notification deleted successfully'
    ];
  }

  /**
   * Send test notification to current user
   */
  public function send_test_notification($request) {
    $user_id = get_current_user_id();

    // Check if user has notifications enabled and has a subscription
    $enabled = $this->push_manager->is_enabled_for_user($user_id);
    $has_subscription = $this->push_manager->get_subscription($user_id) !== false;

    if (!$enabled || !$has_subscription) {
      return $this->push_manager->get_error('not_ready');
    }

    // Send test notification
    $notification_data = [
      'title' => 'Test Notification',
      'body' => 'This is a test notification from Pika Finance',
      'icon' => '/pika/icons/pwa-192x192.png',
      'tag' => 'test-notification',
      'data' => ['type' => 'test', 'timestamp' => time()],
      'require_interaction' => false,
      'silent' => false
    ];

    $result = $this->push_manager->send_notification_to_users([$user_id], $notification_data);

    if (!$result || !isset($result[$user_id])) {
      return $this->push_manager->get_error('send_error');
    }

    $user_result = $result[$user_id];

    // Flush notifications to ensure they are sent immediately
    $this->push_manager->flush_notifications();

    return [
      'message' => 'Test notification sent successfully',
      'devices_sent' => $user_result['devices_sent'],
      'total_devices' => $user_result['total_devices'],
      'success' => $user_result['success']
    ];
  }

  /**
   * Get user devices
   */
  public function get_user_devices($request) {
    $user_id = get_current_user_id();
    $devices = $this->push_manager->get_user_subscriptions($user_id);

    if (is_wp_error($devices)) {
      return $devices;
    }

    return [
      'devices' => $devices,
      'count' => count($devices)
    ];
  }

  /**
   * Delete specific user device
   */
  public function delete_user_device($request) {
    $device_id = $request->get_param('device_id');
    $result = $this->push_manager->delete_subscription($device_id);

    if (is_wp_error($result)) {
      return $result;
    }

    if (!$result) {
      return $this->push_manager->get_error('delete_error');
    }

    return [
      'message' => 'Device removed successfully'
    ];
  }

  /**
   * Get device statistics (admin only)
   */
  public function get_device_statistics($request) {
    $stats = $this->push_manager->get_device_statistics();

    if (is_wp_error($stats)) {
      return $stats;
    }

    return $stats;
  }
}