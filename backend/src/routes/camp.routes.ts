import { Router } from 'express';
import { CampController } from '../controllers/CampController';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { asyncWrapper } from '../utils/asyncWrapper';
import { Role } from '@prisma/client';

const router = Router();

// Only ADMIN and MENTOR can access camp endpoints generally
router.use(authMiddleware);

// Get all camps (Admin + Mentor)
router.get('/', requireRole(Role.ADMIN, Role.MENTOR), asyncWrapper(CampController.getAllCamps));

// Get specific camp details
router.get('/:id', requireRole(Role.ADMIN, Role.MENTOR), asyncWrapper(CampController.getCamp));

// Admin only actions
router.post('/', requireRole(Role.ADMIN), asyncWrapper(CampController.createCamp));
router.post('/:id/assign-mentor', requireRole(Role.ADMIN), asyncWrapper(CampController.assignMentor));
router.post('/:id/import-students', requireRole(Role.ADMIN), asyncWrapper(CampController.importStudents));

export default router;
