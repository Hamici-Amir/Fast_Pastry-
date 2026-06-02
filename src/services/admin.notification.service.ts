import { localDb, Notification, UserNotification, User, NotificationAudience, NotificationType } from '../db/localDb';
import { integrations } from './integrations';

export class AdminNotificationService {
  // Global map to hold timeouts for scheduled notifications, enabling cancellation
  private static scheduledTimers = new Map<string, NodeJS.Timeout>();

  /**
   * Determine target users based on the audience filter
   */
  private static getTargetUsers(audience: NotificationAudience, users: User[]): User[] {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 3600 * 1000;

    switch (audience) {
      case 'ALL':
        return users;
      case 'VIP_CUSTOMERS':
        return users.filter(u => u.role === 'CLIENT' && u.tier === 'VIP');
      case 'DRIVERS':
        return users.filter(u => u.role === 'DRIVER');
      case 'NEW_REGISTERED':
        // Filter clients who either have 'NEW' tier or signed up in the last 7 days
        return users.filter(
          u => u.role === 'CLIENT' && 
          (u.tier === 'NEW' || new Date(u.createdAt).getTime() >= sevenDaysAgo)
        );
      default:
        return [];
    }
  }

  /**
   * Internal helper to execute the notification send (FCM multicast + creating UserNotification records)
   */
  private static async executeSend(notificationId: string) {
    const db = localDb.getData();
    const notifIndex = db.notifications.findIndex(n => n.id === notificationId);
    if (notifIndex === -1) return;

    const notif = db.notifications[notifIndex];
    const targetUsers = this.getTargetUsers(notif.targetAudience, db.users);
    
    // Create UserNotification mapping for each target user
    const userNotificationsToAdd: UserNotification[] = targetUsers.map(user => ({
      id: `UNOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId: user.id,
      notificationId: notif.id,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    }));

    db.userNotifications.push(...userNotificationsToAdd);

    // Collect mock FCM tokens
    const tokens = targetUsers.map(u => `token-${u.id}`);
    
    // Broadcast via FCM
    const successCount = await integrations.sendPushNotification(
      tokens,
      notif.title,
      notif.body,
      { type: notif.type, notificationId: notif.id }
    );

    // Update Notification status
    db.notifications[notifIndex].status = 'SENT';
    db.notifications[notifIndex].sentAt = new Date().toISOString();
    db.notifications[notifIndex].reachCount = targetUsers.length;

    localDb.save();
    this.scheduledTimers.delete(notificationId);
    console.log(`[Notification Broadcaster] Successfully sent notification ${notificationId} to ${successCount} users.`);
  }

  /**
   * Broadcast a notification immediately or schedule it for a later date
   */
  static async sendNotification(params: {
    title: string;
    body: string;
    type: NotificationType;
    targetAudience: NotificationAudience;
    isBoosted: boolean;
    scheduledAt?: string;
  }) {
    const db = localDb.getData();
    const notificationId = `NOTIF-${Date.now()}`;

    const newNotification: Notification = {
      id: notificationId,
      title: params.title,
      body: params.body,
      type: params.type,
      targetAudience: params.targetAudience,
      isBoosted: params.isBoosted,
      status: params.scheduledAt ? 'SCHEDULED' : 'SENT',
      reachCount: 0,
      scheduledAt: params.scheduledAt || undefined,
      createdAt: new Date().toISOString(),
    };

    db.notifications.push(newNotification);
    localDb.save();

    if (params.scheduledAt) {
      const runTime = new Date(params.scheduledAt).getTime();
      const delay = runTime - Date.now();

      if (delay > 0) {
        console.log(`[Notification Broadcaster] Scheduling notification ${notificationId} to fire in ${delay}ms.`);
        const timer = setTimeout(async () => {
          await this.executeSend(notificationId);
        }, delay);
        this.scheduledTimers.set(notificationId, timer);
      } else {
        // If scheduled in the past, send immediately
        console.log(`[Notification Broadcaster] Scheduled date is in the past. Sending ${notificationId} immediately.`);
        await this.executeSend(notificationId);
      }
    } else {
      // Send immediately
      await this.executeSend(notificationId);
    }

    // Return the updated notification state
    const freshDb = localDb.getData();
    return freshDb.notifications.find(n => n.id === notificationId) || newNotification;
  }

  /**
   * Get past and scheduled notifications history with pagination
   */
  static getNotificationHistory(params: { page?: number; limit?: number }) {
    const db = localDb.getData();
    const page = params.page || 1;
    const limit = params.limit || 10;

    const sortedNotifications = [...db.notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = sortedNotifications.length;
    const startIndex = (page - 1) * limit;
    const paginated = sortedNotifications.slice(startIndex, startIndex + limit);

    return {
      notifications: paginated,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Get stats for a notification (reach count, read count, read rate)
   */
  static getNotificationStats(notificationId: string) {
    const db = localDb.getData();
    const notification = db.notifications.find(n => n.id === notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }

    const userNotifs = db.userNotifications.filter(un => un.notificationId === notificationId);
    const reach = userNotifs.length;
    const openCount = userNotifs.filter(un => un.isRead).length;
    const openRatePercent = reach > 0 ? parseFloat(((openCount / reach) * 100).toFixed(1)) : 0.0;

    return {
      reach,
      openCount,
      openRatePercent,
    };
  }

  /**
   * Cancel scheduled notification (only if status is SCHEDULED)
   */
  static cancelScheduledNotification(notificationId: string) {
    const db = localDb.getData();
    const notifIndex = db.notifications.findIndex(n => n.id === notificationId);
    if (notifIndex === -1) {
      throw new Error('Notification not found');
    }

    const notification = db.notifications[notifIndex];
    if (notification.status !== 'SCHEDULED') {
      throw new Error('Can only cancel scheduled notifications');
    }

    // Cancel timer
    const timer = this.scheduledTimers.get(notificationId);
    if (timer) {
      clearTimeout(timer);
      this.scheduledTimers.delete(notificationId);
    }

    db.notifications[notifIndex].status = 'SCHEDULED'; // Keeping scheduled but cancelled structure, or remove it. Let's delete/cancel
    // We can set status to cancelled
    (db.notifications[notifIndex] as any).status = 'CANCELLED';
    localDb.save();

    return db.notifications[notifIndex];
  }

  /**
   * Hard delete notification and related user mappings
   */
  static deleteNotification(notificationId: string) {
    const db = localDb.getData();
    const notifIndex = db.notifications.findIndex(n => n.id === notificationId);
    if (notifIndex === -1) {
      throw new Error('Notification not found');
    }

    // If scheduled, clear the active timeout
    const timer = this.scheduledTimers.get(notificationId);
    if (timer) {
      clearTimeout(timer);
      this.scheduledTimers.delete(notificationId);
    }

    const deleted = db.notifications[notifIndex];
    
    // Remove notification record
    db.notifications.splice(notifIndex, 1);
    
    // Remove user mappings
    db.userNotifications = db.userNotifications.filter(un => un.notificationId !== notificationId);
    
    localDb.save();
    return deleted;
  }
}
