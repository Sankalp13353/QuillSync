require('dotenv').config();
const prisma = require('./prisma/client');

async function main() {
  const workspaces = await prisma.workspace.findMany();
  let count = 0;
  for (const ws of workspaces) {
    const updated = await prisma.workspaceMember.updateMany({
      where: {
        workspaceId: ws.id,
        userId: ws.ownerId
      },
      data: {
        role: 'OWNER'
      }
    });
    count += updated.count;
  }
  console.log(`Updated ${count} workspace owners to OWNER role.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
