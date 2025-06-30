<?php

/**
 * People controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_People_Controller extends Pika_Base_Controller {

    public $people_manager;

    public function __construct() {
        parent::__construct();
        $this->people_manager = new Pika_People_Manager();
    }

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
            'permission_callback' => [$this, 'can_edit_person']
        ]);

        register_rest_route($this->namespace, '/people/(?P<id>\d+)', [
            'methods' => 'DELETE',
            'callback' => [$this, 'delete_person'],
            'permission_callback' => [$this, 'can_edit_person']
        ]);
    }

    /**
     * Can edit person
     */
    public function can_edit_person($request) {
        if (!$this->check_auth()) {
            return false;
        }

        $person_id = $request->get_param('id');
        $person = $this->people_manager->get_person($person_id);
        if(is_wp_error($person)) {
            return false;
        }

        return $person->user_id === strval(get_current_user_id());
    }

    /**
     * Get all people
     */
    public function get_people($request) {
        $people = $this->people_manager->get_all_people();
        return $people;
    }

    /**
     * Create new person
     */
    public function create_person($request) {
        $params = $request->get_params();
        $name = sanitize_text_field($params['name'] ?? "");
        $email = sanitize_email($params['email'] ?? "");
        $phone = sanitize_text_field($params['phone'] ?? "");
        $avatar_id = $params['avatarId'] ?? null;
        $description = sanitize_text_field($params['description'] ?? "");
        
        if (is_null($name) || empty($name)) {
            return $this->people_manager->get_error('invalid_name');
        }

        if (isset($email) && !is_email($email)) {
            return $this->people_manager->get_error('invalid_email');
        }

        if (isset($avatar_id) && !$this->people_manager->is_valid_avatar_id($avatar_id)) {
            return $this->people_manager->get_error('invalid_avatar');
        }

        if ($this->people_manager->is_person_exists($name, $email)) {
            return $this->people_manager->get_error('person_already_exists');
        }

        return $this->people_manager->create_person($name, $email, $phone, $avatar_id, $description);
    }

    /**
     * Get single person
     */
    public function get_person($request) {
        $person_id = $request->get_param('id');
        $person = $this->people_manager->get_person($person_id, true);
        return $person;
    }

    /**
     * Update person
     */
    public function update_person($request) {
        $params = $request->get_params();
        $data = [];
        $format = [];

        $existing_person = $this->people_manager->get_person($request->get_param('id'));
        if(is_wp_error($existing_person)) {
            return $existing_person;
        }

        if(isset($params['name'])) {
            $data['name'] = sanitize_text_field($params['name']);
            $format['name'] = '%s';
        }

        if(isset($params['email'])) {
            $data['email'] = sanitize_email($params['email']);
            $format['email'] = '%s';
        }

        if(isset($params['phone'])) {
            $data['phone'] = sanitize_text_field($params['phone']);
            $format['phone'] = '%s';
        }

        if(isset($params['avatarId'])) {
            $data['avatar_id'] = $params['avatarId'];
            $format['avatar_id'] = '%d';

            if (!$this->people_manager->is_valid_avatar_id($data['avatar_id'])) {
                return $this->people_manager->get_error('invalid_avatar');
            }
        }

        if(isset($params['description'])) {
            $data['description'] = sanitize_text_field($params['description']);
            $format['description'] = '%s';
        }

        if(count($data) === 0) {
            return $this->people_manager->get_error('no_update');
        }

        if($this->people_manager->is_person_exists($data['name']??$existing_person->name, $data['email']??$existing_person->email, $request->get_param('id'))) {
            return $this->people_manager->get_error('person_already_exists');
        }

        return $this->people_manager->update_person($request->get_param('id'), $data, $format);
    }

    /**
     * Delete person
     */
    public function delete_person($request) {
        $person_id = $request->get_param('id');
        $person = $this->people_manager->get_person($person_id);
        if(is_wp_error($person)) {
            return $person;
        }

        if($this->people_manager->person_has_transactions($person_id)) {
            return $this->people_manager->get_error('person_has_transactions');
        }

        $result = $this->people_manager->delete_person($person_id);
        if(is_wp_error($result)) {
            return $result;
        }

        return ['message' => 'Person deleted successfully'];
    }
}
