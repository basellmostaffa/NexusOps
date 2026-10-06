import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/errors.js';
import { signToken, authenticate, AuthRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
const router = Router();
const credentials = z.object({ email: z.string().email(), password: z.string().min(8) });
router.post('/register', validate(credentials.extend({ name: z.string().min(2) })), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new AppError(409, 'Email is already registered');
    const user = await prisma.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) } });
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token: signToken(user) });
  } catch (e) { next(e); }
});
router.post('/login', validate(credentials), async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) throw new AppError(401, 'Invalid email or password');
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token: signToken(user) });
  } catch (e) { next(e); }
});
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try { const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { id: true, name: true, email: true, role: true } }); if (!user) throw new AppError(404, 'User not found'); res.json({ user }); } catch (e) { next(e); }
});
export default router;
