const prisma = require('./client');

async function main() {
  // Users
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: { supabaseId: 'supabase-uid-alice', email: 'alice@example.com' }
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: { supabaseId: 'supabase-uid-bob', email: 'bob@example.com' }
  });

  // Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Product Design',
      ownerId: alice.id,
      members: {
        create: [
          { userId: alice.id, role: 'OWNER' },
          { userId: bob.id, role: 'EDITOR' }
        ]
      }
    }
  });

  // Tags
  const tag1 = await prisma.tag.create({ data: { name: 'design', workspaceId: workspace.id } });
  const tag2 = await prisma.tag.create({ data: { name: 'research', workspaceId: workspace.id } });

  // Documents
  const doc1 = await prisma.document.create({
    data: {
      title: 'Brand Guidelines 2024',
      content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Brand guidelines content here.' }] }] },
      workspaceId: workspace.id,
      authorId: alice.id,
      tags: { create: [{ tagId: tag1.id }] }
    }
  });

  await prisma.document.create({
    data: {
      title: 'Customer Interview #14',
      content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Interview notes here.' }] }] },
      workspaceId: workspace.id,
      authorId: bob.id,
      tags: { create: [{ tagId: tag2.id }] }
    }
  });

  console.log('✅ Seed complete');
  console.log(`   Users: ${alice.email}, ${bob.email}`);
  console.log(`   Workspace: ${workspace.name}`);
  console.log(`   Documents: Brand Guidelines 2024, Customer Interview #14`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
