import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin2026!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bellasglamour.com' },
    update: {},
    create: {
      email: 'admin@bellasglamour.com',
      password_hash: adminPassword,
      name: 'Administrador',
      role: 'admin',
      email_verified: true,
      age_verified: true,
    },
  });

  console.log('Admin user created:', admin.id, admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
