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
            COUNT(DISTINCT DATE(`date`)) AS activeDays,
            SUM(CASE WHEN type = 'income' THEN 1 ELSE 0 END) AS incomeTransactionCount,
            SUM(CASE WHEN type = 'expense' THEN 1 ELSE 0 END) AS expenseTransactionCount
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
            'incomeTransactionCount' => intval($row['incomeTransactionCount']),
            'expenseTransactionCount' => intval($row['expenseTransactionCount']),
        ];

        return rest_ensure_response($result);
    }

    public function get_daily_summaries($month, $year) {
        $transactions_table = $this->get_table_name($this->transaction_table_name);
        $user_id = get_current_user_id();
        $start_date = date('Y-m-01', strtotime("$year-$month-01"));
        $end_date = date('Y-m-t', strtotime($start_date)); // last day of month

        $sql = $this->db()->prepare("
        SELECT 
            DATE(date) AS date,
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
                'incomeTransactionCount' => 0,
                'expenseTransactionCount' => 0,
                'transferTransactionCount' => 0,
            ];
        }

        foreach ($results as $row) {
            $key = $row['date'];
            $balance = floatval($row['income']) - floatval($row['expenses']);
            $data[$key] = [
                'date' => $key,
                'income' => floatval($row['income']),
                'expenses' => floatval($row['expenses']),
                'transfers' => floatval($row['transfers']),
                'balance' => $balance,
                'transactionCount' => intval($row['transactionCount']),
                'incomeTransactionCount' => intval($row['incomeTransactionCount']),
                'expenseTransactionCount' => intval($row['expenseTransactionCount']),
                'transferTransactionCount' => intval($row['transferTransactionCount']),
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

    /**
     * Get the monthly category spending
     * 
     * @param int $month
     * @param int $year
     * @return array|WP_Error
     */
    public function get_monthly_category_spending($month, $year) {
        $transactions_table = $this->get_table_name($this->transaction_table_name);
        $categories_table = $this->get_table_name($this->category_table_name);
        $user_id = get_current_user_id();

        $start_date = date('Y-m-01', strtotime("$year-$month-01"));
        $end_date = date('Y-m-t', strtotime($start_date)); // last day of month

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
            AND t.date BETWEEN %s AND %s
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

    public function get_monthly_tag_spending($month, $year) {
        $transactions_table = $this->get_table_name($this->transaction_table_name);
        $tags_table = $this->get_table_name($this->tags_table_name);
        $transaction_tags_table = $this->get_table_name($this->transaction_tags_table_name);
        $user_id = get_current_user_id();

        $start_date = date('Y-m-01', strtotime("$year-$month-01"));
        $end_date = date('Y-m-t', strtotime($start_date)); // last day of month

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
                AND tx.date BETWEEN %s AND %s
    
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
}
