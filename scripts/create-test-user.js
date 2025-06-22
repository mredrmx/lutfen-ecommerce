const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Admin kullanıcısı oluştur
    const adminPassword = await bcrypt.hash('a', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'a',
        password: adminPassword,
        name: 'Admin',
        surname: 'User',
        role: 'ADMIN'
      }
    });
    
    console.log('Admin kullanıcısı oluşturuldu:', admin);

    // Normal kullanıcı oluştur
    const userPassword = await bcrypt.hash('b', 10);
    const user = await prisma.user.create({
      data: {
        email: 'b',
        password: userPassword,
        name: 'Normal',
        surname: 'User',
        role: 'USER'
      }
    });
    
    console.log('Normal kullanıcı oluşturuldu:', user);
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers(); 