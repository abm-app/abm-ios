export type NotificationType =
  | 'audit_event'
  | 'report_ready'
  | 'alert'
  | 'upgrade'
  | 'campaign'
  | 'summary'
  | 'info';

export interface AppNotification {
  id: string;
  userId?: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  linkedEntityId?: string | null;
  icon?: string;
  description?: string;
  timestamp?: string;
}

export interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
  total?: number;
  page?: number;
  limit?: number;
}
