import React, { useState, useEffect } from 'react';
import { Send, TestTube, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import AdminCard from '../../AdminCard';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select } from '../../ui/select';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';
import apiFetch from '@wordpress/api-fetch';

interface NotificationSettings {
  title: string;
  body: string;
  icon?: string;
  target_users: 'all' | 'specific';
  specific_user_ids: number[];
}

interface NotificationFormProps {
  notificationSettings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
  onSend: () => void;
  isLoading: boolean;
}

interface SendResult {
  success: boolean;
  message: string;
  summary: {
    total_users: number;
    successful_users: number;
    total_devices: number;
    successful_devices: number;
  };
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  notificationSettings,
  onSettingsChange,
  onSend,
  isLoading
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateSettings = (updates: Partial<NotificationSettings>) => {
    onSettingsChange({ ...notificationSettings, ...updates });
  };

  const sendNotification = async () => {
    if (!notificationSettings.title || !notificationSettings.body) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSending(true);
    setError(null);
    setResult(null);

    try {
      const payload: any = {
        title: notificationSettings.title,
        body: notificationSettings.body,
        icon: notificationSettings.icon || undefined,
        tag: 'admin-notification',
        data: {
          type: 'admin',
          timestamp: Date.now()
        },
        require_interaction: false,
        silent: false
      };

      if (notificationSettings.target_users === 'specific' && notificationSettings.specific_user_ids.length > 0) {
        payload.user_ids = notificationSettings.specific_user_ids;
      }

      const response = await apiFetch({
        path: '/pika/v1/admin/push/send',
        method: 'POST',
        data: payload
      }) as any;

      if (response && response.success) {
        setResult(response);
        onSettingsChange({
          title: '',
          body: '',
          icon: '',
          target_users: 'all',
          specific_user_ids: []
        });
        onSend();
      } else {
        setError(response?.message || 'Failed to send notification');
      }
    } catch (err: any) {
      console.error('Failed to send notification:', err);
      setError(err.message || 'Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };

  const sendTestNotification = async () => {
    setIsTesting(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiFetch({
        path: '/pika/v1/admin/push/test',
        method: 'POST'
      }) as any;

      if (response && response.success) {
        setResult({
          success: true,
          message: response.message,
          summary: {
            total_users: 1,
            successful_users: response.success ? 1 : 0,
            total_devices: response.total_devices || 0,
            successful_devices: response.devices_sent || 0
          }
        });
      } else {
        setError(response?.message || 'Failed to send test notification');
      }
    } catch (err: any) {
      console.error('Failed to send test notification:', err);
      setError(err.message || 'Failed to send test notification');
    } finally {
      setIsTesting(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return (
    <AdminCard title="Send Push Notification" subtitle="Send notifications to users">
      <div className="space-y-4">
        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-green-800 mb-2">
                  {result.message}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="text-center p-2 bg-white rounded border border-green-200">
                    <div className="font-semibold text-green-700">{result.summary.total_users}</div>
                    <div className="text-xs text-green-600">Total Users</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-green-200">
                    <div className="font-semibold text-green-700">{result.summary.successful_users}</div>
                    <div className="text-xs text-green-600">Successful</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-green-200">
                    <div className="font-semibold text-green-700">{result.summary.total_devices}</div>
                    <div className="text-xs text-green-600">Total Devices</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-green-200">
                    <div className="font-semibold text-green-700">{result.summary.successful_devices}</div>
                    <div className="text-xs text-green-600">Devices Sent</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearResult}
                  className="mt-3 text-green-600 hover:text-green-800"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearResult}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Title *
          </label>
          <Input
            type="text"
            value={notificationSettings.title}
            onChange={(e) => updateSettings({ title: e.target.value })}
            placeholder="Enter notification title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Body *
          </label>
          <Input
            type="text"
            value={notificationSettings.body}
            onChange={(e: { target: { value: any; }; }) => updateSettings({ body: e.target.value })}
            placeholder="Enter notification message"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon URL (optional)
          </label>
          <Input
            type="url"
            value={notificationSettings.icon || ''}
            onChange={(e: { target: { value: any; }; }) => updateSettings({ icon: e.target.value })}
            placeholder="https://example.com/icon.png"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Target Users
          </Label>
          <RadioGroup
            value={notificationSettings.target_users}
            onValueChange={(value) => updateSettings({ target_users: value as 'all' | 'specific' })}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-users" />
              <Label htmlFor="all-users" className="text-sm text-gray-900">All users</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="specific" id="specific-users" />
              <Label htmlFor="specific-users" className="text-sm text-gray-900">Specific users</Label>
            </div>
          </RadioGroup>
        </div>

        {notificationSettings.target_users === 'specific' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User IDs (comma-separated)
            </label>
            <Input
              type="text"
              value={notificationSettings.specific_user_ids.join(', ')}
              onChange={(e: { target: { value: string; }; }) => {
                const ids = e.target.value.split(',').map((id: string) => parseInt(id.trim())).filter(id => !isNaN(id));
                updateSettings({ specific_user_ids: ids });
              }}
              placeholder="1, 2, 3"
            />
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            onClick={sendNotification}
            disabled={isSending || isTesting || !notificationSettings.title || !notificationSettings.body || isLoading}
          >
            <Send className="h-4 w-4" />
            Send Notification
          </Button>

          <Button
            onClick={sendTestNotification}
            disabled={isSending || isTesting || isLoading}
            variant="outline"
          >
            <TestTube className="h-4 w-4" />
            Send Test
          </Button>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          <p className="font-medium mb-1">How it works:</p>
          <ul className="space-y-1">
            <li>• <strong>All users:</strong> Sends to all users who have enabled push notifications</li>
            <li>• <strong>Specific users:</strong> Sends only to users with the specified IDs</li>
            <li>• <strong>Test notification:</strong> Sends a test notification to your own device</li>
            <li>• Notifications are sent immediately and stored in the database</li>
          </ul>
        </div>
      </div>
    </AdminCard>
  );
};

export default NotificationForm;
