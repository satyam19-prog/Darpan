// ==========================================
// Darpan CP Tracker - Shared Types
// ==========================================

// Enums & Literal Types
export type Role = 'ADMIN' | 'MENTOR' | 'STUDENT';
export type CampType = 'SUMMER' | 'WINTER' | 'CUSTOM';
export type Platform = 'CODEFORCES' | 'LEETCODE' | 'CODECHEF' | 'OTHER';
export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

// User & Auth
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  cfHandle?: string;
  lcHandle?: string;
  ccHandle?: string;
  bio?: string;
  avatarUrl?: string;
}

// Camp
export interface Camp {
  id: string;
  name: string;
  type: CampType;
  description?: string;
  startDate: string;
  endDate: string;
  createdBy?: string;
}

// Contest
export interface Contest {
  id: string;
  campId: string;
  name: string;
  platform: Platform;
  url?: string;
  startTime: string;
  endTime: string;
}

// Standing / Performance
export interface Standing {
  id: string;
  contestId: string;
  studentId: string;
  rank: number;
  score: number;
  problemsSolved: number;
  totalProblems: number;
  penalty?: number;
}

// Friendship
export interface Friendship {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendshipStatus;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

// API Response Types
export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    accessToken: string;
  };
  error?: string;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
