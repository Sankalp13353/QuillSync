const prisma = require('./prisma/client');

async function main() {
  const members = await prisma.workspaceMember.findMany();
  console.log("Found members:", members.length);
  if (members.length > 0) {
    const m = members[0];
    console.log("Attempting to update member:", m);
    try {
      const updated = await prisma.workspaceMember.update({
        where: { userId_workspaceId: { userId: m.userId, workspaceId: m.workspaceId } },
        data: { role: 'OWNER' }
      });
      console.log("Updated:", updated);
    } catch (err) {
      console.error("Error:", err);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
