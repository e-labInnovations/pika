import type { AxiosResponse } from 'axios';
import { BaseService } from './base.service';

export interface VapidKeyResponse {
  public_key: string;
  web_push_ready: boolean;
}

export interface GenericSuccessResponse {
  message: string;
}

export interface NotificationStatusResponse {
  enabled: boolean;
  has_subscription: boolean;
  can_receive: boolean;
}

export interface NotificationSendResponse {
  message: string;
  data: {
    [key: string]: boolean;
  };
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  user_id?: number;
}

export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: unknown;
  actions?: unknown[];
  require_interaction?: boolean;
  silent?: boolean;
}

export interface NotificationStatus {
  enabled: boolean;
  has_subscription: boolean;
  can_receive: boolean;
}

export interface NotificationRecord {
  id: number;
  user_id: number;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: unknown;
  actions?: unknown[];
  require_interaction: boolean;
  silent: boolean;
  timestamp: string;
  read_at?: string;
  clicked_at?: string;
  dismissed_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationsResponse {
  notifications: NotificationRecord[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

class PushNotificationsService extends BaseService<
  NotificationRecord | NotificationStatus | NotificationsResponse | PushSubscription | string
> {
  constructor() {
    super('/push');
  }

  /**
   * Get VAPID public key
   */
  getVapidKey(): Promise<AxiosResponse<VapidKeyResponse>> {
    return this.api.get(`${this.endpoint}/vapid-key`);
  }

  /**
   * Subscribe user to push notifications
   */
  subscribe(subscription: PushSubscription): Promise<AxiosResponse<GenericSuccessResponse>> {
    return this.api.post(`${this.endpoint}/subscribe`, {
      subscription,
    });
  }

  /**
   * Unsubscribe user from push notifications
   */
  unsubscribe(): Promise<AxiosResponse<GenericSuccessResponse>> {
    return this.api.post(`${this.endpoint}/unsubscribe`, {});
  }

  /**
   * Enable push notifications for user
   */
  enable(): Promise<AxiosResponse<GenericSuccessResponse>> {
    return this.api.post(`${this.endpoint}/enable`, {});
  }

  /**
   * Disable push notifications for user
   */
  disable(): Promise<AxiosResponse<GenericSuccessResponse>> {
    return this.api.post(`${this.endpoint}/disable`, {});
  }

  /**
   * Get notification status for user
   */
  getStatus(): Promise<AxiosResponse<NotificationStatusResponse>> {
    return this.api.get(`${this.endpoint}/status`);
  }

  /**
   * Send notification (admin only)
   */
  sendNotification(
    notification: NotificationData,
    userIds?: number[],
  ): Promise<AxiosResponse<NotificationSendResponse>> {
    const payload: NotificationData & { user_ids?: number[] } = { ...notification };
    if (userIds) {
      payload.user_ids = userIds;
    }

    return this.api.post(`${this.endpoint}/send`, payload);
  }

  /**
   * Get user notifications
   */
  getNotifications(page: number = 1, perPage: number = 20): Promise<AxiosResponse<NotificationsResponse>> {
    return this.api.get(`${this.endpoint}/notifications`, {
      params: { page, per_page: perPage },
    });
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: number): Promise<AxiosResponse<GenericSuccessResponse>> {
    return this.api.put(`${this.endpoint}/notifications/${notificationId}`, {
      read_at: true,
    });
  }

  /**
   * Mark notification as clicked
   */
  markAsClicked(notificationId: number): Promise<AxiosResponse<GenericSuccessResponse>> {
    return this.api.put(`${this.endpoint}/notifications/${notificationId}`, {
      clicked_at: true,
    });
  }

  /**
   * Mark notification as dismissed
   */
  dismissNotification(notificationId: number): Promise<AxiosResponse<GenericSuccessResponse>> {
    return this.api.put(`${this.endpoint}/notifications/${notificationId}`, {
      dismissed_at: true,
    });
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: number): Promise<AxiosResponse<GenericSuccessResponse>> {
    return this.api.delete(`${this.endpoint}/notifications/${notificationId}`);
  }

  /**
   * Send test notification to current user
   */
  sendTestNotification(): Promise<AxiosResponse<GenericSuccessResponse>> {
    return this.api.post(`${this.endpoint}/test`, {
      title: 'Test Notification',
      body: 'This is a test notification from Pika Finance',
      icon: '/pika/icons/pwa-192x192.png',
      tag: 'test-notification',
    });
  }
}

export const pushNotificationsService = new PushNotificationsService();
