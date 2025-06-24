<?php

/**
 * Upload manager for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Upload_Manager extends Pika_Base_Manager {

  /**
   * Get table suffix
   */
  protected function get_table_suffix() {
    return 'uploads';
  }

  /**
   * Handle file upload
   */
  public function handle_upload($file, $user_id, $type = 'receipt') {
    if (!function_exists('wp_handle_upload')) {
      require_once(ABSPATH . 'wp-admin/includes/file.php');
    }

    // Set upload directory
    $upload_dir = wp_upload_dir();
    $pika_upload_dir = $upload_dir['basedir'] . '/pika-uploads/' . $user_id;

    // Create directory if it doesn't exist
    if (!file_exists($pika_upload_dir)) {
      wp_mkdir_p($pika_upload_dir);
    }

    // Handle the upload
    $upload_overrides = [
      'test_form' => false,
      'unique_filename_callback' => [$this, 'generate_unique_filename']
    ];

    $uploaded_file = wp_handle_upload($file, $upload_overrides);

    if (isset($uploaded_file['error'])) {
      return new WP_Error('upload_error', $uploaded_file['error']);
    }

    // Save file info to database
    $file_data = [
      'user_id' => $user_id,
      'original_name' => $file['name'],
      'file_path' => $uploaded_file['file'],
      'file_url' => $uploaded_file['url'],
      'file_type' => $type,
      'file_size' => $file['size'],
      'mime_type' => $uploaded_file['type'],
      'created_at' => current_time('mysql')
    ];

    $file_id = $this->create($file_data);

    if (!$file_id) {
      return new WP_Error('db_error', 'Failed to save file information');
    }

    return [
      'id' => $file_id,
      'url' => $uploaded_file['url'],
      'name' => $file['name']
    ];
  }

  /**
   * Generate unique filename
   */
  public function generate_unique_filename($dir, $name, $ext) {
    $filename = sanitize_file_name($name);
    $filename = pathinfo($filename, PATHINFO_FILENAME);
    $filename = $filename . '_' . time() . $ext;

    return $filename;
  }

  /**
   * Get user uploads
   */
  public function get_user_uploads($user_id, $type = null) {
    $db = $this->get_db();

    $where = "WHERE user_id = %d";
    $params = [$user_id];

    if ($type) {
      $where .= " AND file_type = %s";
      $params[] = $type;
    }

    $sql = $db->prepare(
      "SELECT * FROM {$this->table_name} {$where} ORDER BY created_at DESC",
      ...$params
    );

    return $db->get_results($sql);
  }

  /**
   * Create upload record
   */
  public function create($data) {
    $db = $this->get_db();

    $result = $db->insert(
      $this->table_name,
      [
        'user_id' => $data['user_id'],
        'original_name' => $data['original_name'],
        'file_path' => $data['file_path'],
        'file_url' => $data['file_url'],
        'file_type' => $data['file_type'],
        'file_size' => $data['file_size'],
        'mime_type' => $data['mime_type'],
        'created_at' => $data['created_at']
      ],
      ['%d', '%s', '%s', '%s', '%s', '%d', '%s', '%s']
    );

    return $result ? $db->insert_id : false;
  }
}
