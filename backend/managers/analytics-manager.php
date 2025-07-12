<?php

/**
 * Analytics manager for Pika plugin
 * 
 * @package Pika
 */

Pika_Utils::reject_abs_path();

class Pika_Analytics_Manager extends Pika_Base_Manager {
    protected $category_table_name = 'categories';
    protected $transaction_table_name = 'transactions';
    protected $tags_table_name = 'tags';
    protected $accounts_table_name = 'accounts';
    protected $people_table_name = 'people';

    protected $errors = [
        'invalid_month' => ['message' => 'Invalid month, month must be a number between 1 and 12.', 'status' => 400],
        'invalid_year' => ['message' => 'Invalid year, year must be a number.', 'status' => 400],
    ];

    public function __construct() {
        parent::__construct();
    }

    public function sanitize_month($month) {
        $month = intval($month);
        if (!is_numeric($month) || $month < 1 || $month > 12) {
            return $this->get_error('invalid_month');
        }
        return $month;
    }

    public function sanitize_year($year) {
        $year = intval($year);
        if (!is_numeric($year)) {
            return $this->get_error('invalid_year');
        }
        return $year;
    }

    /**
     * Get the summary of a specific account
     * 
     * @param int $account_id
     * @return object|WP_Error
     */
    public function get_account_summary($account_id) {
        $transactions_table = $this->get_table_name($this->transaction_table_name);

        $sql = $this->db()->prepare("
SELECT 
    COALESCE(SUM(
        CASE 
            WHEN t.type = 'income' AND t.account_id = %d THEN t.amount
            WHEN t.type = 'expense' AND t.account_id = %d THEN -t.amount
            WHEN t.type = 'transfer' AND t.account_id = %d THEN -t.amount
            WHEN t.type = 'transfer' AND t.to_account_id = %d THEN t.amount
            ELSE 0
        END
    ), 0) AS balance
FROM 
    {$transactions_table} t
WHERE 
    (t.account_id = %d OR t.to_account_id = %d) 
    AND t.is_active = 1;", $account_id, $account_id, $account_id, $account_id, $account_id, $account_id);
        $account = $this->db()->get_row($sql);
        if (is_wp_error($account)) {
            return $this->get_error('db_error');
        }
        return $account;
    }

    /**
     * Get the summary of all people
     * 
     * @param int $person_id
     * @return array|WP_Error
     */
    public function get_person_summary($person_id) {
        $people_table = $this->get_table_name($this->people_table_name);
        $transactions_table = $this->get_table_name($this->transaction_table_name);
        $user_id = get_current_user_id();

        $sql = $this->db()->prepare("
SELECT 
    p.id AS person_id,
    p.name AS person_name,
    COUNT(t.id) AS total_transactions,
    MAX(t.date) AS last_transaction_at,
    COALESCE(SUM(
        CASE 
            WHEN t.type = 'income' THEN t.amount
            WHEN t.type = 'expense' THEN -t.amount
            ELSE 0
        END
    ), 0) AS balance
FROM 
    {$people_table} p
LEFT JOIN 
    {$transactions_table} t
    ON t.person_id = p.id
    AND t.is_active = 1
    AND t.user_id = %d
WHERE 
    p.user_id = %d
    AND p.id = %d
GROUP BY 
    p.id, p.name
ORDER BY 
    p.name;", $user_id, $user_id, $person_id);
        $person = $this->db()->get_row($sql);
        if (is_wp_error($person)) {
            return $this->get_error('db_error');
        }
        return $person;
    }

    /**
     * Get the total summary of a specific person
     * 
     * @param int $person_id
     * @return array|WP_Error
     */
    public function get_person_total_summary($person_id) {
        $transactions_table = $this->get_table_name($this->transaction_table_name);

        $sql = $this->db()->prepare("
SELECT
  SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_spent,
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_received
FROM
  {$transactions_table}
WHERE
  person_id = %d AND is_active = 1;", $person_id);
        $person_total_summary = $this->db()->get_row($sql);
        if (is_wp_error($person_total_summary)) {
            return $this->get_error('db_error');
        }
        return $person_total_summary;
    }

    /**
     * Get the weekly expenses
     * 
     * @return array|WP_Error
     */
    public function get_weekly_expenses() {
        $transactions_table = $this->get_table_name($this->transaction_table_name);
        $user_id = get_current_user_id();

        $sql = $this->db()->prepare("
SELECT
    COALESCE(SUM(CASE WHEN DAYOFWEEK(date) = 2 THEN amount END), 0) AS mon,
    COALESCE(SUM(CASE WHEN DAYOFWEEK(date) = 3 THEN amount END), 0) AS tue,
    COALESCE(SUM(CASE WHEN DAYOFWEEK(date) = 4 THEN amount END), 0) AS wed,
    COALESCE(SUM(CASE WHEN DAYOFWEEK(date) = 5 THEN amount END), 0) AS thu,
    COALESCE(SUM(CASE WHEN DAYOFWEEK(date) = 6 THEN amount END), 0) AS fri,
    COALESCE(SUM(CASE WHEN DAYOFWEEK(date) = 7 THEN amount END), 0) AS sat,
    COALESCE(SUM(CASE WHEN DAYOFWEEK(date) = 1 THEN amount END), 0) AS sun
FROM 
    {$transactions_table}
WHERE 
    user_id = %d
    AND is_active = 1
    AND type = 'expense'
    AND DATE(date) BETWEEN CURDATE() - INTERVAL (WEEKDAY(CURDATE()) + 6) DAY
                         AND CURDATE() + INTERVAL (6 - WEEKDAY(CURDATE())) DAY;", $user_id);
        $weekly_expenses_data = $this->db()->get_row($sql);
        if (is_wp_error($weekly_expenses_data)) {
            return $this->get_error('db_error');
        }

        $weekly_expenses = [
            'mon' => $weekly_expenses_data->mon,
            'tue' => $weekly_expenses_data->tue,
            'wed' => $weekly_expenses_data->wed,
            'thu' => $weekly_expenses_data->thu,
            'fri' => $weekly_expenses_data->fri,
            'sat' => $weekly_expenses_data->sat,
            'sun' => $weekly_expenses_data->sun,
        ];
        return $weekly_expenses;
    }

    /**
     * Get the monthly expenses
     * Not used anymore, use get_monthly_summary instead
     * 
     * @return array|WP_Error
     */
    public function get_monthly_expenses() {
        $transactions_table = $this->get_table_name($this->transaction_table_name);
        $user_id = get_current_user_id();

        // Get date range from transactions
        $range_sql = $this->db()->prepare(
            "SELECT 
                MIN(DATE(date)) AS start_date,
                MAX(DATE(date)) AS end_date
            FROM {$transactions_table}
            WHERE user_id = %d AND is_active = 1",
            $user_id
        );
        $range = $this->db()->get_row($range_sql);
        if (is_wp_error($range)) {
            return $this->get_error('db_error');
        }

        // If no transactions exist yet, return empty array
        if (!$range || !$range->start_date) {
            return [];
        }

        $start = new DateTime($range->start_date);
        $end = new DateTime();

        // Generate array of all months between start and end dates
        $period = new DatePeriod($start, new DateInterval('P1M'), $end);
        $allMonths = [];
        foreach ($period as $dt) {
            $allMonths[] = [
                'year' => (int)$dt->format('Y'),
                'month' => (int)$dt->format('n'),
                'monthName' => $dt->format('F'),
                'label' => $dt->format('M Y')
            ];
        }

        // Get transaction totals grouped by month
        $sql = $this->db()->prepare(
            "SELECT
                YEAR(date) AS year,
                MONTH(date) AS month,
                DATE_FORMAT(date, '%M') AS monthName,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS balance,
                COUNT(id) AS transactionCount
            FROM {$transactions_table}
            WHERE user_id = %d
              AND is_active = 1
            GROUP BY YEAR(date), MONTH(date), monthName
            ORDER BY YEAR(date), MONTH(date)",
            $user_id
        );
        $rawResults = $this->db()->get_results($sql);
        if (is_wp_error($rawResults)) {
            return $this->get_error('db_error');
        }

        // Index results by year-month for easier lookup
        $indexedResults = [];
        foreach ($rawResults as $row) {
            $key = $row->year . '-' . $row->month;
            $indexedResults[$key] = [
                'year' => (int)$row->year,
                'month' => (int)$row->month,
                'monthName' => $row->monthName,
                'income' => (float)$row->income,
                'expenses' => (float)$row->expenses,
                'balance' => (float)$row->balance,
                'transactionCount' => (int)$row->transactionCount,
            ];
        }

        // Merge results with all months, filling in zeros for months with no data
        $finalData = [];
        foreach ($allMonths as $m) {
            $key = $m['year'] . '-' . $m['month'];
            $finalData[] = isset($indexedResults[$key])
                ? $indexedResults[$key]
                : [
                    'year' => $m['year'],
                    'month' => $m['month'],
                    'monthName' => $m['monthName'],
                    'income' => 0,
                    'expenses' => 0,
                    'balance' => 0,
                    'transactionCount' => 0,
                ];
        }

        return $finalData;
    }

    public function get_monthly_summary($month, $year) {
        $transactions_table = $this->get_table_name($this->transaction_table_name);
        $user_id = get_current_user_id();
        $start_date = date('Y-m-01', strtotime("$year-$month-01"));
        $end_date = date('Y-m-t', strtotime($start_date));
        $monthName = date('F', strtotime($start_date));
        $year = intval(date('Y', strtotime($start_date)));

        $sql = $this->db()->prepare("
        SELECT 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses,
            COUNT(*) AS transactionCount,
            COUNT(DISTINCT DATE(`date`)) AS activeDays
        FROM {$transactions_table}
        WHERE user_id = %d
            AND is_active = 1
            AND `date` BETWEEN %s AND %s
      ", $user_id, $start_date, $end_date);

        $row = $this->db()->get_row($sql, ARRAY_A);
        if (is_wp_error($row)) {
            return $this->get_error('db_error');
        }

        $income = floatval($row['income']);
        $expenses = floatval($row['expenses']);
        $balance = $income - $expenses;
        $transactionCount = intval($row['transactionCount']);
        $activeDays = max(intval($row['activeDays']), 1); // Avoid division by zero

        $savingsRate = $income > 0 ? ($balance / $income) * 100 : 0;
        $avgDaily = $expenses / $activeDays;

        $result = [
            'year' => $year,
            'month' => $month,
            'monthName' => $monthName,
            'income' => $income,
            'expenses' => $expenses,
            'balance' => $balance,
            'transactionCount' => $transactionCount,
            'savingsRate' => round($savingsRate, 2),
            'avgDaily' => round($avgDaily, 2),
        ];

        return rest_ensure_response($result);
    }

    public function get_daily_expenses($month, $year) {
        $transactions_table = $this->get_table_name($this->transaction_table_name);
        $user_id = get_current_user_id();
        $start_date = date('Y-m-01', strtotime("$year-$month-01"));
        $end_date = date('Y-m-t', strtotime($start_date)); // last day of month

        $sql = $this->db()->prepare("
        SELECT 
            DATE(`date`) AS date,
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses,
            SUM(CASE WHEN type = 'transfer' THEN amount ELSE 0 END) AS transfers,
            COUNT(*) AS transactionCount
        FROM {$transactions_table}
        WHERE user_id = %d
            AND is_active = 1
            AND `date` BETWEEN %s AND %s
        GROUP BY DATE(`date`)
        ORDER BY DATE(`date`) ASC;
    ", $user_id, $start_date, $end_date);

        $results = $this->db()->get_results($sql, ARRAY_A);

        $data = [];

        // Create zero-filled entries for all days in the month
        $period = new DatePeriod(
            new DateTime($start_date),
            new DateInterval('P1D'),
            (new DateTime($end_date))->modify('+1 day')
        );

        foreach ($period as $date) {
            $key = $date->format('Y-m-d');
            $data[$key] = [
                'date' => $key,
                'balance' => 0.0,
                'income' => 0.0,
                'expenses' => 0.0,
                'transfers' => 0.0,
                'transactionCount' => 0,
            ];
        }

        foreach ($results as $row) {
            $key = $row['date'];
            $balance = floatval($row['income']) - floatval($row['expenses']) - floatval($row['transfers']);
            $data[$key] = [
                'date' => $key,
                'income' => floatval($row['income']),
                'expenses' => floatval($row['expenses']),
                'transfers' => floatval($row['transfers']),
                'balance' => $balance,
                'transactionCount' => intval($row['transactionCount']),
            ];
        }

        $meta = [
            'month' => date('F', strtotime($start_date)),
            'year' => intval(date('Y', strtotime($start_date))),
        ];

        return [
            'data' => $data,
            'meta' => $meta,
        ];
    }
}
