export type NotificationType = 'alert' | 'upgrade' | 'campaign' | 'summary' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  icon?: string;
}

export interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
}
