<?php
/**
 * People controller for Pika plugin
 * 
 * @package Pika
 */

if (!defined('ABSPATH')) {
    exit;
}

class Pika_People_Controller extends Pika_Base_Controller {
    
    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/people', [
            'methods' => 'GET',
            'callback' => [$this, 'get_people'],
            'permission_callback' => [$this, 'check_auth']
        ]);
        
        register_rest_route($this->namespace, '/people', [
            'methods' => 'POST',
            'callback' => [$this, 'create_person'],
            'permission_callback' => [$this, 'check_auth']
        ]);
        
        register_rest_route($this->namespace, '/people/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_person'],
            'permission_callback' => [$this, 'check_auth']
        ]);
        
        register_rest_route($this->namespace, '/people/(?P<id>\d+)', [
            'methods' => 'PUT',
            'callback' => [$this, 'update_person'],
            'permission_callback' => [$this, 'check_auth']
        ]);
        
        register_rest_route($this->namespace, '/people/(?P<id>\d+)', [
            'methods' => 'DELETE',
            'callback' => [$this, 'delete_person'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }
    
    /**
     * Get all people
     */
    public function get_people($request) {
        // TODO: Implement get people logic
        return [];
    }
    
    /**
     * Create new person
     */
    public function create_person($request) {
        // TODO: Implement create person logic
        return [];
    }
    
    /**
     * Get single person
     */
    public function get_person($request) {
        // TODO: Implement get person logic
        return [];
    }
    
    /**
     * Update person
     */
    public function update_person($request) {
        // TODO: Implement update person logic
        return [];
    }
    
    /**
     * Delete person
     */
    public function delete_person($request) {
        // TODO: Implement delete person logic
        return [];
    }
} 