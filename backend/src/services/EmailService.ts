import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private async initTransporter() {
    // If SMTP_HOST is not provided or it's the example one, create a test account via Ethereal
    if (!env.SMTP_HOST || env.SMTP_HOST === 'smtp.gmail.com') {
      logger.info('EmailService: No valid SMTP credentials provided. Creating Ethereal test account...');
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
          },
        });
        logger.info(`EmailService: Ethereal test account ready. User: ${testAccount.user}`);
      } catch (e) {
        logger.error('EmailService: Failed to create Ethereal account', e);
      }
    } else {
      // Use provided real credentials
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
      logger.info('EmailService: Production SMTP transporter initialized.');
    }
  }

  async sendEmail(to: string, subject: string, htmlContent: string) {
    if (!this.transporter) {
      logger.warn('EmailService: Transporter not initialized. Cannot send email.');
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: env.SMTP_FROM || '"Darpan CP Tracker" <noreply@darpan.app>',
        to,
        subject,
        html: htmlContent,
      });

      logger.info(`Email sent: ${info.messageId}`);
      
      // If using ethereal, log the preview URL
      if (info.messageId && (!env.SMTP_HOST || env.SMTP_HOST === 'smtp.gmail.com')) {
        logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }

      return true;
    } catch (error) {
      logger.error(`EmailService: Error sending email to ${to}`, error);
      return false;
    }
  }

  // --- Predefined Templates ---

  async sendWelcomeEmail(to: string, name: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Welcome to Darpan CP Tracker, ${name}!</h2>
        <p>Your account has been created successfully.</p>
        <p>Please log in and connect your Codeforces and LeetCode handles to start tracking your progress.</p>
        <br/>
        <p>Happy Coding,</p>
        <p>The Darpan Team</p>
      </div>
    `;
    return this.sendEmail(to, 'Welcome to Darpan CP Tracker', html);
  }

  async sendCampEnrollmentEmail(to: string, name: string, campName: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>You are enrolled!</h2>
        <p>Hi ${name},</p>
        <p>You have been successfully enrolled in <strong>${campName}</strong>.</p>
        <p>Log in to your dashboard to view the schedule and assignments.</p>
        <br/>
        <p>Best of luck,</p>
        <p>The Darpan Team</p>
      </div>
    `;
    return this.sendEmail(to, `Enrolled in ${campName}`, html);
  }
}

export const emailService = new EmailService();
