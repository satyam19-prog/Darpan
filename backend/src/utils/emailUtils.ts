// ========================================
// Darpan CP Tracker - Email Utilities
// Nodemailer transporter setup aur email sending functions
// SMTP config env se aati hai, templates bhi yahi defined hain
// ========================================

import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from './logger';

/**
 * Nodemailer transporter — SMTP config se setup hota hai
 * Gmail App Password use karo agar Gmail se bhej rahe ho
 */
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // 465 pe SSL, 587 pe STARTTLS
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

/**
 * Generic email bhejne ka function
 * Kisi bhi type ka email bhejne ke liye isko call karo
 *
 * @param to - Recipient email address
 * @param subject - Email subject line
 * @param html - Email body as HTML string
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to} — Message ID: ${info.messageId}`);
  } catch (error) {
    logger.error(`Email bhejne mein error aaya for ${to}: ${(error as Error).message}`);
    // Email failure se app crash nahi honi chahiye, isliye throw nahi kar rahe
    // Lekin log zaroor ho raha hai taaki debug kar sakein
  }
}

/**
 * Password Reset Email Template
 * User ko reset link ke saath email bhejta hai
 *
 * @param name - User ka naam
 * @param resetLink - Password reset URL with token
 * @returns HTML string for the email body
 */
export function passwordResetEmailTemplate(
  name: string,
  resetLink: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #6366f1; margin: 0; }
        .btn { display: inline-block; padding: 14px 28px; background: #6366f1; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Darpan CP Tracker</h1>
        </div>
        <p>Hey <strong>${name}</strong>,</p>
        <p>Tumne password reset request kiya hai. Neeche diye gaye button pe click karo apna password reset karne ke liye:</p>
        <p style="text-align: center;">
          <a href="${resetLink}" class="btn">Reset Password</a>
        </p>
        <p>Yeh link <strong>1 hour</strong> mein expire ho jayega.</p>
        <p>Agar tumne yeh request nahi kiya tha, toh is email ko ignore kar do.</p>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Darpan CP Tracker. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Welcome Email Template
 * Naye user ko registration ke baad welcome email bhejta hai
 *
 * @param name - User ka naam
 * @returns HTML string for the welcome email
 */
export function welcomeEmailTemplate(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #6366f1; margin: 0; }
        .highlight { background: #f0f0ff; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 20px 0; }
        .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Welcome to Darpan!</h1>
        </div>
        <p>Hey <strong>${name}</strong>,</p>
        <p>Darpan CP Tracker mein tumhara swagat hai! 🎉</p>
        <div class="highlight">
          <p><strong>Yeh cheezein kar sakte ho:</strong></p>
          <ul>
            <li>📊 Apne Codeforces, LeetCode, CodeChef stats track karo</li>
            <li>🏕️ Coding camps mein participate karo</li>
            <li>🏆 Contests attend karo aur performance track karo</li>
            <li>👥 Friends ke saath compare karo</li>
            <li>🎖️ Badges earn karo</li>
          </ul>
        </div>
        <p>Apne competitive programming handles add karo apne profile mein — hum automatically tumhare stats fetch kar lenge!</p>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Darpan CP Tracker. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Contest Reminder Email Template
 * Contest se pehle students ko reminder bhejta hai
 *
 * @param name - Student ka naam
 * @param contestName - Contest ka naam
 * @param startTime - Contest start time
 * @param contestLink - Contest ka direct link
 * @returns HTML string for the reminder email
 */
export function contestReminderEmailTemplate(
  name: string,
  contestName: string,
  startTime: string,
  contestLink: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #6366f1; margin: 0; }
        .contest-info { background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316; margin: 20px 0; }
        .btn { display: inline-block; padding: 14px 28px; background: #f97316; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Contest Reminder</h1>
        </div>
        <p>Hey <strong>${name}</strong>,</p>
        <p>Ek contest aa raha hai jismein tumhe participate karna hai!</p>
        <div class="contest-info">
          <p><strong>🏆 Contest:</strong> ${contestName}</p>
          <p><strong>📅 Start Time:</strong> ${startTime}</p>
        </div>
        <p style="text-align: center;">
          <a href="${contestLink}" class="btn">Go to Contest</a>
        </p>
        <p>All the best! Acche problems solve karo 💪</p>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Darpan CP Tracker. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Verify SMTP connection on startup — agar connection fail ho toh warn karo
 */
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    logger.info('SMTP: Email transporter verified — emails bhej sakte hain ✅');
    return true;
  } catch (error) {
    logger.warn(
      `SMTP: Email transporter verify nahi ho paya — ${(error as Error).message}. Emails disabled rehenge.`
    );
    return false;
  }
}
