<?php

/**
 * Tags controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Tags_Controller extends Pika_Base_Controller {

    public $tags_manager;

    public function __construct() {
        parent::__construct();
        $this->tags_manager = new Pika_Tags_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/tags', [
            'methods' => 'GET',
            'callback' => [$this, 'get_tags'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/tags', [
            'methods' => 'POST',
            'callback' => [$this, 'add_tag'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/tags/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_tag_by_id'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/tags/(?P<id>\d+)', [
            'methods' => 'PUT',
            'callback' => [$this, 'update_tag'],
            'permission_callback' => [$this, 'can_edit_tag']
        ]);

        register_rest_route($this->namespace, '/tags/(?P<id>\d+)', [
            'methods' => 'DELETE',
            'callback' => [$this, 'delete_tag'],
            'permission_callback' => [$this, 'can_edit_tag']
        ]);
    }

    /**
     * Check if the user can edit the tag
     */
    public function can_edit_tag($request) {
        if (!$this->check_auth($request)) {
            return $this->tags_manager->get_error('unauthorized');
        }

        $tag_id = $request->get_param('id');
        $existing = $this->tags_manager->get_tag_by_id($tag_id);    
        if (!$existing) {
            return $this->tags_manager->get_error('tag_not_found');
        }

        if ($existing->user_id !== strval(get_current_user_id())) {
            return $this->tags_manager->get_error('unauthorized');
        }

        return true;
    }

    /**
     * Get tags
     */
    public function get_tags($request) {
        $user_id = get_current_user_id();
        $tags = $this->tags_manager->get_all_tags($user_id);
        return $tags;
    }

    /**
     * Add a new tag
     */
    public function add_tag($request) {
        $params = $request->get_params();
        $name = sanitize_text_field($params['name']??'');
        $color = $this->tags_manager->sanitize_color($params['color']??'');
        $bg_color = $this->tags_manager->sanitize_color($params['bgColor']??'');
        $icon = $this->tags_manager->sanitize_icon($params['icon']??'');
        $description = sanitize_text_field($params['description']??'');
        
        if (is_null($name) || empty($name)) {
            return $this->tags_manager->get_error('invalid_name');
        }

        if (is_null($color) || empty($color)) {
            return $this->tags_manager->get_error('invalid_color');
        }

        if (is_null($icon) || empty($icon)) {
            return $this->tags_manager->get_error('invalid_icon');
        }
        
        if (is_null($bg_color) || empty($bg_color)) {
            return $this->tags_manager->get_error('invalid_bg_color');
        }

        if (!$this->tags_manager->is_tag_name_unique($name)) {
            return $this->tags_manager->get_error('tag_name_not_unique');
        }

        $tag = $this->tags_manager->create_tag($name, $color, $bg_color, $icon, $description);
        return $tag;
    }

    public function get_tag_by_id($request) {
        $tag_id = $request->get_param('id');
        $tag = $this->tags_manager->get_tag_by_id($tag_id, true);
        return $tag;
    }

    /**
     * Update a tag
     */
    public function update_tag($request) {
        $params = $request->get_params();
        $tag_id = $request->get_param('id');
        $data = [];
        $format = [];

        if(isset($params['name'])) {
            $data['name'] = sanitize_text_field($params['name']);
            $format['name'] = '%s';

            if (!$this->tags_manager->is_tag_name_unique($data['name'], $tag_id)) {
                return $this->tags_manager->get_error('tag_name_not_unique');
            }
        }

        if(isset($params['color'])) {
            $data['color'] = $this->tags_manager->sanitize_color($params['color']);
            if (is_null($data['color'])) {
                return $this->tags_manager->get_error('invalid_color');
            }
            $format['color'] = '%s';
        }

        if(isset($params['bgColor'])) {
            $data['bg_color'] = $this->tags_manager->sanitize_color($params['bgColor']);
            if (is_null($data['bg_color'])) {
                return $this->tags_manager->get_error('invalid_color');
            }
            $format['bg_color'] = '%s';
        }

        if(isset($params['icon'])) {
            $data['icon'] = $this->tags_manager->sanitize_icon($params['icon']);
            if (is_null($data['icon'])) {
                return $this->tags_manager->get_error('invalid_icon');
            }
            $format['icon'] = '%s';
        }

        if(isset($params['description'])) {
            $data['description'] = sanitize_text_field($params['description']) ?? "";
            $format['description'] = '%s';
        }

        if(empty($data)) {
            return $this->tags_manager->get_error('no_update');
        }

        $tag = $this->tags_manager->update_tag($tag_id, $data, $format);
        return $tag;
    }

    /**
     * Delete a tag
     */
    public function delete_tag($request) {
        $tag_id = $request->get_param('id');
        $result = $this->tags_manager->delete_tag($tag_id);
        if (is_wp_error($result)) {
            return $result;
        }
        return ['message' => 'Tag deleted successfully'];
    }
}
