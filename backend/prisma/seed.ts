import bcrypt from 'bcryptjs';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Demo123!', 12);
  await prisma.user.createMany({
    data: [
      { name: 'Demo Admin', email: 'demo@nexusops.com', passwordHash, role: 'ADMIN' },
      { name: 'Nexus Operations', email: 'ops@nexusops.com', passwordHash, role: 'STAFF' },
    ],
  });

  const customers = await Promise.all(
    Array.from({ length: 15 }, (_, index) =>
      prisma.customer.create({
        data: {
          name: `Customer ${String(index + 1).padStart(2, '0')}`,
          email: `customer${index + 1}@nexusops.example`,
          company: `Company ${String.fromCharCode(65 + index)}`,
          phone: `+1 555 01${String(index + 1).padStart(2, '2')}`,
        },
      }),
    ),
  );

  const products = await Promise.all(
    Array.from({ length: 10 }, (_, index) =>
      prisma.product.create({
        data: {
          name: `Nexus Product ${index + 1}`,
          sku: `NX-${String(index + 1).padStart(3, '0')}`,
          description: `NexusOps catalog item ${index + 1}`,
          price: 49 + index * 25,
          stock: 250,
        },
      }),
    ),
  );

  const statuses: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  for (let index = 0; index < 30; index += 1) {
    const product = products[index % products.length];
    const quantity = (index % 3) + 1;
    await prisma.order.create({
      data: {
        customerId: customers[index % customers.length].id,
        status: statuses[index % statuses.length],
        total: Number(product.price) * quantity,
        items: {
          create: [{ productId: product.id, quantity, unitPrice: product.price }],
        },
      },
    });
  }
}

main()
  .then(() => console.log('Seeded 2 users, 15 customers, 10 products, and 30 orders.'))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
