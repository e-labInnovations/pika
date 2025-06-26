# Settings API Documentation

The Settings API provides endpoints for managing user preferences and settings in the Pika financial management system.

## Base URL

```
/wp-json/pika/v1/settings
```

## Authentication

All endpoints require authentication. Include the WordPress nonce or use cookie authentication.

## Endpoints

### 1. Get All Settings

Retrieves all settings for the authenticated user. Returns all allowed settings with their default values for unset settings.

**Endpoint:** `GET /wp-json/pika/v1/settings`

**Headers:**

```
Content-Type: application/json
X-WP-Nonce: {nonce}
```

**Response:**

```json
{
  "currency": "INR"
}
```

**Error Response:**

```json
{
  "code": "unauthorized",
  "message": "Unauthorized access.",
  "status": 401
}
```

### 2. Update Settings

Updates or inserts multiple settings for the authenticated user. Only allowed settings keys can be updated with proper data type validation.

**Endpoint:** `PUT /wp-json/pika/v1/settings`

**Headers:**

```
Content-Type: application/json
X-WP-Nonce: {nonce}
```

**Request Body:**

```json
{
  "currency": "INR"
}
```

**Response:**

```json
{
  "currency": "INR"
}
```

**Error Responses:**

Invalid request:

```json
{
  "code": "invalid_request",
  "message": "Invalid request.",
  "status": 400
}
```

Invalid key:

```json
{
  "code": "invalid_key",
  "message": "Invalid key.",
  "status": 400
}
```

Invalid type:

```json
{
  "code": "invalid_type",
  "message": "Invalid data type.",
  "status": 400
}
```

Invalid value:

```json
{
  "code": "invalid_value",
  "message": "Invalid value.",
  "status": 400
}
```

Unauthorized:

```json
{
  "code": "unauthorized",
  "message": "Unauthorized access.",
  "status": 401
}
```

## Usage Examples

### JavaScript (Fetch API)

```javascript
// Get all settings
async function getSettings() {
  const response = await fetch("/wp-json/pika/v1/settings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-WP-Nonce": wpApiSettings.nonce,
    },
  });

  const data = await response.json();
  return data;
}

// Update settings
async function updateSettings(settings) {
  const response = await fetch("/wp-json/pika/v1/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-WP-Nonce": wpApiSettings.nonce,
    },
    body: JSON.stringify(settings),
  });

  const data = await response.json();
  return data;
}

// Example usage
const settings = {
  currency: "INR",
};

updateSettings(settings)
  .then((response) => {
    console.log("Settings updated:", response);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### PHP (WordPress)

```php
// Get all settings
function get_user_settings() {
  $response = wp_remote_get(home_url('/wp-json/pika/v1/settings'), [
    'headers' => [
      'X-WP-Nonce' => wp_create_nonce('wp_rest')
    ]
  ]);

  if (is_wp_error($response)) {
    return false;
  }

  $body = wp_remote_retrieve_body($response);
  return json_decode($body, true);
}

// Update settings
function update_user_settings($settings) {
  $response = wp_remote_request(home_url('/wp-json/pika/v1/settings'), [
    'method' => 'PUT',
    'headers' => [
      'Content-Type' => 'application/json',
      'X-WP-Nonce' => wp_create_nonce('wp_rest')
    ],
    'body' => json_encode($settings)
  ]);

  if (is_wp_error($response)) {
    return false;
  }

  $body = wp_remote_retrieve_body($response);
  return json_decode($body, true);
}

// Example usage
$settings = [
  'currency' => 'INR'
];

$result = update_user_settings($settings);
if ($result) {
  echo 'Settings updated successfully';
} else {
  echo 'Failed to update settings';
}
```

## Database Schema

The settings are stored in the `wp_pika_user_settings` table:

```sql
CREATE TABLE `wp_pika_user_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_setting_unique` (`user_id`,`setting_key`),
  KEY `user_id` (`user_id`)
);
```

## Common Settings Keys

The following settings are available in the Pika system:

### Currency Settings

- `currency` - Default currency
  - **Type**: string
  - **Default**: "INR"
  - **Allowed Values**: Dynamically loaded from `backend/data/currencies.php` (100+ world currencies)
  - **Sanitization**: Converts to uppercase and trims whitespace

## Notes

1. All setting values are stored as strings in the database
2. Setting keys must be non-empty strings
3. Each user can have their own settings
4. Settings are automatically created if they don't exist
5. The API supports updating multiple settings in a single request
6. Responses follow WordPress REST API conventions - data is returned directly
7. Error responses follow WordPress REST API error format
8. **Data type validation**: Values are validated against their defined data types
9. **Value validation**: Values are checked against allowed values lists
10. **Sanitization**: Values are automatically sanitized before storage
11. **Type safety**: Only predefined settings with proper types can be set
