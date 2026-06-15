#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Password: Password123
  const testPassword = await bcrypt.hash('Password123', 12);

  // ========== TEST ACCOUNTS FOR DEMO ==========
  console.log('📋 Creating test accounts:\n');

  // 1. CLIENT Test Account
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@fastpastry.com' },
    update: { passwordHash: testPassword, status: 'ACTIVE' },
    create: {
      email: 'client@fastpastry.com',
      passwordHash: testPassword,
      fullName: 'Demo Client',
      phone: '+1234567890',
      role: 'CLIENT',
      status: 'ACTIVE',
      tier: 'NEW',
    },
  });
  console.log('✅ CLIENT Account:');
  console.log(`   Email: ${clientUser.email}`);
  console.log('   Password: Password123\n');

  // 2. DRIVER Test Account
  const driverUser = await prisma.user.upsert({
    where: { email: 'driver@fastpastry.com' },
    update: { passwordHash: testPassword, status: 'ACTIVE' },
    create: {
      email: 'driver@fastpastry.com',
      passwordHash: testPassword,
      fullName: 'Demo Driver',
      phone: '+1234567891',
      role: 'DRIVER',
      status: 'ACTIVE',
    },
  });

  await prisma.driver.upsert({
    where: { userId: driverUser.id },
    update: { status: 'ONLINE' },
    create: {
      userId: driverUser.id,
      status: 'ONLINE',
      vehicleType: 'Scooter',
    },
  });
  console.log('✅ DRIVER Account:');
  console.log(`   Email: ${driverUser.email}`);
  console.log('   Password: Password123\n');

  // 3. ADMIN Test Account
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@fastpastry.com' },
    update: { passwordHash: testPassword, status: 'ACTIVE' },
    create: {
      email: 'admin@fastpastry.com',
      passwordHash: testPassword,
      fullName: 'Admin Manager',
      phone: '+1234567892',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✅ ADMIN Account:');
  console.log(`   Email: ${adminUser.email}`);
  console.log('   Password: Password123\n');

  console.log('═'.repeat(60));
  console.log('\n✨ Database seeding completed successfully!\n');
  console.log('🔐 USE THESE ACCOUNTS TO LOGIN:\n');
  console.log('   Password: Password123\n');
  console.log('   👤 CLIENT → client@fastpastry.com');
  console.log('   🚗 DRIVER → driver@fastpastry.com');
  console.log('   ⚙️  ADMIN  → admin@fastpastry.com\n');
  console.log('═'.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
