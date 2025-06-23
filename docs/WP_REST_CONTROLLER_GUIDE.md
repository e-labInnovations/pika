# WordPress REST Controller Guide

## Why Extend WP_REST_Controller?

Yes, we **should** extend `WP_REST_Controller` for our Pika plugin controllers. Here's why:

### 1. **WordPress Best Practices**

- Follows WordPress coding standards and conventions
- Ensures compatibility with WordPress core
- Makes the plugin more maintainable and professional

### 2. **Built-in Features**

`WP_REST_Controller` provides many useful methods out of the box:

#### Schema Support

```php
public function get_item_schema() {
    // Define JSON schema for your endpoints
    // Enables automatic documentation generation
    // Provides validation and sanitization
}
```

#### Collection Parameters

```php
public function get_collection_params() {
    // Standard pagination, search, sorting parameters
    // Consistent API across all endpoints
}
```

#### Response Preparation

```php
public function prepare_item_for_response($item, $request) {
    // Format data for API response
    // Handle different contexts (view, edit, embed)
}
```

### 3. **Automatic Features**

#### Pagination Headers

- `X-WP-Total`: Total number of items
- `X-WP-TotalPages`: Total number of pages
- Automatic pagination handling

#### Schema Validation

- Automatic parameter validation
- Sanitization callbacks
- Type checking

#### Context Support

- `view`: Public data
- `edit`: Full data for editing
- `embed`: Minimal data for embedding

### 4. **Our Implementation**

#### Base Controller

```php
abstract class Pika_Base_Controller extends WP_REST_Controller {
    protected $namespace = 'pika/v1';

    // Custom methods for Pika-specific functionality
    protected function check_auth() { /* ... */ }
    protected function get_sanitized_data() { /* ... */ }
    // ... more custom methods
}
```

#### Account Controller Example

```php
class Pika_Accounts_Controller extends Pika_Base_Controller {
    public function register_routes() {
        register_rest_route($this->namespace, '/accounts', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_items'],
                'permission_callback' => [$this, 'check_auth'],
                'args' => $this->get_collection_params(),
            ],
            // ... more routes
        ]);
    }

    public function get_item_schema() {
        // Define account schema
        return [
            'type' => 'object',
            'properties' => [
                'id' => ['type' => 'integer'],
                'name' => ['type' => 'string'],
                // ... more properties
            ]
        ];
    }
}
```

### 5. **Benefits in Practice**

#### Automatic Documentation

- WordPress automatically generates API documentation
- Available at `/wp-json/pika/v1/`
- Includes schema, parameters, and examples

#### Consistent API

- All endpoints follow the same patterns
- Standard HTTP methods and status codes
- Consistent error handling

#### Better Testing

- WordPress provides testing utilities
- Easier to write unit tests
- Better integration with WordPress testing framework

#### Future Compatibility

- Updates to WordPress REST API automatically benefit your plugin
- Better integration with WordPress ecosystem
- Easier to maintain over time

### 6. **Migration from Custom Implementation**

If you were previously using a custom controller class:

#### Before (Custom)

```php
class Pika_Accounts_Controller {
    public function get_accounts($request) {
        // Custom implementation
        return $this->success_response($accounts);
    }
}
```

#### After (WP_REST_Controller)

```php
class Pika_Accounts_Controller extends Pika_Base_Controller {
    public function get_items($request) {
        // WordPress-standard implementation
        return $this->prepare_collection_for_response($accounts, $request, $total);
    }
}
```

### 7. **Key Methods to Override**

#### Required

- `register_routes()`: Define your endpoints
- `get_item_schema()`: Define data structure

#### Optional but Recommended

- `prepare_item_for_response()`: Format individual items
- `prepare_collection_for_response()`: Format collections
- `get_collection_params()`: Add custom parameters

### 8. **Best Practices**

1. **Always extend WP_REST_Controller** for new controllers
2. **Use WordPress constants** like `WP_REST_Server::READABLE`
3. **Implement proper schemas** for all endpoints
4. **Use permission callbacks** for security
5. **Follow WordPress naming conventions**
6. **Handle errors consistently** using `WP_Error`

### 9. **Testing Your Endpoints**

```bash
# Test with curl
curl -X GET "https://yoursite.com/wp-json/pika/v1/accounts" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test with WordPress CLI
wp rest post /pika/v1/accounts --user=admin
```

### 10. **Conclusion**

Extending `WP_REST_Controller` is not just recommended—it's essential for building professional WordPress plugins. It provides:

- ✅ Better integration with WordPress
- ✅ Automatic features and validation
- ✅ Consistent API design
- ✅ Future-proof code
- ✅ Professional development standards

Our Pika plugin follows these best practices, ensuring a robust and maintainable codebase.
