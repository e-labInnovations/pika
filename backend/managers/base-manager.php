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

  /**
   * Constructor
   */
  public function __construct() {
    $this->utils = new Pika_Utils();
  }

  /**
   * Get database instance
   */
  protected function db() {
    global $wpdb;
    return $wpdb;
  }

  public function get_table_name() {
    global $wpdb;
    return $wpdb->prefix . 'pika_' . $this->table_name;
  }

  /**
   * Default Errors
   */
  protected $_errors = [
    'unauthorized' => ['message' => 'Unauthorized access.', 'status' => 401],
    'invalid_request' => ['message' => 'Invalid request.', 'status' => 400],
    'not_found' => ['message' => 'Resource not found.', 'status' => 404],
  ];

  /**
   * Custom Errors (can be overridden in child classes)
   */
  protected $errors = [];

  /**
   * Get error
   */
  public function get_error($code) {
    $all_errors = $this->get_all_errors();

    if (isset($all_errors[$code])) {
      $error = $all_errors[$code];
      return new WP_Error($code, $error['message'], ['status' => $error['status']]);
    }

    // Fallback generic error
    return new WP_Error('unknown_error', 'An unknown error occurred.', ['status' => 500]);
  }
}
