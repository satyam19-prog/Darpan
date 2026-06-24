import { Router } from 'express';
import { OfflineSessionController } from '../controllers/OfflineSessionController';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { asyncWrapper } from '../utils/asyncWrapper';
import { Role } from '@prisma/client';

const router = Router();

// Only Admins and Mentors can access offline session features
router.use(authMiddleware);
router.use(requireRole(Role.ADMIN, Role.MENTOR));

router.get('/camp/:campId', asyncWrapper(OfflineSessionController.getSessions));
router.post('/', asyncWrapper(OfflineSessionController.createSession));
router.put('/:sessionId/attendance', asyncWrapper(OfflineSessionController.markAttendance));

export default router;
