import React, { useEffect, useState } from 'react';
import { MessageSquare, CheckCircle, Clock, AlertCircle, Loader2, RefreshCw, Search, Filter, Eye, Trash2, Users, Target, BarChart3, Send } from 'lucide-react';
import AdminCard from '../../AdminCard';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import apiFetch from '@wordpress/api-fetch';

interface RecentNotification {
  id: number;
  title: string;
  body: string;
  status: 'delivered' | 'read' | 'clicked' | 'dismissed' | 'unread';
  target: 'all_users' | 'specific_users';
  sent_at: string;
  delivered_count: number;
  total_count: number;
  user_ids?: number[];
  icon?: string;
  tag?: string;
  created_at: string;
  updated_at: string;
  target_users: number;
  total_devices: number;
}

interface RecentNotificationsTableProps {
  onNotificationChange?: (notification: RecentNotification) => void;
}

interface NotificationFilters {
  status: string;
  target: string;
  search: string;
  dateRange: string;
}

interface NotificationStats {
  total_notifications: number;
  delivered_notifications: number;
  failed_notifications: number;
  pending_notifications: number;
  total_users_reached: number;
  total_devices_reached: number;
}

const RecentNotificationsTable: React.FC<RecentNotificationsTableProps> = ({ onNotificationChange }) => {
  const [notifications, setNotifications] = useState<RecentNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NotificationFilters>({
    status: 'all',
    target: 'all',
    search: '',
    dateRange: '7days'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    total: 0,
    totalPages: 0
  });
  const [selectedNotification, setSelectedNotification] = useState<RecentNotification | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Load notifications on component mount and when filters/pagination change
  useEffect(() => {
    loadNotifications();
  }, [filters, pagination.page, pagination.perPage]);

  // Load notifications from backend
  const loadNotifications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        per_page: pagination.perPage.toString(),
        status: filters.status,
        target: filters.target,
        search: filters.search,
        date_range: filters.dateRange
      });

      const response = await apiFetch({
        path: `/pika/v1/admin/notifications?${params.toString()}`,
        method: 'GET'
      }) as any;
      
      if (response && response.success && response.data) {
        setNotifications(response.data.notifications);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.total_pages
        }));
        
        // Calculate stats from notifications
        calculateStats(response.data.notifications);
      } else {
        setError('Failed to load notifications');
      }
    } catch (err: any) {
      console.error('Failed to load notifications:', err);
      setError(err.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate notification statistics
  const calculateStats = (notifications: RecentNotification[]) => {
    const stats: NotificationStats = {
      total_notifications: notifications.length,
      delivered_notifications: notifications.filter(n => n.status === 'delivered' || n.status === 'read' || n.status === 'clicked').length,
      failed_notifications: notifications.filter(n => n.status === 'dismissed').length,
      pending_notifications: notifications.filter(n => n.status === 'unread').length,
      total_users_reached: notifications.reduce((sum, n) => sum + n.target_users, 0),
      total_devices_reached: notifications.reduce((sum, n) => sum + n.total_devices, 0)
    };
    setStats(stats);
  };

  // Map backend status to display status
  const mapBackendStatus = (status: string): string => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'read':
        return 'Read';
      case 'clicked':
        return 'Clicked';
      case 'dismissed':
        return 'Dismissed';
      case 'unread':
        return 'Unread';
      default:
        return 'Unknown';
    }
  };

  // Refresh notifications
  const refreshNotifications = () => {
    loadNotifications();
  };

  // Update filters
  const updateFilter = (key: keyof NotificationFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      target: 'all',
      search: '',
      dateRange: '7days'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Change page
  const changePage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // View notification details
  const viewNotification = async (notification: RecentNotification) => {
    try {
      const response = await apiFetch({
        path: `/pika/v1/admin/notifications/${notification.id}`,
        method: 'GET'
      }) as any;
      
      if (response && response.success && response.data) {
        setSelectedNotification(response.data);
        if (onNotificationChange) {
          onNotificationChange(response.data);
        }
      }
    } catch (err: any) {
      console.error('Failed to load notification details:', err);
      setError('Failed to load notification details');
    }
  };

  // Delete notification
  const deleteNotification = async (id: number) => {
    if (!confirm('Are you sure you want to delete this notification? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(id);
    
    try {
      const response = await apiFetch({
        path: `/pika/v1/admin/notifications/${id}`,
        method: 'DELETE'
      }) as any;
      
      if (response && response.success) {
        // Remove from local state
        setNotifications(prev => prev.filter(n => n.id !== id));
        
        // Update stats
        if (stats) {
          setStats(prev => prev ? {
            ...prev,
            total_notifications: prev.total_notifications - 1
          } : null);
        }
        
        // Show success message (you could add a toast notification here)
        console.log('Notification deleted successfully');
      } else {
        setError('Failed to delete notification');
      }
    } catch (err: any) {
      console.error('Failed to delete notification:', err);
      setError('Failed to delete notification');
    } finally {
      setIsDeleting(null);
    }
  };

  // Send broadcast notification
  const sendBroadcastNotification = async () => {
    const title = prompt('Enter notification title:');
    if (!title) return;
    
    const body = prompt('Enter notification message:');
    if (!body) return;
    
    try {
      const response = await apiFetch({
        path: '/pika/v1/admin/notifications/broadcast',
        method: 'POST',
        data: {
          title,
          body,
          tag: 'admin-broadcast',
          require_interaction: false,
          silent: false
        }
      }) as any;
      
      if (response && response.success) {
        // Refresh notifications to show the new one
        loadNotifications();
        console.log('Broadcast notification sent successfully');
      } else {
        setError('Failed to send broadcast notification');
      }
    } catch (err: any) {
      console.error('Failed to send broadcast notification:', err);
      setError('Failed to send broadcast notification');
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'read':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'clicked':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'dismissed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'unread':
        return <MessageSquare className="h-4 w-4 text-yellow-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'read':
        return 'default';
      case 'clicked':
        return 'secondary';
      case 'dismissed':
        return 'destructive';
      case 'unread':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Get target badge variant
  const getTargetBadgeVariant = (target: string) => {
    return target === 'all_users' ? 'default' : 'secondary';
  };

  // Get delivery rate badge variant
  const getDeliveryRateBadgeVariant = (rate: number) => {
    if (rate >= 90) return 'success';
    if (rate >= 70) return 'warning';
    return 'destructive';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Calculate delivery rate
  const getDeliveryRate = (delivered: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((delivered / total) * 100);
  };

  if (isLoading && notifications.length === 0) {
    return (
      <AdminCard title="Admin Notification Management" subtitle="Monitor and manage all system notifications">
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 mx-auto text-blue-600 animate-spin mb-3" />
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      </AdminCard>
    );
  }

  return (
    <AdminCard title="Admin Notification Management" subtitle="Monitor and manage all system notifications">
      <div className="space-y-6">
        {/* Statistics Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Total</p>
                  <p className="text-lg font-bold text-blue-600">{stats.total_notifications}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-900">Delivered</p>
                  <p className="text-lg font-bold text-green-600">{stats.delivered_notifications}</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-red-900">Dismissed</p>
                  <p className="text-lg font-bold text-red-600">{stats.failed_notifications}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Unread</p>
                  <p className="text-lg font-bold text-blue-600">{stats.pending_notifications}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Users Reached</p>
                  <p className="text-lg font-bold text-purple-600">{stats.total_users_reached}</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-orange-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-orange-900">Devices Reached</p>
                  <p className="text-lg font-bold text-orange-600">{stats.total_devices_reached}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? 'secondary' : 'outline'}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            <Button
              onClick={refreshNotifications}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Button
              onClick={sendBroadcastNotification}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Broadcast</span>
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            {pagination.total} notifications
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select onValueChange={(value) => updateFilter('status', value)} defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="clicked">Clicked</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                <Select onValueChange={(value) => updateFilter('target', value)} defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Targets</SelectItem>
                    <SelectItem value="all_users">All Users</SelectItem>
                    <SelectItem value="specific_users">Specific Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <Select onValueChange={(value) => updateFilter('dateRange', value)} defaultValue="7days">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    placeholder="Search notifications..."
                    className="w-full pl-10 pr-3"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                onClick={clearFilters}
                variant="outline"
                className="text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Notifications Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(notification.status)}
                      <Badge variant="default">
                        {mapBackendStatus(notification.status)}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                      <p className="text-sm text-gray-500 truncate">{notification.body}</p>
                      {notification.icon && (
                        <div className="flex items-center mt-1">
                          <img src={notification.icon} alt="Icon" className="w-4 h-4 mr-2" />
                          <span className="text-xs text-gray-400">{notification.tag}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <Badge variant={
                        getTargetBadgeVariant(notification.target)
                      }>
                        {notification.target === 'all_users' ? 'All Users' : 'Specific Users'}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.target_users} users, {notification.total_devices} devices
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(notification.sent_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <span>{notification.delivered_count.toLocaleString()}/{notification.total_count.toLocaleString()}</span>
                        <Badge variant={
                          // Only allow valid variants: "default", "destructive", "outline", "secondary"
                          (() => {
                            const rate = getDeliveryRate(notification.delivered_count, notification.total_count);
                            if (rate >= 95) return "default";
                            if (rate >= 80) return "secondary";
                            if (rate >= 50) return "outline";
                            return "destructive";
                          })()
                        }>
                          {getDeliveryRate(notification.delivered_count, notification.total_count)}%
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => viewNotification(notification)}
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => deleteNotification(notification.id)}
                        disabled={isDeleting === notification.id}
                        variant="ghost"
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                        title="Delete notification"
                      >
                        {isDeleting === notification.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.perPage) + 1} to {Math.min(pagination.page * pagination.perPage, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1}
                variant="outline"
                className="text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    onClick={() => changePage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      page === pagination.page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </Button>
                );
              })}
              
              <Button
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                variant="outline"
                className="text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No notifications found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or send a new notification</p>
          </div>
        )}
      </div>
    </AdminCard>
  );
};

export default RecentNotificationsTable;
