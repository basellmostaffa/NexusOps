import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './errors.js';

export type AuthRequest = Request & { user?: { id: string; role: string } };
export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : undefined;
  if (!token) return next(new AppError(401, 'Authentication required'));
  try { req.user = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string }; next(); }
  catch { next(new AppError(401, 'Invalid or expired token')); }
}
export function signToken(user: { id: string; role: string }) {
  return jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
}
