<?php

/**
 * Base AI Prompt Utilities for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

abstract class Pika_Base_Prompt_Utils {

  /**
   * Get Gemini data structure for AI prompts
   * 
   * @param string $type Prompt type
   * @param array $data Data to replace placeholders
   * @param string|null $base64_image Base64 encoded image
   * @param string $mime_type Image MIME type
   * @return array|false
   */
  protected function get_gemini_data($type, $data = [], $base64_image = null, $mime_type = 'image/jpeg') {
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

    $user_contents = $base64_image ? [
      [
        'parts' => [
          [
            'inline_data' => [
              'mime_type' => $mime_type,
              'data' => $base64_image
            ]
          ],
          [
            'text' => $user_prompt
          ]
        ]
      ]
    ] : [
      [
        'parts' => [
          [
            'text' => $user_prompt
          ]
        ]
      ]
    ];

    return [
      'system_instruction' => [
        'parts' => [
          [
            'text' => $system_prompt
          ]
        ]
      ],
      'contents' => $user_contents,
      'generationConfig' => [
        'responseMimeType' => 'application/json',
        'responseSchema' => $response_structure
      ]
    ];
  }

  /**
   * Get prompt template by type
   * 
   * @param string $type Prompt type
   * @return array|false
   */
  protected function get_prompt_template($type) {
    return isset($this->pika_ai_prompts[$type]) ? $this->pika_ai_prompts[$type] : false;
  }
}
