import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Crear categorías por defecto
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Streaming' },
      update: {},
      create: {
        name: 'Streaming',
        color: '#FF6B6B',
        icon: 'tv',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Cloud Services' },
      update: {},
      create: {
        name: 'Cloud Services',
        color: '#4ECDC4',
        icon: 'cloud',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Software' },
      update: {},
      create: {
        name: 'Software',
        color: '#45B7D1',
        icon: 'package',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Gaming' },
      update: {},
      create: {
        name: 'Gaming',
        color: '#96CEB4',
        icon: 'gamepad-2',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Music' },
      update: {},
      create: {
        name: 'Music',
        color: '#FFEAA7',
        icon: 'music',
      },
    }),
    prisma.category.upsert({
      where: { name: 'AI Tools' },
      update: {},
      create: {
        name: 'AI Tools',
        color: '#A29BFE',
        icon: 'brain',
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
