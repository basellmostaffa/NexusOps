import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) { super(message); }
}
export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, 'Resource not found'));
}
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) return res.status(400).json({ error: 'Validation failed', details: error.flatten() });
  if (error instanceof SyntaxError && 'status' in error && (error as SyntaxError & { status: number }).status === 400) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code;
    if (code === 'P2002') return res.status(409).json({ error: 'A record with these unique values already exists' });
    if (code === 'P2025') return res.status(404).json({ error: 'Resource not found' });
    if (code === 'P2003') return res.status(409).json({ error: 'Resource is still in use' });
  }
  const status = error instanceof AppError ? error.statusCode : 500;
  if (status === 500) console.error(error);
  return res.status(status).json({ error: error instanceof Error ? error.message : 'Internal server error' });
}
