<?php

/**
 * Categories manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Categories_Manager extends Pika_Base_Manager {

  protected $table_name = 'categories';

  public $allowed_types = ['expense', 'income', 'transfer'];

  protected $errors = [
    'category_name_not_unique' => ['message' => 'Category name is not unique.', 'status' => 400],
    'category_not_found' => ['message' => 'Category not found.', 'status' => 404],
    'invalid_parent_category' => ['message' => 'Invalid parent category.', 'status' => 400],
    'invalid_type' => ['message' => 'Invalid category type. Type must be one of the following: income, expense, transfer.', 'status' => 400],
    'invalid_name' => ['message' => 'Invalid category name.', 'status' => 400],
    'parent_cannot_be_child' => ['message' => 'Parent category can not be a child category.', 'status' => 400],
    'category_has_children' => ['message' => 'Category has children. Please delete the children first.', 'status' => 400],
  ];

  /**
   * Sanitize a parent id
   * 
   * @param int $parent_id
   * @return int|null
   */
  public function sanitize_parent_id($parent_id) {
    if (is_null($parent_id)) {
      return null;
    }

    if (!is_numeric(intval($parent_id))) {
      return null;
    }

    return intval($parent_id);
  }

  /**
   * Format a category
   * 
   * @param object $category
   * @return array
   */
  private function format_category($category) {
    return [
      'id' => $category->id,
      'name' => $category->name,
      'icon' => $category->icon,
      'color' => $category->color,
      'bgColor' => $category->bg_color,
      'description' => $category->description ?? "",
      'isSystem' => $category->user_id === "0",
      'isParent' => $category->parent_id === null,
      'type' => $category->type,
      'parentId' => $category->parent_id,
      'children' => [],
    ];
  }

  /**
   * Sanitize a type
   * 
   * @param string $type
   * @return string|null
   */
  public function sanitize_type($type) {
    $type = strtolower($type);
    if (!in_array($type, $this->allowed_types)) {
      return null;
    }
    return $type;
  }

  /**
   * Convert flat categories to tree
   * 
   * @param array $categories
   * @return array
   */
  private function build_category_tree(array $categories) {
    $grouped = [];

    foreach ($categories as $category) {
      if ($category->parent_id === null) {
        $parent_category = $this->format_category($category);
        $children = array_filter($categories, function ($c) use ($parent_category) {
          return $c->parent_id === $parent_category['id'];
        });
        $parent_category['children'] = array_values(array_map([$this, 'format_category'], $children));
        array_push($grouped, $parent_category);
      }
    }

    return $grouped;
  }

  /**
   * Get default category (Other)
   * 
   * @param string $type
   * @return array|WP_Error
   */
  public function get_default_category($type = 'expense') {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $sql = $this->db()->prepare("SELECT * FROM {$table_name} WHERE name = 'Other' AND type = %s AND (user_id = %d OR user_id = 0)", $type, $user_id);
    $category = $this->db()->get_row($sql);
    if (is_wp_error($category) || is_null($category)) {
      return $this->get_error('db_error');
    }

    return $this->format_category($category);
  }

  /**
   * Get a category by id
   * 
   * @param int $id
   * @param bool $format
   * @return object|null
   */
  public function get_category_by_id($id, $format = false) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $sql = $this->db()->prepare("SELECT * FROM {$table_name} WHERE id = %d AND (user_id = %d OR user_id = 0)", $id, $user_id);
    $category = $this->db()->get_row($sql);
    if (is_wp_error($category) || is_null($category)) {
      return $this->get_error('db_error');
    }

    return $format ? $this->format_category($category) : $category;
  }

  /**
   * Check parent category is valid
   * 
   * @param int $parent_id
   * @return bool
   */
  public function is_valid_parent_category($parent_id) {
    if (is_null($parent_id)) {
      return true;
    }

    $category = $this->get_category_by_id($parent_id);

    if (is_wp_error($category)) {
      return false;
    }

    if ($category->parent_id !== null) {
      return false;
    }

    return true;
  }

  /**
   * Check if a category is parent
   * 
   * @param int $category_id
   * @return bool
   */
  public function is_parent_category($category_id) {
    $category = $this->get_category_by_id($category_id);

    if (is_wp_error($category)) {
      return false;
    }

    return $category->parent_id === null;
  }

  /**
   * Check if a category name is unique
   * 
   * @param string $name
   * @param int|null $filter_id
   * @return bool
   */
  public function is_category_name_unique($name, $filter_id = null) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $sql = $this->db()->prepare("SELECT COUNT(*) FROM {$table_name} WHERE name = %s AND (user_id = %d OR user_id = 0) AND id != %d", $name, $user_id, $filter_id);
    $count = $this->db()->get_var($sql);
    return $count == 0;
  }

  /**
   * Check if a category has children
   * 
   * @param int $category_id
   * @return bool
   */
  public function has_children($category_id) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $sql = $this->db()->prepare("SELECT COUNT(*) FROM {$table_name} WHERE parent_id = %d AND (user_id = %d OR user_id = 0)", $category_id, $user_id);
    $count = $this->db()->get_var($sql);
    return $count > 0;
  }

  /**
   * Get all categories
   * 
   * @return array
   */
  public function get_all_categories($tree = true, $exclude_system_categories = false) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $sql = $this->db()->prepare("SELECT * FROM {$table_name} WHERE user_id = %d", $user_id);
    if (!$exclude_system_categories) {
      $sql .= " OR user_id = 0";
    }
    $sql .= " ORDER BY name ASC";
    $categories = $this->db()->get_results($sql);
    if (is_wp_error($categories)) {
      return $this->get_error('db_error');
    }

    $result = $tree ? $this->build_category_tree($categories) : array_values(array_map([$this, 'format_category'], $categories));

    return $result;
  }

  /**
   * Get all child categories by type
   * 
   */
  public function get_all_child_categories($type = 'all') {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();

    $sql = "SELECT * FROM {$table_name} WHERE (user_id = %d OR user_id = 0) AND parent_id IS NOT NULL";
    $params = [$user_id];

    if ($type != 'all') {
      $sql .= " AND type = %s";
      $params[] = $type;
    }

    $sql = $this->db()->prepare($sql, ...$params);
    $categories = $this->db()->get_results($sql);

    if (is_wp_error($categories)) {
      return $this->get_error('db_error');
    }

    $result = array_values(array_map([$this, 'format_category'], $categories));

    return $result;
  }

  /**
   * Get a nested category by id
   * 
   * @param int $id
   * @return array|WP_Error
   */
  public function get_nested_category_by_id($id) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $sql = $this->db()->prepare("SELECT * FROM {$table_name} WHERE (id = %d OR parent_id = %d) AND (user_id = %d OR user_id = 0)", $id, $id, $user_id);
    $categories = $this->db()->get_results($sql);
    if (is_wp_error($categories)) {
      return $this->get_error('db_error');
    }

    return $this->build_category_tree($categories);
  }

  /**
   * Create a category
   * 
   * @param string $name
   * @param string $icon
   * @param string $color
   * @param string $bg_color
   * @param string $type
   * @param string $description
   * @param int $parent_id
   * @return array|WP_Error
   */
  public function create_category($name, $icon, $color, $bg_color, $type, $description, $parent_id) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $format = ['%s', '%s', '%s', '%s', '%s', '%s', '%d', '%d'];
    $data = [
      'name' => $name,
      'icon' => $icon,
      'color' => $color,
      'bg_color' => $bg_color,
      'type' => $type,
      'description' => $description,
      'parent_id' => $parent_id,
      'user_id' => $user_id
    ];

    $this->db()->insert($table_name, $data, $format);
    $category_id = $this->db()->insert_id;

    if ($category_id === 0) {
      return $this->get_error('db_error');
    }

    $category = $this->get_category_by_id($category_id);
    if (is_wp_error($category)) {
      return $this->get_error('db_error');
    }

    return $this->format_category($category);
  }

  /**
   * Update a category
   * 
   * @param int $id
   * @param array $data
   * @param array $format
   * @return array|WP_Error
   */
  public function update_category($id, $data, $format) {
    $table_name = $this->get_table_name();
    $result = $this->db()->update($table_name, $data, ['id' => $id], $format);
    if ($result === false) {
      return $this->get_error('db_update_error');
    }

    $category = $this->get_category_by_id($id);
    if (is_wp_error($category)) {
      return $this->get_error('db_error');
    }

    if ($category->parent_id === null) {
      $categories = $this->get_nested_category_by_id($id);
      if (is_wp_error($categories)) {
        return $this->get_error('db_error');
      }

      return $categories;
    }

    return $this->format_category($category);
  }

  /**
   * Delete a category
   * 
   * @param int $id
   * @return bool|WP_Error
   */
  public function delete_category($id) {
    $table_name = $this->get_table_name();
    $result = $this->db()->delete($table_name, ['id' => $id]);
    if ($result === false) {
      return $this->get_error('db_delete_error');
    }

    return true;
  }
}
