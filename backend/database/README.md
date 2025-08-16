# Pika Database Layer

This directory contains the new database architecture for the Pika plugin, providing a clean separation of concerns and better maintainability.

## Architecture Overview

### Core Classes

- **`Pika_Database_Manager`** - Main orchestrator for all database operations
- **`Pika_Table_Manager`** - Handles table creation and management
- **`Pika_Migration_Manager`** - Manages database migrations and upgrades
- **`Pika_Seed_Manager`** - Handles default data insertion

### Directory Structure

```
database/
├── class-database-manager.php      # Main database operations
├── class-table-manager.php         # Table creation/management
├── class-migration-manager.php     # Database migrations
├── class-seed-manager.php          # Default data insertion
├── migrations/                     # Individual migration files
│   ├── 001_add_reminders_table.php
│   └── index.php
├── index.php                       # Security file
└── README.md                       # This file
```

## Key Features

### 1. **Smart Default Data Insertion**
- Only inserts system categories and tags when:
  - Database version is exactly 1.0.0 (fresh install), OR
  - Both categories and tags tables are completely empty
- Prevents duplicate data during upgrades

### 2. **Versioned Migrations**
- Each database change is a separate migration file
- Migrations run in order based on version numbers
- Support for rollback operations (development only)
- Transaction-safe upgrades with rollback on failure

### 3. **Clean Separation of Concerns**
- **Table Manager**: Handles schema creation
- **Seed Manager**: Handles data insertion
- **Migration Manager**: Handles schema changes
- **Database Manager**: Orchestrates all operations

### 4. **Development Tools**
- Database health checks
- Development-only reset functionality
- Comprehensive logging
- Error handling with rollback

## Usage Examples

### Basic Database Operations

```php
// Initialize database (activation)
$db_manager = new Pika_Database_Manager();
$db_manager->initialize();

// Check if upgrade needed
if ($db_manager->needs_upgrade()) {
    $db_manager->upgrade();
}

// Check database health
$is_healthy = $db_manager->check_health();
```

### Development Operations

```php
// Reset database (development only)
$db_manager->reset_database();

// Clear user data
$seed_manager = new Pika_Seed_Manager();
$seed_manager->clear_user_data($user_id);
```

## Migration System

### Creating New Migrations

1. Create a new file in `migrations/` directory
2. Follow naming convention: `XXX_description.php`
3. Implement `up()` and optionally `down()` methods
4. Add to `$migrations` array in `Migration_Manager`

### Example Migration

```php
class Pika_Migration_Add_New_Feature {
    public function up() {
        // Create new table or modify existing
    }
    
    public function down() {
        // Rollback changes
    }
}
```

## Benefits Over Previous System

1. **Maintainability**: Database logic is centralized and organized
2. **Testability**: Each component can be tested independently
3. **Scalability**: Easy to add new migrations and features
4. **Safety**: Transaction-based upgrades with rollback capability
5. **Clarity**: Clear separation between schema, data, and migrations
6. **Flexibility**: Easy to extend and modify database operations

## Migration from Old System

The old database methods in `activator.php` are deprecated but maintained for backward compatibility. They now delegate to the new database manager.

## Security

- All database operations use WordPress's `$wpdb` with proper escaping
- Direct access to database directory is prevented
- Development-only operations require `WP_DEBUG` to be enabled
