<?php

/**
 * Import/Export manager for Pika plugin
 * Handles data import and export operations
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Import_Export_Manager extends Pika_Base_Manager {

  protected $table_name = 'import_export_logs';
  protected $categories_manager;
  protected $accounts_manager;
  protected $people_manager;
  protected $tags_manager;

  /**
   * Supported export/import formats
   */
  protected $supported_formats = [
    'json' => 'JSON',
    'csv' => 'CSV',
    'excel' => 'Excel (XLSX)'
  ];

  /**
   * Available data types for export/import
   */
  protected $data_types = [
    'transactions' => 'Transactions',
    'accounts' => 'Accounts',
    'categories' => 'Categories',
    'people' => 'People',
    'tags' => 'Tags',
    'settings' => 'Settings'
  ];

  /**
   * Custom error messages
   */
  protected $errors = [
    'invalid_format' => ['message' => 'Invalid export/import format.', 'status' => 400],
    'no_import_data' => ['message' => 'No import data provided.', 'status' => 400],
    'file_upload_error' => ['message' => 'File upload error.', 'status' => 400],
    'invalid_file_type' => ['message' => 'Invalid file type.', 'status' => 400],
    'file_too_large' => ['message' => 'File too large.', 'status' => 400],
    'parse_error' => ['message' => 'Error parsing import data.', 'status' => 400],
    'validation_failed' => ['message' => 'Data validation failed.', 'status' => 400],
    'import_failed' => ['message' => 'Import operation failed.', 'status' => 500],
    'export_failed' => ['message' => 'Export operation failed.', 'status' => 500]
  ];

  /**
   * Maximum file size for imports (in bytes)
   */
  protected $max_file_size = 10485760; // 10MB

  /**
   * Constructor
   */
  public function __construct() {
    parent::__construct();
    $this->categories_manager = new Pika_Categories_Manager();
    $this->accounts_manager = new Pika_Accounts_Manager();
    $this->people_manager = new Pika_People_Manager();
    $this->tags_manager = new Pika_Tags_Manager();
  }

  /**
   * Export user data
   */
  public function export_data($user_id, $options = []) {
    $format = $options['format'] ?? 'json';
    $include = $options['include'] ?? array_keys($this->data_types);
    $date_from = isset($options['date_from']) ? $this->sanitize_datetime($options['date_from']) : null;
    $date_to = isset($options['date_to']) ? $this->sanitize_datetime($options['date_to']) : null;
    $exclude_system_categories = $options['exclude_system_categories'] ?? false;

    // Suppress any errors/warnings during export to prevent output corruption
    $old_error_reporting = error_reporting(0);

    try {
      $export_data = [];

      // Export each requested data type
      foreach ($include as $data_type) {
        if (!array_key_exists($data_type, $this->data_types)) {
          continue;
        }

        $data = $this->export_data_type($user_id, $data_type, $date_from, $date_to, $exclude_system_categories);
        if (!is_wp_error($data)) {
          $export_data[$data_type] = $data;
        }
      }

      // Log export operation
      $this->log_operation($user_id, 'export', [
        'format' => $format,
        'include' => $include,
        'exclude_system_categories' => $exclude_system_categories,
        'status' => 'completed'
      ]);

      // Format the export data
      $result = $this->format_export_data($export_data, $format);

      // Restore error reporting
      error_reporting($old_error_reporting);

      return $result;
    } catch (Exception $e) {
      // Restore error reporting
      error_reporting($old_error_reporting);

      $this->log_operation($user_id, 'export', [
        'format' => $format,
        'include' => $include,
        'exclude_system_categories' => $exclude_system_categories,
        'status' => 'failed',
        'error' => $e->getMessage()
      ]);

      return $this->get_error('export_failed');
    }
  }

  /**
   * Import data from file
   */
  public function import_from_file($user_id, $file, $options = []) {
    // Validate file
    $validation = $this->validate_import_file($file);
    if (is_wp_error($validation)) {
      return $validation;
    }

    // Read file content
    $file_content = file_get_contents($file['tmp_name']);
    if ($file_content === false) {
      return $this->get_error('file_upload_error');
    }

    return $this->import_from_data($user_id, $file_content, $options);
  }

  /**
   * Import data from raw data
   */
  public function import_from_data($user_id, $data, $options = []) {
    $format = $options['format'] ?? 'json';
    $merge_strategy = $options['merge_strategy'] ?? 'merge';
    $validate_only = $options['validate_only'] ?? false;

    try {
      // Parse data based on format
      $parsed_data = $this->parse_import_data($data, $format);
      if (is_wp_error($parsed_data)) {
        return $parsed_data;
      }

      // Validate data structure
      $validation = $this->validate_import_data($parsed_data);
      if (is_wp_error($validation)) {
        return $validation;
      }

      if ($validate_only) {
        return [
          'status' => 'validation_passed',
          'summary' => $this->get_import_summary($parsed_data),
          'data' => $parsed_data
        ];
      }

      // Import data
      $result = $this->process_import($user_id, $parsed_data, $merge_strategy);

      // Log import operation  
      $this->log_operation($user_id, 'import', [
        'format' => $format,
        'merge_strategy' => $merge_strategy,
        'status' => is_wp_error($result) ? 'failed' : 'completed',
        'summary' => is_wp_error($result) ? null : $result
      ]);

      return $result;
    } catch (Exception $e) {
      $this->log_operation($user_id, 'import', [
        'format' => $format,
        'merge_strategy' => $merge_strategy,
        'status' => 'failed',
        'error' => $e->getMessage()
      ]);

      return $this->get_error('import_failed');
    }
  }

  /**
   * Get operation status
   */
  public function get_operation_status($user_id) {
    $table_name = $this->get_table_name('import_export_logs');

    $recent_operations = $this->db()->get_results($this->db()->prepare("
            SELECT operation_type, status, created_at, metadata
            FROM {$table_name}
            WHERE user_id = %d
            ORDER BY created_at DESC
            LIMIT 10
        ", $user_id));

    return [
      'recent_operations' => $recent_operations,
      'supported_formats' => $this->supported_formats,
      'data_types' => $this->data_types
    ];
  }

  /**
   * Get supported formats
   */
  public function get_supported_formats() {
    return [
      'formats' => $this->supported_formats,
      'data_types' => $this->data_types,
      'max_file_size' => $this->max_file_size
    ];
  }

  /**
   * Check if format is valid
   */
  public function is_valid_format($format) {
    return array_key_exists($format, $this->supported_formats);
  }

  // TODO: Implement these helper methods

  /**
   * Export specific data type
   */
  private function export_data_type($user_id, $data_type, $date_from = null, $date_to = null, $exclude_system_categories = false) {
    switch ($data_type) {
      case 'categories':
        return $this->export_categories($user_id, $exclude_system_categories);
      default:
        // TODO: Implement other data types
        return [];
    }
  }

  /**
   * Export categories data
   */
  private function export_categories($user_id, $exclude_system_categories = false) {
    try {
      // Get categories manager instance
      if (!class_exists('Pika_Categories_Manager')) {
        require_once PIKA_PLUGIN_PATH . 'backend/managers/categories-manager.php';
      }

      $categories_manager = new Pika_Categories_Manager();

      // Build SQL query based on exclude_system_categories parameter
      $table_name = $this->get_table_name('categories');
      if ($exclude_system_categories) {
        // Only get user-created categories
        $sql = $this->db()->prepare("SELECT * FROM {$table_name} WHERE user_id = %d ORDER BY id ASC", $user_id);
      } else {
        // Get all categories (including system and user categories)
        $sql = $this->db()->prepare("SELECT * FROM {$table_name} WHERE user_id = %d OR user_id = 0 ORDER BY id ASC", $user_id);
      }

      $categories = $this->db()->get_results($sql);

      if (is_wp_error($categories)) {
        return $this->get_error('db_error');
      }

      // Format categories for export - flatten arrays for CSV compatibility
      $formatted_categories = [];
      foreach ($categories as $category) {
        $formatted_categories[] = [
          'id' => $category->id,
          'name' => $category->name,
          'icon' => $category->icon,
          'color' => $category->color,
          'bgColor' => $category->bg_color,
          'description' => $category->description ?? '',
          'isSystem' => $category->user_id === "0" ? '1' : '0',
          'isParent' => $category->parent_id === null ? '1' : '0',
          'type' => $category->type,
          'parentId' => $category->parent_id ?? '',
          'userId' => $category->user_id,
          'created_at' => $category->created_at ?? '',
          'updated_at' => $category->updated_at ?? ''
        ];
      }

      return $formatted_categories;
    } catch (Exception $e) {
      Pika_Utils::log('Categories export error: ' . $e->getMessage());
      return $this->get_error('export_failed');
    }
  }

  /**
   * Format export data based on format
   */
  private function format_export_data($data, $format) {
    switch ($format) {
      case 'json':
        $content = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        return [
          'content' => $content,
          'filename' => 'pika_export_' . date('Y-m-d_H-i-s') . '.json',
          'mime_type' => 'application/json',
          'content_length' => strlen($content)
        ];
      case 'csv':
        return $this->format_to_csv($data);
      case 'excel':
        // TODO: Implement Excel format
        return $this->get_error('invalid_format');
      default:
        return $this->get_error('invalid_format');
    }
  }

  /**
   * Format data to CSV
   */
  private function format_to_csv($data) {
    $csv_content = '';

    foreach ($data as $data_type => $items) {
      if (empty($items)) continue;

      // Add section header
      $csv_content .= strtoupper($data_type) . "\n";

      // Get headers from first item
      $headers = array_keys($items[0]);
      $csv_content .= $this->array_to_csv_line($headers);

      // Add data rows
      foreach ($items as $item) {
        $csv_content .= $this->array_to_csv_line(array_values($item));
      }

      $csv_content .= "\n";
    }

    $content = trim($csv_content);
    return [
      'content' => $content,
      'filename' => 'pika_export_' . date('Y-m-d_H-i-s') . '.csv',
      'mime_type' => 'text/csv',
      'content_length' => strlen($content)
    ];
  }

  /**
   * Convert array to CSV line
   */
  private function array_to_csv_line($array) {
    // Convert any arrays within the data to strings
    $safe_array = [];
    foreach ($array as $value) {
      if (is_array($value)) {
        $safe_array[] = json_encode($value);
      } elseif (is_object($value)) {
        $safe_array[] = json_encode($value);
      } else {
        $safe_array[] = (string) $value;
      }
    }

    $output = fopen('php://temp', 'r+');
    fputcsv($output, $safe_array);
    rewind($output);
    $csv_line = fgets($output);
    fclose($output);
    return $csv_line;
  }

  /**
   * Validate import file
   */
  private function validate_import_file($file) {
    // TODO: Implement file validation
    return true;
  }

  /**
   * Parse import data based on format
   */
  private function parse_import_data($data, $format) {
    // TODO: Implement data parsing for different formats
    return [];
  }

  /**
   * Validate import data structure
   */
  private function validate_import_data($data) {
    // TODO: Implement data validation
    return true;
  }

  /**
   * Get import summary
   */
  private function get_import_summary($data) {
    // TODO: Implement summary generation
    return [];
  }

  /**
   * Process import operation
   */
  private function process_import($user_id, $data, $merge_strategy) {
    // TODO: Implement import processing
    return [];
  }

  /**
   * Log operation
   */
  private function log_operation($user_id, $operation_type, $metadata) {
    $table_name = $this->get_table_name('import_export_logs');

    $this->db()->insert(
      $table_name,
      [
        'user_id' => $user_id,
        'operation_type' => $operation_type,
        'status' => $metadata['status'],
        'metadata' => json_encode($metadata),
        'created_at' => current_time('mysql', true)
      ],
      [
        '%d',
        '%s',
        '%s',
        '%s',
        '%s'
      ]
    );
  }
}
