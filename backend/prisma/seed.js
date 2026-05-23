import prisma from '../src/utils/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  const email = '';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('Admin user already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash('', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email,
      password: hashedPassword,
      address: 'System Address',
      role: 'ADMIN',
    },
  });

  console.log('Seeded Admin user:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
