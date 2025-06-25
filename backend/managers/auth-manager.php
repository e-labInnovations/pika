<?php

/**
 * Authentication manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Auth_Manager extends Pika_Base_Manager {

  /**
   * Get current user data
   */
  public function get_current_user_data() {
    $user_id = $this->utils->get_current_user_id();
    $user = get_user_by('id', $user_id);

    if (!$user) {
      return $this->get_error('unauthorized');
    }

    return [
      'id' => $user->ID,
      'username' => $user->user_login,
      'email' => $user->user_email,
      'display_name' => $user->display_name,
      'roles' => $user->roles,
      'capabilities' => $user->allcaps
    ];
  }
}
