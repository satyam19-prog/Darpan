import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/errorHandler.middleware';

export class PlagiarismController {
  // Get all flags for a camp (Mentor/Admin)
  static async getFlagsByCamp(req: AuthRequest, res: Response) {
    const { campId } = req.params;

    const flags = await prisma.plagiarismFlag.findMany({
      where: { campId },
      include: {
        studentA: { include: { user: true } },
        studentB: { include: { user: true } },
        contest: true,
        resolver: true,
      },
      orderBy: { flaggedAt: 'desc' },
    });

    res.status(200).json({ success: true, data: flags });
  }

  // Create a new flag (Mentor/Admin)
  static async createFlag(req: AuthRequest, res: Response) {
    const { campId, contestId, studentAId, studentBId, reason } = req.body;

    if (!campId || !contestId || !studentAId || !studentBId || !reason) {
      throw new AppError('Missing required fields', 400);
    }

    const flag = await prisma.plagiarismFlag.create({
      data: {
        campId,
        contestId,
        studentAId,
        studentBId,
        reason,
      },
      include: {
        studentA: { include: { user: true } },
        studentB: { include: { user: true } },
      }
    });

    res.status(201).json({ success: true, data: flag });
  }

  // Resolve a flag (Admin only usually, but mentor could potentially if allowed. We'll stick to logic in routes)
  static async resolveFlag(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { resolution } = req.body;

    if (!resolution) {
      throw new AppError('Resolution notes are required', 400);
    }

    const flag = await prisma.plagiarismFlag.update({
      where: { id },
      data: {
        resolvedBy: req.user!.userId,
        resolution,
      },
    });

    res.status(200).json({ success: true, data: flag });
  }
}
