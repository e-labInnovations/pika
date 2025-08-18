# Libraries Directory

This directory contains external PHP libraries and dependencies for the Pika Finance plugin.

## Structure

- `web-push/` - Web Push notification library (minishlink/web-push-php)
- `autoload.php` - Composer-style autoloader for libraries

## Installation

### Using Docker Composer (Recommended)

```bash
docker run --rm \
  -v $(pwd):/app \
  -w /app/backend/libraries \
  composer install
```

### Manual Installation

1. Download the required libraries
2. Place them in their respective folders
3. Update the autoloader if needed

### Using Local Composer (Development only)

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

- Vendor dependencies are committed to version control and packaged with the plugin
- Use specific versions for production stability
- Regularly update libraries for security patches
- The vendor directory is tracked in Git to ensure the plugin works without requiring Composer installation on the target server
