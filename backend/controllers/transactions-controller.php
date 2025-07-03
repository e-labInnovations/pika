<?php

/**
 * Transactions controller for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Transactions_Controller extends Pika_Base_Controller {

    public $transactions_manager;

    public function __construct() {
        parent::__construct();
        $this->transactions_manager = new Pika_Transactions_Manager();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/transactions', [
            'methods' => 'GET',
            'callback' => [$this, 'get_transactions'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/transactions/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_transaction_by_id'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/transactions', [
            'methods' => 'POST',
            'callback' => [$this, 'create_transaction'],
            'permission_callback' => [$this, 'check_auth']
        ]);

        register_rest_route($this->namespace, '/transactions/(?P<id>\d+)', [
            'methods' => 'PUT',
            'callback' => [$this, 'update_transaction'],
            'permission_callback' => [$this, 'can_edit_transaction']
        ]);

        register_rest_route($this->namespace, '/transactions/(?P<id>\d+)', [
            'methods' => 'DELETE',
            'callback' => [$this, 'delete_transaction'],
            'permission_callback' => [$this, 'can_edit_transaction']
        ]);
    }

    /**
     * Check if user can edit transaction
     */
    public function can_edit_transaction($request) {
        if(!$this->check_auth($request)) {
            return false;
        }

        $transaction_id = $request->get_param('id');
        $transaction = $this->transactions_manager->get_transaction_by_id($transaction_id);
        if (is_wp_error($transaction)) {
            return $transaction;
        }
        return $transaction->user_id === strval(get_current_user_id());
    }

    /**
     * Get transactions
     */
    public function get_transactions($request) {
        $params = $request->get_params();
        $person_id = $params['personId'] ?? null;
        $account_id = $params['accountId'] ?? null;
        $category_id = $params['categoryId'] ?? null;
        $date_from = $params['dateFrom'] ?? null;
        $date_to = $params['dateTo'] ?? null;
        $limit = $params['limit'] ?? null;
        $offset = $params['offset'] ?? null;

        if(!is_null($person_id) && !empty($person_id)) {
            $person_id = intval($person_id);
            $is_valid_person_id = $this->transactions_manager->is_valid_person_id($person_id);
            if(is_wp_error($is_valid_person_id)) {
                return $is_valid_person_id;
            }
        }

        if(!is_null($account_id) && !empty($account_id)) {
            $account_id = intval($account_id);
            $is_valid_account_id = $this->transactions_manager->is_valid_account_id($account_id);
            if(is_wp_error($is_valid_account_id)) {
                return $is_valid_account_id;
            }
        }

        if(!is_null($category_id) && !empty($category_id)) {
            $category_id = intval($category_id);
            $is_valid_category_id = $this->transactions_manager->is_valid_category_id($category_id);
            if(is_wp_error($is_valid_category_id)) {
                return $is_valid_category_id;
            }
        }

        if(!is_null($date_from) && !empty($date_from)) {
            $is_valid_date_from = $this->transactions_manager->sanitize_iso_datetime($date_from);
            if(is_wp_error($is_valid_date_from)) {
                return $is_valid_date_from;
            }
        }

        if(!is_null($date_to) && !empty($date_to)) {
            $is_valid_date_to = $this->transactions_manager->sanitize_iso_datetime($date_to);
            if(is_wp_error($is_valid_date_to)) {
                return $is_valid_date_to;
            }
        }

        if(!is_null($limit) && !empty($limit)) {
            $limit = intval($limit);
        }

        if(!is_null($offset) && !empty($offset)) {
            $offset = intval($offset);
        }

        $transactions = $this->transactions_manager->get_all_transactions($person_id, $account_id, $category_id, $date_from, $date_to, $limit, $offset);
        return $transactions;
    }

    /**
     * Get transaction by id
     */
    public function get_transaction_by_id($request) {
        $transaction_id = $request->get_param('id');
        $transaction = $this->transactions_manager->get_transaction_by_id($transaction_id, true);
        return $transaction;
    }

    /**
     * Create transaction
     * 
     */
    public function create_transaction($request) {
        $params = $request->get_params();
        $title = sanitize_text_field($params['title']??'');
        $amount = sanitize_text_field((float)$params['amount']??0);
        $date = $this->transactions_manager->sanitize_iso_datetime($params['date']??'');
        $type = $this->transactions_manager->sanitize_type($params['type']??'');
        $category_id = sanitize_text_field($params['categoryId']??'');
        $account_id = sanitize_text_field($params['accountId']??'');
        $person_id = $params['personId'] ? sanitize_text_field($params['personId']) : null;
        $to_account_id = sanitize_text_field($params['toAccountId']??'');
        $note = sanitize_text_field($params['note']??'');
        $attachments = $params['attachments']??[];
        $tags = $params['tags']??[];

        if (is_null($title) || empty($title)) {
            return $this->transactions_manager->get_error('invalid_title');
        }

        if (is_null($amount) || empty($amount) || $amount <= 0) {
            return $this->transactions_manager->get_error('invalid_amount');
        }

        if (is_null($date) || empty($date)) {
            return $this->transactions_manager->get_error('invalid_date');
        }

        if (is_null($type)) {
            return $this->transactions_manager->get_error('invalid_type');
        }

        if (is_null($category_id) || empty($category_id) || !$this->transactions_manager->is_valid_category_id($category_id, $type)) {
            return $this->transactions_manager->get_error('invalid_category_id');
        }

        if (is_null($account_id) || empty($account_id) || !$this->transactions_manager->is_valid_account_id($account_id)) {
            return $this->transactions_manager->get_error('invalid_account_id');
        }

        if (!is_null($person_id) && empty($person_id) && !$this->transactions_manager->is_valid_person_id($person_id)) {
            return $this->transactions_manager->get_error('invalid_person_id');
        }

        if (($type === 'transfer') && (is_null($to_account_id) || empty($to_account_id) || !$this->transactions_manager->is_valid_account_id($to_account_id) || $account_id === $to_account_id)) {
            return $this->transactions_manager->get_error('invalid_to_account_id');
        }

        if (!is_null($tags) && !$this->transactions_manager->is_valid_tag_ids($tags)) {
            return $this->transactions_manager->get_error('invalid_tags');
        }

        if (!is_null($attachments) && !$this->transactions_manager->is_valid_attachments($attachments)) {
            return $this->transactions_manager->get_error('invalid_attachments');
        }

        $transaction = $this->transactions_manager->create_transaction($title, $amount, $date, $type, $category_id, $account_id, $person_id, $to_account_id, $note, $attachments, $tags);
        return $transaction;
    }

    /**
     * Update transaction
     */
    public function update_transaction($request) {
        $params = $request->get_params();
        $transaction_id = $request->get_param('id');
        $data = [];
        $format = [];

        $existing_transaction = $this->transactions_manager->get_transaction_by_id($transaction_id, true);
        if (is_wp_error($existing_transaction)) {
            return $existing_transaction;
        }

        $existing_tags = array_map(function($tag) {
            return $tag['id'];
        }, $existing_transaction['tags']);
        $current_attachments = array_map(function($attachment) {
            return $attachment['id'];
        }, $existing_transaction['attachments']);

        $new_tags = [];
        $new_attachments = [];

        if(isset($params['title'])) {
            $data['title'] = sanitize_text_field($params['title']);
            $format['title'] = '%s';
        }
        
        if (isset($params['amount'])) {
            $data['amount'] = sanitize_text_field((float)$params['amount']);
            $format['amount'] = '%f';

            if (is_null($data['amount']) || empty($data['amount']) || $data['amount'] <= 0) {
                return $this->transactions_manager->get_error('invalid_amount');
            }
        }

        if (isset($params['date'])) {
            $data['date'] = $this->transactions_manager->sanitize_iso_datetime($params['date']);
            $format['date'] = '%s';

            if (is_null($data['date']) || empty($data['date'])) {
                return $this->transactions_manager->get_error('invalid_date');
            }
        }

        if (isset($params['type'])) {
            $data['type'] = $this->transactions_manager->sanitize_type($params['type']);
            $format['type'] = '%s';

            if (is_null($data['type']) || empty($data['type'])) {
                return $this->transactions_manager->get_error('invalid_type');
            }
        }

        if (isset($params['categoryId'])) {
            $data['category_id'] = sanitize_text_field($params['categoryId']);
            $format['category_id'] = '%d';

            if (is_null($data['category_id']) || empty($data['category_id']) || !$this->transactions_manager->is_valid_category_id($data['category_id'], $data['type'])) {
                return $this->transactions_manager->get_error('invalid_category_id');
            }
        }

        if (isset($params['accountId'])) {
            $data['account_id'] = sanitize_text_field($params['accountId']);
            $format['account_id'] = '%d';

            if (is_null($data['account_id']) || empty($data['account_id']) || !$this->transactions_manager->is_valid_account_id($data['account_id'])) {
                return $this->transactions_manager->get_error('invalid_account_id');
            }
        }

        if (isset($params['personId'])) {
            $data['person_id'] = sanitize_text_field($params['personId']);
            $format['person_id'] = '%d';

            if (is_null($data['person_id']) || empty($data['person_id']) || !$this->transactions_manager->is_valid_person_id($data['person_id'])) {
                return $this->transactions_manager->get_error('invalid_person_id');
            }
        }

        if ($data['type'] === 'transfer') {
            if (is_null($data['to_account_id']) || empty($data['to_account_id']) || !$this->transactions_manager->is_valid_account_id($data['to_account_id']) || $data['account_id'] === $data['to_account_id']) {
                return $this->transactions_manager->get_error('invalid_to_account_id');
            }
        } else {
            $data['to_account_id'] = null;
            $format['to_account_id'] = '%d';
        }

        if (isset($params['note'])) {
            $data['note'] = sanitize_text_field($params['note']);
            $format['note'] = '%s';
        }

        if (isset($params['attachments'])) {
            $new_attachments = $params['attachments'];

            if (!is_null($new_attachments) && !$this->transactions_manager->is_valid_attachments($new_attachments)) {
                return $this->transactions_manager->get_error('invalid_attachments');
            }
        }

        if (isset($params['tags'])) {
            $new_tags = $params['tags'];

            if (!is_null($new_tags) && !$this->transactions_manager->is_valid_tag_ids($new_tags)) {
                return $this->transactions_manager->get_error('invalid_tags');
            }
        }

        $tags_to_add = array_diff($new_tags, $existing_tags);
        $tags_to_remove = array_diff($existing_tags, $new_tags);
        $attachments_to_add = array_diff($new_attachments, $current_attachments);
        $attachments_to_remove = array_diff($current_attachments, $new_attachments);

        if (empty($data) && empty($tags_to_add) && empty($tags_to_remove) && empty($attachments_to_add) && empty($attachments_to_remove)) {
            return $this->transactions_manager->get_error('no_update');
        }

        $transaction = $this->transactions_manager->update_transaction($transaction_id, $data, $format, $tags_to_add, $tags_to_remove, $attachments_to_add, $attachments_to_remove);
        return $transaction;
    }

    /**
     * Delete transaction
     */
    public function delete_transaction($request) {
        $transaction_id = $request->get_param('id');
        $transaction = $this->transactions_manager->delete_transaction($transaction_id);
        if (is_wp_error($transaction)) {
            return $transaction;
        }

        return ['message' => 'Transaction deleted successfully'];
    }
}
