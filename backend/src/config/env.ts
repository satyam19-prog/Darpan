// ========================================
// Darpan CP Tracker - Environment Config
// Yeh module .env file se saare environment variables load aur validate karta hai using Zod
// ========================================

import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// .env file ko load karo — project root se pick hoga
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Zod schema jo saare env vars validate karta hai
 * Agar koi required var missing hoga toh server start hone se pehle hi error aayega
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // JWT Secrets — production mein strong secrets daalo
  JWT_ACCESS_SECRET: z.string().min(10, 'JWT_ACCESS_SECRET kam se kam 10 characters ka hona chahiye'),
  JWT_REFRESH_SECRET: z.string().min(10, 'JWT_REFRESH_SECRET kam se kam 10 characters ka hona chahiye'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // SMTP / Email
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  SMTP_FROM: z.string().default('Darpan CP Tracker <noreply@darpan.app>'),

  // External APIs
  GOOGLE_SHEETS_API_KEY: z.string().default(''),
  CF_API_KEY: z.string().default(''),
  CF_API_SECRET: z.string().default(''),

  // Server
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
});

/**
 * Parse aur validate karo — agar fail hua toh error with details throw hoga
 */
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Environment validation fail ho gayi hai:');
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

/** Typed, validated environment variables — puri app mein isko import karo */
export const env = parsedEnv.data;

/** Type export for use in other modules */
export type Env = z.infer<typeof envSchema>;
