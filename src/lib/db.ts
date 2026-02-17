import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: [],
    errorFormat: 'minimal',
    // Optimized for shared hosting with resource limits
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['error'],
      errorFormat: 'pretty',
    });
  }
  prisma = global.prisma;
}

// Graceful shutdown
if (process.env.NODE_ENV === 'production') {
  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

export { prisma };
export const db = prisma;
export default prisma;
