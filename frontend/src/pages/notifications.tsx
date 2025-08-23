import { useState, useCallback, useEffect } from 'react';
import TabsLayout from '@/layouts/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import AsyncStateWrapper from '@/components/async-state-wrapper';
import { DynamicIcon } from '@/components/lucide';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { pushNotificationsService, type NotificationRecord } from '@/services/api';

const ITEMS_PER_PAGE = 20;

const NotificationsPage = () => {
  const {
    isLoading,
    error,
    notifications,
    markAsRead,
    delete: deleteNotification,
    refreshNotifications,
    refreshStatus,
    unreadCount,
  } = usePushNotifications();

  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allNotifications, setAllNotifications] = useState<NotificationRecord[]>([]);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const navigate = useNavigate();

  // Load notifications for a specific page
  const loadNotificationsPage = useCallback(
    async (page: number, append: boolean = false) => {
      if (isLoadingMore) return;

      setIsLoadingMore(true);

      try {
        const response = await pushNotificationsService.getNotifications(page, ITEMS_PER_PAGE);
        const { notifications: pageNotifications, pagination } = response.data;

        if (append) {
          setAllNotifications((prev) => [...prev, ...pageNotifications]);
        } else {
          setAllNotifications(pageNotifications);
        }

        setTotalNotifications(pagination.total);
        setHasMorePages(page < pagination.total_pages);
        setCurrentPage(page);
      } catch (error) {
        console.error('Failed to load notifications:', error);
        toast.error('Failed to load more notifications');
      } finally {
        setIsLoadingMore(false);
      }
    },
    [isLoadingMore],
  );

  // Load more notifications (next page)
  const loadMoreNotifications = useCallback(async () => {
    if (isLoadingMore || !hasMorePages) return;

    const nextPage = currentPage + 1;
    await loadNotificationsPage(nextPage, true);
  }, [isLoadingMore, hasMorePages, currentPage, loadNotificationsPage]);

  // Auto-load more when reaching the end
  useEffect(() => {
    if (hasMorePages && currentPage >= 1) {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Load more when user is near the bottom (within 200px)
        if (scrollTop + windowHeight >= documentHeight - 200) {
          loadMoreNotifications();
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [hasMorePages, currentPage, loadMoreNotifications]);

  // Load initial notifications
  useEffect(() => {
    if (notifications.length > 0 && allNotifications.length === 0) {
      // If we have notifications from the hook, use them as initial data
      setAllNotifications(notifications);
      setTotalNotifications(notifications.length);
      setHasMorePages(notifications.length > ITEMS_PER_PAGE);
    } else if (allNotifications.length === 0) {
      // Load first page from API
      loadNotificationsPage(1, false);
    }
  }, [notifications, allNotifications.length, loadNotificationsPage]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      toast.success('Marked as read');

      // Update local state
      setAllNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read_at: new Date().toISOString() } : notification,
        ),
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(id));
      await deleteNotification(id);
      toast.success('Notification deleted');

      // Remove from local state
      setAllNotifications((prev) => prev.filter((notification) => notification.id !== id));
      setTotalNotifications((prev) => prev - 1);

      // Check if we need to load more to maintain the display
      if (allNotifications.length <= ITEMS_PER_PAGE && hasMorePages) {
        await loadNotificationsPage(currentPage + 1, true);
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = allNotifications.filter((n) => !n.read_at);
      await Promise.all(unreadNotifications.map((n) => markAsRead(n.id)));
      toast.success('All notifications marked as read');

      // Update local state for all unread notifications
      setAllNotifications((prev) =>
        prev.map((notification) =>
          !notification.read_at ? { ...notification, read_at: new Date().toISOString() } : notification,
        ),
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Only show stats if there are notifications
  const shouldShowStats = allNotifications.length > 0;

  return (
    <TabsLayout
      header={{
        title: 'Notifications',
        description: 'Manage your notifications and preferences',
        linkBackward: '/',
      }}
    >
      <AsyncStateWrapper
        isLoading={isLoading}
        error={error}
        onRetry={() => {
          refreshStatus();
          refreshNotifications();
        }}
        className="space-y-4"
      >
        {/* Conditional Header Stats - only show if there are notifications */}
        {shouldShowStats && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalNotifications}</div>
                  <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Total</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{unreadCount}</div>
                  <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Unread</div>
                </div>
              </CardContent>
            </Card>

            <Card className="hidden border-0 bg-gradient-to-br from-slate-50 to-slate-100 lg:block dark:from-slate-950/20 dark:to-slate-900/20">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">{allNotifications.length}</div>
                  <div className="text-xs text-slate-600/70 dark:text-slate-400/70">Loaded</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <DynamicIcon name="check" className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => loadNotificationsPage(1, false)}>
              <DynamicIcon name="refresh-cw" className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/settings/notifications')}>
              <DynamicIcon name="settings" className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Notifications</CardTitle>
                <CardDescription>
                  {allNotifications.length === 0
                    ? 'No notifications yet'
                    : `Showing ${allNotifications.length} of ${totalNotifications} notifications`}
                </CardDescription>
              </div>
              {hasMorePages && <div className="text-muted-foreground text-xs">Scroll to load more</div>}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {allNotifications.length === 0 ? (
              <div className="py-12 text-center">
                <DynamicIcon name="bell-off" className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">No Notifications</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  You&apos;re all caught up! New notifications will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-border divide-y">
                {allNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      notification.read_at ? 'opacity-75' : ''
                    }`}
                  >
                    {/* Status indicator */}
                    <div
                      className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${
                        notification.read_at ? 'bg-slate-300 dark:bg-slate-600' : 'bg-emerald-500'
                      }`}
                    />

                    {/* Notification content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h4 className="truncate text-sm font-medium text-slate-900 dark:text-white">
                              {notification.title}
                            </h4>
                            {!notification.read_at && (
                              <Badge variant="secondary" className="flex-shrink-0 text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="mb-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                            {notification.body}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                            <DynamicIcon name="clock" className="h-3 w-3" />
                            {formatDate(notification.timestamp)}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-shrink-0 gap-1">
                          {!notification.read_at && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="h-7 px-2 text-xs"
                            >
                              <DynamicIcon name="check" className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(notification.id)}
                            disabled={deletingIds.has(notification.id)}
                            className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            {deletingIds.has(notification.id) ? (
                              <DynamicIcon name="loader-2" className="h-3 w-3 animate-spin" />
                            ) : (
                              <DynamicIcon name="trash-2" className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load More Indicator */}
                {hasMorePages && (
                  <div className="p-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadMoreNotifications}
                      disabled={isLoadingMore}
                      className="min-w-[120px]"
                    >
                      {isLoadingMore ? (
                        <>
                          <DynamicIcon name="loader-2" className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <DynamicIcon name="chevron-down" className="mr-2 h-4 w-4" />
                          Load More
                        </>
                      )}
                    </Button>
                    <p className="text-muted-foreground mt-2 text-xs">Or scroll down to automatically load more</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </AsyncStateWrapper>
    </TabsLayout>
  );
};

export default NotificationsPage;
