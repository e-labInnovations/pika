<?php

/**
 * Upload controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Upload_Controller extends Pika_Base_Controller {

    public $upload_manager;

    public function __construct() {
        parent::__construct();
        $this->upload_manager = new Pika_Upload_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/upload/(?P<type>[a-zA-Z]+)', [
            'methods' => 'POST',
            'callback' => [$this, 'upload_file'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }

    /**
     * Upload file
     */
    public function upload_file($request) {
        $params = $request->get_params();
        $type = $this->upload_manager->sanitize_file_type($params['type'] ?? null);
        $attachment_type = $this->upload_manager->sanitize_attachment_type($params['attachment_type'] ?? null);
        $entity_type = $this->upload_manager->sanitize_entity_type($params['entity_type'] ?? null);

        if (is_null($type)) {
            return $this->upload_manager->get_error('invalid_type');
        }

        if(($type === 'avatar')) {
            $attachment_type = 'image';
        }

        if (is_null($attachment_type)) {
            return $this->upload_manager->get_error('invalid_attachment_type');
        }

        if (is_null($entity_type)) {
            return $this->upload_manager->get_error('invalid_entity_type');
        }

        if (!isset($_FILES['file'])) {
            return $this->upload_manager->get_error('invalid_file');
        }

        $file = $this->upload_manager->upload_file('file', $type, $attachment_type, $entity_type);
        if (is_wp_error($file)) {
            return $file;
        }

        return $file;
    }
}
