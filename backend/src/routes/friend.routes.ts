import { Router } from 'express';
import { FriendController } from '../controllers/FriendController';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { Role } from '@prisma/client';
import { asyncWrapper } from '../utils/asyncWrapper';

const router = Router();

// Only students can access friends features
router.use(authMiddleware);
router.use(requireRole(Role.STUDENT));

router.post('/request', asyncWrapper(FriendController.sendRequest));
router.put('/request/:friendshipId/accept', asyncWrapper(FriendController.acceptRequest));
router.get('/', asyncWrapper(FriendController.getFriends));

export default router;
