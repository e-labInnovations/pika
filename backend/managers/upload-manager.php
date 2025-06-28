<?php

/**
 * Upload manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Upload_Manager extends Pika_Base_Manager {

  protected $table_name = 'uploads';
  public $types = ['avatar', 'attachment', 'other'];
  public $entity_types = ['person', 'account', 'transaction', 'other'];
  private $allowed_types = [
    'image' => [
      'extensions' => ['png', 'jpg', 'jpeg', 'gif', 'svg'],
      'mime_types' => [
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/svg+xml'
      ]
    ],
    'document' => [
      'extensions' => ['pdf'],
      'mime_types' => [
        'application/pdf',
      ]
    ]
  ];
  public $max_file_size = 1024 * 1024 * 5; // 5MB

  public $errors = [
    'upload_failed' => ['message' => 'Upload failed.', 'status' => 400],
    'upload_not_found' => ['message' => 'Upload not found.', 'status' => 404],
    'upload_not_allowed' => ['message' => 'Upload not allowed.', 'status' => 403],
    'file_size_exceeded' => ['message' => 'File size exceeded, max file size is 5MB.', 'status' => 400],
    'invalid_image_type' => ['message' => 'Image type not allowed. Allowed image types are: jpg, jpeg, png, gif, svg, webp.', 'status' => 400],
    'invalid_document_type' => ['message' => 'Document type not allowed. Allowed document types are: pdf.', 'status' => 400],
    'invalid_image_mime_type' => ['message' => 'Image mime type not allowed. Allowed image mime types are: image/png, image/jpeg, image/gif, image/svg+xml, image/webp.', 'status' => 400],
    'invalid_document_mime_type' => ['message' => 'Document mime type not allowed. Allowed document mime types are: application/pdf.', 'status' => 400],
    'invalid_type' => ['message' => 'File type not allowed. Allowed file types are: avatar, attachment, other.', 'status' => 400],
    'invalid_attachment_type' => ['message' => 'Attachment type not allowed. Allowed attachment types are: image, document.', 'status' => 400],
    'invalid_entity_type' => ['message' => 'Entity type not allowed. Allowed entity types are: person, account, transaction, other.', 'status' => 400],
    'invalid_file' => ['message' => 'File missing you request.', 'status' => 400],
  ];

  /**
   * Sanitize file type
   */
  public function sanitize_file_type($type = null) {
    if ($type === null) {
      return null;
    }

    $type = strtolower(trim($type));
    if (!in_array($type, $this->types)) {
      return null;
    }

    return $type;
  }

  /**
   * Sanitize attachment type
   */
  public function sanitize_attachment_type($attachment_type = null) {
    if ($attachment_type === null) {
      return null;
    }

    $attachment_type = strtolower(trim($attachment_type));
    if (!in_array($attachment_type, array_keys($this->allowed_types))) {
      return null;
    }

    return $attachment_type;
  }

  /**
   * Sanitize entity type
   */
  public function sanitize_entity_type($entity_type = null) {
    if ($entity_type === null) {
      return null;
    }

    $entity_type = strtolower(trim($entity_type));
    if (!in_array($entity_type, $this->entity_types)) {
      return null;
    }

    return $entity_type;
  }

  /**
   * Get upload directory for pika files.
   *
   * @param string $type File type (avatar, attachment)
   * @return string Upload directory path
   */
  public function get_upload_dir($type = 'avatar') {
    $upload_dir = wp_upload_dir();
    $pika_dir = $upload_dir['basedir'] . '/pika';
    $avatars_dir = $pika_dir . '/avatars';
    $attachments_dir = $pika_dir . '/attachments';

    if ($type === 'avatar') {
      return $avatars_dir;
    }

    return $attachments_dir;
  }
  
  /**
   * Get upload URL for pika files.
   *
   * @param string $type File type (avatar, attachment)
   * @return string Upload URL
   */
  public function get_upload_url($type = 'avatar') {
    $upload_dir = wp_upload_dir();
    $pika_url = $upload_dir['baseurl'] . '/pika';
    $avatars_url = $pika_url . '/avatars';
    $attachments_url = $pika_url . '/attachments';

    $url = ($type === 'avatar') ? $avatars_url : $attachments_url;

    // Convert to relative URL
    $parsed = wp_parse_url($url);
    return isset($parsed['path']) ? $parsed['path'] : '';
  }

  /**
   * Validate uploaded file.
   *
   * @param array $file File data from $_FILES
   * @param string $attachment_type Attachment type (image, document)
   * @return WP_Error|array Error if invalid, array if valid
   */
  public function validate_file($file, $attachment_type = 'image') {
    if (!isset($this->allowed_types[$attachment_type])) {
      return $this->get_error('invalid_attachment_type');
    }

    // Check file type
    $file_type = wp_check_filetype($file['name']);
    if (!$file_type['ext'] || !in_array(strtolower($file_type['ext']), $this->allowed_types[$attachment_type]['extensions'])) {
      if ($attachment_type === 'image') {
        return $this->get_error('invalid_image_type');
      }
      return $this->get_error('invalid_document_type');
    }

    // Check MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mime_type, $this->allowed_types[$attachment_type]['mime_types'])) {
      if ($attachment_type === 'document') {
        return $this->get_error('invalid_document_mime_type');
      }
      return $this->get_error('invalid_image_mime_type');
    }

    // Check file size
    if ($file['size'] > $this->max_file_size) {
      return $this->get_error('file_size_exceeded');
    }

    return [
      'file_name' => $file['name'],
      'file_size' => $file['size'],
      'mime_type' => $mime_type,
    ];
  }

  /**
   * Save a file to the upload directory and return the file URL.
   *
   * @param string $file_key File key in $_FILES
   * @param string $type File type (avatar, attachment)
   * @param string $attachment_type Attachment type (image, document)
   * @param string $entity_type Entity type (person, account, attachment, other)
   * @return array|WP_Error File data on success, WP_Error on failure
   */
  public function save_file($file_key, $type, $attachment_type, $entity_type) {
    $file = $_FILES[$file_key];
    // Validate file
    $file_data = $this->validate_file($file, $attachment_type);
    if (is_wp_error($file_data)) {
      return $file_data;
    }

    // Generate unique filename
    $file_type = wp_check_filetype($file['name']);
    $extension = $file_type['ext'];
    $timestamp = time();
    $unique_id = uniqid();
    $file_name = $entity_type . '-' . $unique_id . '-' . $timestamp . '.' . $extension;

    // Determine upload directory based on file type
    $upload_dir = $this->get_upload_dir($type);
    $file_path = $upload_dir . '/' . $file_name;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $file_path)) {
      return $this->get_error('upload_failed');
    }

    // Get file URL
    $upload_url = $this->get_upload_url($type);
    $file_url = $upload_url . '/' . $file_name;

    return [
      'file_name' => $file_data['file_name'],
      'file_size' => $file_data['file_size'],
      'mime_type' => $file_data['mime_type'],
      'file_url' => get_site_url() . $file_url,
    ];
  }

  /**
   * Format file data
   * 
   */
  public function format_file($file_data) {
    return [
      'id' => $file_data->id,
      'url' => $file_data->file_url,
      'type' => $file_data->attachment_type,
      'name' => $file_data->file_name,
      'size' => $file_data->file_size
    ];
  }

  /**
   * Get file by ID
   * 
   */
  public function get_file_by_id($id, $format = false) {
    $table_name = $this->get_table_name();
    $file = $this->db()->get_row($this->db()->prepare("SELECT * FROM {$table_name} WHERE id = %d", $id));
    if (!$file) {
      return $this->get_error('upload_not_found');
    }

    if ($format) {
      return $this->format_file($file);
    }

    return $file;
  }

  /**
   * Upload a file to the upload directory and save to the database.
   *
   * @param string $file_key File key in $_FILES
   * @param string $type File type (avatar, attachment)
   * @param string $attachment_type Attachment type (image, document)
   * @param string $entity_type Entity type (person, account, attachment, other)
   * @return array|WP_Error File data on success, WP_Error on failure
   */
  public function upload_file($file_key, $type, $attachment_type, $entity_type) {
    $file_data = $this->save_file($file_key, $type, $attachment_type, $entity_type);
    if (is_wp_error($file_data)) {
      return $file_data;
    }

    $file_name = $file_data['file_name'];
    $file_size = $file_data['file_size'];
    $mime_type = $file_data['mime_type'];
    $file_url = $file_data['file_url'];
    
    $table_name = $this->get_table_name();
    $format = ['%s', '%s', '%s', '%d', '%s', '%s', '%d', '%s'];
    $data = [
      'type' => $type,
      'attachment_type' => $attachment_type,
      'entity_type' => $entity_type,
      'user_id' => get_current_user_id(),
      'file_name' => $file_name,
      'file_url' => $file_url,
      'file_size' => $file_size,
      'mime_type' => $mime_type,
    ];

    $this->db()->insert($table_name, $data, $format);
    $file_id = $this->db()->insert_id;

    if ($file_id === 0) {
      return $this->get_error('db_error');
    }

    $file = $this->get_file_by_id($file_id);
    if (is_wp_error($file)) {
      return $file;
    }

    return $this->format_file($file);
  }
}
