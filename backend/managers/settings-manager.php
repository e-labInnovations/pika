<?php

/**
 * Settings manager for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Settings_Manager extends Pika_Base_Manager {

  /**
   * Get table suffix
   */
  protected function get_table_suffix() {
    return 'settings';
  }

  /**
   * Get user settings
   */
  public function get_user_settings($user_id) {
    $db = $this->get_db();

    $sql = $db->prepare(
      "SELECT * FROM {$this->table_name} WHERE user_id = %d",
      $user_id
    );

    $settings = $db->get_results($sql);

    // Convert to key-value pairs
    $result = [];
    foreach ($settings as $setting) {
      $result[$setting->setting_key] = $setting->setting_value;
    }

    return $result;
  }

  /**
   * Get specific setting
   */
  public function get_setting($user_id, $key, $default = null) {
    $db = $this->get_db();

    $sql = $db->prepare(
      "SELECT setting_value FROM {$this->table_name} WHERE user_id = %d AND setting_key = %s",
      $user_id,
      $key
    );

    $result = $db->get_var($sql);

    return $result !== null ? $result : $default;
  }

  /**
   * Update or create setting
   */
  public function update_setting($user_id, $key, $value) {
    $db = $this->get_db();

    // Check if setting exists
    $existing = $db->get_var($db->prepare(
      "SELECT id FROM {$this->table_name} WHERE user_id = %d AND setting_key = %s",
      $user_id,
      $key
    ));

    if ($existing) {
      // Update existing
      return $db->update(
        $this->table_name,
        [
          'setting_value' => $value,
          'updated_at' => current_time('mysql')
        ],
        [
          'user_id' => $user_id,
          'setting_key' => $key
        ],
        ['%s', '%s'],
        ['%d', '%s']
      );
    } else {
      // Create new
      return $db->insert(
        $this->table_name,
        [
          'user_id' => $user_id,
          'setting_key' => $key,
          'setting_value' => $value,
          'created_at' => current_time('mysql'),
          'updated_at' => current_time('mysql')
        ],
        ['%d', '%s', '%s', '%s', '%s']
      );
    }
  }
}
