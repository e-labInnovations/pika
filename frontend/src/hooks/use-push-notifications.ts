import { useState, useEffect, useCallback } from 'react';
import {
  pushNotificationsService,
  type PushSubscription,
  type NotificationStatus,
  type NotificationRecord,
} from '@/services/api';

export interface UsePushNotificationsReturn {
  // State
  isSupported: boolean;
  isSubscribed: boolean;
  isEnabled: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  enable: () => Promise<boolean>;
  disable: () => Promise<boolean>;
  sendTestNotification: () => Promise<boolean>;

  // Status
  status: NotificationStatus | null;

  // Notifications
  notifications: NotificationRecord[];
  markAsRead: (id: number) => Promise<void>;
  markAsClicked: (id: number) => Promise<void>;
  dismiss: (id: number) => Promise<void>;
  delete: (id: number) => Promise<void>;

  // Refresh
  refreshStatus: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<NotificationStatus | null>(null);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = async () => {
      console.log('🔍 Checking push notification support...');
      const supported = 'serviceWorker' in navigator && 'PushManager' in window;
      console.log('✅ Push notifications supported:', supported);
      setIsSupported(supported);

      if (supported) {
        // Check service worker registration
        try {
          console.log('🔍 Checking service worker registration...');
          await navigator.serviceWorker.getRegistration();
          console.log('✅ Service worker registration check completed');
        } catch (error) {
          console.error('❌ Error checking service worker registration:', error);
        }

        console.log('🔍 Starting subscription status check...');
        checkSubscriptionStatus();
      } else {
        console.log('❌ Push notifications not supported, setting loading to false');
        setIsLoading(false);
      }
    };

    checkSupport();
  }, []);

  // Check subscription status
  const checkSubscriptionStatus = useCallback(async () => {
    try {
      console.log('🔍 Starting subscription status check...');
      setError(null);

      // Always try to get status from server first
      try {
        console.log('🌐 Fetching status from server...');
        const statusResponse = await pushNotificationsService.getStatus();
        console.log('✅ Server status received:', statusResponse.data);
        setStatus(statusResponse.data);
        setIsEnabled(Boolean(statusResponse.data.enabled));
        setIsSubscribed(Boolean(statusResponse.data.has_subscription));
      } catch (statusErr) {
        console.error('❌ Failed to get server status:', statusErr);
        // Fall back to local check if server fails
        console.log('🔄 Falling back to local subscription check...');
        if (Notification.permission === 'granted') {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(Boolean(subscription));
          setIsEnabled(Boolean(subscription));
        } else {
          setIsSubscribed(false);
          setIsEnabled(false);
        }
        setStatus(null);
      }

      // Always load notifications
      console.log('📱 Loading notifications...');
      await loadNotifications();
      console.log('✅ Notifications loaded');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check subscription status';
      console.error('❌ Subscription status check failed:', err);
      setError(errorMessage);
    } finally {
      console.log('🏁 Setting loading to false');
      setIsLoading(false);
    }
  }, []);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    try {
      console.log('📱 Calling getNotifications API...');
      const response = await pushNotificationsService.getNotifications();
      console.log('✅ Notifications API response:', response);
      const notificationsData = response.data.notifications || [];
      console.log('📋 Notifications data:', notificationsData);
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
    } catch (err) {
      console.error('❌ Failed to load notifications:', err);
      // Set empty array on error to prevent UI issues
      setNotifications([]);
      // Don't set global error for notifications loading failure
    }
  }, []);

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      // Check current permission first
      let permission = Notification.permission;

      if (permission === 'default') {
        // Request permission
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Get VAPID key
      let vapidKey: string;
      try {
        const vapidResponse = await pushNotificationsService.getVapidKey();

        // Get VAPID key directly from response data
        vapidKey = vapidResponse.data.public_key;

        if (!vapidKey || typeof vapidKey !== 'string' || vapidKey.trim().length === 0) {
          throw new Error(`Invalid VAPID key received from server: ${JSON.stringify(vapidKey)}`);
        }
      } catch (vapidErr) {
        throw new Error(`Failed to get VAPID key: ${vapidErr instanceof Error ? vapidErr.message : 'Unknown error'}`);
      }

      // Convert VAPID key to Uint8Array
      let vapidKeyArray: Uint8Array;
      try {
        vapidKeyArray = urlBase64ToUint8Array(vapidKey);
      } catch (conversionErr) {
        throw new Error(
          `Invalid VAPID key format: ${conversionErr instanceof Error ? conversionErr.message : 'Unknown error'}`,
        );
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push manager
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKeyArray,
      });

      // Send subscription to server
      const subscriptionData: PushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
          auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
        },
      };

      try {
        await pushNotificationsService.subscribe(subscriptionData);
      } catch (subscribeErr) {
        // If server subscription fails, we should still unsubscribe from push manager
        await subscription.unsubscribe();
        throw new Error(
          `Server subscription failed: ${subscribeErr instanceof Error ? subscribeErr.message : 'Unknown error'}`,
        );
      }

      setIsSubscribed(true);
      setIsEnabled(true);

      // Refresh status
      await refreshStatus();

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe';
      setError(errorMessage);
      console.error('Subscription failed:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Get current subscription
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe from push manager
        await subscription.unsubscribe();
      }

      // Remove subscription from server
      try {
        await pushNotificationsService.unsubscribe();
      } catch (serverErr) {
        console.error('Server unsubscribe failed, but local unsubscribe succeeded:', serverErr);
        // Don't fail completely if server unsubscribe fails
      }

      setIsSubscribed(false);
      setIsEnabled(false);

      // Refresh status
      await refreshStatus();

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unsubscribe';
      setError(errorMessage);
      console.error('Unsubscribe failed:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enable notifications
  const enable = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      await pushNotificationsService.enable();
      setIsEnabled(true);

      // Refresh status
      await refreshStatus();

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enable notifications';
      setError(errorMessage);
      console.error('Enable notifications failed:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Disable notifications
  const disable = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      await pushNotificationsService.disable();
      setIsEnabled(false);

      // Refresh status
      await refreshStatus();

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disable notifications';
      setError(errorMessage);
      console.error('Disable notifications failed:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (id: number) => {
    try {
      await pushNotificationsService.markAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read_at: new Date().toISOString() } : notification,
        ),
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      // Show user-friendly error
      setError(`Failed to mark notification as read: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Mark notification as clicked
  const markAsClicked = useCallback(async (id: number) => {
    try {
      await pushNotificationsService.markAsClicked(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, clicked_at: new Date().toISOString() } : notification,
        ),
      );
    } catch (err) {
      console.error('Failed to mark notification as clicked:', err);
      // Show user-friendly error
      setError(`Failed to mark notification as clicked: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Dismiss notification
  const dismiss = useCallback(async (id: number) => {
    try {
      await pushNotificationsService.dismissNotification(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, dismissed_at: new Date().toISOString() } : notification,
        ),
      );
    } catch (err) {
      console.error('Failed to dismiss notification:', err);
      // Show user-friendly error
      setError(`Failed to dismiss notification: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (id: number) => {
    try {
      await pushNotificationsService.deleteNotification(id);

      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
      // Show user-friendly error
      setError(`Failed to delete notification: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Refresh status
  const refreshStatus = useCallback(async () => {
    try {
      const statusResponse = await pushNotificationsService.getStatus();

      // Set status directly from response data
      setStatus(statusResponse.data);
      setIsEnabled(Boolean(statusResponse.data.enabled));
      setIsSubscribed(Boolean(statusResponse.data.has_subscription));
    } catch (err) {
      console.error('Failed to refresh status:', err);
      // Don't set global error for status refresh failure
      // Just log it and keep current state
    }
  }, []);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    try {
      await loadNotifications();
    } catch (err) {
      console.error('Failed to refresh notifications:', err);
      // Ensure notifications is always an array
      setNotifications([]);
    }
  }, [loadNotifications]);

  // Send test notification
  const sendTestNotification = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);

      // Send test notification to server
      await pushNotificationsService.sendTestNotification();

      // Test notification sent successfully
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send test notification';
      setError(errorMessage);
      console.error('Test notification failed:', err);
      return false;
    }
  }, []);

  return {
    // State
    isSupported,
    isSubscribed,
    isEnabled,
    isLoading,
    error,

    // Actions
    subscribe,
    unsubscribe,
    enable,
    disable,
    sendTestNotification,

    // Status
    status,

    // Notifications
    notifications,
    markAsRead,
    markAsClicked,
    dismiss,
    delete: deleteNotification,

    // Refresh
    refreshStatus,
    refreshNotifications,
  };
}

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
