# Pika WordPress Plugin API Documentation

## Overview

Pika is a comprehensive financial management WordPress plugin that helps users track income, expenses, transfers, and manage their financial data. This document outlines the WordPress plugin architecture, database schema, and REST API endpoints.

## Plugin Information

- **Plugin Name**: Pika
- **Plugin URI**: https://pika.elabins.com
- **Description**: Complete financial management solution for WordPress
- **Version**: 1.0.0
- **Author**: e-lab innovations
- **License**: GPL v2 or later
- **Text Domain**: pika-financial
- **Domain Path**: /languages

## WordPress Integration

### Plugin Structure

```
wp-content/
├── uploads/
│   └── pika/
│       ├── avatars/
│       │   └── {entity_type}-{entity_id}-{random_unique_string}.{extension}
│       └── attachments/
│           └── {random_unique_string}.{extension}
└── plugins/
    └── plugins/
        └── pika/
            ├── pika.php                # Main plugin file
            ├── frontend                # Frontend react files (excluded in build)
            ├── frontend-build          # Frontend build
            └── backend/
                ├── controllers         # Controllers for API endpoints/
                │   ├── Base_Controller
                │   ├── Accounts_Controller
                │   ├── Categories_Controller
                │   ├── Transactions_Controller
                │   └── ...
                ├── Managers            # Business logic for API endpoints and database operations/
                │   ├── Accounts_Manager
                │   ├── Categories_Manager
                │   ├── Transactions_Manager
                │   └── ...
                ├── admin/
                │   └── Admin_Page.php  # Admin page UI
                ├── api-loader.php      # Loads the API endpoints
                ├── activator.php       # Activation hooks including database tables
                ├── deactivator.php     # Deactivation hooks including database tables
                ├── utils.php           # Utility functions
                └── pwa_loader.php      # Frontend PWA loader
```

### WordPress Hooks Used

- `register_activation_hook` - Activation hook
- `register_deactivation_hook` - Deactivation hook
- `rest_api_init` - Register REST API routes

## Database Schema

### WordPress Custom Tables

#### 1. pika_accounts

```sql
CREATE TABLE `{prefix}pika_accounts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(100) NOT NULL DEFAULT 'wallet',
  `bg_color` varchar(7) NOT NULL DEFAULT '#3B82F6',
  `color` varchar(7) NOT NULL DEFAULT '#ffffff',
  `avatar` text,
  `description` text,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `is_active` (`is_active`)
) {charset_collate};
```

#### 2. pika_people

```sql
CREATE TABLE `{prefix}pika_people` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255),
  `phone` varchar(50),
  `avatar` text,
  `description` text,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `email` (`email`),
  KEY `is_active` (`is_active`)
) {charset_collate};
```

#### 3. pika_categories

```sql
CREATE TABLE `{prefix}pika_categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `parent_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(100) NOT NULL DEFAULT 'folder',
  `color` varchar(7) NOT NULL DEFAULT '#3B82F6',
  `bg_color` varchar(7) NOT NULL DEFAULT '#ffffff',
  `type` enum('income','expense','transfer') NOT NULL,
  `description` text,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `parent_id` (`parent_id`),
  KEY `type` (`type`),
  KEY `is_system` (`is_system`),
  KEY `is_active` (`is_active`)
) {charset_collate};
```

#### 4. pika_tags

```sql
CREATE TABLE `{prefix}pika_tags` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(100) NOT NULL DEFAULT 'tag',
  `color` varchar(7) NOT NULL DEFAULT '#3B82F6',
  `bg_color` varchar(7) NOT NULL DEFAULT '#ffffff',
  `description` text,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `is_system` (`is_system`),
  KEY `is_active` (`is_active`)
) {charset_collate};
```

#### 5. pika_transactions

```sql
CREATE TABLE `{prefix}pika_transactions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `date` datetime NOT NULL,
  `type` enum('income','expense','transfer') NOT NULL,
  `category_id` bigint(20) unsigned NOT NULL,
  `account_id` bigint(20) unsigned NOT NULL,
  `to_account_id` bigint(20) unsigned DEFAULT NULL,
  `person_id` bigint(20) unsigned DEFAULT NULL,
  `note` text,
  `currency` varchar(3) NOT NULL DEFAULT 'USD',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  KEY `account_id` (`account_id`),
  KEY `to_account_id` (`to_account_id`),
  KEY `person_id` (`person_id`),
  KEY `date` (`date`),
  KEY `type` (`type`),
  KEY `is_active` (`is_active`)
) {charset_collate};
```

#### 6. pika_transaction_tags

```sql
CREATE TABLE `{prefix}pika_transaction_tags` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `transaction_id` bigint(20) unsigned NOT NULL,
  `tag_id` bigint(20) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_tag_unique` (`transaction_id`,`tag_id`),
  KEY `transaction_id` (`transaction_id`),
  KEY `tag_id` (`tag_id`)
) {charset_collate};
```

#### 7. pika_transaction_attachments

```sql
CREATE TABLE `{prefix}pika_transaction_attachments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `transaction_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` text NOT NULL,
  `type` enum('image','pdf') NOT NULL DEFAULT 'image',
  `file_size` bigint(20) unsigned DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `transaction_id` (`transaction_id`),
  KEY `type` (`type`)
) {charset_collate};
```

#### 8. pika_user_settings

```sql
CREATE TABLE `{prefix}pika_user_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_setting_unique` (`user_id`,`setting_key`),
  KEY `user_id` (`user_id`),
) {charset_collate};
```

## WordPress REST API Endpoints

### Base URL

```
/wp-json/pika/v1
```

### Authentication

The plugin uses WordPress user authentication by Application password:

```php
// Check if user is logged in
if (!is_user_logged_in()) {
    return new WP_Error('unauthorized', 'Authentication required', array('status' => 401));
}
```

### API Endpoints

#### Authentication

##### GET /wp-json/pika/v1/auth/me

Get current user information.

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "default_currency": "USD",
  "avatar_url": "https://example.com/avatar-96.jpg"
}
```

> Update user profile is only done by native wordpress api

#### Accounts

##### GET /wp-json/pika/v1/accounts

Get all user accounts.

**Query Parameters:**

- `search` (string): Search by name or description
- `page` (number): Page number
- `per_page` (number): Items per page

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Checking Account",
      "icon": "wallet",
      "bg_color": "#3B82F6",
      "color": "#ffffff",
      "balance": 2450.5,
      "description": "Chase Bank",
      "avatar": "https://example.com/uploads/avatars/account-1-ndehd87.png"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 20
  }
}
```

##### POST /wp-json/pika/v1/accounts

Create a new account.

**Request Body:**

```json
{
  "name": "Savings Account",
  "icon": "piggy-bank",
  "bg_color": "#22C55E",
  "color": "#ffffff",
  "description": "Federal Bank",
  "avatar": "https://example.com/uploads/avatars/account-1-ndehd87.png",
  "initial_balance": 1000.0
}
```

##### GET /wp-json/pika/v1/accounts/{id}

Get account by ID.

##### PUT /wp-json/pika/v1/accounts/{id}

Update account.

##### DELETE /wp-json/pika/v1/accounts/{id}

Delete account.

#### People

##### GET /wp-json/pika/v1/people

Get all people.

**Query Parameters:**

- `search` (string): Search by name, email, or phone
- `page` (number): Page number
- `per_page` (number): Items per page

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Sarah Johnson",
      "avatar": "https://example.com/avatar.jpg",
      "email": "sarah@example.com",
      "phone": "+1 (555) 123-4567",
      "description": "College friend and roommate",
      "balance": 125.5,
      "last_transaction_date": "2024-11-15T00:00:00Z",
      "transaction_count": 12,
      "total_spent": 450.75,
      "total_received": 325.25
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 20
  }
}
```

##### POST /wp-json/pika/v1/people

Create a new person.

**Request Body:**

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1 (555) 987-6543",
  "description": "Work colleague",
  "avatar": "https://example.com/uploads/avatars/person-1-ndehd87.png"
}
```

##### GET /wp-json/pika/v1/people/{id}

Get person by ID.

##### PUT /wp-json/pika/v1/people/{id}

Update person.

##### DELETE /wp-json/pika/v1/people/{id}

Delete person.

#### Categories

##### GET /wp-json/pika/v1/categories

Get all categories.

**Query Parameters:**

- `type` (string): Filter by transaction type (income, expense, transfer)
- `parent_id` (number): Get child categories of a parent
- `system_only` (boolean): Get only system categories
- `search` (string): Search by name, or description

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Food & Dining",
      "icon": "shopping-cart",
      "bg_color": "#f97316",
      "color": "#ffffff",
      "type": "expense",
      "description": "Food & Dining",
      "is_system": true,
      "is_parent": true,
      "children": [
        {
          "id": 2,
          "name": "Restaurants",
          "icon": "shopping-cart",
          "bg_color": "#8B5CF6",
          "color": "#ffffff",
          "type": "expense",
          "description": "Restaurants",
          "is_system": true,
          "is_parent": false
        }
      ]
    }
  ]
}
```

##### POST /wp-json/pika/v1/categories

Create a new category.

**Request Body:**

```json
{
  "name": "Entertainment",
  "icon": "tv",
  "bg_color": "#8B5CF6",
  "color": "#ffffff",
  "type": "expense",
  "description": "Entertainment expenses",
  "parent_id": 1
}
```

##### GET /wp-json/pika/v1/categories/{id}

Get category by ID.

##### PUT /wp-json/pika/v1/categories/{id}

Update category.

##### DELETE /wp-json/pika/v1/categories/{id}

Delete category.

#### Tags

##### GET /wp-json/pika/v1/tags

Get all tags.

**Query Parameters:**

- `search` (string): Search by name
- `system_only` (boolean): Get only system tags

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Coffee",
      "icon": "coffee",
      "color": "#ffffff",
      "bg_color": "#f59e0b",
      "description": "Coffee at MalabarBites",
      "is_system": false
    }
  ]
}
```

##### POST /wp-json/pika/v1/tags

Create a new tag.

**Request Body:**

```json
{
  "name": "Birthday",
  "icon": "cake",
  "color": "#ffffff",
  "bg_color": "#10b981",
  "description": "Birthday celebrations"
}
```

##### GET /wp-json/pika/v1/tags/{id}

Get tag by ID.

##### PUT /wp-json/pika/v1/tags/{id}

Update tag.

##### DELETE /wp-json/pika/v1/tags/{id}

Delete tag.

#### Transactions

##### GET /wp-json/pika/v1/transactions

Get all transactions with filtering and pagination.

**Query Parameters:**

- `search` (string): Search in title, category, person, note
- `type` (string[]): Filter by transaction types
- `category_id` (number[]): Filter by category IDs
- `tag_id` (number[]): Filter by tag IDs
- `person_id` (number[]): Filter by person IDs
- `account_id` (number[]): Filter by account IDs
- `date_from` (string): Filter by start date (ISO format)
- `date_to` (string): Filter by end date (ISO format)
- `amount_min` (number): Minimum amount
- `amount_max` (number): Maximum amount
- `amount_operator` (string): Amount comparison operator
- `sort_by` (string): Sort field (date, amount, category, tags, title, person)
- `sort_direction` (string): Sort direction (asc, desc)
- `page` (number): Page number
- `per_page` (number): Items per page

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Grocery Shopping",
      "amount": 85.5,
      "date": "2024-11-15T14:30:00Z",
      "type": "expense",
      "category": {
        "id": 2,
        "name": "Restaurants",
        "icon": "shopping-cart",
        "color": "#8B5CF6",
        "bg_color": "#ffffff"
      },
      "account": {
        "id": 1,
        "name": "Checking Account",
        "icon": "wallet",
        "bg_color": "#3B82F6",
        "color": "#ffffff"
      },
      "tags": [
        {
          "id": 1,
          "name": "Coffee",
          "color": "#ffffff",
          "bg_color": "#f59e0b",
          "icon": "coffee"
        }
      ],
      "person": {
        "id": 1,
        "name": "Sarah Johnson",
        "avatar": "https://example.com/avatar.jpg",
        "email": "sarah@example.com",
        "phone": "+1 (555) 123-4567"
      },
      "note": "This is a note about the receipt",
      "attachments": [
        {
          "id": 1,
          "name": "receipt.pdf",
          "url": "https://example.com/uploads/attachements/document-1-ndehd87.pdf",
          "type": "pdf"
        }
      ],
      "to_account": {
        "id": 2,
        "name": "Savings Account",
        "icon": "piggy-bank",
        "bg_color": "#22C55E",
        "color": "#ffffff"
      },
      "currency": "USD"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 20,
    "total_pages": 1
  }
}
```

##### POST /wp-json/pika/v1/transactions

Create a new transaction.

**Request Body:**

```json
{
  "title": "Grocery Shopping",
  "amount": 85.5,
  "date": "2024-11-15T14:30:00Z",
  "type": "expense",
  "category_id": 2,
  "account_id": 1,
  "to_account_id": 2,
  "person_id": 1,
  "tag_ids": [1, 2],
  "note": "This is a note about the receipt",
  "attachments": [
    {
      "name": "receipt.pdf",
      "url": "https://example.com/uploads/attachements/document-1-ndehd87.pdf",
      "type": "pdf"
    }
  ]
}
```

##### GET /wp-json/pika/v1/transactions/{id}

Get transaction by ID.

##### PUT /wp-json/pika/v1/transactions/{id}

Update transaction.

##### DELETE /wp-json/pika/v1/transactions/{id}

Delete transaction.

#### Analytics

##### GET /wp-json/pika/v1/analytics/monthly-summary

Get monthly summary data.

**Query Parameters:**

- `months` (number): Number of months to fetch (default: 6)
- `offset` (number): Month offset from current month (default: 0)

**Response:**

```json
{
  "data": [
    {
      "month": "November",
      "year": 2024,
      "income": 3800,
      "expenses": 2700,
      "balance": 1100,
      "transaction_count": 24
    }
  ]
}
```

##### GET /wp-json/pika/v1/analytics/weekly-expenses

Get weekly expense data.

**Query Parameters:**

- `start_date` (string): Start date (ISO format)
- `end_date` (string): End date (ISO format)

**Response:**

```json
{
  "data": [
    {
      "day": "Mon",
      "amount": 45.5
    }
  ]
}
```

##### GET /wp-json/pika/v1/analytics/account-balances

Get account balances summary.

**Response:**

```json
{
  "data": {
    "total_balance": 11370.75,
    "accounts": [
      {
        "id": 1,
        "name": "Checking Account",
        "balance": 2450.5
      }
    ]
  }
}
```

#### Receipt Analysis

##### POST /wp-json/pika/v1/receipts/analyze

Analyze receipt image using AI.

**Request Body:**

```json
{
  "image": "base64_encoded_image_or_url"
}
```

**Response:**

```json
{
  "title": "Coffee at MalabarBites",
  "date": "2024-11-15",
  "total": 15.0,
  "category": {
    "id": 2,
    "name": "Restaurants",
    "icon": "shopping-cart",
    "color": "#8B5CF6",
    "bg_color": "#ffffff"
  },
  "tags": [
    {
      "id": 1,
      "name": "Coffee",
      "color": "#ffffff",
      "bg_color": "#f59e0b",
      "icon": "coffee"
    }
  ],
  "note": "This is a note about the receipt"
}
```

#### File Upload

##### POST /wp-json/pika/v1/upload/:type

| Param  | Type     | Description                                                         |
| ------ | -------- | ------------------------------------------------------------------- |
| `type` | `string` | Folder type: `'avatars'` or `'attachments'` (can be expanded later) |

Upload file (receipts, avatars, etc.).

##### 📨 Request Headers:

```http
Content-Type: multipart/form-data
Authorization: Bearer <your_token>  (if using JWT)
```

---

#### 📂 Body (multipart/form-data):

```form-data
files[]: file1.jpg
files[]: file2.png
files[]: file3.pdf
```

✅ **Multiple files** are supported with the same key `files[]`.

**Response:**

```json
[
  {
    "url": "https://example.com/uploads/file.jpg",
    "filename": "receipt.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  },
  {
    "url": "https://example.com/uploads/file.jpg",
    "filename": "receipt2.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  },
  {
    "url": "https://example.com/uploads/file.jpg",
    "filename": "receipt3.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  }
]
```

#### Settings

##### GET /wp-json/pika/v1/settings

Get user settings.

**Response:**

```json
{
  "default_currency": "USD",
  "date_format": "Y-m-d",
  "time_format": "H:i",
  "notifications_enabled": true,
  "biometric_auth": false
}
```

##### PUT /wp-json/pika/v1/settings

Update user settings.

**Request Body:**

```json
{
  "default_currency": "EUR",
  "notifications_enabled": false
}
```

## WordPress Plugin Implementation

### Main Plugin File (pika.php)

## WordPress Integration Features

### Frontend

`pwa_loader.php` will serve all the files inside the `frontend-build` folder when we hit the https://example.com/pika as a PWA app (individual app)

#### 2. ✨ `PWA_Loader.php` – Serve the React App

```php
<?php
class Pika_PWA_Loader {
    public function __construct() {
        add_action('init', [$this, 'add_rewrite_rule']);
        add_filter('template_include', [$this, 'serve_pwa'], 99);
    }

    public function add_rewrite_rule() {
        add_rewrite_rule('^my-pwa(?:/.*)?$', 'index.php?yourplugin_pwa=1', 'top');
        add_rewrite_tag('%yourplugin_pwa%', '1');
    }

    public function serve_pwa($template) {
        if (get_query_var('yourplugin_pwa') === '1') {
            $pwa_index = plugin_dir_path(__DIR__) . 'dist/index.html';

            if (file_exists($pwa_index)) {
                // Set headers for HTML
                header("Content-Type: text/html");
                readfile($pwa_index);
                exit;
            }
        }

        return $template;
    }
}
```

#### 🛑 Prevent WordPress Hijack (Optional but smart)

WordPress may interfere with static files like .js, .json, etc. You can optionally add a passthrough handler:

```php
add_action('template_redirect', function () {
    $uri = $_SERVER['REQUEST_URI'];
    if (strpos($uri, '/my-pwa/') === 0 && preg_match('/\.(js|css|json|png|ico|txt|webmanifest|svg)$/', $uri)) {
        $file = plugin_dir_path(__FILE__) . 'dist' . str_replace('/my-pwa', '', $uri);
        if (file_exists($file)) {
            $ext = pathinfo($file, PATHINFO_EXTENSION);
            $mime_types = [
                'js' => 'application/javascript',
                'css' => 'text/css',
                'json' => 'application/json',
                'ico' => 'image/x-icon',
                'png' => 'image/png',
                'svg' => 'image/svg+xml',
                'webmanifest' => 'application/manifest+json',
            ];
            header("Content-Type: " . ($mime_types[$ext] ?? 'text/plain'));
            readfile($file);
            exit;
        }
    }
});
```
