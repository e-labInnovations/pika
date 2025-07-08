<?php

/**
 * AI controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_AI_Controller extends Pika_Base_Controller {

  public $ai_manager;

  public function __construct() {
    parent::__construct();
    $this->ai_manager = new Pika_AI_Manager();
  }

  /**
   * Register routes
   */
  public function register_routes() {
    // Test gemini response
    register_rest_route($this->namespace, '/ai/test', [
      'methods' => 'GET',
      'callback' => [$this, 'test'],
      'permission_callback' => [$this, 'check_auth']
    ]);

    register_rest_route($this->namespace, '/ai/text-to-transaction', [
      'methods' => 'POST',
      'callback' => [$this, 'text_to_transaction'],
      'permission_callback' => [$this, 'check_auth']
    ]);
  }

  /**
   * Test gemini response
   */
  public function test($request) {
    $result = $this->ai_manager->get_test_gemini_response();

    return $result;
  }

  /**
   * Convert text to transaction
   */
  public function text_to_transaction($request) {
    $text = sanitize_text_field($request->get_param('text'));
    $result = $this->ai_manager->get_text_to_transaction_response($text);

    return $result;
  }
}
