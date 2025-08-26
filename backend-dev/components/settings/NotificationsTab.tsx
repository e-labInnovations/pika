import React, { useState } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import NotificationForm from './notifications/NotificationForm';
import NotificationStats from './notifications/NotificationStats';
import RecentNotificationsTable from './notifications/RecentNotificationsTable';

interface NotificationSettings {
  title: string;
  body: string;
  icon?: string;
  target_users: 'all' | 'specific';
  specific_user_ids: number[];
}

const NotificationsTab = () => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    title: '',
    body: '',
    target_users: 'all',
    specific_user_ids: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Mock data for notification statistics
  const mockNotificationStats = {
    totalUsers: 1247,
    activeSubscriptions: 892,
    notificationsSent: 8920,
    recentNotifications: [
      {
        id: 1,
        title: 'Welcome to Pika Finance!',
        body: 'Get started with managing your finances efficiently',
        status: 'delivered',
        target: 'all_users',
        sent_at: '2024-01-15 10:30:00',
        delivered_count: 892,
        total_count: 892
      },
      {
        id: 2,
        title: 'New Feature Available',
        body: 'Try our new AI-powered transaction categorization',
        status: 'delivered',
        target: 'specific_users',
        sent_at: '2024-01-14 15:45:00',
        delivered_count: 156,
        total_count: 200
      },
      {
        id: 3,
        title: 'Weekly Summary',
        body: 'Your financial summary for this week is ready',
        status: 'sending',
        target: 'all_users',
        sent_at: '2024-01-13 09:00:00',
        delivered_count: 745,
        total_count: 892
      },
      {
        id: 4,
        title: 'Account Verification',
        body: 'Please verify your account to continue',
        status: 'failed',
        target: 'specific_users',
        sent_at: '2024-01-12 14:20:00',
        delivered_count: 23,
        total_count: 50
      }
    ]
  };

  // Send notification
  const sendNotification = async () => {
    if (!notificationSettings.title || !notificationSettings.body) {
      setMessage({ type: 'error', text: 'Please fill in title and body' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const payload = {
        title: notificationSettings.title,
        body: notificationSettings.body,
        icon: notificationSettings.icon,
        user_ids: notificationSettings.target_users === 'specific' ? notificationSettings.specific_user_ids : null
      };

      // TODO: Implement API call to send notification
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setMessage({ type: 'success', text: 'Notification sent successfully!' });
      
      // Reset form
      setNotificationSettings({
        title: '',
        body: '',
        target_users: 'all',
        specific_user_ids: []
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send notification' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle stats change from NotificationStats
  const handleStatsChange = (stats: any) => {
    // You can use this to update other components or perform additional actions
    // console.log('Stats updated:', stats);
  };

  // Handle notification change from RecentNotificationsTable
  const handleNotificationChange = (notification: any) => {
    // You can use this to update other components or perform additional actions
    // console.log('Notification updated:', notification);
  };

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Send Notification Form */}
      <NotificationForm
        notificationSettings={notificationSettings}
        onSettingsChange={setNotificationSettings}
        onSend={sendNotification}
        isLoading={isLoading}
      />

      {/* Notification Statistics */}
      <NotificationStats />

      {/* Recent Notifications Table */}
      <RecentNotificationsTable 
        onNotificationChange={handleNotificationChange}
      />
    </div>
  );
};

export default NotificationsTab;
