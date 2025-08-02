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
    'invalid_image' => ['message' => 'Invalid image.', 'status' => 400],
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

  function pika_sanitize_base64_image($base64) {
    // Check if it matches a base64 image pattern
    if (
      preg_match('/^data:image\/(png|jpeg|jpg|gif|webp);base64,/', $base64, $matches)
    ) {
      $mime_type = $matches[1];

      // Strip out the mime-type header
      $base64_clean = substr($base64, strpos($base64, ',') + 1);

      // Decode and validate
      $decoded = base64_decode($base64_clean, true);
      if ($decoded === false) {
        return false;
      }

      // Optional: check if it's a valid image
      $finfo = finfo_open();
      $detected_type = finfo_buffer($finfo, $decoded, FILEINFO_MIME_TYPE);
      finfo_close($finfo);

      $allowed_types = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
      if (!in_array($detected_type, $allowed_types, true)) {
        return false;
      }

      // Return sanitized base64 (or return decoded if needed)
      return [
        'mime' => $detected_type,
        'data' => $decoded,
        'ext' => $mime_type,
      ];
    }

    return false;
  }


  private function get_gemini_api_key() {
    return $this->settings_manager->get_settings_item(get_current_user_id(), 'gemini_api_key');
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

  /**
   * Get Pika data for AI analysis
   * 
   * @return array
   */
  private function get_pika_data() {
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

    return [
      'categories' => $categories,
      'tags' => $tags,
      'accounts' => $accounts,
      'people' => $people,
    ];
  }

  public function format_transaction_data($transaction_data) {
    $transaction_data['category'] = isset($transaction_data['category']) && !empty($transaction_data['category']) && !is_null($transaction_data['category']) ? $this->categories_manager->get_category_by_id($transaction_data['category'], true) : null;
    $transaction_data['account'] = isset($transaction_data['account']) && !empty($transaction_data['account']) && !is_null($transaction_data['account']) ? $this->accounts_manager->get_account_by_id($transaction_data['account'], true) : null;
    $transaction_data['person'] = isset($transaction_data['person']) && !empty($transaction_data['person']) && !is_null($transaction_data['person']) ? $this->people_manager->get_person($transaction_data['person'], true) : null;
    $transaction_data['toAccount'] = isset($transaction_data['toAccount']) && !empty($transaction_data['toAccount']) && !is_null($transaction_data['toAccount']) ? $this->accounts_manager->get_account_by_id($transaction_data['toAccount'], true) : null;
    $transaction_data['tags'] = array_map(function ($tag) {
      return $this->tags_manager->get_tag_by_id($tag, true);
    }, $transaction_data['tags'] ?? []);

    if (!isset($transaction_data['type']) || is_null($transaction_data['type'])) {
      $transaction_data['type'] = 'expense';
    }

    if (is_wp_error($transaction_data['category']) || is_null($transaction_data['category'])) {
      $transaction_data['category'] = $this->categories_manager->get_default_category($transaction_data['type']);
    }

    if (!isset($transaction_data['date']) || is_null($transaction_data['date'])) {
      $transaction_data['date'] = date('Y-m-d H:i:s');
    }

    if (!isset($transaction_data['amount']) || is_null($transaction_data['amount'])) {
      $transaction_data['amount'] = 0;
    }

    return $transaction_data;
  }

  /**
   * Get text to transaction response
   * 
   * @param string $text
   * @return array|WP_Error
   */
  public function get_text_to_transaction_response($text) {
    $pika_data = $this->get_pika_data();
    $prompt_data = $this->ai_prompt_utils->get_text_to_transaction_data($text, $pika_data['categories'], $pika_data['tags'], $pika_data['accounts'], $pika_data['people']);
    $this->utils->log('prompt_data', $prompt_data, 'json');
    $client = $this->gemini_client($prompt_data);
    $this->utils->log('client', $client, 'debug');
    $response = json_decode($client['body'], true);
    if (isset($response['candidates']) && isset($response['candidates'][0]['content']['parts'][0]['text'])) {
      $transaction_data = json_decode($response['candidates'][0]['content']['parts'][0]['text'], true);
      $transaction_data = $this->format_transaction_data($transaction_data);
      // $this->utils->log('transaction_data', $transaction_data, 'json');
      return $transaction_data;
    } else {
      return $this->get_error('ai_invalid_response');
    }
  }

  /**
   * Get receipt to transaction response
   * 
   * @param string $base64_image
   * @return array|WP_Error
   */
  public function get_receipt_to_transaction_response($base64_image, $mime_type) {
    $pika_data = $this->get_pika_data();
    $prompt_data = $this->ai_prompt_utils->get_receipt_to_transaction_data($base64_image, $mime_type, $pika_data['categories'], $pika_data['tags'], $pika_data['accounts'], $pika_data['people']);
    $this->utils->log('prompt_data', $prompt_data, 'json');
    $client = $this->gemini_client($prompt_data);
    $this->utils->log('client', $client, 'debug');
    $response = json_decode($client['body'], true);
    $this->utils->log('response', $response, 'debug');
    if (isset($response['candidates']) && isset($response['candidates'][0]['content']['parts'][0]['text'])) {
      $transaction_data = json_decode($response['candidates'][0]['content']['parts'][0]['text'], true);
      $transaction_data = $this->format_transaction_data($transaction_data);
      // $this->utils->log('transaction_data', $transaction_data, 'json');
      return $transaction_data;
    } else {
      return $this->get_error('ai_invalid_response');
    }
  }
}
