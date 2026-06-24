import { prisma } from '../config/database';
import { StudentProfile, Prisma } from '@prisma/client';
import { PaginationParams } from '../types';

export class StudentRepository {
  async findByUserId(userId: string): Promise<StudentProfile | null> {
    return prisma.studentProfile.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async findByCfHandle(cfHandle: string): Promise<StudentProfile | null> {
    return prisma.studentProfile.findFirst({
      where: { cfHandle },
      include: { user: true },
    });
  }

  async create(data: Prisma.StudentProfileCreateInput): Promise<StudentProfile> {
    return prisma.studentProfile.create({
      data,
    });
  }

  async update(id: string, data: Prisma.StudentProfileUpdateInput): Promise<StudentProfile> {
    return prisma.studentProfile.update({
      where: { id },
      data,
    });
  }

  async findByCampId(campId: string) {
    return prisma.campEnrollment.findMany({
      where: { campId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll(params: PaginationParams, filters?: any) {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const skip = (page - 1) * limit;

    const where = filters ? { ...filters } : {};

    const [data, total] = await Promise.all([
      prisma.studentProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          user: true,
        },
      }),
      prisma.studentProfile.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
