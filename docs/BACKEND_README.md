# Pika WordPress Plugin Backend

This directory contains the WordPress plugin backend for the Pika financial management application.

## 🏗️ Project Structure

```
pika/
├── pika.php                    # Main plugin file
├── backend/                    # Backend PHP files
│   ├── class-pika-loader.php   # Main plugin loader
│   ├── activator.php           # Plugin activation (database setup)
│   ├── deactivator.php         # Plugin deactivation
│   ├── utils.php               # Utility functions
│   ├── api-loader.php          # REST API route registration
│   ├── pwa-loader.php          # PWA frontend serving
│   ├── controllers/            # API controllers
│   │   ├── base-controller.php # Base controller class
│   │   ├── auth-controller.php # Authentication endpoints
│   │   ├── accounts-controller.php
│   │   ├── people-controller.php
│   │   ├── categories-controller.php
│   │   ├── tags-controller.php
│   │   ├── transactions-controller.php
│   │   ├── analytics-controller.php
│   │   ├── upload-controller.php
│   │   └── settings-controller.php
│   ├── managers/               # Business logic managers
│   │   ├── accounts-manager.php
│   │   ├── people-manager.php
│   │   ├── categories-manager.php
│   │   ├── tags-manager.php
│   │   ├── transactions-manager.php
│   │   └── analytics-manager.php
│   └── admin/                  # Admin interface
│       └── admin-page.php      # WordPress admin page
├── frontend/                   # React frontend (development)
├── frontend-build/             # Built React app (production)
└── assets/                     # Plugin assets (CSS, JS, images)
```

## 🚀 Quick Start

### 1. Installation

1. **Upload to WordPress**: Copy the entire `pika` folder to `/wp-content/plugins/`
2. **Activate Plugin**: Go to WordPress Admin → Plugins → Activate "Pika Financial Management"
3. **Database Setup**: The plugin will automatically create required database tables
4. **Build Frontend**: Build the React app and place it in `frontend-build/`

### 2. Database Tables

The plugin creates the following tables:

- `wp_pika_accounts` - User accounts
- `wp_pika_people` - People/contacts
- `wp_pika_categories` - Transaction categories
- `wp_pika_tags` - Transaction tags
- `wp_pika_transactions` - Financial transactions
- `wp_pika_transaction_tags` - Transaction-tag relationships
- `wp_pika_transaction_attachments` - File attachments
- `wp_pika_user_settings` - User preferences

### 3. API Endpoints

All API endpoints are available under `/wp-json/pika/v1/`:

- **Authentication**: `/auth/me`
- **Accounts**: `/accounts`
- **People**: `/people`
- **Categories**: `/categories`
- **Tags**: `/tags`
- **Transactions**: `/transactions`
- **Analytics**: `/analytics/*`
- **Upload**: `/upload/*`
- **Settings**: `/settings`

### 4. PWA Access

Once the frontend is built, the PWA will be accessible at:

```
https://yourdomain.com/pika/
```

## 🔧 Development

### Creating New Controllers

1. **Extend Base Controller**:

```php
class Pika_Your_Controller extends Pika_Base_Controller {
    public function register_routes() {
        register_rest_route($this->namespace, '/your-endpoint', [
            'methods' => 'GET',
            'callback' => [$this, 'get_items'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }

    public function get_items($request) {
        // Your logic here
        return $this->success_response($data);
    }
}
```

2. **Register in API Loader**:

```php
// In api-loader.php
private function register_your_routes() {
    $your_controller = new Pika_Your_Controller();
    $your_controller->register_routes();
}
```

### Creating New Managers

Managers handle business logic and database operations:

```php
class Pika_Your_Manager {
    public static function get_items($user_id, $args = []) {
        global $wpdb;

        $table = $wpdb->prefix . 'pika_your_table';
        $sql = "SELECT * FROM $table WHERE user_id = %d";

        return $wpdb->get_results($wpdb->prepare($sql, $user_id));
    }

    public static function create_item($user_id, $data) {
        global $wpdb;

        $table = $wpdb->prefix . 'pika_your_table';

        return $wpdb->insert($table, array_merge($data, [
            'user_id' => $user_id,
            'created_at' => current_time('mysql')
        ]));
    }
}
```

### File Upload Handling

The plugin provides utility functions for file uploads:

```php
// Handle single file upload
$result = pika_handle_file_upload($_FILES['file'], 'avatars');

// Handle multiple files
$results = [];
foreach ($_FILES['files']['tmp_name'] as $key => $tmp_name) {
    $file = [
        'name' => $_FILES['files']['name'][$key],
        'type' => $_FILES['files']['type'][$key],
        'tmp_name' => $tmp_name,
        'error' => $_FILES['files']['error'][$key],
        'size' => $_FILES['files']['size'][$key]
    ];

    $results[] = pika_handle_file_upload($file, 'attachments');
}
```

## 🛡️ Security Features

- **WordPress Authentication**: Uses WordPress user authentication
- **Input Sanitization**: All inputs are sanitized using WordPress functions
- **SQL Prepared Statements**: All database queries use prepared statements
- **File Upload Validation**: File type and size validation
- **Nonce Verification**: CSRF protection for admin forms

## 📊 Database Schema

### Accounts Table

```sql
CREATE TABLE wp_pika_accounts (
    id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    user_id bigint(20) unsigned NOT NULL,
    name varchar(255) NOT NULL,
    icon varchar(100) NOT NULL DEFAULT 'wallet',
    bg_color varchar(7) NOT NULL DEFAULT '#3B82F6',
    color varchar(7) NOT NULL DEFAULT '#ffffff',
    avatar text,
    description text,
    is_active tinyint(1) NOT NULL DEFAULT 1,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_id (user_id),
    KEY is_active (is_active)
);
```

### Transactions Table

```sql
CREATE TABLE wp_pika_transactions (
    id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    user_id bigint(20) unsigned NOT NULL,
    title varchar(255) NOT NULL,
    amount decimal(15,2) NOT NULL,
    date datetime NOT NULL,
    type enum('income','expense','transfer') NOT NULL,
    category_id bigint(20) unsigned NOT NULL,
    account_id bigint(20) unsigned NOT NULL,
    to_account_id bigint(20) unsigned DEFAULT NULL,
    person_id bigint(20) unsigned DEFAULT NULL,
    note text,
    currency varchar(3) NOT NULL DEFAULT 'USD',
    is_active tinyint(1) NOT NULL DEFAULT 1,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_id (user_id),
    KEY category_id (category_id),
    KEY account_id (account_id),
    KEY date (date),
    KEY type (type)
);
```

## 🔄 API Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Your data here
  }
}
```

### Error Response

```json
{
  "code": "error_code",
  "message": "Error message",
  "data": {
    "status": 400,
    "details": {}
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [
    // Items array
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20,
    "total_pages": 5
  }
}
```

## 🧪 Testing

### Manual Testing

1. **Activate Plugin**: Test plugin activation
2. **Database Tables**: Verify all tables are created
3. **API Endpoints**: Test with Postman or similar tool
4. **File Uploads**: Test avatar and attachment uploads
5. **PWA Access**: Verify React app loads correctly

### WordPress Debug

Enable WordPress debug mode in `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## 📝 Next Steps

1. **Create Controllers**: Implement all API controllers
2. **Create Managers**: Implement business logic managers
3. **Add Validation**: Enhance input validation
4. **Add Caching**: Implement caching for better performance
5. **Add Tests**: Create unit tests
6. **Documentation**: Complete API documentation

## 🤝 Contributing

1. Follow WordPress coding standards
2. Use proper error handling
3. Add comments for complex logic
4. Test thoroughly before committing
5. Update documentation as needed

## 📄 License

This project is licensed under GPL v2 or later.
