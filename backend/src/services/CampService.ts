import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler.middleware';
import { logger } from '../utils/logger';
import { emailService } from './EmailService';
import { notificationService } from './NotificationService';
import { CampType, Role } from '@prisma/client';
import { GoogleSheetsService } from './GoogleSheetsService';
import { User, StudentProfile } from '@prisma/client';
import bcrypt from 'bcryptjs';

const googleSheetsService = new GoogleSheetsService();

export class CampService {
  async createCamp(adminId: string, data: { name: string; type: CampType; description?: string; startDate: Date; endDate: Date }) {
    return prisma.camp.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        createdBy: adminId,
      },
    });
  }

  async getAllCamps() {
    return prisma.camp.findMany({
      include: {
        _count: {
          select: { enrollments: true, mentors: true, privateContests: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCampById(campId: string) {
    const camp = await prisma.camp.findUnique({
      where: { id: campId },
      include: {
        enrollments: {
          include: { student: { include: { user: true } } },
        },
        mentors: {
          include: { mentor: { include: { user: true } } },
        },
        privateContests: true,
      },
    });
    if (!camp) throw new AppError('Camp not found', 404);
    return camp;
  }

  async assignMentor(campId: string, mentorEmail: string) {
    const user = await prisma.user.findUnique({
      where: { email: mentorEmail },
      include: { mentorProfile: true },
    });

    if (!user || user.role !== Role.MENTOR || !user.mentorProfile) {
      throw new AppError('User is not a registered mentor', 400);
    }

    const existing = await prisma.campMentor.findUnique({
      where: { campId_mentorId: { campId, mentorId: user.mentorProfile.id } },
    });

    if (existing) {
      throw new AppError('Mentor already assigned to this camp', 400);
    }

    return prisma.campMentor.create({
      data: {
        campId,
        mentorId: user.mentorProfile.id,
      },
      include: { mentor: { include: { user: true } } }
    });
  }

  async importStudentsFromSheet(campId: string, sheetUrl: string) {
    // 1. Fetch data from Google Sheet
    const studentsData = await googleSheetsService.fetchStudentsFromSheet(sheetUrl);
    
    if (!studentsData || studentsData.length === 0) {
      throw new AppError('No valid students found in the sheet', 400);
    }

    const defaultPassword = await bcrypt.hash('darpan123', 10);
    const results = { added: 0, updated: 0, enrolled: 0 };

    // 2. Upsert each student and enroll them in the camp
    for (const data of studentsData) {
      await prisma.$transaction(async (tx: any) => {
        // Upsert User
        let user = await tx.user.findUnique({ where: { email: data.email } });
        
        if (!user) {
          user = await tx.user.create({
            data: {
              name: data.name,
              email: data.email,
              passwordHash: defaultPassword,
              role: Role.STUDENT,
            },
          });
          results.added++;
        } else {
          results.updated++;
        }

        // Upsert StudentProfile
        let profile = await tx.studentProfile.findUnique({ where: { userId: user.id } });
        if (!profile) {
          profile = await tx.studentProfile.create({
            data: {
              userId: user.id,
              cfHandle: data.cfHandle || null,
              lcHandle: data.lcHandle || null,
              ccHandle: data.ccHandle || null,
            },
          });
        } else {
          profile = await tx.studentProfile.update({
            where: { userId: user.id },
            data: {
              cfHandle: data.cfHandle || profile.cfHandle,
              lcHandle: data.lcHandle || profile.lcHandle,
              ccHandle: data.ccHandle || profile.ccHandle,
            },
          });
        }

        // Enroll in Camp
        const isEnrolled = await tx.campEnrollment.findUnique({
          where: { campId_studentId: { campId, studentId: profile.id } },
        });

        if (!isEnrolled) {
          await tx.campEnrollment.create({
            data: {
              campId,
              studentId: profile.id,
            },
          });
          results.enrolled++;
          
          // Send notification and email (asynchronously outside tx context to avoid blocking, but since we await here it's fine for small batches. Ideally BullMQ).
          const camp = await tx.camp.findUnique({ where: { id: campId } });
          if (camp) {
            notificationService.createNotification(
              user.id,
              'CAMP_ENROLLMENT',
              `You have been enrolled in ${camp.name}.`
            ).catch(e => logger.error('Failed to create notification', e));

            emailService.sendCampEnrollmentEmail(user.email, user.name, camp.name)
              .catch(e => logger.error('Failed to send enrollment email', e));
          }
        }
      });
    }

    // TODO: Ideally we would push a job to BullMQ here to fetch ratings for all these new users asynchronously.
    // For now, they will be fetched in the next cron polling cycle.

    return results;
  }
}
