import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { Role } from '@prisma/client';
import { asyncWrapper } from '../utils/asyncWrapper';

const router = Router();

// Only Admins and Mentors can export reports
router.use(authMiddleware);
router.use(requireRole(Role.ADMIN, Role.MENTOR));

router.get('/camp/:campId/excel', asyncWrapper(ReportController.exportExcel));
router.get('/camp/:campId/pdf', asyncWrapper(ReportController.exportPDF));

export default router;
