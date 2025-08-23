import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useNavigate } from 'react-router-dom';
import { DynamicIcon } from '@/components/lucide';
import { toast } from 'sonner';

const NotificationIcon = () => {
  const navigate = useNavigate();
  const { isSupported, isSubscribed, isEnabled, isLoading, subscribe, enable, refreshStatus, unreadCount } =
    usePushNotifications();

  const handleNotificationClick = async () => {
    // If notifications are not enabled, try to enable them first
    if (!isEnabled && isSupported) {
      try {
        if (!isSubscribed) {
          // Request permission and subscribe
          const success = await subscribe();
          if (success) {
            toast.success('Push notifications enabled!');
            await refreshStatus();
          } else {
            toast.error('Failed to enable push notifications');
            return;
          }
        } else {
          // Already subscribed, just enable
          const success = await enable();
          if (success) {
            toast.success('Push notifications enabled!');
            await refreshStatus();
          } else {
            toast.error('Failed to enable push notifications');
            return;
          }
        }
      } catch (error) {
        console.error('Error enabling notifications:', error);
        toast.error('Failed to enable push notifications');
        return;
      }
    }

    // Navigate to notifications page
    navigate('/notifications');
  };

  const handlePermissionRequest = async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported in this browser');
      return;
    }

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        // Try to subscribe after permission is granted
        const success = await subscribe();
        if (success) {
          toast.success('Push notifications enabled!');
          await refreshStatus();
        } else {
          toast.error('Failed to subscribe to push notifications');
        }
      } else if (permission === 'denied') {
        toast.error('Notification permission denied. Please enable it in your browser settings.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission');
    }
  };

  // If not supported, don't show the icon
  if (!isSupported) {
    return null;
  }

  // If loading, show skeleton
  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="relative h-9 w-9 animate-pulse" disabled>
        <DynamicIcon name="bell" className="h-5 w-5" />
      </Button>
    );
  }

  // If not enabled and no permission, show permission request button
  if (!isEnabled && Notification.permission === 'default') {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground relative h-9 w-9"
        onClick={handlePermissionRequest}
        title="Enable push notifications"
      >
        <DynamicIcon name="bell-off" className="h-5 w-5" />
      </Button>
    );
  }

  // If not enabled but has permission, show disabled bell
  if (!isEnabled && Notification.permission === 'granted') {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground relative h-9 w-9"
        onClick={handleNotificationClick}
        title="Enable push notifications"
      >
        <DynamicIcon name="bell-off" className="h-5 w-5" />
      </Button>
    );
  }

  // Show enabled bell with notification count
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9"
      onClick={handleNotificationClick}
      title="View notifications"
    >
      <DynamicIcon name="bell" className="h-5 w-5" />

      {/* Notification count badge */}
      {unreadCount > 0 && (
        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs font-bold">
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
};

export default NotificationIcon;
