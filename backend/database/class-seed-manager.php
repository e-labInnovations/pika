<?php

/**
 * Seed Manager for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
  exit;
}

class Pika_Seed_Manager {

  /**
   * Insert all default data
   */
  public function insert_all_default_data() {
    try {
      $this->insert_system_categories();
      $this->insert_system_tags();
      return true;
    } catch (Exception $e) {
      error_log('Pika Seed Manager Error: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Insert system categories
   */
  private function insert_system_categories() {
    global $wpdb;

    // Include default data
    require_once PIKA_PLUGIN_PATH . 'backend/data/default-data.php';

    $categories_table = $wpdb->prefix . 'pika_categories';

    // Insert expense categories
    $this->insert_categories_with_children(Pika_Default_Data::DEFAULT_EXPENSE_CATEGORIES, 0);

    // Insert income categories
    $this->insert_categories_with_children(Pika_Default_Data::DEFAULT_INCOME_CATEGORIES, 0);

    // Insert transfer categories
    $this->insert_categories_with_children(Pika_Default_Data::DEFAULT_TRANSFER_CATEGORIES, 0);
  }

  /**
   * Insert categories with their children
   */
  private function insert_categories_with_children($categories, $user_id) {
    global $wpdb;

    $categories_table = $wpdb->prefix . 'pika_categories';

    foreach ($categories as $category) {
      // Insert parent category
      $parent_data = [
        'user_id' => $user_id,
        'name' => $category['name'],
        'icon' => $category['icon'],
        'color' => $category['color'],
        'bg_color' => $category['bg_color'],
        'type' => $category['type'],
        'description' => $category['description'],
        'is_active' => 1
      ];

      $wpdb->insert($categories_table, $parent_data);
      $parent_id = $wpdb->insert_id;

      // Insert children if they exist
      if (!empty($category['children'])) {
        foreach ($category['children'] as $child) {
          $child_data = [
            'user_id' => $user_id,
            'parent_id' => $parent_id,
            'name' => $child['name'],
            'icon' => $child['icon'],
            'color' => $child['color'],
            'bg_color' => $child['bg_color'],
            'type' => $child['type'],
            'description' => $child['description'],
            'is_active' => 1
          ];

          $wpdb->insert($categories_table, $child_data);
        }
      }
    }
  }

  /**
   * Insert system tags
   */
  private function insert_system_tags() {
    global $wpdb;

    // Include default data
    require_once PIKA_PLUGIN_PATH . 'backend/data/default-data.php';

    $tags_table = $wpdb->prefix . 'pika_tags';

    foreach (Pika_Default_Data::DEFAULT_TAGS as $tag) {
      $tag_data = [
        'user_id' => 0, // 0 for system tags
        'name' => $tag['name'],
        'icon' => $tag['icon'],
        'color' => $tag['color'],
        'bg_color' => $tag['bg_color'],
        'description' => $tag['description'],
        'is_active' => 1
      ];

      $wpdb->insert($tags_table, $tag_data);
    }
  }

  /**
   * Check if tables are empty
   */
  public function are_tables_empty() {
    global $wpdb;

    // Check if categories table exists and is empty
    $categories_count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}pika_categories");
    if ($categories_count === null) {
      // Table doesn't exist yet, return false
      return false;
    }

    // Check if tags table exists and is empty
    $tags_count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}pika_tags");
    if ($tags_count === null) {
      // Table doesn't exist yet, return false
      return false;
    }

    // Return true if both tables are empty
    return ($categories_count == 0 && $tags_count == 0);
  }

  /**
   * Get count of system categories
   */
  public function get_system_categories_count() {
    global $wpdb;

    $categories_table = $wpdb->prefix . 'pika_categories';
    return $wpdb->get_var("SELECT COUNT(*) FROM $categories_table WHERE user_id = 0");
  }

  /**
   * Get count of system tags
   */
  public function get_system_tags_count() {
    global $wpdb;

    $tags_table = $wpdb->prefix . 'pika_tags';
    return $wpdb->get_var("SELECT COUNT(*) FROM $tags_table WHERE user_id = 0");
  }

  /**
   * Get count of user categories
   */
  public function get_user_categories_count($user_id) {
    global $wpdb;

    $categories_table = $wpdb->prefix . 'pika_categories';
    return $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $categories_table WHERE user_id = %d", $user_id));
  }

  /**
   * Get count of user tags
   */
  public function get_user_tags_count($user_id) {
    global $wpdb;

    $tags_table = $wpdb->prefix . 'pika_tags';
    return $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $tags_table WHERE user_id = %d", $user_id));
  }

  /**
   * Check if system category can be deleted/edited
   * 
   * @param int $category_id
   * @return array ['can_edit' => bool, 'can_delete' => bool, 'dependencies' => array]
   */
  public function check_system_category_permissions($category_id) {
    global $wpdb;

    $dependencies = [];
    $can_edit = true;
    $can_delete = true;

    // Check if category exists and is system category
    $category = $wpdb->get_row($wpdb->prepare(
      "SELECT * FROM {$wpdb->prefix}pika_categories WHERE id = %d AND user_id = 0",
      $category_id
    ));

    if (!$category) {
      return ['can_edit' => false, 'can_delete' => false, 'dependencies' => []];
    }

    // Check for child categories
    $child_count = $wpdb->get_var($wpdb->prepare(
      "SELECT COUNT(*) FROM {$wpdb->prefix}pika_categories WHERE parent_id = %d",
      $category_id
    ));

    if ($child_count > 0) {
      $dependencies[] = "Has {$child_count} child category(ies)";
      $can_delete = false;
    }

    // Check for transactions using this category
    $transaction_count = $wpdb->get_var($wpdb->prepare(
      "SELECT COUNT(*) FROM {$wpdb->prefix}pika_transactions WHERE category_id = %d",
      $category_id
    ));

    if ($transaction_count > 0) {
      $dependencies[] = "Used in {$transaction_count} transaction(s)";
      $can_delete = false;
      $can_edit = false; // Can't edit if used in transactions
    }

    // Check for reminders using this category
    $reminder_count = $wpdb->get_var($wpdb->prepare(
      "SELECT COUNT(*) FROM {$wpdb->prefix}pika_reminders WHERE category_id = %d",
      $category_id
    ));

    if ($reminder_count > 0) {
      $dependencies[] = "Used in {$reminder_count} reminder(s)";
      $can_delete = false;
      $can_edit = false; // Can't edit if used in reminders
    }

    return [
      'can_edit' => $can_edit,
      'can_delete' => $can_delete,
      'dependencies' => $dependencies
    ];
  }

  /**
   * Check if system tag can be deleted/edited
   * 
   * @param int $tag_id
   * @return array ['can_edit' => bool, 'can_delete' => bool, 'dependencies' => array]
   */
  public function check_system_tag_permissions($tag_id) {
    global $wpdb;

    $dependencies = [];
    $can_edit = true;
    $can_delete = true;

    // Check if tag exists and is system tag
    $tag = $wpdb->get_row($wpdb->prepare(
      "SELECT * FROM {$wpdb->prefix}pika_tags WHERE id = %d AND user_id = 0",
      $tag_id
    ));

    if (!$tag) {
      return ['can_edit' => false, 'can_delete' => false, 'dependencies' => []];
    }

    // Check for transactions using this tag
    $transaction_count = $wpdb->get_var($wpdb->prepare(
      "SELECT COUNT(*) FROM {$wpdb->prefix}pika_transaction_tags WHERE tag_id = %d",
      $tag_id
    ));

    if ($transaction_count > 0) {
      $dependencies[] = "Used in {$transaction_count} transaction(s)";
      $can_delete = false;
      $can_edit = false; // Can't edit if used in transactions
    }

    // Check for reminders using this tag
    $reminder_count = $wpdb->get_var($wpdb->prepare(
      "SELECT COUNT(*) FROM {$wpdb->prefix}pika_reminders WHERE tag_ids IS NOT NULL AND JSON_CONTAINS(tag_ids, %s)",
      json_encode($tag_id)
    ));

    if ($reminder_count > 0) {
      $dependencies[] = "Used in {$reminder_count} reminder(s)";
      $can_delete = false;
      $can_edit = false; // Can't edit if used in reminders
    }

    return [
      'can_edit' => $can_edit,
      'can_delete' => $can_delete,
      'dependencies' => $dependencies
    ];
  }

  /**
   * Clear all system data (development only)
   */
  public function clear_system_data() {
    if (!defined('WP_DEBUG') || !WP_DEBUG) {
      return false;
    }

    global $wpdb;

    try {
      // Clear system categories
      $wpdb->delete($wpdb->prefix . 'pika_categories', ['user_id' => 0]);

      // Clear system tags
      $wpdb->delete($wpdb->prefix . 'pika_tags', ['user_id' => 0]);

      return true;
    } catch (Exception $e) {
      error_log('Pika Clear System Data Error: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Get detailed dependency information for system items
   * 
   * @param string $type 'category' or 'tag'
   * @param int $item_id
   * @return array|WP_Error
   */
  public function get_detailed_dependencies($type, $item_id) {
    global $wpdb;

    $dependencies = [];

    if ($type === 'category') {
      // Check for child categories
      $child_categories = $wpdb->get_results($wpdb->prepare(
        "SELECT id, name FROM {$wpdb->prefix}pika_categories WHERE parent_id = %d",
        $item_id
      ));

      if (!empty($child_categories)) {
        $dependencies['child_categories'] = $child_categories;
      }

      // Check for transactions
      $transactions = $wpdb->get_results($wpdb->prepare(
        "SELECT id, title, amount, date FROM {$wpdb->prefix}pika_transactions WHERE category_id = %d LIMIT 10",
        $item_id
      ));

      if (!empty($transactions)) {
        $dependencies['transactions'] = $transactions;
      }

      // Check for reminders
      $reminders = $wpdb->get_results($wpdb->prepare(
        "SELECT id, title, amount, date FROM {$wpdb->prefix}pika_reminders WHERE category_id = %d LIMIT 10",
        $item_id
      ));

      if (!empty($reminders)) {
        $dependencies['reminders'] = $reminders;
      }
    } elseif ($type === 'tag') {
      // Check for transactions using this tag
      $transactions = $wpdb->get_results($wpdb->prepare(
        "SELECT t.id, t.title, t.amount, t.date FROM {$wpdb->prefix}pika_transactions t 
         INNER JOIN {$wpdb->prefix}pika_transaction_tags tt ON t.id = tt.transaction_id 
         WHERE tt.tag_id = %d LIMIT 10",
        $item_id
      ));

      if (!empty($transactions)) {
        $dependencies['transactions'] = $transactions;
      }

      // Check for reminders using this tag
      $reminders = $wpdb->get_results($wpdb->prepare(
        "SELECT id, title, amount, date FROM {$wpdb->prefix}pika_reminders 
         WHERE tag_ids IS NOT NULL AND JSON_CONTAINS(tag_ids, %s) LIMIT 10",
        json_encode($item_id)
      ));

      if (!empty($reminders)) {
        $dependencies['reminders'] = $reminders;
      }
    }

    return $dependencies;
  }

  /**
   * Clear all user data (development only)
   */
  public function clear_user_data($user_id) {
    if (!defined('WP_DEBUG') || !WP_DEBUG) {
      return false;
    }

    global $wpdb;

    try {
      // Clear user categories
      $wpdb->delete($wpdb->prefix . 'pika_categories', ['user_id' => $user_id]);

      // Clear user tags
      $wpdb->delete($wpdb->prefix . 'pika_tags', ['user_id' => $user_id]);

      // Clear user accounts
      $wpdb->delete($wpdb->prefix . 'pika_accounts', ['user_id' => $user_id]);

      // Clear user people
      $wpdb->delete($wpdb->prefix . 'pika_people', ['user_id' => $user_id]);

      // Clear user transactions
      $wpdb->delete($wpdb->prefix . 'pika_transactions', ['user_id' => $user_id]);

      // Clear user uploads
      $wpdb->delete($wpdb->prefix . 'pika_uploads', ['user_id' => $user_id]);

      // Clear user settings
      $wpdb->delete($wpdb->prefix . 'pika_user_settings', ['user_id' => $user_id]);

      // Clear user reminders
      $wpdb->delete($wpdb->prefix . 'pika_reminders', ['user_id' => $user_id]);

      return true;
    } catch (Exception $e) {
      error_log('Pika Clear User Data Error: ' . $e->getMessage());
      return false;
    }
  }
}
