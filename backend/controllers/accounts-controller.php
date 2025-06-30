<?php

/**
 * Accounts controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Accounts_Controller extends Pika_Base_Controller {

    public $accounts_manager;

    public function __construct() {
        parent::__construct();
        $this->accounts_manager = new Pika_Accounts_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/accounts', [
            'methods' => 'GET',
            'callback' => [$this, 'get_accounts'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/accounts', [
            'methods' => 'POST',
            'callback' => [$this, 'create_account'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/accounts/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_account'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/accounts/(?P<id>\d+)', [
            'methods' => 'PUT',
            'callback' => [$this, 'update_account'],
            'permission_callback' => [$this, 'can_edit_account']
        ]);

        register_rest_route($this->namespace, '/accounts/(?P<id>\d+)', [
            'methods' => 'DELETE',
            'callback' => [$this, 'delete_account'],
            'permission_callback' => [$this, 'can_edit_account']
        ]);
    }

    /**
     * Check if user can edit account
     * 
     * @param WP_REST_Request $request
     * @return bool|WP_Error
     */
    public function can_edit_account($request) {
        $account_id = $request->get_param('id');
        $account = $this->accounts_manager->get_account_by_id($account_id);
        if (is_wp_error($account)) {
            return $account;
        }

        if ($account->user_id !== strval(get_current_user_id())) {
            return $this->get_error('unauthorized');
        }

        return true;
    }

    public function get_accounts($request) {
        $accounts = $this->accounts_manager->get_all_accounts();
        if (is_wp_error($accounts)) {
            return $accounts;
        }

        return $accounts;
    }

    public function create_account($request) {
        $name = sanitize_text_field($request->get_param('name') ?? '');
        $description = sanitize_text_field($request->get_param('description') ?? '');
        $avatar_id = $request->get_param('avatarId') ?? null;
        $icon = $this->accounts_manager->sanitize_icon($request->get_param('icon') ?? 'wallet');
        $bg_color = $this->accounts_manager->sanitize_color($request->get_param('bgColor') ?? '#3B82F6');
        $color = $this->accounts_manager->sanitize_color($request->get_param('color') ?? '#ffffff');

        if (is_null($name) || empty($name)) {
            return $this->accounts_manager->get_error('invalid_name');
        }

        if (is_null($icon)) {
            return $this->accounts_manager->get_error('invalid_icon');
        }

        if (is_null($bg_color)) {
            return $this->accounts_manager->get_error('invalid_bg_color');
        }

        if (is_null($color)) {
            return $this->accounts_manager->get_error('invalid_color');
        }

        if (!$this->accounts_manager->is_account_name_unique($name)) {
            return $this->accounts_manager->get_error('account_name_not_unique');
        }

        if (!is_null($avatar_id) && !$this->accounts_manager->is_valid_avatar_id($avatar_id)) {
            return $this->accounts_manager->get_error('invalid_avatar_id');
        }

        $account = $this->accounts_manager->create_account($name, $description, $avatar_id, $icon, $bg_color, $color);

        return $account;
    }

    public function get_account($request) {
        $account_id = $request->get_param('id');
        $account = $this->accounts_manager->get_account_by_id($account_id, true);

        return $account;
    }

    public function update_account($request) {
        $account_id = $request->get_param('id');
        $params = $request->get_params();
        $data = [];
        $format = [];

        if(isset($params['name'])) {
            $data['name'] = sanitize_text_field($params['name']);
            $format['name'] = '%s';

            if (!$this->accounts_manager->is_account_name_unique($params['name'], $account_id)) {
                return $this->accounts_manager->get_error('account_name_not_unique');
            }
        }

        if(isset($params['description'])) {
            $data['description'] = sanitize_text_field($params['description']);
            $format['description'] = '%s';
        }

        if(isset($params['avatarId'])) {
            $data['avatar_id'] = $params['avatarId'];
            $format['avatar_id'] = '%d';

            if (!$this->accounts_manager->is_valid_avatar_id($params['avatarId'])) {
                return $this->accounts_manager->get_error('invalid_avatar_id');
            }
        } else if(is_null($params['avatarId'])) {
            $data['avatar_id'] = null;
            $format['avatar_id'] = '%d';
        }

        if(isset($params['icon'])) {
            $data['icon'] = $this->accounts_manager->sanitize_icon($params['icon']);
            $format['icon'] = '%s';

            if (is_null($params['icon'])) {
                return $this->accounts_manager->get_error('invalid_icon');
            }
        }

        if(isset($params['bgColor'])) {
            $data['bg_color'] = $this->accounts_manager->sanitize_color($params['bgColor']);
            $format['bg_color'] = '%s';

            if (is_null($params['bgColor'])) {
                return $this->accounts_manager->get_error('invalid_bg_color');
            }
        }

        if(isset($params['color'])) {
            $data['color'] = $this->accounts_manager->sanitize_color($params['color']);
            $format['color'] = '%s';

            if (is_null($params['color'])) {
                return $this->accounts_manager->get_error('invalid_color');
            }
        }

        if(empty($data)) {
            return $this->accounts_manager->get_error('no_update');
        }

        $account = $this->accounts_manager->update_account($account_id, $data, $format);
        return $account;
    }

    public function delete_account($request) {
        $account_id = $request->get_param('id');

        if ($this->accounts_manager->account_has_transactions($account_id)) {
            return $this->accounts_manager->get_error('account_has_transactions');
        }

        $result = $this->accounts_manager->delete_account($account_id);
        if (is_wp_error($result)) {
            return $result;
        }
        return ['message' => 'Account deleted successfully'];
    }
}
