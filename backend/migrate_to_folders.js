require('dotenv').config();
const prisma = require('./prisma/client');

async function main() {
  const workspaces = await prisma.workspace.findMany();
  let movedDocsCount = 0;

  for (const ws of workspaces) {
    const rootDocs = await prisma.document.findMany({
      where: {
        workspaceId: ws.id,
        folderId: null
      }
    });

    if (rootDocs.length > 0) {
      let generalFolder = await prisma.folder.findFirst({
        where: {
          workspaceId: ws.id,
          name: 'General',
          parentId: null
        }
      });

      if (!generalFolder) {
        generalFolder = await prisma.folder.create({
          data: {
            name: 'General',
            workspaceId: ws.id
          }
        });
      }

      const updateResult = await prisma.document.updateMany({
        where: {
          workspaceId: ws.id,
          folderId: null
        },
        data: {
          folderId: generalFolder.id
        }
      });
      
      movedDocsCount += updateResult.count;
      console.log(`Moved ${updateResult.count} root documents to "General" folder in workspace ${ws.name}`);
    }
  }

  console.log(`Migration complete. Moved a total of ${movedDocsCount} documents.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
