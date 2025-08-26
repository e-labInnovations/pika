import React, { useEffect, useState } from 'react';
import { TrendingDown, TrendingUp, RefreshCw, Settings, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
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

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Latest transactions and system activities</p>
      </CardHeader>
      
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 flex-grow">
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
                        <Badge variant={getStatusBadgeVariant(activity.status)}>
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      {activities.length > 0 && (
        <CardFooter className="bg-gray-50">
          <Button variant="ghost" size="sm">
            View All Activity
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RecentActivity;
