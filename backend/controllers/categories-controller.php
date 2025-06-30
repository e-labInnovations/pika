<?php

/**
 * Categories controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Categories_Controller extends Pika_Base_Controller {

    public $categories_manager;

    public function __construct() {
        parent::__construct();
        $this->categories_manager = new Pika_Categories_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/categories', [
            'methods' => 'GET',
            'callback' => [$this, 'get_categories'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/categories', [
            'methods' => 'POST',
            'callback' => [$this, 'add_category'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/categories/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_category'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/categories/(?P<id>\d+)', [
            'methods' => 'PUT',
            'callback' => [$this, 'update_category'],
            'permission_callback' => [$this, 'can_edit_category']
        ]);

        register_rest_route($this->namespace, '/categories/(?P<id>\d+)', [
            'methods' => 'DELETE',
            'callback' => [$this, 'delete_category'],
            'permission_callback' => [$this, 'can_edit_category']
        ]);
    }

    /**
     * Check if user can edit a category
     */
    public function can_edit_category($request) {
        if(!$this->check_auth($request)) {
            return false;
        }

        $params = $request->get_params();
        $id = $params['id'];

        $category = $this->categories_manager->get_category_by_id($id);
        if(is_wp_error($category)) {
            return false;
        }

        if($category->user_id !== strval(get_current_user_id())) {
            return false;
        }

        return true;
    }

    /**
     * Get categories
     */
    public function get_categories($request) {
        return $this->categories_manager->get_all_categories();
    }

    /**
     * Get a category
     */
    public function get_category($request) {
        $params = $request->get_params();
        $id = $params['id'];

        $category = $this->categories_manager->get_category_by_id($id, true);

        return $category;
    }

    /**
     * Add a category
     */
    public function add_category($request) {
        $params = $request->get_params();
        $name = sanitize_text_field($params['name'] ?? "");
        $icon = $this->categories_manager->sanitize_icon($params['icon'] ?? "");
        $color = $this->categories_manager->sanitize_color($params['color'] ?? "");
        $bg_color = $this->categories_manager->sanitize_color($params['bgColor'] ?? "");
        $type = $this->categories_manager->sanitize_type($params['type'] ?? "");
        $description = sanitize_text_field($params['description'] ?? "") ?? "";
        $parent_id = $this->categories_manager->sanitize_parent_id($params['parentId'] ?? null);

        if (is_null($name) || empty($name)) {
            return $this->categories_manager->get_error('invalid_name');
        }

        if (is_null($icon)) {
            return $this->categories_manager->get_error('invalid_icon');
        }

        if (is_null($color) || empty($color)) {
            return $this->categories_manager->get_error('invalid_color');
        }

        if (is_null($bg_color) || empty($bg_color)) {
            return $this->categories_manager->get_error('invalid_bg_color');
        }

        if (is_null($type) || empty($type)) {
            return $this->categories_manager->get_error('invalid_type');
        }

        if (!$this->categories_manager->is_valid_parent_category($parent_id)) {
            return $this->categories_manager->get_error('invalid_parent_category');
        }

        if (!$this->categories_manager->is_category_name_unique($name, $parent_id)) {
            return $this->categories_manager->get_error('category_name_not_unique');
        }

        $category = $this->categories_manager->create_category($name, $icon, $color, $bg_color, $type, $description, $parent_id);
        return $category;
    }

    /**
     * Update a category
     */
    public function update_category($request) {
        $params = $request->get_params();
        $id = $params['id'];
        $data = [];
        $format = [];

        if(isset($params['name'])) {
            $data['name'] = sanitize_text_field($params['name']);
            $format['name'] = '%s';

            if (is_null($data['name']) || empty($data['name'])) {
                return $this->categories_manager->get_error('invalid_name');
            }

            if (!$this->categories_manager->is_category_name_unique($data['name'], $id)) {
                return $this->categories_manager->get_error('category_name_not_unique');
            }
        }

        if(isset($params['icon'])) {
            $data['icon'] = $this->categories_manager->sanitize_icon($params['icon']);
            $format['icon'] = '%s';

            if (is_null($data['icon'])) {
                return $this->categories_manager->get_error('invalid_icon');
            }
        }

        if(isset($params['color'])) {
            $data['color'] = $this->categories_manager->sanitize_color($params['color']);
            $format['color'] = '%s';

            if (is_null($data['color'])) {
                return $this->categories_manager->get_error('invalid_color');
            }
        }

        if(isset($params['bgColor'])) {
            $data['bg_color'] = $this->categories_manager->sanitize_color($params['bgColor']);
            $format['bg_color'] = '%s';
            
            if (is_null($data['bg_color'])) {
                return $this->categories_manager->get_error('invalid_bg_color');
            }
        }

        if(isset($params['type'])) {
            $data['type'] = $this->categories_manager->sanitize_type($params['type']);
            $format['type'] = '%s';

            if (is_null($data['type'])) {
                return $this->categories_manager->get_error('invalid_type');
            }
        }

        if(isset($params['description'])) {
            $data['description'] = sanitize_text_field($params['description']);
            $format['description'] = '%s';
        }

        if(isset($params['parent_id'])) {
            $data['parent_id'] = $this->categories_manager->sanitize_parent_id($params['parent_id']);
            $format['parent_id'] = '%d';

            if (!$this->categories_manager->is_valid_parent_category($data['parent_id'])) {
                return $this->categories_manager->get_error('invalid_parent_category');
            }

            if ($this->categories_manager->is_parent_category($id)) {
                return $this->categories_manager->get_error('parent_cannot_be_child');
            }
        }

        if(empty($data)) {
            return $this->categories_manager->get_error('no_update');
        }

        $category = $this->categories_manager->update_category($id, $data, $format);
        return $category;
    }

    /**
     * Delete a category
     */
    public function delete_category($request) {
        $params = $request->get_params();
        $id = $params['id'];

        $category = $this->categories_manager->get_category_by_id($id);
        if(is_wp_error($category)) {
            return $category;
        }

        if($this->categories_manager->has_children($id)) {
            return $this->categories_manager->get_error('category_has_children');
        }

        $result = $this->categories_manager->delete_category($id);
        if(is_wp_error($result)) {
            return $result;
        }

        return ['message' => 'Category deleted successfully'];
    }
}
