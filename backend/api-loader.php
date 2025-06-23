<?php
/**
 * API loader for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_API_Loader {
    
    /**
     * Initialize the API loader
     */
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }
    
    /**
     * Register all API routes
     */
    public function register_routes() {
        // Load controllers
        $this->load_controllers();
        
        // Register routes
        $this->register_auth_routes();
        $this->register_accounts_routes();
        $this->register_people_routes();
        $this->register_categories_routes();
        $this->register_tags_routes();
        $this->register_transactions_routes();
        $this->register_analytics_routes();
        $this->register_upload_routes();
        $this->register_settings_routes();
    }
    
    /**
     * Load controller files
     */
    private function load_controllers() {
        require_once PIKA_PLUGIN_PATH . 'backend/controllers/base-controller.php';
        require_once PIKA_PLUGIN_PATH . 'backend/controllers/auth-controller.php';
        require_once PIKA_PLUGIN_PATH . 'backend/controllers/accounts-controller.php';
        require_once PIKA_PLUGIN_PATH . 'backend/controllers/people-controller.php';
        require_once PIKA_PLUGIN_PATH . 'backend/controllers/categories-controller.php';
        require_once PIKA_PLUGIN_PATH . 'backend/controllers/tags-controller.php';
        require_once PIKA_PLUGIN_PATH . 'backend/controllers/transactions-controller.php';
        require_once PIKA_PLUGIN_PATH . 'backend/controllers/analytics-controller.php';
        require_once PIKA_PLUGIN_PATH . 'backend/controllers/upload-controller.php';
        require_once PIKA_PLUGIN_PATH . 'backend/controllers/settings-controller.php';
    }
    
    /**
     * Register authentication routes
     */
    private function register_auth_routes() {
        $auth_controller = new Pika_Auth_Controller();
        $auth_controller->register_routes();
    }
    
    /**
     * Register accounts routes
     */
    private function register_accounts_routes() {
        $accounts_controller = new Pika_Accounts_Controller();
        $accounts_controller->register_routes();
    }
    
    /**
     * Register people routes
     */
    private function register_people_routes() {
        $people_controller = new Pika_People_Controller();
        $people_controller->register_routes();
    }
    
    /**
     * Register categories routes
     */
    private function register_categories_routes() {
        $categories_controller = new Pika_Categories_Controller();
        $categories_controller->register_routes();
    }
    
    /**
     * Register tags routes
     */
    private function register_tags_routes() {
        $tags_controller = new Pika_Tags_Controller();
        $tags_controller->register_routes();
    }
    
    /**
     * Register transactions routes
     */
    private function register_transactions_routes() {
        $transactions_controller = new Pika_Transactions_Controller();
        $transactions_controller->register_routes();
    }
    
    /**
     * Register analytics routes
     */
    private function register_analytics_routes() {
        $analytics_controller = new Pika_Analytics_Controller();
        $analytics_controller->register_routes();
    }
    
    /**
     * Register upload routes
     */
    private function register_upload_routes() {
        $upload_controller = new Pika_Upload_Controller();
        $upload_controller->register_routes();
    }
    
    /**
     * Register settings routes
     */
    private function register_settings_routes() {
        $settings_controller = new Pika_Settings_Controller();
        $settings_controller->register_routes();
    }
} 