<?php

/**
 * Tags manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Tags_Manager extends Pika_Base_Manager {

  protected $table_name = 'tags';
  protected $table_transaction_tags = 'transaction_tags';

  protected $errors = [
    'tag_name_not_unique' => ['message' => 'Tag name is not unique.', 'status' => 400],
    'tag_not_found' => ['message' => 'Tag not found.', 'status' => 404],
    'invalid_name' => ['message' => 'Invalid tag name.', 'status' => 400],
  ];

  /**
   * Format a tag
   * 
   * @param object $tag
   * @return array
   */
  private function format_tag($tag) {
    return [
      'id' => $tag->id,
      'name' => $tag->name,
      'color' => $tag->color,
      'bgColor' => $tag->bg_color,
      'icon' => $tag->icon,
      'description' => $tag->description ?? "",
      'isSystem' => $tag->user_id === "0",
    ];
  }

  /**
   * Get all tags
   * 
   * @param int $user_id
   * @return array|WP_Error
   */
  public function get_all_tags() {
    $user_id = get_current_user_id();
    $table_name = $this->get_table_name();
    $sql = $this->db()->prepare("SELECT * FROM $table_name WHERE user_id = %d OR user_id = 0 ORDER BY user_id ASC, name ASC", $user_id);
    $tags = $this->db()->get_results($sql);

    if (is_wp_error($tags)) {
      return $this->get_error('db_error');
    }

    $result = array_map([$this, 'format_tag'], $tags);

    return $result;
  }

  /**
   * Get a tag by id
   * 
   * @param int $id
   * @param bool $format
   * @return array|WP_Error
   */
  public function get_tag_by_id($id, $format = false) {
    $table_name = $this->get_table_name();
    $sql = $this->db()->prepare("SELECT * FROM $table_name WHERE id = %d", $id);
    $tag = $this->db()->get_row($sql);

    if (is_wp_error($tag)) {
      return $this->get_error('db_error');
    }

    if ($format) {
      return $this->format_tag($tag);
    }

    return $tag;
  }

  /**
   * Check if a tag name is unique
   * 
   * @param string $name
   * @return bool
   */
  public function is_tag_name_unique($name, $filter_id = null) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $sql = $this->db()->prepare("SELECT COUNT(*) FROM $table_name WHERE name = %s AND (user_id = %d OR user_id = 0) AND id != %d", $name, $user_id, $filter_id);
    $count = $this->db()->get_var($sql);
    return $count == 0;
  }

  /**
   * Create a new tag
   * 
   * @param string $name
   * @param string $color
   * @param string $bg_color
   * @param string $icon
   * @param string $description
   * @return array|WP_Error
   */
  public function create_tag($name, $color, $bg_color, $icon, $description) {
    $table_name = $this->get_table_name();
    $user_id = get_current_user_id();
    $format = ['%s', '%s', '%s', '%s', '%s', '%d'];
    $data = [
      'name' => $name,
      'color' => $color,
      'bg_color' => $bg_color,
      'icon' => $icon,
      'description' => $description,
      'user_id' => $user_id
    ];

    $this->db()->insert($table_name, $data, $format);
    $tag_id = $this->db()->insert_id;

    if ($tag_id === 0) {
      return $this->get_error('db_error');
    }

    $tag = $this->get_tag_by_id($tag_id);
    if (is_wp_error($tag)) {
      return $this->get_error('db_error');
    }

    return $this->format_tag($tag);
  }

  /**
   * Update a tag
   * 
   * @param int $tag_id
   * @param array $data
   * @param array $format
   * @return array|WP_Error
   */
  public function update_tag($tag_id, $data, $format) {
    $table_name = $this->get_table_name();
    $result = $this->db()->update($table_name, $data, ['id' => $tag_id], $format);
    if ($result === false) {
      return $this->get_error('db_update_error');
    }

    $tag = $this->get_tag_by_id($tag_id);
    if (is_wp_error($tag)) {
      return $this->get_error('db_error');
    }

    return $tag;
  }

  /**
   * Delete a tag
   * 
   * @param int $tag_id
   * @return bool|WP_Error
   */
  public function delete_tag($tag_id) {
    $table_name = $this->get_table_name();
    $result = $this->db()->delete($table_name, ['id' => $tag_id]);
    if ($result === false) {
      return $this->get_error('db_delete_error');
    }

    return true;
  }

  /**
   * Get all tags by transaction id
   * 
   * @param int $transaction_id
   * @return array|WP_Error
   */
  public function get_all_transaction_tags($transaction_id) {
    $tags_table = $this->get_table_name();
    $transaction_tags_table = $this->get_table_name($this->table_transaction_tags);
    $sql = $this->db()->prepare("SELECT t.* FROM {$tags_table} AS t INNER JOIN {$transaction_tags_table} AS tt ON t.id = tt.tag_id WHERE tt.transaction_id = %d", $transaction_id);
    $tags = $this->db()->get_results($sql);

    if (is_wp_error($tags)) {
      return $this->get_error('db_error');
    }

    return array_map([$this, 'format_tag'], $tags);
  }
}
