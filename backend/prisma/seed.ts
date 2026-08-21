import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jbgrocery.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@jbgrocery.com',
      password: adminPassword,
      role: "ADMIN",
      phone: '1234567890',
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 2. Create Customers
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password: customerPassword,
      phone: '0987654321',
    },
  });
  console.log(`Created customer: ${customer1.email}`);

  // 3. Create Categories
  const categories = [
    { name: 'Fruits', description: 'Fresh seasonal fruits' },
    { name: 'Vegetables', description: 'Fresh vegetables' },
    { name: 'Dairy', description: 'Milk, cheese, and eggs' },
    { name: 'Beverages', description: 'Drinks and juices' },
    { name: 'Snacks', description: 'Chips, cookies, and more' },
    { name: 'Bakery', description: 'Breads and pastries' },
    { name: 'Rice & Grains', description: 'Rice, wheat, and pulses' },
    { name: 'Household', description: 'Cleaning supplies and more' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log('Created categories.');

  const fruitsCategory = await prisma.category.findUnique({ where: { name: 'Fruits' } });
  const veggiesCategory = await prisma.category.findUnique({ where: { name: 'Vegetables' } });
  const dairyCategory = await prisma.category.findUnique({ where: { name: 'Dairy' } });

  if (fruitsCategory && veggiesCategory && dairyCategory) {
    // 4. Create Products
    const products = [
      {
        name: 'Fresh Apples',
        description: 'Crisp red apples, 1kg',
        price: 3.5,
        stock: 100,
        categoryId: fruitsCategory.id,
      },
      {
        name: 'Bananas',
        description: 'Sweet yellow bananas, 1 bunch',
        price: 1.2,
        stock: 150,
        categoryId: fruitsCategory.id,
      },
      {
        name: 'Carrots',
        description: 'Fresh organic carrots, 1kg',
        price: 2.0,
        stock: 80,
        categoryId: veggiesCategory.id,
      },
      {
        name: 'Broccoli',
        description: 'Green broccoli heads, 1 piece',
        price: 2.5,
        stock: 50,
        categoryId: veggiesCategory.id,
      },
      {
        name: 'Whole Milk',
        description: 'Fresh cow milk, 1 Gallon',
        price: 4.0,
        stock: 200,
        categoryId: dairyCategory.id,
      },
    ];

    for (const prod of products) {
      await prisma.product.create({
        data: prod,
      });
    }
    console.log('Created products.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
