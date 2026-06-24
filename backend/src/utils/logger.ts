// ========================================
// Darpan CP Tracker - Winston Logger
// Yeh module structured logging provide karta hai puri app ke liye
// Development mein colorized console, production mein rotating file logs
// ========================================

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

/**
 * Custom log format — timestamp, level, aur message ke saath structured output
 */
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (stack) {
      log += `\n${stack}`;
    }
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    return log;
  })
);

/**
 * Console transport — development ke liye colorized output
 */
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    customFormat
  ),
});

/**
 * Daily rotate file transport — production ke liye rotating log files
 * Har din naya file, 14 din ke baad purane delete, max 20MB per file
 */
const fileRotateTransport = new DailyRotateFile({
  filename: path.join(__dirname, '../../logs/darpan-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: winston.format.combine(
    winston.format.uncolorize(),
    customFormat
  ),
});

/**
 * Error-specific rotate transport — sirf errors alag file mein
 */
const errorFileTransport = new DailyRotateFile({
  filename: path.join(__dirname, '../../logs/error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: winston.format.combine(
    winston.format.uncolorize(),
    customFormat
  ),
});

/**
 * Transports decide karo based on NODE_ENV
 * Development mein console, production mein file + console dono
 */
const transports: winston.transport[] = [consoleTransport];

if (process.env.NODE_ENV === 'production') {
  transports.push(fileRotateTransport, errorFileTransport);
}

/**
 * Main logger instance — puri app mein yahi use hoga
 * Service name 'darpan-api' se identify hoga
 */
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'darpan-api' },
  transports,
  // Uncaught exceptions aur rejections bhi log karo
  exceptionHandlers: [
    new winston.transports.Console(),
    ...(process.env.NODE_ENV === 'production'
      ? [
          new DailyRotateFile({
            filename: path.join(__dirname, '../../logs/exceptions-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
          }),
        ]
      : []),
  ],
  rejectionHandlers: [
    new winston.transports.Console(),
    ...(process.env.NODE_ENV === 'production'
      ? [
          new DailyRotateFile({
            filename: path.join(__dirname, '../../logs/rejections-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
          }),
        ]
      : []),
  ],
});
