# Libraries Directory

This directory contains external PHP libraries and dependencies for the Pika Finance plugin.

## Structure

- `web-push/` - Web Push notification library (minishlink/web-push-php)
- `autoload.php` - Composer-style autoloader for libraries

## Installation

### Manual Installation (Recommended for production)

1. Download the required libraries
2. Place them in their respective folders
3. Update the autoloader if needed

### Using Composer (Development only)

```bash
cd backend/libraries
composer install
```

## Dependencies

### web-push-php
- **Version**: 9.0+
- **Source**: https://github.com/web-push-libs/web-push-php
- **Purpose**: Server-side push notification implementation
- **Requirements**: PHP 8.1+, OpenSSL with elliptic curve support

## Autoloading

The libraries are autoloaded using a custom autoloader that mimics Composer's PSR-4 structure.

## Security Notes

- Never commit vendor dependencies to version control
- Use specific versions for production stability
- Regularly update libraries for security patches
