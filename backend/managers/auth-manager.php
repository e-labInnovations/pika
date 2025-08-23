<?php

/**
 * Authentication manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Auth_Manager extends Pika_Base_Manager {

  protected $settings_manager;
  protected $user_session_device_info_key = 'pika_session_device_info';
  protected $errors = [
    'invalid_uuid' => ['message' => 'Invalid UUID', 'status' => 400],
    'session_not_found' => ['message' => 'Session not found', 'status' => 404],
  ];

  public function __construct() {
    parent::__construct();
    $this->settings_manager = new Pika_Settings_Manager();
  }

  /**
   * Get app_id
   */
  public function get_app_id() {
    $app_id = get_option('pika_app_id');
    if (!$app_id) {
      $app_id = wp_generate_uuid4();
      update_option('pika_app_id', $app_id);
    }
    return $app_id;
  }

  /**
   * Save user session device info
   * @param int $user_id
   * @param string $session_id
   * @param array $device_info
   */
  public function save_user_session_device_info($user_id, $session_id, $device_info) {
    $session_device_info = get_user_meta($user_id, $this->user_session_device_info_key, true);
    if (!$session_device_info) {
      $session_device_info = [];
    }
    $session_device_info[$session_id] = $device_info;
    update_user_meta($user_id, $this->user_session_device_info_key, $session_device_info);
  }

  /**
   * Get user session device info
   * @param int $user_id
   * @param string $session_id
   * @return array|null
   */
  public function get_user_session_device_info($user_id, $session_id) {
    $session_device_info = get_user_meta($user_id, $this->user_session_device_info_key, true);
    $default_value = [
      'device_type' => 'unknown',
      'brand' => null,
      'model' => null,
      'client_type' => null,
      'client_name' => null,
      'os_name' => null,
    ];
    return $session_device_info[$session_id] ?? $default_value;
  }

  /**
   * Delete user session device info
   * @param int $user_id
   * @param string $session_id
   */
  public function delete_user_session_device_info($user_id, $session_id) {
    $session_device_info = get_user_meta($user_id, $this->user_session_device_info_key, true);
    if ($session_device_info) {
      unset($session_device_info[$session_id]);
      update_user_meta($user_id, $this->user_session_device_info_key, $session_device_info);
    }
  }

  /**
   * Get user data by id 
   */
  public function get_user_data_by_id($user_id) {
    $user = get_userdata($user_id);

    if (!$user) {
      return $this->get_error('unauthorized');
    }

    $settings = $this->settings_manager->get_all_settings($user->ID);
    $modified_settings = [
      'currency' => $settings['currency'],
      'is_api_key_set' => !empty($settings['gemini_api_key']) && !is_null($settings['gemini_api_key'])
    ];

    return [
      'id' => $user->ID,
      'username' => $user->user_login,
      'email' => $user->user_email,
      'display_name' => $user->display_name,
      'avatar_url' => get_avatar_url($user->ID, array('size' => 96)),
      'settings' => $modified_settings
    ];
  }

  /**
   * Get current user data
   */
  public function get_current_user_data() {
    $user_id = get_current_user_id();

    return $this->get_user_data_by_id($user_id);
  }

  /**
   * Get all application passwords
   */
  public function get_all_application_passwords() {
    $user_id = get_current_user_id();
    $passwords = WP_Application_Passwords::get_user_application_passwords($user_id);
    $currently_using_password_uuid = rest_get_authenticated_app_password();
    $app_id = $this->get_app_id();

    // Filter passwords by app_id and reindex array to ensure numeric keys
    $filtered_passwords = [];
    foreach ($passwords as $password) {
      if (isset($password['app_id']) && $password['app_id'] === $app_id) {
        $filtered_passwords[] = $password;
      }
    }

    $result = array_map(function($password) use ($currently_using_password_uuid, $user_id) {
      $device_info = $this->get_user_session_device_info($user_id, $password['uuid']);
      return [
        'uuid' => $password['uuid'],
        'app_id' => $password['app_id'],
        'name' => $password['name'],
        'created' => !empty($password['created']) ? gmdate('Y-m-d\TH:i:s\Z', $password['created']) : null,
        'last_used' => !empty($password['last_used']) ? gmdate('Y-m-d\TH:i:s\Z', $password['last_used']) : null,
        'last_ip' => $password['last_ip'],
        'is_currently_using' => $password['uuid'] === $currently_using_password_uuid,
        'device_info' => $device_info,
      ];
    }, $filtered_passwords);

    return $result;
  }
}
