<?php

/**
 * AI Prompt Templates for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class pika_ai_prompt_utils {

  /**
   * AI Prompt Templates
   */
  protected $pika_ai_prompts = [
    // Transaction Analysis Prompt
    'transaction_analysis' => [],
  ];

  /**
   * Get prompt template by type
   */
  function get_ai_prompt_template($type, $data = []) {
    global $pika_ai_prompts;

    if (!isset($pika_ai_prompts[$type])) {
      return false;
    }

    $template = $pika_ai_prompts[$type];
    $system_prompt = $template['system'];
    $user_prompt = $template['user_template'];

    // Replace placeholders with actual data
    foreach ($data as $key => $value) {
      $user_prompt = str_replace('{' . $key . '}', $value, $user_prompt);
    }

    return [
      'system' => $system_prompt,
      'user' => $user_prompt
    ];
  }

  /**
   * Get analysis prompt
   */
  function get_analysis_prompt($title, $amount, $description, $categories, $tags) {
    $categories_str = implode(', ', $categories);
    $tags_str = implode(', ', $tags);

    return get_ai_prompt_template('transaction_analysis', [
      'title' => $title,
      'amount' => number_format($amount, 2),
      'description' => $description ?: 'No description provided',
      'categories' => $categories_str,
      'tags' => $tags_str
    ]);
  }
}
