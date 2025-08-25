<?php

/**
 * AI manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_AI_Manager extends Pika_Base_Manager {

  protected $table_name = 'ai_usages';
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
    'invalid_image' => ['message' => 'Invalid image file. Please upload a valid image (PNG, JPEG, GIF, WebP) under 10MB.', 'status' => 400],
    'file_too_large' => ['message' => 'File is too large. Maximum size is 10MB.', 'status' => 400],
    'wrong_file_type' => ['message' => 'Wrong file type. Please upload an image file (PNG, JPEG, GIF, WebP).', 'status' => 400],
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

  /**
   * Validate and process uploaded image file
   * 
   * @param array $file $_FILES array element
   * @return array|WP_Error
   */
  function pika_validate_image_file($file) {
    // Check if file was uploaded successfully
    if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
      return $this->get_error('invalid_image');
    }

    // Check file size (max 10MB)
    if ($file['size'] > 10 * 1024 * 1024) {
      return $this->get_error('file_too_large');
    }

    // Check file type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $allowed_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!in_array($mime_type, $allowed_types, true)) {
      return $this->get_error('wrong_file_type');
    }

    // Convert to base64 for AI processing
    $file_content = file_get_contents($file['tmp_name']);
    if ($file_content === false) {
      return $this->get_error('invalid_image');
    }

    $base64 = base64_encode($file_content);

    return [
      'mime' => $mime_type,
      'data' => $file_content,
      'base64' => $base64,
      'ext' => pathinfo($file['name'], PATHINFO_EXTENSION),
    ];
  }


  private function get_gemini_api_key() {
    $api_key = $this->settings_manager->get_settings_item(get_current_user_id(), 'gemini_api_key');
    return [
      'api_key' => $api_key,
      'is_user_api_key' => 1,
    ];
  }

  private function get_gemini_endpoint() {
    return $this->gemini_endpoint . $this->gemini_model . ':generateContent';
  }

  private function save_ai_usage($provider, $rest_client, $total_time_ms, $prompt_type, $is_user_api_key) {
    $user_id = get_current_user_id();
    $table_name = $this->get_table_name();
    
    if ($provider === 'gemini') {
      if (is_wp_error($rest_client)) {
        $data = [
          'user_id' => $user_id,
          'provider' => $provider,
          'is_user_api_key' => $is_user_api_key,
          'model' => $this->gemini_model,
          'total_tokens' => 0,
          'token_details' => null,
          'cost' => 0.0,
          'created_at' => current_time('mysql'),
          'prompt_type' => $prompt_type,
          'latency_ms' => $total_time_ms,
          'status' => 'error',
          'error_message' => $rest_client->get_error_message()
        ];
      } else {
        $response = json_decode($rest_client['body'], true);
        $total_tokens = $response['usageMetadata']['totalTokenCount'] ?? 0;
        $token_details = [
          'promptTokenCount' => $response['usageMetadata']['promptTokenCount'] ?? 0,
          'candidatesTokenCount' => $response['usageMetadata']['candidatesTokenCount'] ?? 0,
          'totalTokenCount' => $response['usageMetadata']['totalTokenCount'] ?? 0,
          'promptTokensDetails' => $response['usageMetadata']['promptTokensDetails'] ?? [],
          'thoughtsTokenCount' => $response['usageMetadata']['thoughtsTokenCount'] ?? 0,
        ];
        $cost = 0;
        $model = $response['modelVersion'] ?? $this->gemini_model;

        $data = [
          'user_id' => $user_id,
          'provider' => $provider,
          'is_user_api_key' => $is_user_api_key,
          'model' => $model,
          'total_tokens' => $total_tokens,
          'token_details' => json_encode($token_details),
          'cost' => $cost,
          'created_at' => current_time('mysql'),
          'prompt_type' => $prompt_type,
          'latency_ms' => $total_time_ms,
          'status' => 'success',
          'error_message' => null
        ];
      }

      $result = $this->db()->insert($table_name, $data);
      if ($result === false || is_wp_error($result)) {
        $this->utils->log('Failed to save AI usage', $result);
      }
    }
  }

  private function gemini_client($data, $prompt_type) {
    $api_key_data = $this->get_gemini_api_key();

    if (empty($api_key_data['api_key']) || is_null($api_key_data['api_key'])) {
      return $this->get_error('ai_service_unavailable');
    }

    $start = microtime(true);
    $response = wp_remote_post($this->get_gemini_endpoint(), [
      'headers' => [
        'x-goog-api-key' => $api_key_data['api_key'],
        'Content-Type' => 'application/json'
      ],
      'timeout' => 120, // 2 minutes
      'body' => json_encode($data)
    ]);
    $latency_ms = (microtime(true) - $start) * 1000;

    $this->save_ai_usage('gemini', $response, $latency_ms, $prompt_type, $api_key_data['is_user_api_key']);

    return $response;
  }

  /**
   * Get Pika data for AI analysis
   * 
   * @return array
   */
  private function get_pika_data() {
    $user_id = get_current_user_id();

    // Get data from managers with error checking
    $categories = $this->categories_manager->get_all_child_categories();
    if (is_wp_error($categories)) {
      $this->utils->log('AI Manager Error: Categories failed', $categories->get_error_message(), 'error');
      $categories = [];
    }

    $tags = $this->tags_manager->get_all_tags();
    if (is_wp_error($tags)) {
      $this->utils->log('AI Manager Error: Tags failed', $tags->get_error_message(), 'error');
      $tags = [];
    }

    $accounts = $this->accounts_manager->get_all_accounts();
    if (is_wp_error($accounts)) {
      $this->utils->log('AI Manager Error: Accounts failed', $accounts->get_error_message(), 'error');
      $accounts = [];
    }

    $people = $this->people_manager->get_all_people();
    if (is_wp_error($people)) {
      $this->utils->log('AI Manager Error: People failed', $people->get_error_message(), 'error');
      $people = [];
    }

    // Ensure we have arrays to work with
    if (!is_array($categories)) {
      $categories = [];
    }
    if (!is_array($tags)) {
      $tags = [];
    }
    if (!is_array($accounts)) {
      $accounts = [];
    }
    if (!is_array($people)) {
      $people = [];
    }

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

    // Get user timezone for date formatting
    $user_timezone = $this->settings_manager->get_settings_item($user_id, 'timezone') ?: 'UTC';
    $current_user_datetime = new DateTime('now', new DateTimeZone($user_timezone));

    return [
      'categories' => $categories,
      'tags' => $tags,
      'accounts' => $accounts,
      'people' => $people,
      'user_timezone' => $user_timezone,
      'current_user_datetime' => $current_user_datetime->format('Y-m-d H:i:s'),
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
      // Use user timezone for default date
      $user_timezone = $this->settings_manager->get_settings_item(get_current_user_id(), 'timezone') ?: 'UTC';
      $current_user_datetime = new DateTime('now', new DateTimeZone($user_timezone));
      $transaction_data['date'] = $current_user_datetime->format('Y-m-d H:i:s');
    }

    if (!isset($transaction_data['amount']) || is_null($transaction_data['amount'])) {
      $transaction_data['amount'] = 0;
    }

    if (is_wp_error($transaction_data['person'])) {
      $transaction_data['person'] = null;
    }

    if (is_wp_error($transaction_data['toAccount'])) {
      $transaction_data['toAccount'] = null;
    }

    if (is_wp_error($transaction_data['account'])) {
      $transaction_data['account'] = null;
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

    $prompt_data = $this->ai_prompt_utils->get_text_to_transaction_data(
      $text,
      $pika_data['categories'],
      $pika_data['tags'],
      $pika_data['accounts'],
      $pika_data['people'],
      $pika_data['user_timezone'],
      $pika_data['current_user_datetime']
    );

    $client = $this->gemini_client($prompt_data, "TEXT");
    if (is_wp_error($client)) {
      $this->utils->log('AI Manager Error: gemini_client failed', $client->get_error_message(), 'error');
      return $client;
    }

    $response = json_decode($client['body'], true);
    if (isset($response['candidates']) && isset($response['candidates'][0]['content']['parts'][0]['text'])) {
      $transaction_data = json_decode($response['candidates'][0]['content']['parts'][0]['text'], true);
      $transaction_data = $this->format_transaction_data($transaction_data);
      return $transaction_data;
    } else {
      return $this->get_error('ai_invalid_response');
    }
  }

  /**
   * Get receipt to transaction response
   * 
   * @param string $base64_image
   * @param string $mime_type
   * @return array|WP_Error
   */
  public function get_receipt_to_transaction_response($base64_image, $mime_type) {
    $pika_data = $this->get_pika_data();

    $prompt_data = $this->ai_prompt_utils->get_receipt_to_transaction_data(
      $base64_image,
      $mime_type,
      $pika_data['categories'],
      $pika_data['tags'],
      $pika_data['accounts'],
      $pika_data['people'],
      $pika_data['user_timezone'],
      $pika_data['current_user_datetime']
    );

    $client = $this->gemini_client($prompt_data, "IMAGE");
    if (is_wp_error($client)) {
      $this->utils->log('AI Manager Error: gemini_client failed', $client->get_error_message(), 'error');
      return $this->get_error('ai_invalid_response');
    }

    $response = json_decode($client['body'], true);
    if (isset($response['candidates']) && isset($response['candidates'][0]['content']['parts'][0]['text'])) {
      $transaction_data = json_decode($response['candidates'][0]['content']['parts'][0]['text'], true);
      $transaction_data = $this->format_transaction_data($transaction_data);
      return $transaction_data;
    } else {
      return $this->get_error('ai_invalid_response');
    }
  }
}
