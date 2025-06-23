# Pika Financial Management WordPress Plugin

[![WordPress](https://img.shields.io/badge/WordPress-5.0+-blue.svg)](https://wordpress.org/)
[![PHP](https://img.shields.io/badge/PHP-7.4+-green.svg)](https://php.net/)
[![License](https://img.shields.io/badge/License-GPL%20v2%2B-orange.svg)](https://www.gnu.org/licenses/gpl-2.0.html)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)](https://github.com/your-username/pika)

> A comprehensive financial management solution for WordPress that helps users track income, expenses, transfers, and manage their financial data with a modern PWA interface.

## 🌟 Features

- **📊 Financial Tracking**: Complete income, expense, and transfer management
- **🏦 Account Management**: Multiple accounts with balance tracking
- **👥 People Management**: Track transactions with contacts and people
- **🏷️ Categories & Tags**: Organize transactions with customizable categories and tags
- **📱 PWA Interface**: Modern Progressive Web App for mobile and desktop
- **📈 Analytics**: Monthly summaries, weekly expenses, and account balances
- **📎 File Attachments**: Upload receipts and documents
- **🔐 WordPress Integration**: Seamless integration with WordPress user system
- **🛡️ Security**: WordPress authentication and data sanitization

## 📋 Requirements

- **WordPress**: 5.0 or higher
- **PHP**: 7.4 or higher
- **MySQL**: 5.6 or higher
- **Web Server**: Apache/Nginx with mod_rewrite enabled

## 🚀 Quick Start

### 1. Installation

1. **Download the Plugin**

   ```bash
   git clone https://github.com/your-username/pika.git
   ```

2. **Upload to WordPress**

   - Copy the `pika` folder to `/wp-content/plugins/`
   - Or upload via WordPress admin → Plugins → Add New → Upload Plugin

3. **Activate the Plugin**

   - Go to WordPress Admin → Plugins
   - Find "Pika Financial Management" and click "Activate"

4. **Database Setup**
   - The plugin will automatically create required database tables
   - System categories and tags will be inserted automatically

### 2. Access the Application

- **Admin Dashboard**: WordPress Admin → Pika
- **PWA Application**: `https://yourdomain.com/pika/`
- **API Endpoints**: `https://yourdomain.com/wp-json/pika/v1/`

## ��️ Architecture

### WordPress REST API Integration

Pika follows WordPress best practices by extending `WP_REST_Controller` for all API endpoints. This provides:

- **🔧 Built-in Features**: Schema validation, pagination, response formatting
- **📚 Automatic Documentation**: WordPress generates API docs at `/wp-json/pika/v1/`
- **🛡️ Security**: WordPress authentication and permission handling
- **🔄 Consistency**: Standard HTTP methods and status codes
- **🧪 Testing**: WordPress testing utilities and framework integration

#### Controller Architecture

```php
// Base controller extends WP_REST_Controller
abstract class Pika_Base_Controller extends WP_REST_Controller {
    protected $namespace = 'pika/v1';

    // Custom Pika-specific methods
    protected function check_auth() { /* ... */ }
    protected function get_sanitized_data() { /* ... */ }
}

// Specific controllers extend the base
class Pika_Accounts_Controller extends Pika_Base_Controller {
    public function register_routes() {
        register_rest_route($this->namespace, '/accounts', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_items'],
                'permission_callback' => [$this, 'check_auth'],
                'args' => $this->get_collection_params(),
            ],
        ]);
    }

    public function get_item_schema() {
        // JSON schema for automatic validation and documentation
    }
}
```

For detailed information about our WordPress REST API implementation, see [WP_REST_CONTROLLER_GUIDE.md](docs/WP_REST_CONTROLLER_GUIDE.md).

### Plugin Structure

```
pika/
├── pika.php                    # Main plugin file
├── uninstall.php               # Uninstall script
├── backend/                    # Backend PHP files
│   ├── class-pika-loader.php   # Plugin loader
│   ├── activator.php           # Database setup
│   ├── deactivator.php         # Deactivation handler
│   ├── utils.php               # Utility functions
│   ├── api-loader.php          # REST API registration
│   ├── pwa-loader.php          # PWA frontend serving
│   ├── controllers/            # API controllers
│   │   ├── base-controller.php # Base controller class
│   │   ├── auth-controller.php # Authentication endpoints
│   │   ├── accounts-controller.php # Account management
│   │   ├── people-controller.php # People management
│   │   ├── categories-controller.php # Category management
│   │   ├── tags-controller.php # Tag management
│   │   ├── transactions-controller.php # Transaction management
│   │   ├── analytics-controller.php # Analytics endpoints
│   │   ├── upload-controller.php # File upload handling
│   │   └── settings-controller.php # Settings management
│   ├── managers/               # Business logic managers
│   └── admin/                  # Admin interface
│       └── admin-page.php      # WordPress admin page
├── frontend/                   # React frontend (development)
├── frontend-build/             # Built React app (production)
└── assets/                     # Plugin assets
```

### Database Schema

The plugin creates 8 custom tables:

- `wp_pika_accounts` - User accounts and balances
- `wp_pika_people` - Contacts and people management
- `wp_pika_categories` - Transaction categories (hierarchical)
- `wp_pika_tags` - Transaction tags
- `wp_pika_transactions` - Financial transactions
- `wp_pika_transaction_tags` - Transaction-tag relationships
- `wp_pika_transaction_attachments` - File attachments
- `wp_pika_user_settings` - User preferences

## 🔌 API Reference

### Base URL

```
/wp-json/pika/v1
```

### Authentication

All endpoints require WordPress user authentication via Application Passwords.

### Core Endpoints

#### Authentication

- `GET /auth/me` - Get current user information
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh access token

#### Accounts

- `GET /accounts` - List user accounts
- `POST /accounts` - Create new account
- `GET /accounts/{id}` - Get account details
- `PUT /accounts/{id}` - Update account
- `DELETE /accounts/{id}` - Delete account

#### People

- `GET /people` - List people/contacts
- `POST /people` - Create new person
- `GET /people/{id}` - Get person details
- `PUT /people/{id}` - Update person
- `DELETE /people/{id}` - Delete person

#### Categories

- `GET /categories` - List categories
- `POST /categories` - Create new category
- `GET /categories/{id}` - Get category details
- `PUT /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category

#### Transactions

- `GET /transactions` - List transactions with filtering
- `POST /transactions` - Create new transaction
- `GET /transactions/{id}` - Get transaction details
- `PUT /transactions/{id}` - Update transaction
- `DELETE /transactions/{id}` - Delete transaction

#### Analytics

- `GET /analytics/monthly-summary` - Monthly financial summary
- `GET /analytics/weekly-expenses` - Weekly expense breakdown
- `GET /analytics/account-balances` - Account balance summary

#### File Upload

- `POST /upload/{type}` - Upload files (avatars/attachments)

#### Settings

- `GET /settings` - Get user settings
- `PUT /settings` - Update user settings

### API Features

#### Standard Parameters

All collection endpoints support:

- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 20, max: 100)
- `search` - Search term
- `sort_by` - Sort field
- `sort_direction` - Sort direction (asc/desc)

#### Response Format

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "total_pages": 5,
    "current_page": 1
  }
}
```

#### Error Handling

```json
{
  "code": "error_code",
  "message": "Error message",
  "data": {
    "status": 400
  }
}
```

## 🛠️ Development

### Prerequisites

- WordPress development environment
- PHP 7.4+
- MySQL 5.6+
- Node.js (for frontend development)

### Local Development Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/pika.git
   cd pika
   ```

2. **Set Up WordPress**

   - Install WordPress locally (XAMPP, Local, etc.)
   - Copy the plugin to `/wp-content/plugins/`
   - Activate the plugin

3. **Frontend Development**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   cp -r dist/* ../frontend-build/
   ```

### API Testing

```bash
# Test authentication
curl -X GET "https://yourdomain.com/wp-json/pika/v1/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test accounts endpoint
curl -X GET "https://yourdomain.com/wp-json/pika/v1/accounts" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create new account
curl -X POST "https://yourdomain.com/wp-json/pika/v1/accounts" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Checking Account",
    "icon": "wallet",
    "bg_color": "#3B82F6",
    "color": "#ffffff",
    "description": "Main checking account"
  }'
```

## 🔧 Configuration

### WordPress Settings

- **Permalinks**: Set to "Post name" for clean URLs
- **Application Passwords**: Enable for API authentication
- **File Uploads**: Ensure upload directory is writable

### Plugin Settings

Access via WordPress Admin → Pika → Settings

- **Default Currency**: Set default currency for new users
- **Date Format**: Configure date display format
- **Upload Limit**: Set maximum file upload size

## 🧪 Testing

### Manual Testing Checklist

- [ ] Plugin activation and database setup
- [ ] Admin page access and functionality
- [ ] API endpoint registration
- [ ] Authentication endpoints
- [ ] CRUD operations for all entities
- [ ] File upload functionality
- [ ] PWA access and routing
- [ ] Error handling and validation

### WordPress Debug Mode

Enable debug mode in `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## 📦 Deployment

### Production Deployment

1. **Build Frontend**

   ```bash
   npm run build
   cp -r dist/* frontend-build/
   ```

2. **Upload Plugin**

   - Upload the entire `pika` folder to `/wp-content/plugins/`
   - Activate the plugin in WordPress admin

3. **Configure Server**
   - Ensure mod_rewrite is enabled
   - Set proper file permissions
   - Configure SSL for secure API access

### Security Considerations

- Use HTTPS for all API communications
- Implement proper user authentication
- Regular security updates
- Database backup procedures

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Follow Coding Standards**
   - WordPress coding standards for PHP
   - ESLint configuration for JavaScript
   - Proper documentation
4. **Test Thoroughly**
   - Unit tests for new functionality
   - Manual testing on different environments
5. **Submit a Pull Request**

### Development Guidelines

- Follow WordPress coding standards
- Add proper error handling
- Include documentation for new features
- Test on multiple WordPress versions
- Ensure backward compatibility

## 📄 License

This project is licensed under the GPL v2 or later - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation

- [API Documentation](docs/API.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [User Manual](docs/USER_MANUAL.md)

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/your-username/pika/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/pika/discussions)
- **Email**: support@pika.elabins.com

### Community

- **WordPress.org**: [Plugin Page](https://wordpress.org/plugins/pika-financial/)
- **Discord**: [Join our community](https://discord.gg/pika)
- **Twitter**: [@PikaFinancial](https://twitter.com/PikaFinancial)

## 🙏 Acknowledgments

- **WordPress Community** - For the amazing platform
- **React Team** - For the frontend framework
- **Contributors** - Everyone who contributed to this project

## 📈 Roadmap

### Version 1.1 (Q2 2025)

- [ ] Advanced analytics and reporting
- [ ] Budget planning and tracking
- [ ] Export/import functionality
- [ ] Multi-currency support

### Version 1.2 (Q3 2025)

- [ ] Mobile app (React Native)
- [ ] Receipt scanning with AI
- [ ] Bank account integration
- [ ] Advanced filtering and search

### Version 2.0 (Q4 2025)

- [ ] Team/family accounts
- [ ] Advanced permissions
- [ ] API rate limiting
- [ ] Webhook support

---

**Made with ❤️ by the Pika Team**

[Website](https://pika.elabins.com) • [Documentation](https://docs.pika.elabins.com) • [Support](https://support.pika.elabins.com)
