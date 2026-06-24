// ========================================
// Darpan CP Tracker - Async Wrapper
// Yeh utility Express async route handlers ko wrap karta hai
// Taaki try-catch har jagah likhna na pade — errors automatically next() mein jaayein
// ========================================

import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Express async route handler ko wrap karta hai
 * Agar async function mein error aaye toh automatically next() call hoga
 * aur global error handler usko handle karega
 *
 * @example
 * router.get('/users', asyncWrapper(async (req, res) => {
 *   const users = await userService.findAll();
 *   res.json(users);
 * }));
 */
export const asyncWrapper = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
