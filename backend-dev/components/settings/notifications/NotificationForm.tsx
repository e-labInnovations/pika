import React from 'react';
import { Send } from 'lucide-react';
import AdminCard from '../../AdminCard';

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

const NotificationForm: React.FC<NotificationFormProps> = ({
  notificationSettings,
  onSettingsChange,
  onSend,
  isLoading
}) => {
  const updateSettings = (updates: Partial<NotificationSettings>) => {
    onSettingsChange({ ...notificationSettings, ...updates });
  };

  return (
    <AdminCard title="Send Push Notification" subtitle="Send notifications to users">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Title *
          </label>
          <input
            type="text"
            value={notificationSettings.title}
            onChange={(e) => updateSettings({ title: e.target.value })}
            placeholder="Enter notification title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Body *
          </label>
          <textarea
            value={notificationSettings.body}
            onChange={(e) => updateSettings({ body: e.target.value })}
            placeholder="Enter notification message"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon URL (optional)
          </label>
          <input
            type="url"
            value={notificationSettings.icon || ''}
            onChange={(e) => updateSettings({ icon: e.target.value })}
            placeholder="https://example.com/icon.png"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Users
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="target_users"
                value="all"
                checked={notificationSettings.target_users === 'all'}
                onChange={(e) => updateSettings({ target_users: e.target.value as 'all' | 'specific' })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-900">All users</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="target_users"
                value="specific"
                checked={notificationSettings.target_users === 'specific'}
                onChange={(e) => updateSettings({ target_users: e.target.value as 'all' | 'specific' })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-900">Specific users</span>
            </label>
          </div>
        </div>

        {notificationSettings.target_users === 'specific' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User IDs (comma-separated)
            </label>
            <input
              type="text"
              value={notificationSettings.specific_user_ids.join(', ')}
              onChange={(e) => {
                const ids = e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                updateSettings({ specific_user_ids: ids });
              }}
              placeholder="1, 2, 3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <button
          onClick={onSend}
          disabled={isLoading || !notificationSettings.title || !notificationSettings.body}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4 mr-2" />
          {isLoading ? 'Sending...' : 'Send Notification'}
        </button>
      </div>
    </AdminCard>
  );
};

export default NotificationForm;
