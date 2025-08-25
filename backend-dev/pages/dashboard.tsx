import React, { useState, useEffect } from 'react';
import { Users, Activity, CreditCard, Database, Bell, Bot } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import UserGrowthChart from '../components/UserGrowthChart';
import SystemStatus from '../components/SystemStatus';
import ApiUsageCard from '../components/ApiUsageCard';
import TopUsersTable from '../components/TopUsersTable';
import RecentActivity from '../components/RecentActivity';
import QuickActions from '../components/QuickActions';
import DashboardHeader from '../components/DashboardHeader';
import apiFetch from '@wordpress/api-fetch';

interface Stats {
  totalUsers: {
    value: number;
    change: {
      value: number;
      isPositive: boolean;
    };
  };
  activeUsers: {
    value: number;
    change: {
      value: number;
      isPositive: boolean;
    };
  };
  totalTransactions: {
    value: number;
    change: {
      value: number;
      isPositive: boolean;
    };
  };
  geminiApiCalls: {
    value: number;
    change: {
      value: number;
      isPositive: boolean;
    };
  };
  systemHealth: string;
  databaseSize: number;
  geminiApiCost: number;
  pushNotificationsSent: number;
  lastBackup: string;
}

const quickActions = [
  {
    id: 'send-notification',
    title: 'Send Push Notification',
    description: 'Broadcast message to specific users or all users',
    icon: <Bell className="h-5 w-5 text-white" />,
    iconColor: 'bg-blue-600',
    action: () => console.log('Send notification clicked'),
    href: '#'
  },
  {
    id: 'manage-users',
    title: 'Manage Users',
    description: 'View, edit, or suspend user accounts',
    icon: <Users className="h-5 w-5 text-white" />,
    iconColor: 'bg-green-600',
    action: () => console.log('Manage users clicked'),
    href: '#'
  },
  {
    id: 'api-settings',
    title: 'API Settings',
    description: 'Configure Gemini API keys and rate limits',
    icon: <Database className="h-5 w-5 text-white" />,
    iconColor: 'bg-purple-600',
    action: () => console.log('API settings clicked'),
    href: '#'
  },
  {
    id: 'system-backup',
    title: 'System Backup',
    description: 'Create manual backup or restore from backup',
    icon: <Database className="h-5 w-5 text-white" />,
    iconColor: 'bg-orange-600',
    action: () => console.log('System backup clicked'),
    href: '#'
  }
];

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats | undefined>(undefined);

  useEffect(() => {
    apiFetch({
      path: '/pika/v1/admin/stats',
      method: 'GET'
    }).then((stats) => {
      setStats(stats as Stats);
      setIsLoading(false);
    }).catch((error) => {
      console.error('Error fetching stats:', error);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-200 rounded"></div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        {/* Admin Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            stats={stats?.totalUsers}
            icon={<Users className="h-6 w-6 text-white" />}
            iconColor="bg-blue-600"
          />
          <StatsCard
            title="Active Users"
            stats={stats?.activeUsers}
            icon={<Activity className="h-6 w-6 text-white" />}
            iconColor="bg-green-600"
          />
          <StatsCard
            title="Total Transactions"
            stats={stats?.totalTransactions}
            icon={<CreditCard className="h-6 w-6 text-white" />}
            iconColor="bg-purple-600"
          />
          <StatsCard
            title="Gemini API Calls"
            stats={stats?.geminiApiCalls}
            icon={<Bot className="h-6 w-6 text-white" />}
            iconColor="bg-orange-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="lg:col-span-2">
              <UserGrowthChart />
          </div>

          {/* System Status & API Usage */}
          <div className="space-y-6">
            <SystemStatus databaseSize={stats?.databaseSize || 0} systemHealth={stats?.systemHealth || 'healthy'} geminiApiCost={stats?.geminiApiCost || 0} lastBackup={stats?.lastBackup || 'N/A'} />
            <ApiUsageCard 
              geminiApiCalls={stats?.geminiApiCalls.value || 0}
              geminiApiCost={stats?.geminiApiCost || 0}
              pushNotificationsSent={stats?.pushNotificationsSent || 0}
            />
          </div>
        </div>

        {/* Top Users Section */}
        <div className="mb-8">
          <TopUsersTable />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <QuickActions actions={quickActions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;