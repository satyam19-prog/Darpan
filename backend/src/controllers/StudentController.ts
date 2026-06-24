import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { CodeforcesService } from '../services/CodeforcesService';
import { LeetCodeService } from '../services/LeetCodeService';
import { CodeChefService } from '../services/CodeChefService';
import { BadgeService } from '../services/BadgeService';
import { AppError } from '../middleware/errorHandler.middleware';

const cfService = new CodeforcesService();
const lcService = new LeetCodeService();
const ccService = new CodeChefService();
const badgeService = new BadgeService();

export class StudentController {
  static async getDashboard(req: AuthRequest, res: Response) {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.userId },
      include: {
        user: { select: { name: true, email: true } },
        badges: { include: { badge: true } },
        enrollments: { include: { camp: true } },
      },
    });

    if (!studentProfile) {
      throw new AppError('Student profile not found', 404);
    }

    // Fetch live ratings from CF and LC if handles exist
    let cfData = null;
    let lcData = null;
    let ccData = null;

    try {
      if (studentProfile.cfHandle) {
        const cfInfo = await cfService.getUserInfo([studentProfile.cfHandle]);
        cfData = cfInfo[0] || null;
        
        // Evaluate badges asynchronously
        if (cfData) {
          badgeService.evaluateBadges(studentProfile.id, { cfRating: cfData.rating }).catch(console.error);
        }
      }
    } catch (e) {
      console.error('Failed to fetch CF data', e);
    }

    try {
      if (studentProfile.lcHandle) {
        lcData = await lcService.getUserProfile(studentProfile.lcHandle);
      }
    } catch (e) {
      console.error('Failed to fetch LC data', e);
    }

    try {
      if (studentProfile.ccHandle) {
        ccData = await ccService.getUserProfile(studentProfile.ccHandle);
      }
    } catch (e) {
      console.error('Failed to fetch CC data', e);
    }

    res.status(200).json({
      success: true,
      data: {
        profile: studentProfile,
        platformData: {
          codeforces: cfData,
          leetcode: lcData,
          codechef: ccData,
        },
      },
    });
  }

  static async getUpsolvingStatus(req: AuthRequest, res: Response) {
    if (!req.user || !req.user.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.userId }
    });

    if (!studentProfile) throw new AppError('Student profile not found', 404);

    const attendances = await prisma.contestAttendance.findMany({
      where: { studentId: studentProfile.id },
      include: { contest: true },
      orderBy: { contest: { startTime: 'desc' } }
    });

    res.status(200).json({ success: true, data: attendances });
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    if (!req.user || !req.user.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { cfHandle, lcHandle, ccHandle } = req.body;

    const updated = await prisma.studentProfile.update({
      where: { userId: req.user.userId },
      data: {
        cfHandle: cfHandle ?? undefined,
        lcHandle: lcHandle ?? undefined,
        ccHandle: ccHandle ?? undefined,
      }
    });

    res.status(200).json({ success: true, data: updated });
  }
}
