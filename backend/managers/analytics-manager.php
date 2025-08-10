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
    protected $transaction_tags_table_name = 'transaction_tags';
    protected $accounts_table_name = 'accounts';
    protected $people_table_name = 'people';

    protected $upload_manager;
    protected $settings_manager;

    protected $errors = [
        'invalid_month' => ['message' => 'Invalid month, month must be a number between 1 and 12.', 'status' => 400],
        'invalid_year' => ['message' => 'Invalid year, year must be a number.', 'status' => 400],
    ];

    public function __construct() {
        parent::__construct();
        $this->upload_manager = new Pika_Upload_Manager();
        $this->settings_manager = new Pika_Settings_Manager();
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
     * Get start and end of month in user's timezone, then convert to UTC
     *
     * @param int $year Full year (e.g. 2025)
     * @param int $month 1–12 (e.g. 7 for July)
     * @return array|null ['start' => string, 'end' => string] in UTC ISO 8601, or null if invalid
     */
    private function get_month_utc_boundaries($year, $month) {
        $user_timezone = $this->settings_manager->get_settings_item(get_current_user_id(), 'timezone');
        try {
            $tz = new DateTimeZone($user_timezone);

            // Start of month in user timezone
            $start_local = new DateTimeImmutable("{$year}-{$month}-01 00:00:00", $tz);

            // End of month in user timezone (start of next month for cleaner boundary logic)
            $end_local = $start_local->modify('first day of next month')->setTime(0, 0, 0);

            // Convert to UTC
            $start_utc = $start_local->setTimezone(new DateTimeZone('UTC'));
            $end_utc = $end_local->setTimezone(new DateTimeZone('UTC'));

            return [
                'start' => $start_utc->format('Y-m-d H:i:s'),
                'end'   => $end_utc->format('Y-m-d H:i:s'),
            ];
        } catch (Exception $e) {
            return null;
        }
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
     * Get the last 7 days of expenses ending with today in user's timezone
     * 
     * @return object|WP_Error
     */
    public function get_weekly_expenses() {
        $transactions_table = $this->get_table_name($this->transaction_table_name);
        $user_id = get_current_user_id();
        $user_timezone = $this->settings_manager->get_settings_item($user_id, 'timezone') ?: 'UTC';

        // Current date/time in user's timezone
        $now_user_tz = new DateTime('now', new DateTimeZone($user_timezone));

        // Start: 6 days ago at 00:00:00
        $start_user_tz = (clone $now_user_tz)->modify('-6 days')->setTime(0, 0, 0);
        // End: today at 23:59:59
        $end_user_tz = (clone $now_user_tz)->setTime(23, 59, 59);

        // Convert to UTC for DB query
        $start_utc = (clone $start_user_tz)->setTimezone(new DateTimeZone('UTC'));
        $end_utc = (clone $end_user_tz)->setTimezone(new DateTimeZone('UTC'));

        // Query totals per local day
        $sql = $this->db()->prepare("
            SELECT 
                DATE(CONVERT_TZ(date, '+00:00', %s)) AS day_local,
                COALESCE(SUM(amount), 0) AS total
            FROM {$transactions_table}
            WHERE user_id = %d
            AND is_active = 1
            AND type = 'expense'
            AND date BETWEEN %s AND %s
            GROUP BY day_local
        ", $this->utils->get_gmt_offset_str($user_timezone), $user_id, $start_utc->format('Y-m-d H:i:s'), $end_utc->format('Y-m-d H:i:s'));

        $results = $this->db()->get_results($sql, OBJECT_K);
        if (is_wp_error($results)) {
            return $this->get_error('db_error');
        }

        // Map: Sun, Mon, ...
        $days_map = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

        // Build final object in chronological order (6 days ago → today)
        $final = [];
        for ($i = 0; $i < 7; $i++) {
            $date_str = (clone $start_user_tz)->modify("+{$i} days")->format('Y-m-d');
            $weekday_index = (int) (new DateTime($date_str, new DateTimeZone($user_timezone)))->format('w');
            $day_key = $days_map[$weekday_index];
            $final[$day_key] = isset($results[$date_str]) ? (float) $results[$date_str]->total : 0.0;
        }

        return (object) $final;
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
        $date_boundaries = $this->get_month_utc_boundaries($year, $month);
        if (is_null($date_boundaries)) {
            return $this->get_error('unknown');
        }

        $transactions_table = $this->get_table_name($this->transaction_table_name);
        $user_id = get_current_user_id();
        $start_date = $date_boundaries['start'];
        $end_date = $date_boundaries['end'];
        $monthName = date('F', strtotime("$year-$month-01"));
        $year = intval($year);

        $sql = $this->db()->prepare("
        SELECT 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses,
            COUNT(*) AS transactionCount,
            COUNT(DISTINCT DATE(`date`)) AS activeDays,
            SUM(CASE WHEN type = 'income' THEN 1 ELSE 0 END) AS incomeTransactionCount,
            SUM(CASE WHEN type = 'expense' THEN 1 ELSE 0 END) AS expenseTransactionCount
        FROM {$transactions_table}
        WHERE user_id = %d
            AND is_active = 1
            AND `date` >= %s AND `date` < %s
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
            'incomeTransactionCount' => intval($row['incomeTransactionCount']),
            'expenseTransactionCount' => intval($row['expenseTransactionCount']),
        ];

        return rest_ensure_response($result);
    }

    public function get_daily_summaries($month, $year) {
        $user_id = get_current_user_id();
        $user_timezone = $this->settings_manager->get_settings_item($user_id, 'timezone');
        $date_boundaries = $this->get_month_utc_boundaries($year, $month);
        if (is_null($date_boundaries)) {
            return $this->get_error('unknown');
        }

        $transactions_table = $this->get_table_name($this->transaction_table_name);
        $start_date_utc = $date_boundaries['start'];
        $end_date_utc = $date_boundaries['end'];

        $sql = $this->db()->prepare("
        SELECT 
            DATE(CONVERT_TZ(`date`, '+00:00', %s)) AS local_date,
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses,
            SUM(CASE WHEN type = 'transfer' THEN amount ELSE 0 END) AS transfers,
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS balance,
            COUNT(*) AS transactionCount,
            COUNT(CASE WHEN type = 'income' THEN 1 END) AS incomeTransactionCount,
            COUNT(CASE WHEN type = 'expense' THEN 1 END) AS expenseTransactionCount,
            COUNT(CASE WHEN type = 'transfer' THEN 1 END) AS transferTransactionCount
        FROM {$transactions_table}
        WHERE user_id = %d
            AND is_active = 1
            AND `date` >= %s AND `date` < %s
        GROUP BY local_date
        ORDER BY local_date ASC
        ", $user_timezone, $user_id, $start_date_utc, $end_date_utc, $user_timezone, $user_timezone);

        $results = $this->db()->get_results($sql, ARRAY_A);
        if (is_wp_error($results)) {
            return $this->get_error('db_error');
        }

        // Build zero-filled summary for each day of the month in user's timezone
        $data = [];
        try {
            $tz = new DateTimeZone($user_timezone);

            // Create DatePeriod directly for the requested month (avoid double timezone conversion)
            $start_local = new DateTimeImmutable("{$year}-{$month}-01 00:00:00", $tz);
            $end_boundary = $start_local->modify('first day of next month'); // Start of next month

            $period = new DatePeriod(
                $start_local,
                new DateInterval('P1D'),
                $end_boundary // DatePeriod excludes this end date
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
                    'incomeTransactionCount' => 0,
                    'expenseTransactionCount' => 0,
                    'transferTransactionCount' => 0,
                ];
            }
        } catch (Exception $e) {
            return $this->get_error('unknown');
        }

        foreach ($results as $row) {
            $key = $row['local_date'];

            // Guard against duplicate dates (defensive programming)
            if (isset($data[$key]) && $data[$key]['transactionCount'] > 0) {
                error_log("Warning: Duplicate date entry found for: $key - this should not happen with GROUP BY");
            }

            $data[$key] = [
                'date' => $key,
                'income' => floatval($row['income']),
                'expenses' => floatval($row['expenses']),
                'transfers' => floatval($row['transfers']),
                'balance' => floatval($row['balance']),
                'transactionCount' => intval($row['transactionCount']),
                'incomeTransactionCount' => intval($row['incomeTransactionCount']),
                'expenseTransactionCount' => intval($row['expenseTransactionCount']),
                'transferTransactionCount' => intval($row['transferTransactionCount']),
            ];
        }

        $meta = [
            'month' => date('F', strtotime($date_boundaries['start'])),
            'year' => intval(date('Y', strtotime($date_boundaries['start']))),
            'timezone' => $user_timezone,
        ];

        return [
            'data' => $data,
            'meta' => $meta,
        ];
    }

    /**
     * Get the monthly category spending
     * 
     * @param int $month
     * @param int $year
     * @return array|WP_Error
     */
    public function get_monthly_category_spending($month, $year) {
        $date_boundaries = $this->get_month_utc_boundaries($year, $month);
        if (is_null($date_boundaries)) {
            return $this->get_error('unknown');
        }

        $transactions_table = $this->get_table_name($this->transaction_table_name);
        $categories_table = $this->get_table_name($this->category_table_name);
        $user_id = get_current_user_id();

        $start_date = $date_boundaries['start'];
        $end_date = $date_boundaries['end'];

        $sql = $this->db()->prepare("
        SELECT
            c.id AS categoryId,
            c.name AS categoryName,
            c.icon AS categoryIcon,
            c.color AS categoryColor,
            c.bg_color AS categoryBgColor,
            c.parent_id IS NULL AS isParent,
            c.parent_id AS parentId,
            (c.user_id = 0) AS isSystem,
            c.description,
            COUNT(t.id) AS transactionCount,
            COALESCE(SUM(t.amount), 0) AS amount,
            COALESCE(AVG(t.amount), 0) AS averagePerTransaction,
            COALESCE(MAX(t.amount), 0) AS highestTransaction,
            COALESCE(MIN(t.amount), 0) AS lowestTransaction
        FROM {$categories_table} AS c
        LEFT JOIN {$transactions_table} AS t
            ON t.category_id = c.id
            AND t.type = 'expense'
            AND t.is_active = 1
            AND t.user_id = %d
            AND t.date >= %s AND t.date < %s
        WHERE c.is_active = 1
            AND (c.user_id = %d OR c.user_id = 0)
        GROUP BY c.id
        ORDER BY amount DESC
        ", $user_id, $start_date, $end_date, $user_id);


        $raw_results = $this->db()->get_results($sql, ARRAY_A);

        if (is_wp_error($raw_results)) {
            return $this->get_error('db_error');
        }

        $categoryMap = [];
        $parentSums = [];

        foreach ($raw_results as $row) {
            $categoryId = intval($row['categoryId']);
            $parentId = $row['parentId'] ? intval($row['parentId']) : null;

            $categoryMap[$categoryId] = [
                'categoryId' => strval($categoryId),
                'categoryName' => $row['categoryName'],
                'categoryIcon' => $row['categoryIcon'],
                'categoryColor' => $row['categoryColor'],
                'categoryBgColor' => $row['categoryBgColor'],
                'isParent' => $row['isParent'] === '1',
                'parentId' => $parentId !== null ? strval($parentId) : null,
                'isSystem' => $row['isSystem'] === '1',
                'description' => $row['description'],
                'amount' => floatval($row['amount']),
                'transactionCount' => intval($row['transactionCount']),
                'averagePerTransaction' => floatval($row['averagePerTransaction']),
                'highestTransaction' => floatval($row['highestTransaction']),
                'lowestTransaction' => floatval($row['lowestTransaction']),
            ];

            if ($parentId) {
                if (!isset($parentSums[$parentId])) {
                    $parentSums[$parentId] = [
                        'amount' => 0,
                        'transactionCount' => 0,
                        'highestTransaction' => 0,
                        'lowestTransaction' => PHP_INT_MAX,
                    ];
                }

                $parentSums[$parentId]['amount'] += floatval($row['amount']);
                $parentSums[$parentId]['transactionCount'] += intval($row['transactionCount']);
                $parentSums[$parentId]['highestTransaction'] = max($parentSums[$parentId]['highestTransaction'], floatval($row['highestTransaction']));
                $parentSums[$parentId]['lowestTransaction'] = min($parentSums[$parentId]['lowestTransaction'], floatval($row['lowestTransaction']));
            }
        }

        // Add or update parent category entries
        foreach ($parentSums as $parentId => $data) {
            if (isset($categoryMap[$parentId])) {
                $categoryMap[$parentId]['amount'] = $data['amount'];
                $categoryMap[$parentId]['transactionCount'] = $data['transactionCount'];
                $categoryMap[$parentId]['averagePerTransaction'] = $data['transactionCount'] > 0 ? $data['amount'] / $data['transactionCount'] : 0;
                $categoryMap[$parentId]['highestTransaction'] = $data['highestTransaction'];
                $categoryMap[$parentId]['lowestTransaction'] = $data['lowestTransaction'] === PHP_INT_MAX ? 0 : $data['lowestTransaction'];
            }
        }


        $data = array_values($categoryMap);

        $meta = [
            'month' => $month,
            'year' => $year,
            'totalExpenses' => array_sum(array_column($data, 'amount')),
        ];

        return [
            'data' => $data,
            'meta' => $meta,
        ];
    }

    public function get_monthly_tag_activity($month, $year) {
        $date_boundaries = $this->get_month_utc_boundaries($year, $month);
        if (is_null($date_boundaries)) {
            return $this->get_error('unknown');
        }

        $transactions_table = $this->get_table_name($this->transaction_table_name);
        $tags_table = $this->get_table_name($this->tags_table_name);
        $transaction_tags_table = $this->get_table_name($this->transaction_tags_table_name);
        $user_id = get_current_user_id();

        $start_date = $date_boundaries['start'];
        $end_date = $date_boundaries['end'];

        $sql = $this->db()->prepare("
            SELECT 
                t.id AS id,
                t.name,
                t.icon,
                t.color,
                t.bg_color,
                t.description,
                t.user_id = 0 AS isSystem,
    
                COUNT(DISTINCT tx.id) AS totalTransactionCount,
                SUM(CASE WHEN tx.type = 'expense' THEN tx.amount ELSE 0 END) AS expenseAmount,
                COUNT(CASE WHEN tx.type = 'expense' THEN 1 END) AS expenseTransactionCount,
                SUM(CASE WHEN tx.type = 'income' THEN tx.amount ELSE 0 END) AS incomeAmount,
                COUNT(CASE WHEN tx.type = 'income' THEN 1 END) AS incomeTransactionCount,
                SUM(CASE WHEN tx.type = 'transfer' THEN tx.amount ELSE 0 END) AS transferAmount,
                COUNT(CASE WHEN tx.type = 'transfer' THEN 1 END) AS transferTransactionCount,
                MIN(tx.amount) AS lowestTransaction,
                MAX(tx.amount) AS highestTransaction,
                AVG(tx.amount) AS averagePerTransaction
    
            FROM {$tags_table} t
            LEFT JOIN {$transaction_tags_table} tt ON tt.tag_id = t.id
            LEFT JOIN {$transactions_table} tx 
                ON tx.id = tt.transaction_id 
                AND tx.is_active = 1 
                AND tx.user_id = %d 
                AND tx.date >= %s AND tx.date < %s
    
            WHERE (t.user_id = 0 OR t.user_id = %d)
              AND t.is_active = 1
    
            GROUP BY t.id
            ORDER BY totalTransactionCount DESC
        ", $user_id, $start_date, $end_date, $user_id);

        $results = $this->db()->get_results($sql, ARRAY_A);

        // Structure results
        $data = [];
        $totalExpenses = 0.0;
        $totalIncome = 0.0;
        $totalTransfers = 0.0;

        foreach ($results as $row) {
            $expense = floatval($row['expenseAmount']);
            $income = floatval($row['incomeAmount']);
            $transfer = floatval($row['transferAmount']);

            $totalExpenses += $expense;
            $totalIncome += $income;
            $totalTransfers += $transfer;

            $data[] = [
                'id' => strval($row['id']),
                'name' => $row['name'],
                'icon' => $row['icon'],
                'color' => $row['color'],
                'bgColor' => $row['bg_color'],
                'description' => $row['description'],
                'isSystem' => boolval($row['isSystem']),
                'totalAmount' => $income - $expense, // Net
                'totalTransactionCount' => intval($row['totalTransactionCount']),
                'expenseAmount' => $expense,
                'expenseTransactionCount' => intval($row['expenseTransactionCount']),
                'incomeAmount' => $income,
                'incomeTransactionCount' => intval($row['incomeTransactionCount']),
                'transferAmount' => $transfer,
                'transferTransactionCount' => intval($row['transferTransactionCount']),
                'averagePerTransaction' => floatval($row['averagePerTransaction']),
                'highestTransaction' => floatval($row['highestTransaction']),
                'lowestTransaction' => floatval($row['lowestTransaction']),
            ];
        }

        $meta = [
            'month' => date('F', strtotime($start_date)),
            'year' => intval(date('Y', strtotime($start_date))),
            'totalExpenses' => $totalExpenses,
            'totalIncome' => $totalIncome,
            'totalTransfers' => $totalTransfers,
        ];

        return [
            'data' => $data,
            'meta' => $meta,
        ];
    }

    public function get_monthly_person_activity($month, $year) {
        $date_boundaries = $this->get_month_utc_boundaries($year, $month);
        if (is_null($date_boundaries)) {
            return $this->get_error('unknown');
        }

        $people_table = $this->get_table_name($this->people_table_name);
        $transactions_table = $this->get_table_name($this->transaction_table_name);
        $user_id = get_current_user_id();

        $start_date = $date_boundaries['start'];
        $end_date = $date_boundaries['end'];

        $sql = $this->db()->prepare("
        SELECT 
            p.id,
            p.name,
            p.email,
            p.phone,
            p.description,
            p.avatar_id,
            COALESCE(SUM(CASE WHEN t.user_id = %d THEN 
                CASE 
                    WHEN t.type = 'income' THEN t.amount 
                    WHEN t.type = 'expense' THEN -t.amount 
                    ELSE 0 
                END 
            ELSE 0 END), 0) AS totalAmount,
            
            COUNT(DISTINCT t.id) AS totalTransactionCount,

            SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) AS incomeAmount,
            COUNT(CASE WHEN t.type = 'income' THEN 1 END) AS incomeTransactionCount,

            SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) AS expenseAmount,
            COUNT(CASE WHEN t.type = 'expense' THEN 1 END) AS expenseTransactionCount,

            MIN(t.amount) AS lowestTransaction,
            MAX(t.amount) AS highestTransaction,
            AVG(t.amount) AS averagePerTransaction,

            MAX(t.date) AS lastTransactionAt,

            (
                SELECT COALESCE(SUM(CASE 
                    WHEN t2.type = 'income' THEN t2.amount 
                    WHEN t2.type = 'expense' THEN -t2.amount 
                    ELSE 0 END), 0)
                FROM {$transactions_table} t2
                WHERE t2.person_id = p.id 
                AND t2.user_id = %d 
                AND t2.is_active = 1
            ) AS balance

        FROM {$people_table} p
        LEFT JOIN {$transactions_table} t 
            ON t.person_id = p.id 
            AND t.user_id = %d 
            AND t.is_active = 1 
            AND t.date >= %s AND t.date < %s

        WHERE p.user_id = %d
          AND p.is_active = 1

        GROUP BY p.id
        ORDER BY totalAmount DESC
    ", $user_id, $user_id, $user_id, $start_date, $end_date, $user_id);

        $results = $this->db()->get_results($sql, ARRAY_A);


        $data = array_map(function ($row) {
            $avatar = is_null($row['avatar_id']) || $row['avatar_id'] == '0' ? null : $this->upload_manager->get_file_by_id($row['avatar_id'], true);
            return [
                'id' => (string)$row['id'],
                'name' => $row['name'],
                'email' => $row['email'],
                'phone' => $row['phone'],
                'description' => $row['description'],
                'avatarUrl' => $avatar ? $avatar['url'] : null,
                'balance' => floatval($row['balance']),
                'totalAmount' => floatval($row['totalAmount']),
                'totalTransactionCount' => intval($row['totalTransactionCount']),
                'incomeAmount' => floatval($row['incomeAmount']),
                'incomeTransactionCount' => intval($row['incomeTransactionCount']),
                'expenseAmount' => floatval($row['expenseAmount']),
                'expenseTransactionCount' => intval($row['expenseTransactionCount']),
                'averagePerTransaction' => floatval($row['averagePerTransaction']),
                'highestTransaction' => floatval($row['highestTransaction']),
                'lowestTransaction' => floatval($row['lowestTransaction']),
                'lastTransactionAt' => $row['lastTransactionAt'] ?? null,
            ];
        }, $results);

        // Meta calculations
        $total_expenses = array_sum(array_column($data, 'expenseAmount'));
        $total_income = array_sum(array_column($data, 'incomeAmount'));
        $total_transfers = 0; // Not person-specific in this query

        $meta = [
            'month' => date('F', strtotime($start_date)),
            'year' => (int)$year,
            'totalExpenses' => round($total_expenses, 2),
            'totalIncome' => round($total_income, 2),
            'totalTransfers' => $total_transfers,
        ];

        return [
            'data' => $data,
            'meta' => $meta,
        ];
    }
}
