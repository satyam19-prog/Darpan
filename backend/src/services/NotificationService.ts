import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class NotificationService {
  /**
   * Create an in-app notification for a user.
   */
  async createNotification(userId: string, type: string, message: string) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          message,
        },
      });
      
      // In a more advanced setup, we would emit a Socket.io event here
      // io.to(userId).emit('new_notification', notification);
      
      return notification;
    } catch (error) {
      logger.error('Failed to create notification', error);
      throw error;
    }
  }

  /**
   * Fetch unread notifications for a user.
   */
  async getUnreadNotifications(userId: string) {
    return prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // Limit to recent 20 unread
    });
  }

  /**
   * Mark specific notification as read.
   */
  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId, // ensure user owns it
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}

export const notificationService = new NotificationService();
