import { Router } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/errors.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.use(authenticate);
const id = z.object({ id: z.string().min(1) });
const pagination = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20) });
const customerInput = z.object({ name: z.string().trim().min(2), email: z.string().trim().email(), phone: z.string().trim().optional(), company: z.string().trim().optional(), status: z.enum(['ACTIVE', 'TRIAL', 'CHURNED']).optional() });
const productInput = z.object({ name: z.string().trim().min(2), sku: z.string().trim().min(1), description: z.string().trim().optional(), category: z.string().trim().min(1).optional(), status: z.enum(['ACTIVE', 'ARCHIVED']).optional(), price: z.coerce.number().finite().nonnegative(), stock: z.coerce.number().int().nonnegative() });
const getPage = (query: unknown) => pagination.parse(query);
const range = (page: number, limit: number) => ({ skip: (page - 1) * limit, take: limit });

router.get('/customers', async (req, res, next) => {
  try {
    const { page, limit } = getPage(req.query); const q = z.string().trim().optional().parse(req.query.search); const status = z.enum(['ACTIVE', 'TRIAL', 'CHURNED']).optional().parse(req.query.status);
    const where: Prisma.CustomerWhereInput = { ...(status && { status }), ...(q && { OR: [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }, { company: { contains: q, mode: 'insensitive' } }] }) };
    const [data, total] = await Promise.all([prisma.customer.findMany({ ...range(page, limit), where, orderBy: { createdAt: 'desc' } }), prisma.customer.count({ where })]);
    res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
});
router.post('/customers', validate(customerInput), async (req, res, next) => { try { res.status(201).json(await prisma.customer.create({ data: req.body })); } catch (e) { next(e); } });
router.get('/customers/:id', validate(id), async (req, res, next) => { try { const item = await prisma.customer.findUnique({ where: { id: String(req.params.id) }, include: { orders: true } }); if (!item) throw new AppError(404, 'Customer not found'); res.json(item); } catch (e) { next(e); } });
router.patch('/customers/:id', validate(id), validate(customerInput.partial()), async (req, res, next) => { try { res.json(await prisma.customer.update({ where: { id: String(req.params.id) }, data: req.body })); } catch (e) { next(e); } });
router.delete('/customers/:id', validate(id), async (req, res, next) => { try { await prisma.customer.delete({ where: { id: String(req.params.id) } }); res.status(204).send(); } catch (e) { next(e); } });

router.get('/products', async (req, res, next) => {
  try {
    const { page, limit } = getPage(req.query); const q = z.string().trim().optional().parse(req.query.search); const category = z.string().trim().optional().parse(req.query.category); const status = z.enum(['ACTIVE', 'ARCHIVED']).optional().parse(req.query.status);
    const where: Prisma.ProductWhereInput = { ...(category && { category }), ...(status && { status }), ...(q && { OR: [{ name: { contains: q, mode: 'insensitive' } }, { sku: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] }) };
    const [data, total] = await Promise.all([prisma.product.findMany({ ...range(page, limit), where, orderBy: { createdAt: 'desc' } }), prisma.product.count({ where })]);
    res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
});
router.post('/products', validate(productInput), async (req, res, next) => { try { res.status(201).json(await prisma.product.create({ data: req.body })); } catch (e) { next(e); } });
router.patch('/products/:id', validate(id), validate(productInput.partial()), async (req, res, next) => { try { res.json(await prisma.product.update({ where: { id: String(req.params.id) }, data: req.body })); } catch (e) { next(e); } });
router.delete('/products/:id', validate(id), async (req, res, next) => { try { await prisma.product.delete({ where: { id: String(req.params.id) } }); res.status(204).send(); } catch (e) { next(e); } });

const orderInput = z.object({ customerId: z.string().min(1), items: z.array(z.object({ productId: z.string().min(1), quantity: z.coerce.number().int().positive() })).min(1) });
router.get('/orders', async (req, res, next) => {
  try {
    const { page, limit } = getPage(req.query); const status = z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional().parse(req.query.status); const customerId = z.string().min(1).optional().parse(req.query.customerId);
    const productId = z.string().min(1).optional().parse(req.query.productId);
    const where: Prisma.OrderWhereInput = { ...(status && { status }), ...(customerId && { customerId }), ...(productId && { items: { some: { productId } } }) };
    const [data, total] = await Promise.all([prisma.order.findMany({ ...range(page, limit), where, include: { customer: true, items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } }), prisma.order.count({ where })]);
    res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
});
router.post('/orders', validate(orderInput), async (req, res, next) => { try { const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => { const customer = await tx.customer.findUnique({ where: { id: req.body.customerId } }); if (!customer) throw new AppError(400, 'Customer not found'); const items = await Promise.all(req.body.items.map(async (i: any) => { const p = await tx.product.findUnique({ where: { id: i.productId } }); if (!p || p.stock < i.quantity) throw new AppError(400, `Insufficient stock for ${i.productId}`); return { ...i, unitPrice: p.price }; })); const total = items.reduce((sum, i) => sum + Number(i.unitPrice) * i.quantity, 0); const created = await tx.order.create({ data: { customerId: req.body.customerId, total, items: { create: items } }, include: { items: true } }); for (const i of items) await tx.product.update({ where: { id: i.productId }, data: { stock: { decrement: i.quantity } } }); return created; }); res.status(201).json(result); } catch (e) { next(e); } });
router.patch('/orders/:id/status', validate(id.extend({ status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']) })), async (req, res, next) => { try { res.json(await prisma.order.update({ where: { id: String(req.params.id) }, data: { status: req.body.status } })); } catch (e) { next(e); } });
export default router;
