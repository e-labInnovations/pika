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
    'text_to_transaction' => [
      'system' => 'You are a financial transaction analyzer that converts natural language text into structured transaction data for a money management application. You must return only valid JSON in the exact format specified.',
      'user_template' => '
        Extract transaction details from the provided text and return structured JSON data.

        INPUT TEXT:
        {text}

        AVAILABLE CATEGORIES (use ID only):
        {categories}

        AVAILABLE TAGS (use ID only):
        {tags}

        AVAILABLE ACCOUNTS (use ID only):
        {accounts}

        AVAILABLE PEOPLE (use ID only):
        {people}

        CURRENT DATE AND TIME:
        {current_date_time}

        REQUIREMENTS:
        - Extract amount, date, description, and transaction type
        - Use exact IDs from provided lists (not names)
        - Format date as YYYY-MM-DD HH:MM:SS
        - Amount must be numeric (no currency symbols)
        - Transaction type: "income", "expense", or "transfer"
        - Must select a category from the available categories and if nothing matches, use other category with the type of same as the transaction type

        RESPONSE FORMAT:
        {
          "title": "string",
          "amount": number,
          "category": "string",
          "tags": ["string"],
          "date": "string",
          "type": "string",
          "person": "string",
          "account": "string",
          "toAccount": "string",
          "note": "string"
        }

        RULES:
        - Return valid JSON only
        - Use empty string "" for unknown/not applicable fields
        - Use empty array [] for no tags
        - Use numeric IDs from provided lists
        - Amount must be positive number
        - Date format: YYYY-MM-DD HH:MM:SS
        - Type must be exactly: income, expense, or transfer
      ',
      'output_structure' => [
        'type' => 'OBJECT',
        'properties' => [
          'title' => ['type' => 'STRING'],
          'amount' => ['type' => 'NUMBER'],
          'category' => ['type' => 'STRING'],
          'tags' => ['type' => 'ARRAY', 'items' => ['type' => 'STRING']],
          'date' => ['type' => 'STRING', 'format' => 'date-time'],
          'type' => ['type' => 'STRING', "enum" => ["income", "expense", "transfer"]],
          'person' => ['type' => 'STRING', 'nullable' => true],
          'account' => ['type' => 'STRING'],
          'toAccount' => ['type' => 'STRING', 'nullable' => true],
          'note' => ['type' => 'STRING']
        ]
      ]
    ],
  ];

  /**
   * Get prompt template by type
   */
  protected function get_gemini_data($type, $data = []) {
    if (!isset($this->pika_ai_prompts[$type])) {
      return false;
    }

    $template = $this->pika_ai_prompts[$type];
    $system_prompt = $template['system'];
    $user_prompt = $template['user_template'];
    $response_structure = $template['output_structure'];

    // Replace placeholders with actual data
    foreach ($data as $key => $value) {
      $user_prompt = str_replace('{' . $key . '}', json_encode($value), $user_prompt);
    }

    // return [
    //   'system' => $system_prompt,
    //   'user' => $user_prompt
    // ];

    return [
      'system_instruction' => [
          'parts' => [
              [
                  'text' => $system_prompt
              ]
          ]
      ],
      'contents' => [
          [
              'parts' => [
                  ['text' => $user_prompt]
              ]
          ]
      ],
      'generationConfig' => [
          'responseMimeType' => 'application/json',
          'responseSchema' => $response_structure
      ]
    ];
  }

  /**
   * Get analysis prompt
   */
  public function get_text_to_transaction_data($text, $categories, $tags, $accounts, $people) {
    return $this->get_gemini_data('text_to_transaction', [
      'text' => $text,
      'categories' => $categories,
      'tags' => $tags,
      'accounts' => $accounts,
      'people' => $people,
      'current_date_time' => date('Y-m-d H:i:s'),
    ]);
  }
}
