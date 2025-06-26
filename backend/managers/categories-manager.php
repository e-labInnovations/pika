<?php

/**
 * Categories manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Categories_Manager extends Pika_Base_Manager {

  protected $table_name = 'categories';

  protected $errors = [
    'category_name_not_unique' => ['message' => 'Category name is not unique.', 'status' => 400],
    'category_not_found' => ['message' => 'Category not found.', 'status' => 404]
  ];

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
      'children' => [],
    ];
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
        $children = array_filter($categories, function($c) use ($parent_category) {
          return $c->parent_id === $parent_category['id'];
        });
        $parent_category['children'] = array_values(array_map([$this, 'format_category'], $children));
        array_push($grouped, $parent_category);
      }
    }

    return $grouped;
  }

  /**
   * Get all categories
   * 
   * @return array
   */
  public function get_all_categories() {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $sql = $this->db()->prepare("SELECT * FROM {$table_name} WHERE user_id = %d OR user_id = 0", $user_id);
    $categories = $this->db()->get_results($sql);
    if (is_wp_error($categories)) {
      return $this->get_error('db_error');
    }

    $result = $this->build_category_tree($categories);

    return $result;
  }
}
