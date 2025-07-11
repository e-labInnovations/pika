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

    register_rest_route($this->namespace, '/ai/text-to-transaction', [
      'methods' => 'POST',
      'callback' => [$this, 'text_to_transaction'],
      'permission_callback' => [$this, 'check_auth']
    ]);

    register_rest_route($this->namespace, '/ai/receipt-to-transaction', [
      'methods' => 'POST',
      'callback' => [$this, 'receipt_to_transaction'],
      'permission_callback' => [$this, 'check_auth']
    ]);
  }

  /**
   * Convert text to transaction
   */
  public function text_to_transaction($request) {
    $text = sanitize_text_field($request->get_param('text'));
    $result = $this->ai_manager->get_text_to_transaction_response($text);

    return $result;
  }

  /**
   * Convert receipt to transaction
   */
  public function receipt_to_transaction($request) {
    $base64_image = $request->get_param('base64_image');

    $image_data = $this->ai_manager->pika_sanitize_base64_image($base64_image);
    if (!$image_data) {
      return $this->get_error('invalid_image');
    }

    $result = $this->ai_manager->get_receipt_to_transaction_response($base64_image, $image_data['mime']);

    return $result;
  }
}
