import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { asyncWrapper } from '../utils/asyncWrapper';
import { Role } from '@prisma/client';

const router = Router();

// Only STUDENT can access student endpoints generally
router.use(authMiddleware);
router.use(requireRole(Role.STUDENT, Role.ADMIN)); // Admins can also view student routes if needed

// Get Student Dashboard
router.get('/dashboard', asyncWrapper(StudentController.getDashboard));

// Get Upsolving Status
router.get('/upsolving', asyncWrapper(StudentController.getUpsolvingStatus));

// Update Profile
router.put('/profile', asyncWrapper(StudentController.updateProfile));

export default router;
