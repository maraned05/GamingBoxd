const { PrismaClient } = require('../generated/prisma/client');

async function logActivity(username, action) {
    const prisma = new PrismaClient();
    
    await prisma.log.create({
      data: {
        username: username,
        action: action,
      },
    });
}
  
  module.exports = { logActivity };