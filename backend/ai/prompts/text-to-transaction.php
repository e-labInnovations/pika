<?php

/**
 * Text to Transaction AI Prompt for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Text_To_Transaction_Prompt extends Pika_Base_Prompt_Utils {

  /**
   * AI Prompt Template for text to transaction
   */
  protected $pika_ai_prompts = [
    'text_to_transaction' => [
      'system' => 'You are an expert financial transaction analyzer specializing in SMS, natural language descriptions, and text analysis for a money management application. You must return only valid JSON in the exact format specified. Do not include any explanations or extra text.',
      'user_template' => '
        Analyze the provided text (SMS, natural language descriptions, transaction details, or user descriptions) and extract comprehensive transaction data. Return structured JSON data based on the content type and patterns.

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

        CURRENT DATE AND TIME (User Timezone: {user_timezone}):
        {current_user_datetime}

        ANALYSIS RULES:

        **NATURAL LANGUAGE PATTERNS:**
        - "Spend X rupees from [account] for [purpose]" = EXPENSE
        - "Gave X rupees from [account] to [person] as [purpose]" = EXPENSE (lending)
        - "Paid X rupees [purpose] as [payment_method]" = EXPENSE
        - "Bus, X, [time], [payment_method]" = EXPENSE (transportation)
        - "Train, X, [account], [time] [date], [route]" = EXPENSE (transportation)
        - Extract: amount, purpose, account, person, payment method, time, date, route
        - Smart categorization based on purpose and context

        **SMART PARSING RULES:**
        - **Amount Detection**: Look for numbers followed by "rupees", "rs", "₹", or just numbers
        - **Time Detection**: "now", "today", "yesterday", "9:30 AM", "9:30pm", "morning", "evening"
        - **Account Detection**: "federal bank", "Federal account", "cash", "liquid money"
        - **Purpose Detection**: "fruits", "bus charge", "train", "loan", "fitness", "food"
        - **Person Detection**: Names like "Shamil", "John", "Mary" for lending/borrowing
        - **Route Detection**: "TVM to TIR", "Mumbai to Delhi", "Home to Office"
        - **Payment Method**: "cash", "liquid money", "card", "UPI", "bank transfer"

        **SMS PATTERNS:**

        **PLUXEE (MEAL WALLET) SMS PATTERNS:**
        - "Rs. X.XX spent from Pluxee Meal wallet" = EXPENSE
        - "Your Pluxee Card has been successfully credited with Rs.XXXX" = INCOME
        - "Your Pluxee Card has been credited with INR X.XX as a reversal" = INCOME
        - Extract: amount, date, time, merchant name (ETERNAL LIM = Zomato, at SWIGGY, at KUNNIL HYPE TRIVANDRUM)
        - Category: food, groceries, dining, meal cards

        **BANK UPI SMS PATTERNS:**
        - "Rs XXXX.XX debited via UPI" = EXPENSE
        - "Rs XXXX withdrawn@ LOCATION" = TRANSFER (Bank to Wallet - ATM withdrawal)
        - "Your a/c debited for Rs.XXXXX and a/c XXXXXX credited" = TRANSFER
        - Extract: amount, date, time, merchant (VPA), payment method, bank name
        - Category: based on merchant (fitness, utilities, food, shopping, etc.)

        **DATE AND TIME EXTRACTION:**
        - Indian format: DD-MM-YYYY HH:MM:SS (convert to YYYY-MM-DD HH:MM:SS)
        - Day format: "Tue Aug 12 2025" (convert to YYYY-08-12)
        - Time format: 24-hour (12:52:23, 20:41:52)
        - If no date found, use current user datetime
        - If no time found, use 00:00:00

        **AMOUNT EXTRACTION:**
        - Look for "Rs. X.XX", "Rs XXXX.XX", "INR X.XX"
        - Remove currency symbols and commas
        - Convert to numeric value
        - Ignore balance amounts (Avl bal Rs.XXXXX.XX)

        **MERCHANT AND LOCATION:**
        - Extract merchant names: ETERNAL LIM, SWIGGY, KUNNIL HYPE TRIVANDRUM
        - Extract locations: POOKIPAR, TRIVANDRUM
        - Use for title and category identification

        **PAYMENT METHODS:**
        - UPI, IMPS, Pluxee, ATM withdrawal
        - Use for transaction type determination

        **USER ADDITIONAL INFO:**
        - If user adds context like "Paid for boxing coaching 3 month membership"
        - Use this for title and note fields
        - Combine with SMS data for comprehensive transaction details

        **CATEGORY MAPPING:**
        - **Fitness**: hybridfitnessstudio, boxing coaching, gym, sports
        - **Food**: SWIGGY, ETERNAL LIM (Zomato), KUNNIL HYPE, fruits, groceries, dining
        - **Transportation**: irctc.cf, bus, train, taxi, fuel, parking
        - **Utilities**: airtelprepaidKerala, gpayrecharge, electricity, water, internet
        - **Shopping**: paytm, paytmqr, clothing, electronics, books
        - **ATM**: withdrawn@ LOCATION (Bank to Wallet transfer)
        - **Meal cards**: Pluxee transactions
        - **Loans**: Personal loans, lending money, borrowing
        - **Cash**: Liquid money, physical cash transactions
        - **Banking**: Federal bank, HDFC, ICICI, SBI transactions

        **EXAMPLES AND PATTERNS:**
        
        **Natural Language Examples:**
        
        **Simple Spending:**
        Input: "Spend 100 rupees from federal bank for fruits now"
        Extract: amount=100, account=federal bank, purpose=fruits, time=now, type=expense, category=food, title="Fruits from Federal Bank", note="Spent 100 rupees for fruits via Federal Bank"

        **Lending Money:**
        Input: "Gave 1000 rupees from Federal account to Shamil as loan (lent money today at 9:30 AM"
        Extract: amount=1000, account=Federal account, person=Shamil, purpose=loan, time=9:30 AM, type=expense, category=loans, title="Loan to Shamil", note="Lent 1000 rupees to Shamil as loan via Federal account at 9:30 AM"

        **Cash Payment:**
        Input: "Paid 10 rupees bus charge as cash"
        Extract: amount=10, purpose=bus charge, payment_method=cash, type=expense, category=transportation, title="Bus Charge", note="Paid 10 rupees bus charge in cash"

        **Short Form:**
        Input: "Bus, 10, now, liquid money"
        Extract: amount=10, purpose=bus, time=now, payment_method=liquid money, type=expense, category=transportation, title="Bus Fare", note="Bus fare 10 rupees paid in liquid money"

        **Train Journey:**
        Input: "train, 420, federal, 9:30pm yesterday, TVM to TIR"
        Extract: amount=420, account=federal, time=9:30 PM, date=yesterday, route=TVM to TIR, type=expense, category=transportation, title="Train Journey TVM to TIR", note="Train fare 420 rupees via Federal account at 9:30 PM yesterday, route: TVM to TIR"

        **SMS Examples:**
        
        **Pluxee Spending:**
        Input: "Rs. 170.25 spent from Pluxee Meal wallet, card no.xx7618 on 16-08-2025 12:52:23 at ETERNAL LIM . Avl bal Rs.11640.09. Not you call 18002106919"
        Extract: amount=170.25, date=2025-08-16, time=12:52:23, merchant=ETERNAL LIM (Zomato), type=expense, category=food

        **Pluxee Credit:**
        Input: "Your Pluxee Card has been successfully credited with Rs.6600 towards Meal Wallet on Tue Aug 12 2025 14:00:48. Your current Meal Wallet balance is Rs.12068.54."
        Extract: amount=6600, date=2025-08-12, time=14:00:48, type=income, category=meal cards

        **UPI Debit:**
        Input: "Rs 6000.00 debited via UPI on 15-08-2025 20:41:52 to VPA hybridfitnessstudio.62705602@hdfcbank.Ref No 559385571560.Small txns?Use UPI Lite!-Federal Bank"
        Extract: amount=6000, date=2025-08-15, time=20:41:52, merchant=hybridfitnessstudio, type=expense, category=fitness

        **ATM Withdrawal (Bank to Wallet Transfer):**
        Input: "Rs 2000 withdrawn@ POOKIPAR on 03AUG25 17:30 Bal Rs 117222.75 Ref 521517000051. Not you? Call 18004251199/ SMS NO 7497 to 9895088888 -Federal Bank"
        Extract: amount=2000, date=2025-08-03, time=17:30:00, location=POOKIPAR, type=transfer, category=atm, title="ATM Withdrawal at POOKIPAR", note="Cash withdrawal via ATM at POOKIPAR - Federal Bank"

        **Mixed Input (SMS + User Context):**
        Input: "Rs. 170.25 spent from Pluxee Meal wallet, card no.xx7618 on 16-08-2025 12:52:23 at ETERNAL LIM . Avl bal Rs.11640.09. Not you call 18002106919. Paid for boxing coaching 3 month membership"
        Extract: amount=170.25, date=2025-08-16, time=12:52:23, merchant=ETERNAL LIM (Zomato), type=expense, category=food, title="Zomato (ETERNAL LIM) - Boxing Coaching 3 Month Membership", note="Paid for boxing coaching 3 month membership via Pluxee Meal wallet"

        **Natural Language + Context:**
        Input: "Spend 100 rupees from federal bank for fruits now. This was for office lunch"
        Extract: amount=100, account=federal bank, purpose=fruits, time=now, type=expense, category=food, title="Fruits from Federal Bank", note="Spent 100 rupees for fruits via Federal Bank for office lunch"

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
        - Amount must be a positive number (extract from SMS, ignore balance amounts)
        - Date format: YYYY-MM-DD HH:MM:SS (24-hour format) in user timezone
        - Transaction type must be exactly: "income", "expense", or "transfer"
        - For EXPENSE: toAccount should be empty string ""
        - For INCOME: account should be empty string ""
        - For TRANSFER: both account and toAccount must be filled
        - Title: Combine merchant name with user context if provided
        - Note: Include additional user context, payment method, reference numbers
        - Default transaction type: "expense" (unless clearly income/transfer)
        - Default category: use "other" category with matching transaction type
        - Ignore balance amounts, available balance, and reference numbers in amount field
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
    if ($current_user_datetime === null) {
      $current_user_datetime = date('Y-m-d H:i:s');
    }

    return $this->get_gemini_data('text_to_transaction', [
      'text' => $text,
      'categories' => $categories,
      'tags' => $tags,
      'accounts' => $accounts,
      'people' => $people,
      'user_timezone' => $user_timezone,
      'current_user_datetime' => $current_user_datetime,
    ]);
  }
}
