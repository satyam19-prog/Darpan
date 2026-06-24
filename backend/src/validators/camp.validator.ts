import { z } from 'zod';
import { CampType } from '@prisma/client';

export const createCampSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    type: z.nativeEnum(CampType),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    description: z.string().optional(),
  }),
});

export const updateCampSchema = createCampSchema.deepPartial();

export const enrollStudentSchema = z.object({
  body: z.object({
    studentId: z.string().cuid('Invalid student ID'),
  }),
});

export const assignMentorSchema = z.object({
  body: z.object({
    mentorId: z.string().cuid('Invalid mentor ID'),
  }),
});
