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
  protected $accounts_manager;
  protected $people_manager;
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
    $this->accounts_manager = new Pika_Accounts_Manager();
    $this->people_manager = new Pika_People_Manager();
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
      'timeout' => 120, // 2 minutes
      'body' => json_encode($data)
    ]);
  }

  public function get_test_gemini_response() {
    $endpoint = $this->get_gemini_endpoint();

    $sample_text = 'I spent 1000 on food at the mall from my wallet on 2025-07-07 10:00:00 pm';
    $sample_categories = [
      ['id' => 1, 'name' => 'Food', 'type' => 'expense'],
      ['id' => 2, 'name' => 'Shopping', 'type' => 'expense'],
      ['id' => 3, 'name' => 'Transportation', 'type' => 'expense'],
      ['id' => 4, 'name' => 'Entertainment', 'type' => 'expense'],
      ['id' => 5, 'name' => 'Other', 'type' => 'expense'],
    ];
    $sample_tags = [
      ['id' => 1, 'name' => 'Food'],
      ['id' => 2, 'name' => 'Shopping'],
      ['id' => 3, 'name' => 'Transportation'],
      ['id' => 4, 'name' => 'Entertainment'],
      ['id' => 5, 'name' => 'Other'],
    ];
    $sample_accounts = [
      ['id' => 1, 'name' => 'Bank'],
      ['id' => 2, 'name' => 'Credit Card'],
      ['id' => 3, 'name' => 'Cash'],
      ['id' => 4, 'name' => 'Other'],
    ];
    $sample_people = [
      ['id' => 1, 'name' => 'John', 'description' => 'Classmate'],
      ['id' => 2, 'name' => 'Jane', 'description' => 'Family'],
      ['id' => 3, 'name' => 'Jim', 'description' => 'Business'],
      ['id' => 4, 'name' => 'Jill', 'description' => 'Friend'],
      ['id' => 5, 'name' => 'Jack', 'description' => 'Gymmate'],
    ];

    $prompt_data = $this->ai_prompt_utils->get_text_to_transaction_data($sample_text, $sample_categories, $sample_tags, $sample_accounts, $sample_people);
    // $this->utils->log('prompt_data', $prompt_data, 'debug');
    // $this->utils->log('prompt_data', $prompt_data, 'json');

    if (is_wp_error($endpoint)) {
      return $endpoint;
    }

    $client = $this->gemini_client($prompt_data);
    $this->utils->log('client', $client, 'debug');
    $response = json_decode($client['body'], true);
    if (isset($response['candidates']) && isset($response['candidates'][0]['content']['parts'][0]['text'])) {
      return json_decode($response['candidates'][0]['content']['parts'][0]['text'], true);
    }

    return $this->get_error('ai_invalid_response');
  }

  public function get_text_to_transaction_response($text) {
    $user_id = get_current_user_id();
    $categories = $this->categories_manager->get_all_child_categories();
    $tags = $this->tags_manager->get_all_tags($user_id);
    $accounts = $this->accounts_manager->get_all_accounts();
    $people = $this->people_manager->get_all_people();

    $categories = array_map(function ($category) {
      return [
        'id' => $category['id'],
        'name' => $category['name'],
        'type' => $category['type'],
        'description' => $category['description'],
      ];
    }, $categories);

    $tags = array_map(function ($tag) {
      return [
        'id' => $tag['id'],
        'name' => $tag['name'],
        'description' => $tag['description'],
      ];
    }, $tags);

    $accounts = array_map(function ($account) {
      return [
        'id' => $account['id'],
        'name' => $account['name'],
        'description' => $account['description'],
      ];
    }, $accounts);

    $people = array_map(function ($person) {
      return [
        'id' => $person['id'],
        'name' => $person['name'],
        'description' => $person['description'],
      ];
    }, $people);

    $prompt_data = $this->ai_prompt_utils->get_text_to_transaction_data($text, $categories, $tags, $accounts, $people);
    $this->utils->log('prompt_data', $prompt_data, 'json');
    $client = $this->gemini_client($prompt_data);
    $this->utils->log('client', $client, 'debug');
    $response = json_decode($client['body'], true);
    if (isset($response['candidates']) && isset($response['candidates'][0]['content']['parts'][0]['text'])) {
      $transaction_data = json_decode($response['candidates'][0]['content']['parts'][0]['text'], true);
      $this->utils->log('transaction_data', $transaction_data, 'json');
      $transaction_data['category'] = $this->categories_manager->get_category_by_id($transaction_data['category'], true);
      $transaction_data['account'] = isset($transaction_data['account']) && !empty($transaction_data['account']) && !is_null($transaction_data['account']) ? $this->accounts_manager->get_account_by_id($transaction_data['account'], true) : null;
      $transaction_data['person'] = isset($transaction_data['person']) && !empty($transaction_data['person']) && !is_null($transaction_data['person']) ? $this->people_manager->get_person($transaction_data['person'], true) : null;
      $transaction_data['toAccount'] = isset($transaction_data['toAccount']) && !empty($transaction_data['toAccount']) && !is_null($transaction_data['toAccount']) ? $this->accounts_manager->get_account_by_id($transaction_data['toAccount'], true) : null;
      $transaction_data['tags'] = array_map(function ($tag) {
        return $this->tags_manager->get_tag_by_id($tag, true);
      }, $transaction_data['tags'] ?? []);
      return $transaction_data;
    } else {
      return $this->get_error('ai_invalid_response');
    }
  }
}
