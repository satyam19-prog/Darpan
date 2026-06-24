// ========================================
// Darpan CP Tracker - Date Utilities
// Date formatting, comparison, aur manipulation ke helper functions
// Puri app mein date-related operations ke liye yeh module use hoga
// ========================================

/**
 * Date ko readable format mein convert karta hai
 * Example: "24 Jun 2026, 10:30 AM"
 *
 * @param date - Date object ya ISO string
 * @param locale - Locale for formatting (default: 'en-IN')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  locale: string = 'en-IN'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Check karta hai ki given date ek range ke andar hai ya nahi
 *
 * @param date - Check karne wali date
 * @param start - Range ka start
 * @param end - Range ka end
 * @returns true agar date range mein hai
 */
export function isWithinRange(
  date: Date | string,
  start: Date | string,
  end: Date | string
): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const s = typeof start === 'string' ? new Date(start) : start;
  const e = typeof end === 'string' ? new Date(end) : end;
  return d >= s && d <= e;
}

/**
 * "Time ago" format mein convert karta hai — "2 hours ago", "3 days ago", etc.
 * Social media style relative time display ke liye
 *
 * @param date - Date object ya ISO string
 * @returns Human-readable relative time string
 */
export function getTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}

/**
 * Date mein specified hours add karta hai
 *
 * @param date - Base date
 * @param hours - Kitne hours add karne hain
 * @returns Naya Date object with added hours
 */
export function addHours(date: Date | string, hours: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
  d.setHours(d.getHours() + hours);
  return d;
}

/**
 * Date mein specified days add karta hai
 *
 * @param date - Base date
 * @param days - Kitne days add karne hain
 * @returns Naya Date object with added days
 */
export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Check karta hai ki given date expire ho chuki hai ya nahi
 * Matlab current time us date se aage nikal gaya hai ya nahi
 *
 * @param date - Expiry date check karne ke liye
 * @returns true agar date past mein hai (expired)
 */
export function isExpired(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date() > d;
}

/**
 * Date ko ISO string mein convert karta hai (UTC)
 * Database mein store karne ke liye
 */
export function toISOString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Do dates ke beech ka difference days mein nikalta hai
 */
export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
