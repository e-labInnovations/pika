<?php

/**
 * Import/Export controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Import_Export_Controller extends Pika_Base_Controller {

  public $import_export_manager;

  public function __construct() {
    parent::__construct();
    $this->import_export_manager = new Pika_Import_Export_Manager();
  }

  /**
   * Register routes
   */
  public function register_routes() {
    // Export data
    register_rest_route($this->namespace, '/import-export/export', [
      'methods' => 'GET',
      'callback' => [$this, 'export_data'],
      'permission_callback' => [$this, 'check_auth']
    ]);

    // Import data
    register_rest_route($this->namespace, '/import-export/import', [
      'methods' => 'POST',
      'callback' => [$this, 'import_data'],
      'permission_callback' => [$this, 'check_auth']
    ]);

    // Get export/import status
    register_rest_route($this->namespace, '/import-export/status', [
      'methods' => 'GET',
      'callback' => [$this, 'get_status'],
      'permission_callback' => [$this, 'check_auth']
    ]);

    // Get available export formats
    register_rest_route($this->namespace, '/import-export/formats', [
      'methods' => 'GET',
      'callback' => [$this, 'get_formats'],
      'permission_callback' => [$this, 'check_auth']
    ]);
  }

  /**
   * Export user data
   */
  public function export_data($request) {
    $user_id = $this->utils->get_current_user_id();

    if (!$user_id) {
      return $this->import_export_manager->get_error('unauthorized');
    }

    // Check if download is requested early to prevent output issues
    $download = $request->get_param('download') === 'true';
    if ($download) {
      // Clear any existing output buffers early for downloads
      while (ob_get_level()) {
        ob_end_clean();
      }
    }

    $format = $request->get_param('format') ?: 'json';
    $include = $request->get_param('include') ?: [];
    $date_from = $request->get_param('date_from');
    $date_to = $request->get_param('date_to');
    $exclude_system_categories = $request->get_param('exclude_system_categories') === 'true';

    // Validate format
    if (!$this->import_export_manager->is_valid_format($format)) {
      return $this->import_export_manager->get_error('invalid_format');
    }

    // Sanitize include parameter
    if (is_string($include)) {
      $include = explode(',', $include);
    }
    $include = array_map('sanitize_text_field', (array) $include);

    $result = $this->import_export_manager->export_data($user_id, [
      'format' => $format,
      'include' => $include,
      'date_from' => $date_from,
      'date_to' => $date_to,
      'exclude_system_categories' => $exclude_system_categories
    ]);

    if (is_wp_error($result)) {
      return $result;
    }

    if ($download && isset($result['content'], $result['filename'], $result['mime_type'])) {
      // Force file download with proper headers
      $content_length = isset($result['content_length']) ? $result['content_length'] : null;
      $this->force_download($result['content'], $result['filename'], $result['mime_type'], $content_length);
      exit; // Important: stop execution after download
    }

    return $result;
  }

  /**
   * Import user data
   */
  public function import_data($request) {
    $user_id = $this->utils->get_current_user_id();

    if (!$user_id) {
      return $this->import_export_manager->get_error('unauthorized');
    }

    $files = $request->get_file_params();
    $body = $request->get_json_params();

    // Check if file was uploaded
    if (empty($files['import_file']) && empty($body['data'])) {
      return $this->import_export_manager->get_error('no_import_data');
    }

    $options = [
      'merge_strategy' => $request->get_param('merge_strategy') ?: 'merge',
      'validate_only' => $request->get_param('validate_only') === 'true',
      'format' => $request->get_param('format') ?: 'json'
    ];

    if (!empty($files['import_file'])) {
      $result = $this->import_export_manager->import_from_file($user_id, $files['import_file'], $options);
    } else {
      $result = $this->import_export_manager->import_from_data($user_id, $body['data'], $options);
    }

    if (is_wp_error($result)) {
      return $result;
    }

    return $result;
  }

  /**
   * Get import/export status
   */
  public function get_status($request) {
    $user_id = $this->utils->get_current_user_id();

    if (!$user_id) {
      return $this->import_export_manager->get_error('unauthorized');
    }

    $status = $this->import_export_manager->get_operation_status($user_id);

    return $status;
  }

  /**
   * Get available export/import formats
   */
  public function get_formats($request) {
    $user_id = $this->utils->get_current_user_id();

    if (!$user_id) {
      return $this->import_export_manager->get_error('unauthorized');
    }

    $formats = $this->import_export_manager->get_supported_formats();

    return $formats;
  }

  /**
   * Force file download with proper HTTP headers
   * Based on: https://stackoverflow.com/questions/44524071/wp-rest-response-to-download-a-file
   */
  private function force_download($content, $filename, $mime_type, $content_length = null) {
    // Clear any existing output buffers
    while (ob_get_level()) {
      ob_end_clean();
    }

    // Sanitize filename to prevent header injection
    $safe_filename = preg_replace('/[^a-zA-Z0-9._-]/', '_', $filename);

    // Set headers for file download
    header('Content-Description: File Transfer');
    header('Content-Type: ' . $mime_type);
    header('Content-Disposition: attachment; filename="' . $safe_filename . '"');
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Pragma: public');

    // Use provided content_length or calculate it
    $length = $content_length !== null ? $content_length : strlen($content);
    header('Content-Length: ' . $length);

    // Output the file content
    echo $content;

    // Flush output to ensure download starts immediately
    if (ob_get_level()) {
      ob_end_flush();
    }
    flush();
  }
}
