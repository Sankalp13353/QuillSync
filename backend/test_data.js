const prisma = require('./prisma/client');

async function run() {
  const supabaseId = 'ebf6ccf3-4636-4142-9836-bf8a2fd4c15a';
  const user = await prisma.user.findUnique({ where: { supabaseId } });
  
  if (!user) {
    console.log("User not found!");
    return;
  }
  
  console.log("User:", user);
  
  const workspaces = await prisma.workspaceMember.findMany({
    where: { userId: user.id },
    include: { workspace: true }
  });
  
  console.log("Workspaces:", workspaces.map(w => w.workspace.name));
  
  const rootDocs = await prisma.document.findMany({
    where: { workspaceId: workspaces[0]?.workspaceId, folderId: null }
  });
  
  console.log("Root Docs in WS 0:", rootDocs.length);
  
  const folders = await prisma.folder.findMany({
    where: { workspaceId: workspaces[0]?.workspaceId, parentId: null }
  });
  
  console.log("Root Folders in WS 0:", folders.length);
}

run().finally(() => prisma.$disconnect());
