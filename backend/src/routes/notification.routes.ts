import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authMiddleware } from '../middleware/auth.middleware';
import { asyncWrapper } from '../utils/asyncWrapper';

const router = Router();

// All notification routes require authentication
router.use(authMiddleware);

router.get('/unread', asyncWrapper(NotificationController.getUnread));
router.put('/mark-all-read', asyncWrapper(NotificationController.markAllAsRead));
router.put('/:id/read', asyncWrapper(NotificationController.markAsRead));

export default router;
