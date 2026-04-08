require('dotenv').config();
const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const email = 'admin@360sehpa.com';
    const password = 'Admin123!';
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log('Admin user already exists:', email);
      
      // Update to admin role if not already
      if (existingUser.role !== UserRole.ADMIN) {
        await prisma.user.update({
          where: { email },
          data: { role: UserRole.ADMIN }
        });
        console.log('Updated to ADMIN role');
      }
      
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', admin.role);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
