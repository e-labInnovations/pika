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
      'system' => 'You are a financial transaction analyzer that converts natural language text into structured transaction data for a money management application. You must return only valid JSON in the exact format specified. Do not include any explanations or extra text.',
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
        - Extract amount, date, title/description, and transaction type
        - Use exact IDs from provided lists (not names)
        - Format date as YYYY-MM-DD HH:MM:SS (24-hour format)
        - Amount must be numeric (no currency symbols or commas)
        - Transaction type: "income", "expense", or "transfer"
        - For "transfer" type: This is a transaction where money is moved from one account to another, such as transferring between banks, using an ATM (bank to wallet), using a CDM (wallet to bank), or any transfer between accounts. For transfer, both "account" (source) and "toAccount" (destination) must be filled with valid account IDs.
        - Must select a category from the available categories; if nothing matches, use the category with name "other" and the type matching the transaction type
        - If a field is not present in the input, use "" (empty string) or [] (empty array) as appropriate

        RESPONSE FORMAT (return only this JSON object, no extra text):
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
        - Return valid JSON only, no explanations or extra text
        - Use empty string "" for unknown/not applicable fields (except tags)
        - Use empty array [] for no tags
        - Use numeric IDs from provided lists for category, tags, account, toAccount, and person
        - Amount must be a positive number
        - Date format: YYYY-MM-DD HH:MM:SS (24-hour format)
        - Type must be exactly: income, expense, or transfer
        - If transaction type is "transfer", both "account" and "toAccount" must be filled with valid account IDs
        - If transaction type is not "transfer", "toAccount" should be ""
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
