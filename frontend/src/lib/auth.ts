import type { Role, User } from '@/types';

/**
 * Decode a JWT token and return the payload
 */
function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  // Add 10 second buffer
  return Date.now() >= (payload.exp * 1000 - 10000);
}

/**
 * Extract user info from JWT token
 */
export function getUserFromToken(token: string): User | null {
  const payload = decodeToken(token);
  if (!payload) return null;

  return {
    id: payload.id as string,
    name: payload.name as string,
    email: payload.email as string,
    role: payload.role as Role,
    createdAt: payload.createdAt as string || new Date().toISOString(),
  };
}

/**
 * Get the redirect path based on user role
 */
export function getRedirectPath(role: Role): string {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'MENTOR':
      return '/mentor';
    case 'STUDENT':
      return '/student';
    default:
      return '/login';
  }
}
