import { prisma } from '../config/database';
import { StudentProfile } from '@prisma/client';

export class BadgeService {
  /**
   * Defines default generic badges in the system if they don't exist.
   */
  async seedDefaultBadges() {
    const badges = [
      { name: 'First Blood', description: 'Solved your first problem', condition: { type: 'solve_count', min: 1 } },
      { name: 'Centurion', description: 'Solved 100 problems', condition: { type: 'solve_count', min: 100 } },
      { name: 'Specialist', description: 'Reached Specialist on Codeforces', condition: { type: 'cf_rating', min: 1400 } },
      { name: 'Expert', description: 'Reached Expert on Codeforces', condition: { type: 'cf_rating', min: 1600 } },
      { name: 'Knight', description: 'Reached Knight on LeetCode', condition: { type: 'lc_rating', min: 1850 } },
    ];

    for (const b of badges) {
      await prisma.badge.upsert({
        where: { name: b.name },
        update: {},
        create: {
          name: b.name,
          description: b.description,
          condition: b.condition,
        },
      });
    }
  }

  /**
   * Evaluate a student against all badges and award new ones.
   */
  async evaluateBadges(studentId: string, metrics: { cfRating?: number; lcRating?: number; solveCount?: number }) {
    const allBadges = await prisma.badge.findMany();
    const existingStudentBadges = await prisma.studentBadge.findMany({
      where: { studentId },
      select: { badgeId: true },
    });
    
    const existingBadgeIds = new Set(existingStudentBadges.map(b => b.badgeId));

    for (const badge of allBadges) {
      if (existingBadgeIds.has(badge.id)) continue;

      const condition: any = badge.condition;
      let earned = false;

      if (condition.type === 'solve_count' && metrics.solveCount && metrics.solveCount >= condition.min) {
        earned = true;
      } else if (condition.type === 'cf_rating' && metrics.cfRating && metrics.cfRating >= condition.min) {
        earned = true;
      } else if (condition.type === 'lc_rating' && metrics.lcRating && metrics.lcRating >= condition.min) {
        earned = true;
      }

      if (earned) {
        await prisma.studentBadge.create({
          data: {
            studentId,
            badgeId: badge.id,
          },
        });
      }
    }
  }
}
