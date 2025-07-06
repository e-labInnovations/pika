<?php

/**
 * AI manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_AI_Manager extends Pika_Base_Manager {

  protected $table_name = '';
  protected $analytics_manager;
  protected $categories_manager;
  protected $tags_manager;
  protected $transactions_manager;
  protected $settings_manager;
  protected $ai_prompt_utils;
  protected $gemini_endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/';
  protected $gemini_model = 'gemini-2.5-flash';

  protected $errors = [
    'ai_service_unavailable' => ['message' => 'AI service is currently unavailable.', 'status' => 503],
    'ai_rate_limit' => ['message' => 'AI service rate limit exceeded. Please try again later.', 'status' => 429],
    'ai_invalid_response' => ['message' => 'Invalid response from AI service.', 'status' => 500],
    'insufficient_data' => ['message' => 'Insufficient data for AI analysis.', 'status' => 400],
    'ai_disabled' => ['message' => 'AI features are currently disabled.', 'status' => 403],
  ];

  /**
   * Constructor
   */
  public function __construct() {
    parent::__construct();
    $this->analytics_manager = new Pika_Analytics_Manager();
    $this->categories_manager = new Pika_Categories_Manager();
    $this->tags_manager = new Pika_Tags_Manager();
    $this->transactions_manager = new Pika_Transactions_Manager();
    $this->ai_prompt_utils = new Pika_AI_Prompt_Utils();
    $this->settings_manager = new Pika_Settings_Manager();
  }

  private function get_gemini_api_key() {
    return $this->settings_manager->get_settings_item(get_current_user_id(), 'gemini_api_key', null);
  }

  private function get_gemini_endpoint() {

    return $this->gemini_endpoint . $this->gemini_model . ':generateContent';
  }

  private function gemini_client($data) {
    $api_key = $this->get_gemini_api_key();

    if (empty($api_key) || is_null($api_key)) {
      return $this->get_error('ai_service_unavailable');
    }

    return wp_remote_post($this->get_gemini_endpoint(), [
      'headers' => [
        'x-goog-api-key' => $api_key,
        'Content-Type' => 'application/json'
      ],
      'body' => json_encode($data)
    ]);
  }

  public function get_test_gemini_response() {
    $endpoint = $this->get_gemini_endpoint();

    if (is_wp_error($endpoint)) {
      return $endpoint;
    }

    $prompt = "What is the capital of France?";

    $client = $this->gemini_client([
      'contents' => [
        [
          'parts' => [
            [
              'text' => $prompt
            ]
          ]
        ]
      ]
    ]);

    $response = json_decode($client['body'], true);

    return $response;
  }
}
