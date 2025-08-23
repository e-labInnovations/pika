import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import TabsLayout from '@/layouts/tabs';
import AsyncStateWrapper from '@/components/async-state-wrapper';
import { Bell, BellOff, Smartphone, Monitor } from 'lucide-react';

const NotificationsSettings = () => {
  const {
    isSupported,
    isSubscribed,
    isEnabled,
    isLoading,
    error,
    subscribe,
    enable,
    disable,
    sendTestNotification,
    status,
    refreshStatus,
    refreshNotifications,
  } = usePushNotifications();

  const [showTestNotification, setShowTestNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Auto-clear messages after 5 seconds
  const clearMessages = () => {
    setTimeout(() => {
      setSuccessMessage(null);
      setLocalError(null);
    }, 5000);
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    try {
      // Clear previous messages
      setLocalError(null);
      setSuccessMessage(null);

      if (enabled) {
        if (!isSubscribed) {
          const success = await subscribe();
          if (!success) {
            // Error is already set in the hook
            return;
          }
          setSuccessMessage('Successfully subscribed to push notifications!');
          clearMessages();
        } else {
          const success = await enable();
          if (!success) {
            // Error is already set in the hook
            return;
          }
          setSuccessMessage('Push notifications enabled!');
          clearMessages();
        }
      } else {
        const success = await disable();
        if (!success) {
          // Error is already set in the hook
          return;
        }
        setSuccessMessage('Push notifications disabled!');
        clearMessages();
      }
    } catch (err) {
      console.error('Toggle notifications failed:', err);
      // Error is already handled in the hook
    }
  };

  const handleTestNotification = async () => {
    try {
      setLocalError(null);
      setSuccessMessage(null);

      const success = await sendTestNotification();

      if (success) {
        setSuccessMessage('Test notification sent! Check your browser notifications.');
        setShowTestNotification(true);
        // Hide the test notification indicator after 3 seconds
        setTimeout(() => setShowTestNotification(false), 3000);
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000);

        // Refresh notifications to show the new test notification
        await refreshNotifications();
      }
    } catch (err) {
      console.error('Test notification failed:', err);
      setLocalError('Failed to send test notification. Please try again.');
      // Clear error after 5 seconds
      setTimeout(() => setLocalError(null), 5000);
    }
  };

  // Early return for unsupported browsers
  if (!isSupported) {
    return (
      <TabsLayout
        header={{
          title: 'Notifications Settings',
          description: 'Manage your notifications settings',
          linkBackward: '/settings',
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellOff className="text-muted-foreground h-5 w-5" />
              Push Notifications Not Supported
            </CardTitle>
            <CardDescription>
              Your browser doesn't support push notifications. Please use a modern browser.
            </CardDescription>
          </CardHeader>
        </Card>
      </TabsLayout>
    );
  }

  return (
    <TabsLayout
      header={{
        title: 'Notifications Settings',
        description: 'Manage your notifications settings',
        linkBackward: '/settings',
      }}
    >
      <AsyncStateWrapper
        isLoading={isLoading}
        error={error}
        onRetry={() => {
          // Retry by refreshing status and notifications
          refreshStatus();
          refreshNotifications();
        }}
        className="space-y-6"
      >
        {/* Push Notifications Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Receive real-time notifications for transactions, reminders, and important updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications" className="text-sm font-medium">
                  Enable Push Notifications
                </Label>
                <p className="text-muted-foreground text-xs">
                  {isSubscribed ? 'You are subscribed to push notifications' : 'Subscribe to receive notifications'}
                </p>
              </div>
              <Switch
                id="notifications"
                checked={isEnabled}
                onCheckedChange={handleToggleNotifications}
                disabled={isLoading}
              />
            </div>

            {localError && (
              <div className="text-destructive bg-destructive/10 rounded-md p-3 text-sm">Error: {localError}</div>
            )}
            {successMessage && (
              <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-600 dark:border-green-800 dark:bg-green-950">
                {successMessage}
              </div>
            )}

            {status && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Badge variant={status.can_receive ? 'default' : 'secondary'}>
                  {status.can_receive ? 'Active' : 'Inactive'}
                </Badge>
                <span>•</span>
                <span>Subscription: {status.has_subscription ? 'Yes' : 'No'}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Device Management
            </CardTitle>
            <CardDescription>Manage your push notification subscriptions across devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">Current Device</span>
              </div>
              <Badge variant="outline">Web Browser</Badge>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleTestNotification} disabled={!isEnabled || isLoading}>
                Test Notification
              </Button>
              <Button variant="outline" size="sm" onClick={refreshStatus} disabled={isLoading}>
                Refresh Status
              </Button>
            </div>

            {showTestNotification && (
              <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-600 dark:border-green-800 dark:bg-green-950">
                Test notification sent! Check your browser notifications.
              </div>
            )}
          </CardContent>
        </Card>
      </AsyncStateWrapper>
    </TabsLayout>
  );
};

export default NotificationsSettings;
