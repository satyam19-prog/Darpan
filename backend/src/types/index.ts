// ========================================
// Darpan CP Tracker - Shared TypeScript Types
// Puri app mein use hone wale common types yahan defined hain
// JWT payload, API response format, pagination — sab yahan hai
// ========================================

import { Request } from 'express';
import { Role } from '@prisma/client';

/**
 * JWT mein store hone wala payload — userId aur role
 * Token verify hone ke baad yeh data milta hai
 */
export interface JwtPayload {
  userId: string;
  role: Role;
}

/**
 * Authenticated request — normal Express Request + user payload
 * Auth middleware attach karta hai user property har authenticated request mein
 */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * Standardized API response format — har endpoint yahi return karega
 * Frontend ko consistent structure milega chahe success ho ya error
 *
 * @template T - Response data ka type
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination parameters — list endpoints ke liye
 * Page number, limit, sort field aur order specify kar sakte hain
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response — total count aur pages ke saath data return karta hai
 * Frontend ko pagination controls dikhane ke liye zaroor info hai
 *
 * @template T - Array items ka type
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Token pair — access token + refresh token dono saath mein return hote hain
 * Login aur refresh ke time use hota hai
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Codeforces API response ka generic type
 * CF API hamesha { status, result } format mein data bhejta hai
 */
export interface CfApiResponse<T = any> {
  status: 'OK' | 'FAILED';
  result?: T;
  comment?: string;
}

/**
 * Codeforces user info ka type — CF API se aata hai
 */
export interface CfUserInfo {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  contribution?: number;
  registrationTimeSeconds?: number;
  friendOfCount?: number;
  avatar?: string;
  titlePhoto?: string;
}

/**
 * Codeforces contest standings row
 */
export interface CfStandingsRow {
  party: {
    contestId: number;
    members: Array<{ handle: string }>;
    participantType: string;
    ghost: boolean;
    startTimeSeconds: number;
  };
  rank: number;
  points: number;
  penalty: number;
  successfulHackCount: number;
  unsuccessfulHackCount: number;
  problemResults: Array<{
    points: number;
    rejectedAttemptCount: number;
    type: string;
    bestSubmissionTimeSeconds?: number;
  }>;
}

/**
 * Codeforces submission ka type
 */
export interface CfSubmission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  problem: {
    contestId?: number;
    index: string;
    name: string;
    type: string;
    rating?: number;
    tags: string[];
  };
  author: {
    contestId?: number;
    members: Array<{ handle: string }>;
    participantType: string;
  };
  programmingLanguage: string;
  verdict?: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}
