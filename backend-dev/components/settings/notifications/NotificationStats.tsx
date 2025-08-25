import React from 'react';
import { Users, Bell, Send } from 'lucide-react';
import AdminCard from '../../AdminCard';

interface NotificationStatsProps {
  totalUsers: number;
  activeSubscriptions: number;
  notificationsSent: number;
}

const NotificationStats: React.FC<NotificationStatsProps> = ({
  totalUsers,
  activeSubscriptions,
  notificationsSent
}) => {
  return (
    <AdminCard title="Notification Statistics" subtitle="Overview of notification delivery">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-900">Total Users</p>
              <p className="text-2xl font-bold text-blue-600">{totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-900">Active Subscriptions</p>
              <p className="text-2xl font-bold text-green-600">{activeSubscriptions.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Send className="h-5 w-5 text-purple-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-purple-900">Notifications Sent</p>
              <p className="text-2xl font-bold text-purple-600">{notificationsSent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminCard>
  );
};

export default NotificationStats;
