import { Role, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { StudentRepository } from '../repositories/StudentRepository';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler.middleware';
import { env } from '../config/env';
import { emailService } from './EmailService';
import { logger } from '../utils/logger';

const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const studentRepository = new StudentRepository();

export class AuthService {
  /**
   * User register karta hai
   */
  async register(data: any): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const role = data.role || Role.STUDENT;

    // Use transaction to create user and profile
    const user = await prisma.$transaction(async (tx: any) => {
      const newUser = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          role,
        },
      });

      if (role === Role.STUDENT) {
        await tx.studentProfile.create({
          data: {
            userId: newUser.id,
            cfHandle: data.cfHandle || null,
            lcHandle: data.lcHandle || null,
            ccHandle: data.ccHandle || null,
          },
        });
      } else if (role === Role.MENTOR) {
        await tx.mentorProfile.create({
          data: {
            userId: newUser.id,
          },
        });
      }

      return newUser;
    });

    // Send welcome email asynchronously
    emailService.sendWelcomeEmail(user.email, user.name).catch(e => logger.error('Failed to send welcome email', e));

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    await refreshTokenRepository.create(refreshToken, user.id, expiresAt);

    return { user, accessToken, refreshToken };
  }

  /**
   * User login karta hai
   */
  async login(data: any): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    await refreshTokenRepository.create(refreshToken, user.id, expiresAt);

    return { user, accessToken, refreshToken };
  }

  /**
   * Refresh token renew karta hai
   */
  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    const storedToken = await refreshTokenRepository.findByToken(token);
    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) {
        await refreshTokenRepository.deleteByToken(token);
      }
      throw new AppError('Invalid or expired refresh token', 401);
    }

    try {
      jwt.verify(token, env.JWT_REFRESH_SECRET);
    } catch (e) {
      await refreshTokenRepository.deleteByToken(token);
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await userRepository.findById(storedToken.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Rotate token
    await refreshTokenRepository.deleteByToken(token);
    
    const newAccessToken = this.generateAccessToken(user.id, user.role);
    const newRefreshToken = this.generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await refreshTokenRepository.create(newRefreshToken, user.id, expiresAt);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * Logout - DB se token delete karta hai
   */
  async logout(token: string): Promise<void> {
    await refreshTokenRepository.deleteByToken(token);
  }

  /**
   * Password reset email send karta hai
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Don't leak that user doesn't exist
      return;
    }

    const resetToken = jwt.sign({ userId: user.id }, env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password. This link is valid for 1 hour.</p>
      <a href="${resetUrl}">Reset Password</a>
    `;

    await emailService.sendEmail(user.email, 'Password Reset - Darpan', html);
  }

  /**
   * Password reset verify karta hai aur naya password set karta hai
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string };
      
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await userRepository.update(decoded.userId, { passwordHash });
      
      // Invalidate all existing refresh tokens so user has to login again
      await refreshTokenRepository.deleteAllByUserId(decoded.userId);
    } catch (e) {
      throw new AppError('Invalid or expired reset token', 400);
    }
  }

  private generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY as any });
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRY as any });
  }
}
