import { Router } from 'express';
import { PlagiarismController } from '../controllers/PlagiarismController';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { asyncWrapper } from '../utils/asyncWrapper';
import { Role } from '@prisma/client';

const router = Router();

// Only Admins and Mentors can access plagiarism features
router.use(authMiddleware);
router.use(requireRole(Role.ADMIN, Role.MENTOR));

router.get('/camp/:campId', asyncWrapper(PlagiarismController.getFlagsByCamp));
router.post('/', asyncWrapper(PlagiarismController.createFlag));

// Admin only resolution
router.put('/:id/resolve', requireRole(Role.ADMIN), asyncWrapper(PlagiarismController.resolveFlag));

export default router;
