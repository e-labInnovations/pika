<?php

/**
 * Base manager class for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

abstract class Pika_Base_Manager {
  /**
   * Database table name
   */
  protected $table_name = '';
  public $utils;
  protected $icons = [];

  /**
   * Constructor
   */
  public function __construct() {
    $this->utils = new Pika_Utils();
    $this->load_icons();
  }

  /**
   * Get database instance
   */
  protected function db() {
    global $wpdb;
    return $wpdb;
  }

  public function get_table_name($name = null) {
    global $wpdb;
    return $wpdb->prefix . 'pika_' . ($name ? $name : $this->table_name);
  }

  /**
   * Default Errors
   */
  protected $_errors = [
    'unauthorized' => ['message' => 'Unauthorized access.', 'status' => 401],
    'invalid_request' => ['message' => 'Invalid request.', 'status' => 400],
    'not_found' => ['message' => 'Resource not found.', 'status' => 404],
    'db_error' => ['message' => 'Database error.', 'status' => 500],
    'db_update_error' => ['message' => 'Database update error.', 'status' => 500],
    'db_delete_error' => ['message' => 'Database delete error.', 'status' => 500],
    'db_insert_error' => ['message' => 'Database insert error.', 'status' => 500],
    'invalid_icon' => ['message' => 'Invalid icon.', 'status' => 400],
    'invalid_color' => ['message' => 'Invalid color. Use hex format like #000000.', 'status' => 400],
    'invalid_bg_color' => ['message' => 'Invalid background color. Use hex format like #000000.', 'status' => 400],
    'no_update' => ['message' => 'Nothing to update.', 'status' => 400],
    'invalid_name' => ['message' => 'Invalid name.', 'status' => 400],
    'unknown' => ['message' => 'An unknown error occurred.', 'status' => 500],
  ];

  /**
   * Custom Errors (can be overridden in child classes)
   */
  protected $errors = [];

  /**
   * Get error
   */
  public function get_error($code) {
    $all_errors = array_merge($this->_errors, $this->errors);

    if (isset($all_errors[$code])) {
      $error = $all_errors[$code];
      return new WP_Error($code, $error['message'], ['status' => $error['status']]);
    }

    // Fallback generic error
    return new WP_Error('unknown_error', 'An unknown error occurred.', ['status' => 500]);
  }

  /**
   * Sanitize color
   */
  public function sanitize_color($color) {
    if (preg_match('/^#([0-9a-fA-F]{6})$/', $color, $matches)) {
      return '#' . $matches[1];
    }
    return null;
  }

  /**
   * Sanitize icon
   */
  public function sanitize_icon($icon) {
    if (is_null($icon) || empty($icon)) {
      return null;
    }

    if (in_array($icon, $this->icons)) {
      return $icon;
    }
    return null;
  }

  /**
 * Sanitize ISO 8601 datetime (supports both Z and +00:00 UTC variants)
 *
 * @param string $datetime_string
 * @return string|null Sanitized ISO 8601 string with Z, or null if invalid
 */
  public function sanitize_datetime($datetime_string) {
    $datetime_string = trim($datetime_string);

    // Match ISO 8601 with optional milliseconds and either Z or +00:00
    if (!preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|\+00:00)$/', $datetime_string)) {
        return null;
    }

    try {
        $dt = new DateTimeImmutable($datetime_string);
        // Normalize to ISO 8601 format with literal Z
        return $dt->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d\TH:i:s\Z');
    } catch (Exception $e) {
        return null;
    }
  }

  /**
   * Load icons
   */
  private function load_icons() {
    $icons_file = PIKA_PLUGIN_PATH . 'backend/data/icons.php';
    if (file_exists($icons_file)) {
      include $icons_file;
      $this->icons = $pika_icons;
    }
  }
}
