import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/errorHandler.middleware';

export class OfflineSessionController {
  // Get all sessions for a camp
  static async getSessions(req: AuthRequest, res: Response) {
    const { campId } = req.params;

    const sessions = await prisma.offlineSession.findMany({
      where: { campId },
      include: {
        creator: true,
        attendances: {
          include: { student: { include: { user: true } } }
        }
      },
      orderBy: { date: 'desc' },
    });

    res.status(200).json({ success: true, data: sessions });
  }

  // Create a new session
  static async createSession(req: AuthRequest, res: Response) {
    const { campId, title, date, durationMinutes } = req.body;

    if (!campId || !title || !date || !durationMinutes) {
      throw new AppError('Missing required fields', 400);
    }

    const session = await prisma.offlineSession.create({
      data: {
        campId,
        title,
        date: new Date(date),
        durationMinutes: parseInt(durationMinutes, 10),
        createdBy: req.user!.userId,
      },
    });

    res.status(201).json({ success: true, data: session });
  }

  // Mark attendance for a session
  static async markAttendance(req: AuthRequest, res: Response) {
    const { sessionId } = req.params;
    const { studentId, present } = req.body;

    if (!studentId || present === undefined) {
      throw new AppError('Missing studentId or present status', 400);
    }

    // Upsert attendance record
    const attendance = await prisma.offlineAttendance.upsert({
      where: {
        sessionId_studentId: {
          sessionId,
          studentId,
        },
      },
      update: {
        present,
        markedBy: req.user!.userId,
      },
      create: {
        sessionId,
        studentId,
        present,
        markedBy: req.user!.userId,
      },
      include: {
        student: { include: { user: true } }
      }
    });

    res.status(200).json({ success: true, data: attendance });
  }
}
