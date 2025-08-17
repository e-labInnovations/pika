# Push Notifications Setup Guide

This guide explains how to implement server-side push notifications for the Pika Finance plugin using the web-push-php library.

## Overview

The push notification system consists of:
- **Backend**: PHP-based notification server using web-push-php
- **Frontend**: React-based client with service worker integration
- **Database**: Storage for notifications and device subscriptions
- **PWA**: Progressive Web App capabilities for offline notifications

## Prerequisites

- PHP 8.1+ with extensions: bcmath, mbstring, curl, openssl
- WordPress 6.0+
- HTTPS enabled (required for push notifications)

## Installation Steps

### 1. Install Web Push Library

#### Option A: Manual Installation (Recommended)

```bash
cd backend/libraries
chmod +x install-web-push.sh
./install-web-push.sh
```

This script will:
- Download web-push-php v9.0.2 from GitHub
- Extract and organize the files
- Create a custom autoloader

#### Option B: Manual Download

1. Download [web-push-php v9.0.2](https://github.com/web-push-libs/web-push-php/archive/refs/tags/v9.0.2.zip)
2. Extract to `backend/libraries/web-push/`
3. Ensure the `src/` folder contains the library files

### 2. Database Setup

The plugin will automatically run migrations when activated:

- **1.2.0**: `pika_notifications` and `pika_device_subscriptions` tables for push notifications

### 3. Backend Integration

The plugin automatically:
- Loads the library autoloader
- Initializes push notifications controller
- Registers REST API endpoints

### 4. Frontend Integration

The service worker is already configured in `vite.config.ts` and handles:
- Push notification events
- Notification display
- User interactions

## Architecture Changes

### Multiple Device Support

Users can now have multiple devices:
- Each device gets a unique subscription
- Notifications are sent to all active devices
- Device information is automatically detected

### Storage Strategy

- **VAPID Keys**: Stored in `wp_options` (app-level)
- **User Preferences**: Stored in `wp_usermeta`
- **Device Subscriptions**: Stored in `pika_device_subscriptions`
- **Notifications**: Stored in `pika_notifications`

## API Endpoints

### Authentication Required Endpoints

- `GET /wp-json/pika/v1/push/vapid-key` - Get VAPID public key
- `POST /wp-json/pika/v1/push/subscribe` - Subscribe device
- `POST /wp-json/pika/v1/push/unsubscribe` - Unsubscribe device
- `POST /wp-json/pika/v1/push/enable` - Enable notifications
- `POST /wp-json/pika/v1/push/disable` - Disable notifications
- `GET /wp-json/pika/v1/push/status` - Get user status
- `GET /wp-json/pika/v1/push/notifications` - Get user notifications
- `PUT /wp-json/pika/v1/push/notifications/{id}` - Update notification
- `DELETE /wp-json/pika/v1/push/notifications/{id}` - Delete notification

### Admin Only Endpoints

- `POST /wp-json/pika/v1/push/send` - Send notification to users

## Usage Examples

### Sending Notifications

#### To All Users
```php
$push_manager = new Pika_Push_Notifications_Manager();

$notification_data = [
    'title' => 'New Transaction',
    'body' => 'You have a new transaction to review',
    'icon' => '/pika/icons/pwa-192x192.png',
    'tag' => 'transaction',
    'data' => ['type' => 'transaction', 'id' => 123]
];

$push_manager->send_notification_to_all($notification_data);
$push_manager->flush_notifications();
```

#### To Specific Users
```php
$user_ids = [1, 2, 3];
$push_manager->send_notification_to_users($user_ids, $notification_data);
$push_manager->flush_notifications();
```

### Frontend Device Management

```tsx
// Subscribe with device ID
const subscribe = async () => {
  try {
    const deviceId = generateDeviceId(); // Generate unique device ID
    await pushNotificationsService.subscribe(subscription, deviceId);
  } catch (error) {
    console.error('Failed to subscribe:', error);
  }
};

// Get all user devices
const { data: devices } = await pushNotificationsService.getDevices();
```

## Configuration

### VAPID Keys

VAPID keys are automatically generated and stored in WordPress options. You can customize them by:

1. Setting environment variables:
```bash
export VAPID_PUBLIC_KEY="your_public_key"
export VAPID_PRIVATE_KEY="your_private_key"
```

2. Or manually updating options:
```php
update_option('pika_vapid_public_key', 'your_public_key');
update_option('pika_vapid_private_key', 'your_private_key');
```

### Device Management

The system automatically:
- Detects device type (web, mobile, desktop)
- Generates unique device IDs
- Tracks device activity
- Manages multiple subscriptions per user

## Security Considerations

1. **VAPID Keys**: Keep private keys secure, never expose them to the client
2. **User Permissions**: Always verify user ownership before modifying subscriptions
3. **Rate Limiting**: Implement rate limiting for notification sending
4. **HTTPS**: Push notifications only work over HTTPS
5. **User Consent**: Always request explicit permission before subscribing

## Testing

### Local Development

1. Use a tool like ngrok to expose your local server over HTTPS
2. Test with different browsers (Chrome, Firefox, Safari)
3. Test notification permissions and subscription flows
4. Test multiple devices per user

### Browser Testing

```javascript
// Check if push notifications are supported
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Push notifications supported');
} else {
  console.log('Push notifications not supported');
}

// Check permission status
if (Notification.permission === 'granted') {
  console.log('Permission granted');
} else if (Notification.permission === 'denied') {
  console.log('Permission denied');
} else {
  console.log('Permission not requested');
}
```

## Troubleshooting

### Common Issues

1. **"Push subscription failed"**
   - Check VAPID keys are correctly set
   - Verify HTTPS is enabled
   - Check browser console for errors
   - Ensure web-push library is properly installed

2. **"Service worker not found"**
   - Ensure service worker is properly registered
   - Check file paths in vite.config.ts
   - Clear browser cache

3. **"Permission denied"**
   - User must explicitly grant permission
   - Check browser notification settings
   - Try requesting permission again

4. **"Library not found"**
   - Verify web-push library is installed in `backend/libraries/web-push/`
   - Check autoloader is working
   - Ensure PHP extensions are installed

### Debug Mode

Enable debug logging in the service worker:

```typescript
const DEBUG_PUSH = true; // Set to true for debugging
```

### Logs

Check these locations for errors:
- Browser console (frontend errors)
- WordPress debug.log (backend errors)
- Service worker console (push events)

## Performance Optimization

1. **Batch Notifications**: Use `flush_notifications()` to send multiple notifications efficiently
2. **Device Cleanup**: Automatically remove expired subscriptions
3. **Rate Limiting**: Implement user-friendly notification frequency limits
4. **Caching**: Cache VAPID keys and user preferences

## Browser Support

- **Chrome**: 42+ (full support)
- **Firefox**: 44+ (full support)
- **Safari**: 16+ (limited support)
- **Edge**: 17+ (full support)

## Future Enhancements

1. **Rich Notifications**: Add images, actions, and custom layouts
2. **Notification Categories**: Group notifications by type
3. **Smart Scheduling**: Send notifications at optimal times
4. **Analytics**: Track notification engagement and effectiveness
5. **A/B Testing**: Test different notification strategies
6. **Device Sync**: Synchronize notifications across devices

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review browser console logs
3. Verify WordPress debug logs
4. Test with different browsers and devices
5. Ensure all dependencies are properly installed

## References

- [Web Push Protocol](https://tools.ietf.org/html/rfc8030)
- [web-push-php Documentation](https://github.com/web-push-libs/web-push-php)
- [MDN Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [MDN Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
