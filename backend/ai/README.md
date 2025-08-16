# AI Subsystem

This directory contains the AI functionality for the Pika plugin, including prompt management, AI integration, and transaction analysis.

## Structure

```
backend/ai/
├── index.php           # Security file (prevents direct access)
├── README.md          # This documentation
└── prompts/           # AI prompt management
    ├── index.php      # Security file
    ├── base-prompt-utils.php
    ├── text-to-transaction.php
    ├── receipt-to-transaction.php
    ├── ai-prompt-utils.php
    └── README.md
```

## Overview

The AI subsystem provides intelligent transaction analysis capabilities:

- **Text Analysis**: Parse SMS, natural language descriptions, and user context
- **Receipt Analysis**: Extract transaction details from receipt images
- **Smart Categorization**: Automatically categorize transactions based on content
- **Timezone Awareness**: Handle user timezone for accurate date/time processing

## Components

### AI Manager (`../managers/ai-manager.php`)
- Main interface for AI functionality
- Handles file uploads and validation
- Manages Gemini API integration
- Processes AI responses

### AI Prompt Utils (`prompts/ai-prompt-utils.php`)
- Coordinates all prompt classes
- Maintains backward compatibility
- Provides unified interface

### Prompt Classes
- **Base Prompt Utils**: Common methods and utilities
- **Text to Transaction**: SMS and natural language analysis
- **Receipt to Transaction**: Image-based receipt analysis

## Features

### Text Analysis
- **SMS Patterns**: Pluxee, UPI, ATM, IMPS
- **Natural Language**: "Spend 100 rupees from federal bank for fruits"
- **User Context**: Additional information integration
- **Smart Parsing**: Amount, date, time, account detection

### Receipt Analysis
- **Payment Apps**: Google Pay, PhonePe
- **Receipt Types**: Restaurant, shop, utility bills
- **Transaction Types**: Expense, income, transfer
- **Data Extraction**: Amount, date, merchant, category

### AI Integration
- **Gemini API**: Google's advanced AI model
- **Structured Output**: JSON response format
- **Error Handling**: Graceful fallbacks
- **Validation**: Input and output validation

## Usage

```php
// Initialize AI manager
$ai_manager = new Pika_AI_Manager();

// Text analysis
$transaction = $ai_manager->get_text_to_transaction_response($text);

// Receipt analysis
$transaction = $ai_manager->get_receipt_to_transaction_response($base64_image, $mime_type);
```

## Configuration

- **API Key**: Set Gemini API key in user settings
- **File Limits**: Maximum 10MB image uploads
- **Supported Formats**: PNG, JPEG, GIF, WebP
- **Timeout**: 2 minutes for AI processing

## Future Enhancements

- **Budget Analysis**: AI-powered budget insights
- **Investment Advice**: Financial planning recommendations
- **Fraud Detection**: Suspicious transaction identification
- **Multi-language**: International language support
- **Caching**: Performance optimization for repeated queries

## Security

- **File Validation**: MIME type and size checks
- **User Isolation**: Data separated by user ID
- **Input Sanitization**: All inputs validated and sanitized
- **Error Handling**: No sensitive information in error messages
