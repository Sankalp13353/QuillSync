const prisma = require('./prisma/client');

async function run() {
  const supabaseId = 'ebf6ccf3-4636-4142-9836-bf8a2fd4c15a';
  const user = await prisma.user.findUnique({ where: { supabaseId } });
  
  if (!user) return;
  
  const workspaces = await prisma.workspaceMember.findMany({
    where: { userId: user.id },
    include: { workspace: true }
  });
  
  const wsId = workspaces[0]?.workspaceId;
  
  const allDocs = await prisma.document.findMany({
    where: { workspaceId: wsId },
    include: { tags: { include: { tag: true } } }
  });
  
  console.log(`Total Docs in WS: ${allDocs.length}`);
  allDocs.forEach(d => {
    console.log(`- Doc: ${d.title} | folderId: ${d.folderId} | Tags: ${d.tags.map(t => t.tag.name).join(', ')}`);
  });
  
  const allFolders = await prisma.folder.findMany({
    where: { workspaceId: wsId }
  });
  
  console.log(`Total Folders in WS: ${allFolders.length}`);
  allFolders.forEach(f => {
    console.log(`- Folder: ${f.name} | parentId: ${f.parentId} | ID: ${f.id}`);
  });
}

run().finally(() => prisma.$disconnect());
