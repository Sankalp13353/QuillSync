const prisma = require('./client');

async function main() {
  // --- 1. Clean existing data ---
  await prisma.$transaction([
    prisma.documentTag.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.document.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.folder.deleteMany(),
    prisma.workspaceMember.deleteMany(),
    prisma.workspace.deleteMany(),
    prisma.user.deleteMany()
  ]);

  // --- 2. Users ---
  const usersData = [
    { supabaseId: 'ebf6ccf3-4636-4142-9836-bf8a2fd4c15a', email: 'admin@nst.rishihood.edu.in' },
    { supabaseId: 'uid-marcus', email: 'marcus.j@acmecorp.com' },
    { supabaseId: 'uid-elena', email: 'elena.r@acmecorp.com' }
  ];
  const users = await Promise.all(usersData.map(u => 
    prisma.user.create({ data: u })
  ));
  const [sarah, marcus, elena] = users;

  // --- 3. Workspace ---
  const ws = await prisma.workspace.create({
    data: {
      name: 'Acme Product Development',
      description: 'Core documentation for the Acme web app ecosystem.',
      ownerId: sarah.id
    }
  });

  await prisma.workspaceMember.createMany({
    data: [
      { userId: sarah.id, workspaceId: ws.id, role: 'OWNER' },
      { userId: marcus.id, workspaceId: ws.id, role: 'EDITOR' },
      { userId: elena.id, workspaceId: ws.id, role: 'VIEWER' }
    ]
  });

  // --- 4. Custom Labels (Tags) ---
  const tagData = [
    { name: 'Urgent', color: '#ef4444', workspaceId: ws.id },       // red
    { name: 'In Review', color: '#f59e0b', workspaceId: ws.id },    // yellow
    { name: 'Approved', color: '#10b981', workspaceId: ws.id },     // green
    { name: 'Architecture', color: '#8b5cf6', workspaceId: ws.id }, // purple
    { name: 'Frontend', color: '#3b82f6', workspaceId: ws.id }      // blue
  ];
  const tags = await Promise.all(tagData.map(t => prisma.tag.create({ data: t })));
  const [tagUrgent, tagReview, tagApproved, tagArch, tagFront] = tags;

  // --- 5. Nested Folders ---
  // Root Level
  const folderEngineering = await prisma.folder.create({ data: { name: 'Engineering', workspaceId: ws.id } });
  const folderDesign = await prisma.folder.create({ data: { name: 'Design', workspaceId: ws.id } });
  const folderProduct = await prisma.folder.create({ data: { name: 'Product Management', workspaceId: ws.id } });

  // Second Level (inside Engineering)
  const folderFrontend = await prisma.folder.create({ data: { name: 'Frontend', workspaceId: ws.id, parentId: folderEngineering.id } });
  const folderBackend = await prisma.folder.create({ data: { name: 'Backend', workspaceId: ws.id, parentId: folderEngineering.id } });

  // Third Level (inside Frontend)
  const folderComponents = await prisma.folder.create({ data: { name: 'Shared Components', workspaceId: ws.id, parentId: folderFrontend.id } });

  // --- 6. Documents ---
  const docData = [
    // Root Level (No Folder)
    { title: 'Project Acme Overview', folderId: null, authorId: sarah.id, tagIds: [tagApproved.id] },
    
    // Design Folder
    { title: 'Q3 Design System Updates', folderId: folderDesign.id, authorId: elena.id, tagIds: [tagReview.id] },
    
    // Product Folder
    { title: 'Q3 OKRs & Milestones', folderId: folderProduct.id, authorId: sarah.id, tagIds: [tagUrgent.id] },
    
    // Engineering Folder
    { title: 'System Architecture v2.0', folderId: folderEngineering.id, authorId: marcus.id, tagIds: [tagArch.id, tagApproved.id] },
    
    // Backend Folder
    { title: 'Database Migration Strategy', folderId: folderBackend.id, authorId: marcus.id, tagIds: [tagArch.id] },
    
    // Frontend Folder
    { title: 'State Management Refactor', folderId: folderFrontend.id, authorId: elena.id, tagIds: [tagFront.id, tagReview.id] },
    
    // Shared Components Folder (Deepest)
    { title: 'Button Component API Specs', folderId: folderComponents.id, authorId: elena.id, tagIds: [tagFront.id, tagApproved.id] },
    { title: 'Modal Refactor Checklist', folderId: folderComponents.id, authorId: elena.id, tagIds: [tagFront.id, tagUrgent.id] }
  ];

  for (const doc of docData) {
    await prisma.document.create({
      data: {
        title: doc.title,
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: `Detailed content for ${doc.title}...` }] }] },
        workspaceId: ws.id,
        folderId: doc.folderId,
        authorId: doc.authorId,
        tags: { create: doc.tagIds.map(tagId => ({ tagId })) }
      }
    });
  }

  console.log('✅ Realistic Seed Complete!');
  console.log('   Users: 3');
  console.log('   Workspaces: 1');
  console.log('   Folders: 6 (Up to 3 levels deep)');
  console.log('   Labels: 5 (Colored)');
  console.log('   Documents: 8');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
