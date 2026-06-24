import { Request, Response } from 'express';
import { notificationService } from '../services/NotificationService';
import { AuthRequest } from '../types';

export class NotificationController {
  static async getUnread(req: AuthRequest, res: Response) {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const notifications = await notificationService.getUnreadNotifications(req.user.userId);
    res.status(200).json({ success: true, data: notifications });
  }

  static async markAsRead(req: AuthRequest, res: Response) {
    if (!req.user || !req.user.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { id } = req.params;
    await notificationService.markAsRead(id, req.user.userId);
    
    res.status(200).json({ success: true, message: 'Notification marked as read' });
  }

  static async markAllAsRead(req: AuthRequest, res: Response) {
    if (!req.user || !req.user.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    await notificationService.markAllAsRead(req.user.userId);
    
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  }
}
