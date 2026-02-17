import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Always cache in development; in production, rely on connection pooling
if (process.env.NODE_ENV === 'development') {
  globalForPrisma.prisma = prisma;
}

// Export as 'db' as well for backward compatibility
export const db = prisma;

export default prisma;
