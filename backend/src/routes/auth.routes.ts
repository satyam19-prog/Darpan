import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { asyncWrapper } from '../utils/asyncWrapper';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';
import { rateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.post(
  '/register',
  rateLimiter,
  validate(registerSchema),
  asyncWrapper(AuthController.register)
);

router.post(
  '/login',
  rateLimiter,
  validate(loginSchema),
  asyncWrapper(AuthController.login)
);

router.post(
  '/refresh',
  asyncWrapper(AuthController.refreshToken)
);

router.post(
  '/logout',
  authMiddleware,
  asyncWrapper(AuthController.logout)
);

router.post(
  '/forgot-password',
  rateLimiter,
  validate(forgotPasswordSchema),
  asyncWrapper(AuthController.forgotPassword)
);

router.post(
  '/reset-password',
  rateLimiter,
  validate(resetPasswordSchema),
  asyncWrapper(AuthController.resetPassword)
);

router.get(
  '/me',
  authMiddleware,
  asyncWrapper(AuthController.getMe)
);

export default router;
