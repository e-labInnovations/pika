# AI Prompts Structure

This directory contains the modular AI prompt system for the Pika plugin.

## Structure

```
backend/ai/prompts/
├── index.php                    # Security file (prevents direct access)
├── base-prompt-utils.php       # Base class with common methods
├── text-to-transaction.php     # Text/SMS analysis prompt
├── receipt-to-transaction.php  # Receipt image analysis prompt
├── ai-prompt-utils.php         # Main class that combines all prompts
└── README.md                   # This documentation
```

## Classes

### Pika_Base_Prompt_Utils
Abstract base class containing common methods:
- `get_gemini_data()` - Generates Gemini API data structure
- `get_prompt_template()` - Retrieves prompt templates

### Pika_Text_To_Transaction_Prompt
Handles text-based transaction analysis:
- SMS patterns (Pluxee, UPI, ATM)
- Natural language descriptions
- User context integration
- Smart categorization

### Pika_Receipt_To_Transaction_Prompt
Handles receipt image analysis:
- Google Pay receipts
- PhonePe receipts
- Restaurant/shop receipts
- Bill payment receipts
- Bank transfer receipts

### Pika_AI_Prompt_Utils
Main class that combines all prompt utilities:
- Maintains backward compatibility
- Delegates to specific prompt classes
- Provides unified interface

## Usage

```php
// The AI manager will continue to work exactly as before
$ai_prompt_utils = new Pika_AI_Prompt_Utils();

// Text analysis
$prompt_data = $ai_prompt_utils->get_text_to_transaction_data(
    $text, $categories, $tags, $accounts, $people, $user_timezone, $current_user_datetime
);

// Receipt analysis
$prompt_data = $ai_prompt_utils->get_receipt_to_transaction_data(
    $base64_image, $mime_type, $categories, $tags, $accounts, $people, $user_timezone, $current_user_datetime
);
```

## Benefits

1. **Modularity**: Each prompt is self-contained
2. **Maintainability**: Easier to update specific prompts
3. **Scalability**: Simple to add new AI capabilities
4. **Testing**: Can test prompts independently
5. **Team Development**: Multiple developers can work on different prompts

## Adding New Prompts

1. Create a new prompt class extending `Pika_Base_Prompt_Utils`
2. Define the prompt template in `$pika_ai_prompts`
3. Implement the specific method for the prompt
4. Add the new class to `ai-prompt-utils.php`
5. Update this README

## Migration Notes

- **No Breaking Changes**: Existing code continues to work
- **Same Interface**: All public methods remain unchanged
- **Enhanced Structure**: Better organization and maintainability
- **Future Ready**: Easy to extend with new AI features
