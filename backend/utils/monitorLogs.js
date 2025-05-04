const { PrismaClient } = require('../generated/prisma/client');

const TIME_WINDOW_MINUTES = 1;
const ACTION_THRESHOLD = 5;

async function detectSuspiciousActivity() {
    const prisma = new PrismaClient();
    console.log("detecting suspicious activity...");
    const since = new Date(Date.now() - TIME_WINDOW_MINUTES * 60 * 1000);
    const logs = await prisma.log.findMany({
        where: { createdAt: { gte: since } },
    });

    const actionCounts = {};
    logs.forEach(log => {
        actionCounts[log.username] = (actionCounts[log.username] || 0) + 1;
    });

    for (const [username, count] of Object.entries(actionCounts)) {
        if (count > ACTION_THRESHOLD) {
        await prisma.monitoredUser.upsert({
            where: { username: username },
            update: { lastDetected: new Date() },
            create: { username: username, lastDetected: new Date() },
        });
        }
    }
}

module.exports = { detectSuspiciousActivity };
