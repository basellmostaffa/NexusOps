import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errors.js';

const router = Router();
router.use(authenticate);

const querySchema = z.object({
  days: z.coerce.number().int().min(7).max(365).default(30),
});

const overview = async (req: any, res: any, next: any) => {
  try {
    const { days } = querySchema.parse(req.query);
    const since = new Date();
    since.setDate(since.getDate() - days + 1);
    since.setHours(0, 0, 0, 0);

    const [customers, products, orders, revenue, statuses, orderRows, customerRows, topProducts, recentOrders] =
      await Promise.all([
        prisma.customer.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
        prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
        prisma.order.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true, total: true, status: true } }),
        prisma.customer.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
        prisma.orderItem.groupBy({
          by: ['productId'],
          where: { order: { status: { not: 'CANCELLED' } } },
          _sum: { quantity: true },
          _count: { _all: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5,
        }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { customer: { select: { id: true, name: true, email: true } }, items: { include: { product: { select: { id: true, name: true } } } } },
        }),
      ]);

    const productIds = topProducts.map((item) => item.productId);
    const productRows = await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true, sku: true } });
    const productMap = new Map(productRows.map((product) => [product.id, product]));
    const buckets = new Map<string, { revenue: number; orders: number; customers: number }>();
    for (let i = 0; i < days; i += 1) {
      const date = new Date(since);
      date.setDate(since.getDate() + i);
      buckets.set(date.toISOString().slice(0, 10), { revenue: 0, orders: 0, customers: 0 });
    }
    for (const order of orderRows) {
      const bucket = buckets.get(order.createdAt.toISOString().slice(0, 10));
      if (bucket) { bucket.orders += 1; if (order.status !== 'CANCELLED') bucket.revenue += Number(order.total); }
    }
    for (const customer of customerRows) {
      const bucket = buckets.get(customer.createdAt.toISOString().slice(0, 10));
      if (bucket) bucket.customers += 1;
    }
    const revenueOverTime = [...buckets].map(([date, values]) => ({ date, revenue: Number(values.revenue.toFixed(2)), orders: values.orders }));
    const customerGrowth = [...buckets].map(([date, values]) => ({ date, newCustomers: values.customers }));
    res.json({
      customers, products, orders, revenue: Number(revenue._sum.total ?? 0),
      orderStatuses: statuses.map((status) => ({ status: status.status, count: status._count._all })),
      revenueOverTime, customerGrowth,
      topProducts: topProducts.map((item) => ({ ...productMap.get(item.productId), quantity: item._sum.quantity ?? 0, orders: item._count._all })),
      recentOrders,
    });
  } catch (error) { next(error); }
};

router.get('/', overview);
router.get('/overview', overview);
export default router;
