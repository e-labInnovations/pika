<?php

/**
 * Settings manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Settings_Manager extends Pika_Base_Manager {

  protected $table_name = 'user_settings';

  /**
   * Get a settings item
   * 
   * @param string $key
   * @param int $user_id
   * @param mixed $default
   * @return mixed
   */
  public function get_settings_item($user_id, $key, $default = null) {
    $value = $this->db()->get_var(
      $this->db()->prepare(
        "SELECT value FROM {$this->get_table_name()} WHERE key = %s AND user_id = %d",
        $key,
        $user_id
      )
    );

    if (!$value) {
      return $default;
    }

    return $value;
  }

  /**
   * Set a settings item
   * 
   * @param string $key
   * @param mixed $value
   * @param int $user_id
   */
  public function set_settings_item($user_id, $key, $value) {
    $updated = $this->db()->update(
      $this->get_table_name(),
      ['value' => $value],
      ['key' => $key, 'user_id' => $user_id]
    );

    return $this->get_settings_item($key, $user_id);
  }

  /**
   * Get all settings items
   * 
   * @param int $user_id
   * @return array
   */
  public function get_all_settings($user_id) {
    $db = $this->db();
    $sql = $db->prepare(
      "SELECT * FROM {$this->get_table_name()} WHERE user_id = %d",
      $user_id
    );
    $items = $db->get_results($sql);

    if (is_wp_error($items)) {
      return $this->get_error('db_error');
    }

    $settings = [];
    foreach ($items as $item) {
      $settings[$item->key] = $item->value;
    }

    return $settings;
  }

  /**
   * Get settings
   * 
   * @param int $user_id
   * @param array $keys
   * @param array $default_values
   * @return array
   */
  public function get_settings($user_id, $keys = [], $default_values = []) {
    $settings = $this->get_all_settings($user_id);

    if (is_wp_error($settings)) {
      return $settings;
    }

    $result = [];
    for ($i = 0; $i < count($keys); $i++) {
      $result[$keys[$i]] = $settings[$keys[$i]] ?? $default_values[$i] ?? null;
    }

    return $result;
  }
}
