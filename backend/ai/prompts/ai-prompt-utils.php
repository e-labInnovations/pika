<?php

/**
 * Main AI Prompt Utils for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

// Include all prompt classes
require_once __DIR__ . '/base-prompt-utils.php';
require_once __DIR__ . '/text-to-transaction.php';
require_once __DIR__ . '/receipt-to-transaction.php';

class Pika_AI_Prompt_Utils {

  protected $text_prompt_utils;
  protected $receipt_prompt_utils;

  public function __construct() {
    $this->text_prompt_utils = new Pika_Text_To_Transaction_Prompt();
    $this->receipt_prompt_utils = new Pika_Receipt_To_Transaction_Prompt();
  }

  /**
   * Get text to transaction data
   * 
   * @param string $text Input text to analyze
   * @param array $categories Available categories
   * @param array $tags Available tags
   * @param array $accounts Available accounts
   * @param array $people Available people
   * @param string $user_timezone User timezone
   * @param string|null $current_user_datetime Current user datetime
   * @return array
   */
  public function get_text_to_transaction_data($text, $categories, $tags, $accounts, $people, $user_timezone = 'UTC', $current_user_datetime = null) {
    return $this->text_prompt_utils->get_text_to_transaction_data(
      $text,
      $categories,
      $tags,
      $accounts,
      $people,
      $user_timezone,
      $current_user_datetime
    );
  }

  /**
   * Get receipt to transaction data
   * 
   * @param string $base64_image Base64 encoded image
   * @param string $mime_type Image MIME type
   * @param array $categories Available categories
   * @param array $tags Available tags
   * @param array $accounts Available accounts
   * @param array $people Available people
   * @param string $user_timezone User timezone
   * @param string|null $current_user_datetime Current user datetime
   * @return array
   */
  public function get_receipt_to_transaction_data($base64_image, $mime_type, $categories, $tags, $accounts, $people, $user_timezone = 'UTC', $current_user_datetime = null) {
    return $this->receipt_prompt_utils->get_receipt_to_transaction_data(
      $base64_image,
      $mime_type,
      $categories,
      $tags,
      $accounts,
      $people,
      $user_timezone,
      $current_user_datetime
    );
  }
}
