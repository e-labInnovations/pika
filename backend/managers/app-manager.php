<?php

/**
 * App manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_App_Manager extends Pika_Base_Manager {

  protected $auth_manager;
  protected $categories_manager;
  protected $accounts_manager;
  protected $people_manager;
  protected $tags_manager;

  protected $errors = [
    'app_info_not_found' => ['message' => 'App info not found', 'status' => 404],
  ];

  public function __construct() {
    parent::__construct();
    $this->auth_manager = new Pika_Auth_Manager();
    $this->categories_manager = new Pika_Categories_Manager();
    $this->accounts_manager = new Pika_Accounts_Manager();
    $this->people_manager = new Pika_People_Manager();
    $this->tags_manager = new Pika_Tags_Manager();
  }

  /**
   * Get app_details
   */
  public function get_app_details() {
    $plugin_data = get_plugin_data(PIKA_PLUGIN_PATH . 'pika.php');
    return [
      'name' => $plugin_data['Name'],
      'version' => $plugin_data['Version'],
      'description' => $plugin_data['Description'],
      'app_id' => $this->auth_manager->get_app_id(),
      'base_url' => get_site_url(),
    ];
  }

  /**
   * Get the lists of categories, accounts, people and tags
   */
  public function get_app_lists() {
    $categories = $this->categories_manager->get_all_categories();
    $accounts = $this->accounts_manager->get_all_accounts();
    $people = $this->people_manager->get_all_people();
    $tags = $this->tags_manager->get_all_tags();

    if (is_wp_error($categories) || is_wp_error($accounts) || is_wp_error($people) || is_wp_error($tags)) {
      return $this->get_error('db_error');
    }

    return [
      'categories' => $categories,
      'accounts' => $accounts,
      'people' => $people,
      'tags' => $tags,
    ];
  }
}
