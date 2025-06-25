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

    return [
      'id' => $user->ID,
      'username' => $user->user_login,
      'email' => $user->user_email,
      'display_name' => $user->display_name,
      'avatar_url' => get_avatar_url($user->ID, array('size' => 96)),
      'settings' => $this->settings_manager->get_settings($user->ID, ['default_currency'], ['INR'])
    ];
  }
}
