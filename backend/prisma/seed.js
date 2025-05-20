const { PrismaClient } = require('../generated/prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

const NUM_USERS = 10000;
const REVIEWS_PER_USER = 10;

async function main() {
  for (let i = 0; i < NUM_USERS; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(['user', 'admin'])
      },
    });

    const reviews = Array.from({ length: REVIEWS_PER_USER }).map(() => ({
      title: faker.lorem.words(3),
      body: faker.lorem.paragraph(),
      rating: faker.helpers.arrayElement(['1', '2', '3', '4', '5']),
      date: faker.date.past().toISOString().split('T')[0],
      userId: user.id,
    }));

    await prisma.review.createMany({ data: reviews });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
