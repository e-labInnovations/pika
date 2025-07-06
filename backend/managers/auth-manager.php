<?php

/**
 * Authentication manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Auth_Manager extends Pika_Base_Manager {

  protected $settings_manager;

  public function __construct() {
    parent::__construct();
    $this->settings_manager = new Pika_Settings_Manager();
  }

  /**
   * Get current user data
   */
  public function get_current_user_data() {
    $user_id = $this->utils->get_current_user_id();
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
}
