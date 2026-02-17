import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const clientOptions = {
  log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  errorFormat: 'minimal' as const,
};

let prisma: PrismaClient;

if (!global.prisma) {
  prisma = new PrismaClient(clientOptions);
  if (process.env.NODE_ENV === 'production') {
    global.prisma = prisma;
  }
} else {
  prisma = global.prisma;
}

// Graceful shutdown
if (process.env.NODE_ENV === 'production') {
  const shutdownHandler = async (signal: string) => {
    console.log(`Received ${signal}, disconnecting Prisma...`);
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error('Error disconnecting Prisma:', error);
    }
    process.exit(0);
  };

  process.on('SIGINT', () => shutdownHandler('SIGINT'));
  process.on('SIGTERM', () => shutdownHandler('SIGTERM'));
}

export { prisma };
export const db = prisma;
export default prisma;
