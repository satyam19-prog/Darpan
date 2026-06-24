import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { AppError } from '../middleware/errorHandler.middleware';

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    const { user, accessToken, refreshToken } = await authService.register(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      data: { user, accessToken },
    });
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: { user, accessToken },
    });
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new AppError('Refresh token missing', 401);
    }

    const tokens = await authService.refreshToken(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: { accessToken: tokens.accessToken },
    });
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie('refreshToken');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    await authService.forgotPassword(req.body.email);
    res.status(200).json({
      success: true,
      message: 'If the email exists, a reset link has been sent.',
    });
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    // req.user is set by authMiddleware
    res.status(200).json({
      success: true,
      data: { user: (req as any).user },
    });
  }
}
