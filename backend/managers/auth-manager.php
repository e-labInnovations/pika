<?php

/**
 * Authentication manager for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Auth_Manager extends Pika_Base_Manager {

  /**
   * Get table suffix
   */
  protected function get_table_suffix() {
    return 'auth';
  }

  /**
   * Get current user data
   */
  public function get_current_user_data($user_id) {
    $user = get_user_by('id', $user_id);

    if (!$user) {
      return null;
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

  /**
   * Validate user credentials
   */
  public function validate_credentials($username, $password) {
    $user = wp_authenticate($username, $password);

    if (is_wp_error($user)) {
      return false;
    }

    return $user->ID;
  }
}
