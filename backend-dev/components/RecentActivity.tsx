import React, { useEffect, useState } from 'react';
import { TrendingDown, TrendingUp, RefreshCw, Settings, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import apiFetch from '@wordpress/api-fetch';

interface ActivityItem {
  id: string;
  type: 'expense' | 'income' | 'transfer' | 'system';
  title: string;
  amount?: string;
  description: string;
  timestamp: string;
  status?: 'completed' | 'pending' | 'failed' | 'warning';
}

interface RecentActivityProps {
  className?: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ className = '' }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    apiFetch({ path: '/pika/v1/admin/activities' }).then((data) => {
      setActivities(data as ActivityItem[]);
    });
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expense':
        return { icon: <TrendingDown className="h-4 w-4 text-red-500" />, bgColor: 'bg-red-50' };
      case 'income':
        return { icon: <TrendingUp className="h-4 w-4 text-green-500" />, bgColor: 'bg-green-50' };
      case 'transfer':
        return { icon: <RefreshCw className="h-4 w-4 text-blue-500" />, bgColor: 'bg-blue-50' };
      case 'system':
        return { icon: <Settings className="h-4 w-4 text-gray-500" />, bgColor: 'bg-gray-50' };
      default:
        return { icon: <Activity className="h-4 w-4 text-gray-500" />, bgColor: 'bg-gray-50' };
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-600 mt-1">Latest transactions and system activities</p>
      </div>
      
      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const typeIcon = getTypeIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={cn("p-2 rounded-lg", typeIcon.bgColor)}>
                    {typeIcon.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      {activity.amount && (
                        <span className={cn("text-sm font-medium", {
                          'text-red-600': activity.type === 'expense',
                          'text-green-600': activity.type === 'income',
                          'text-gray-600': activity.type !== 'expense' && activity.type !== 'income'
                        })}>
                          {activity.type === 'expense' ? '-' : '+'}{activity.amount}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      {activity.status && (
                        <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getStatusColor(activity.status))}>
                          {activity.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
