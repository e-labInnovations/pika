<?php

/**
 * Receipt to Transaction AI Prompt for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Receipt_To_Transaction_Prompt extends Pika_Base_Prompt_Utils {

  /**
   * AI Prompt Template for receipt to transaction
   */
  protected $pika_ai_prompts = [
    'receipt_to_transaction' => [
      'system' => 'You are an expert financial transaction analyzer specializing in receipt analysis for a money management application. You must return only valid JSON in the exact format specified. Do not include any explanations or extra text.',
      'user_template' => '
        Analyze the provided receipt image and extract comprehensive transaction details. Return structured JSON data based on the receipt type and content.

        AVAILABLE CATEGORIES (use ID only):
        {categories}

        AVAILABLE TAGS (use ID only):
        {tags}

        AVAILABLE ACCOUNTS (use ID only):
        {accounts}

        AVAILABLE PEOPLE (use ID only):
        {people}

        CURRENT DATE AND TIME (User Timezone: {user_timezone}):
        {current_user_datetime}

        RECEIPT ANALYSIS RULES:

        **GENERAL PRINCIPLES:**
        - 95% of receipts are EXPENSE transactions
        - For EXPENSE transactions: toAccount must be null/empty
        - For INCOME transactions: account must be null/empty
        - Use exact IDs from provided lists (not names)
        - Format date as YYYY-MM-DD HH:MM:SS (24-hour format) in user timezone
        - Amount must be numeric (no currency symbols or commas)

        **GOOGLE PAY RECEIPTS:**
        - Look for Google Pay logo at bottom
        - "Pay again" = EXPENSE (personal payment only)
        - "Payment Started" → "Pay intermediary" → "Bill payment proceed" = EXPENSE (utility bills like KSEB electricity)
        - "Payments may take up to 3 working days" = INCOME (someone paid you)
        - Extract: payment account, receiver name, amount, date, comment, time
        - For bill payments: identify service provider (electricity, water, gas, etc.)

        **PHONEPE RECEIPTS:**
        - Look for PhonePe logo
        - "Debited from" account = EXPENSE
        - "Credited to" account = INCOME
        - If debited account not found, guess using bank logo
        - For credits: use credit account logo for account identification

        **RESTAURANT/SHOP RECEIPTS:**
        - Extract: date, time, shop name, food items, total amount
        - Payment method: cash, card, bank transfer, meal card
        - SODOXO/Pluxee = meal card payment
        - Category: food, groceries, shopping based on items

        **BILL PAYMENT RECEIPTS:**
        - Utility bills (electricity, water, gas, internet, phone)
        - Insurance premiums
        - Credit card payments
        - Loan EMIs
        - All are EXPENSE transactions

        **BANK TRANSFER RECEIPTS:**
        - Look for "TRANSFER" keyword
        - Source account → Destination account
        - Transaction type: "transfer"
        - Both account and toAccount must be filled

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

        CRITICAL RULES:
        - Return valid JSON only, no explanations or extra text
        - Use empty string "" for unknown/not applicable fields (except tags)
        - Use empty array [] for no tags
        - Use numeric IDs from provided lists for category, tags, account, toAccount, and person
        - Amount must be a positive number
        - Date format: YYYY-MM-DD HH:MM:SS (24-hour format) in user timezone
        - Transaction type must be exactly: "income", "expense", or "transfer"
        - For EXPENSE or INCOME: toAccount should be empty string "" and the account should be filled
        - For TRANSFER: both account and toAccount must be filled
        - If receipt is unclear or unreadable, return an empty JSON object {{}}
        - Default transaction type: "expense" (unless clearly income/transfer)
        - Default category: use "other" category with matching transaction type
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
    ]
  ];

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
    if ($current_user_datetime === null) {
      $current_user_datetime = date('Y-m-d H:i:s');
    }

    return $this->get_gemini_data('receipt_to_transaction', [
      'categories' => $categories,
      'tags' => $tags,
      'accounts' => $accounts,
      'people' => $people,
      'user_timezone' => $user_timezone,
      'current_user_datetime' => $current_user_datetime,
    ], $base64_image, $mime_type);
  }
}
