<?php

/**
 * Base manager class for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

use WP_Error;

abstract class Pika_Base_Manager {
  /**
   * Database table name
   */
  protected $table_name;

  /**
   * Primary key field
   */
  protected $primary_key = 'id';

  /**
   * Constructor
   */
  public function __construct() {
    global $wpdb;
    $this->table_name = $wpdb->prefix . 'pika_' . $this->get_table_suffix();
  }

  /**
   * Get table suffix - should be overridden in child classes
   */
  abstract protected function get_table_suffix();

  /**
   * Get all records
   */
  public function get_all($args = []) {
    // Template method - override in child classes
    return [];
  }

  /**
   * Get single record by ID
   */
  public function get_by_id($id) {
    // Template method - override in child classes
    return null;
  }

  /**
   * Create new record
   */
  public function create($data) {
    // Template method - override in child classes
    return false;
  }

  /**
   * Update existing record
   */
  public function update($id, $data) {
    // Template method - override in child classes
    return false;
  }

  /**
   * Delete record
   */
  public function delete($id) {
    // Template method - override in child classes
    return false;
  }

  /**
   * Get database instance
   */
  protected function get_db() {
    global $wpdb;
    return $wpdb;
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
