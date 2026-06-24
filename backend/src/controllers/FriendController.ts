import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/errorHandler.middleware';

export class FriendController {
  // Send friend request
  static async sendRequest(req: AuthRequest, res: Response) {
    const { receiverId } = req.body;
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Only students can send friend requests', 403);
    const requesterId = profile.id;

    if (requesterId === receiverId) {
      throw new AppError('Cannot send a friend request to yourself', 400);
    }

    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, receiverId },
          { requesterId: receiverId, receiverId: requesterId }
        ]
      }
    });

    if (existing) {
      throw new AppError('Friendship or pending request already exists', 400);
    }

    const friendship = await prisma.friendship.create({
      data: { requesterId, receiverId, status: 'PENDING' }
    });

    res.status(201).json({ success: true, data: friendship });
  }

  // Accept friend request
  static async acceptRequest(req: AuthRequest, res: Response) {
    const { friendshipId } = req.params;
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Student profile not found', 404);
    const receiverId = profile.id;

    const friendship = await prisma.friendship.findFirst({
      where: { id: friendshipId, receiverId }
    });

    if (!friendship) {
      throw new AppError('Friend request not found', 404);
    }

    const updated = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: 'ACCEPTED' }
    });

    res.status(200).json({ success: true, data: updated });
  }

  // Get friends list with comparison data
  static async getFriends(req: AuthRequest, res: Response) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Only students have friends', 403);
    const studentId = profile.id;

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: studentId }, { receiverId: studentId }],
        status: 'ACCEPTED'
      },
      include: {
        requester: { include: { user: { select: { name: true } } } },
        receiver: { include: { user: { select: { name: true } } } }
      }
    });

    // Map to simple friend objects with ratings
    const friends = friendships.map(f => {
      const isRequester = f.requesterId === studentId;
      const friendProfile = isRequester ? f.receiver : f.requester;
      return {
        id: friendProfile.id,
        name: friendProfile.user.name,
        codeforcesRating: 0,
        leetcodeRating: 0,
        codechefRating: 0,
        totalSolved: 0
      };
    });

    res.status(200).json({ success: true, data: friends });
  }
}
