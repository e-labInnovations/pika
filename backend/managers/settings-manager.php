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
   * Allowed settings keys with their default values and data types
   * Add new settings here for type safety and consistency
   */
  protected $allowed_settings = [
    // Currency Settings
    'currency' => [
      'default' => 'INR',
      'type' => 'string',
      'allowed_values' => [], // Will be populated from currencies.php
      'sanitize' => 'sanitize_currency'
    ]
  ];

  protected $errors = [
    'invalid_key' => ['message' => 'Invalid key.', 'status' => 400],
    'invalid_type' => ['message' => 'Invalid data type.', 'status' => 400],
    'invalid_value' => ['message' => 'Invalid value.', 'status' => 400],
  ];

  /**
   * Constructor
   */
  public function __construct() {
    parent::__construct();
    $this->load_currencies();
  }

  /**
   * Load currencies from currencies.php file
   */
  private function load_currencies() {
    $currencies_file = PIKA_PLUGIN_PATH . 'backend/data/currencies.php';

    if (file_exists($currencies_file)) {
      include $currencies_file;

      if (isset($currencies) && is_array($currencies)) {
        $this->allowed_settings['currency']['allowed_values'] = array_keys($currencies);
      }
    }
  }

  /**
   * Get allowed settings keys
   */
  public function get_allowed_settings() {
    $settings = [];
    foreach ($this->allowed_settings as $key => $config) {
      $settings[$key] = $config['default'];
    }
    return $settings;
  }

  /**
   * Check if a setting key is allowed
   */
  public function is_allowed_setting($key) {
    return array_key_exists($key, $this->allowed_settings);
  }

  /**
   * Get default value for a setting
   */
  public function get_default_value($key) {
    return $this->allowed_settings[$key]['default'] ?? null;
  }

  /**
   * Get data type for a setting
   */
  public function get_setting_type($key) {
    return $this->allowed_settings[$key]['type'] ?? null;
  }

  /**
   * Validate and sanitize a setting value
   */
  public function validate_and_sanitize_setting($key, $value) {
    if (!$this->is_allowed_setting($key)) {
      return $this->get_error('invalid_key');
    }

    $config = $this->allowed_settings[$key];
    $type = $config['type'];
    $allowed_values = $config['allowed_values'] ?? null;
    $sanitize_method = $config['sanitize'] ?? null;

    // Type validation
    $validated_value = $this->validate_type($value, $type);
    if (is_wp_error($validated_value)) {
      return $validated_value;
    }

    // Allowed values validation
    if ($allowed_values && !in_array($validated_value, $allowed_values)) {
      return $this->get_error('invalid_value');
    }

    // Sanitization
    if ($sanitize_method && method_exists($this, $sanitize_method)) {
      $validated_value = $this->$sanitize_method($validated_value);
    }

    return $validated_value;
  }

  /**
   * Validate data type
   */
  private function validate_type($value, $type) {
    switch ($type) {
      case 'string':
        if (!is_string($value) && !is_numeric($value)) {
          return $this->get_error('invalid_type');
        }
        return (string) $value;

      case 'integer':
        if (!is_numeric($value)) {
          return $this->get_error('invalid_type');
        }
        return (int) $value;

      case 'float':
        if (!is_numeric($value)) {
          return $this->get_error('invalid_type');
        }
        return (float) $value;

      case 'boolean':
        if (is_string($value)) {
          $value = strtolower($value);
          if (!in_array($value, ['true', 'false', '1', '0', 'yes', 'no'])) {
            return $this->get_error('invalid_type');
          }
          return in_array($value, ['true', '1', 'yes']) ? 'true' : 'false';
        }
        return $value ? 'true' : 'false';

      case 'array':
        if (!is_array($value)) {
          return $this->get_error('invalid_type');
        }
        return json_encode($value);

      default:
        return $this->get_error('invalid_type');
    }
  }

  /**
   * Sanitize currency value
   */
  private function sanitize_currency($value) {
    return strtoupper(trim($value));
  }

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
        "SELECT setting_value FROM {$this->get_table_name()} WHERE setting_key = %s AND user_id = %d",
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
   * @param int $user_id
   * @param string $key
   * @param mixed $value
   * @return mixed
   */
  public function set_settings_item($user_id, $key, $value) {
    // Validate and sanitize the setting
    $validated_value = $this->validate_and_sanitize_setting($key, $value);
    if (is_wp_error($validated_value)) {
      return $validated_value;
    }

    $db = $this->db();

    // Check if setting already exists
    $existing = $db->get_var(
      $db->prepare(
        "SELECT id FROM {$this->get_table_name()} WHERE setting_key = %s AND user_id = %d",
        $key,
        $user_id
      )
    );

    if ($existing) {
      // Update existing setting
      $updated = $db->update(
        $this->get_table_name(),
        ['setting_value' => $validated_value],
        ['setting_key' => $key, 'user_id' => $user_id],
        ['%s'],
        ['%s', '%d']
      );
    } else {
      // Insert new setting
      $inserted = $db->insert(
        $this->get_table_name(),
        [
          'user_id' => $user_id,
          'setting_key' => $key,
          'setting_value' => $validated_value
        ],
        ['%d', '%s', '%s']
      );
    }

    return $this->get_settings_item($user_id, $key);
  }

  /**
   * Update multiple settings at once
   * 
   * @param int $user_id
   * @param array $settings
   * @return array
   */
  public function update_settings($user_id, $settings) {
    $results = [];

    foreach ($settings as $key => $value) {
      $results[$key] = $this->set_settings_item($user_id, $key, $value);
    }

    return $results;
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

    // Start with all default values
    $settings = array_map(function($setting) {
      return $setting['default'];
    }, $this->allowed_settings);

    // Override with user's saved settings
    foreach ($items as $item) {
      if (isset($this->allowed_settings[$item->setting_key])) {
        $settings[$item->setting_key] = $item->setting_value;
      }
    }

    return $settings;
  }

  /**
   * Get settings
   * 
   * @param int $user_id
   * @param array $keys
   * @return array
   */
  public function get_settings($user_id, $keys = []) {
    // Check if keys are allowed
    foreach ($keys as $key) {
      if (!$this->is_allowed_setting($key)) {
        return $this->get_error('invalid_key');
      }
    }

    $all_settings = $this->get_all_settings($user_id);

    // If no keys provided, return all allowed settings
    if (empty($keys)) {
      return $all_settings;
    }

    $result = [];
    foreach ($keys as $key) {
      $result[$key] = $all_settings[$key] ?? $this->get_default_value($key);
    }

    return $result;
  }
}
