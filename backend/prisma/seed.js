const prisma = require('./client');

async function main() {
  // Users
  const users = await Promise.all([
    prisma.user.upsert({ where: { email: 'alice@example.com' }, update: {}, create: { supabaseId: 'supabase-uid-alice', email: 'alice@example.com' } }),
    prisma.user.upsert({ where: { email: 'bob@example.com' }, update: {}, create: { supabaseId: 'supabase-uid-bob', email: 'bob@example.com' } }),
    prisma.user.upsert({ where: { email: 'carol@example.com' }, update: {}, create: { supabaseId: 'supabase-uid-carol', email: 'carol@example.com' } }),
    prisma.user.upsert({ where: { email: 'david@example.com' }, update: {}, create: { supabaseId: 'supabase-uid-david', email: 'david@example.com' } }),
    prisma.user.upsert({ where: { email: 'eve@example.com' }, update: {}, create: { supabaseId: 'supabase-uid-eve', email: 'eve@example.com' } }),
  ]);

  const [alice, bob, carol, david, eve] = users;

  // Workspaces
  const workspaces = await Promise.all([
    prisma.workspace.create({ data: { name: 'Product Design', ownerId: alice.id } }),
    prisma.workspace.create({ data: { name: 'Engineering', ownerId: bob.id } }),
    prisma.workspace.create({ data: { name: 'Marketing Hub', ownerId: carol.id } }),
    prisma.workspace.create({ data: { name: 'Client Portal', ownerId: david.id } }),
  ]);

  const [wsProduct, wsEng, wsMkt, wsClient] = workspaces;

  // Workspace Members
  await prisma.workspaceMember.createMany({
    data: [
      { userId: alice.id, workspaceId: wsProduct.id, role: 'OWNER' },
      { userId: bob.id, workspaceId: wsProduct.id, role: 'EDITOR' },
      { userId: carol.id, workspaceId: wsProduct.id, role: 'VIEWER' },

      { userId: bob.id, workspaceId: wsEng.id, role: 'OWNER' },
      { userId: alice.id, workspaceId: wsEng.id, role: 'EDITOR' },
      { userId: david.id, workspaceId: wsEng.id, role: 'VIEWER' },

      { userId: carol.id, workspaceId: wsMkt.id, role: 'OWNER' },
      { userId: eve.id, workspaceId: wsMkt.id, role: 'EDITOR' },

      { userId: david.id, workspaceId: wsClient.id, role: 'OWNER' },
      { userId: eve.id, workspaceId: wsClient.id, role: 'EDITOR' },
      { userId: bob.id, workspaceId: wsClient.id, role: 'VIEWER' },
    ]
  });

  // Tags
  const tagData = [
    { name: 'design', workspaceId: wsProduct.id },
    { name: 'research', workspaceId: wsProduct.id },
    { name: 'ux', workspaceId: wsProduct.id },
    { name: 'backend', workspaceId: wsEng.id },
    { name: 'frontend', workspaceId: wsEng.id },
    { name: 'devops', workspaceId: wsEng.id },
    { name: 'campaign', workspaceId: wsMkt.id },
    { name: 'seo', workspaceId: wsMkt.id },
    { name: 'client', workspaceId: wsClient.id },
    { name: 'onboarding', workspaceId: wsClient.id },
  ];
  const tags = await Promise.all(tagData.map(t => prisma.tag.create({ data: t })));

  const [tDesign, tResearch, tUx, tBackend, tFrontend, tDevops, tCampaign, tSeo, tClient, tOnboarding] = tags;

  // Documents
  const docData = [
    { title: 'Brand Guidelines 2024', workspaceId: wsProduct.id, authorId: alice.id, tagIds: [tDesign.id] },
    { title: 'Customer Interview #14', workspaceId: wsProduct.id, authorId: bob.id, tagIds: [tResearch.id] },
    { title: 'Wireframes v3', workspaceId: wsProduct.id, authorId: alice.id, tagIds: [tDesign.id, tUx.id] },
    { title: 'User Persona Profiles', workspaceId: wsProduct.id, authorId: carol.id, tagIds: [tResearch.id, tUx.id] },
    { title: 'Design System Tokens', workspaceId: wsProduct.id, authorId: alice.id, tagIds: [tDesign.id] },
    { title: 'Usability Test Results', workspaceId: wsProduct.id, authorId: bob.id, tagIds: [tResearch.id] },

    { title: 'API v2 Spec', workspaceId: wsEng.id, authorId: bob.id, tagIds: [tBackend.id] },
    { title: 'Database Schema', workspaceId: wsEng.id, authorId: bob.id, tagIds: [tBackend.id] },
    { title: 'Frontend Architecture', workspaceId: wsEng.id, authorId: alice.id, tagIds: [tFrontend.id] },
    { title: 'CI/CD Pipeline Setup', workspaceId: wsEng.id, authorId: david.id, tagIds: [tDevops.id] },
    { title: 'Technical Debt Review', workspaceId: wsEng.id, authorId: bob.id, tagIds: [tBackend.id, tFrontend.id] },
    { title: 'Security Audit Q3', workspaceId: wsEng.id, authorId: alice.id, tagIds: [tBackend.id] },
    { title: 'Performance Benchmarks', workspaceId: wsEng.id, authorId: david.id, tagIds: [tDevops.id] },

    { title: 'Q3 Campaign Brief', workspaceId: wsMkt.id, authorId: carol.id, tagIds: [tCampaign.id] },
    { title: 'SEO Strategy 2024', workspaceId: wsMkt.id, authorId: eve.id, tagIds: [tSeo.id] },
    { title: 'Social Media Calendar', workspaceId: wsMkt.id, authorId: carol.id, tagIds: [tCampaign.id] },
    { title: 'Email Campaign Templates', workspaceId: wsMkt.id, authorId: eve.id, tagIds: [tCampaign.id, tSeo.id] },
    { title: 'Competitor Analysis', workspaceId: wsMkt.id, authorId: carol.id, tagIds: [tResearch.id] },

    { title: 'Client Onboarding Guide', workspaceId: wsClient.id, authorId: david.id, tagIds: [tOnboarding.id] },
    { title: 'Project Proposal — Acme', workspaceId: wsClient.id, authorId: david.id, tagIds: [tClient.id] },
    { title: 'Meeting Notes — Acme #3', workspaceId: wsClient.id, authorId: eve.id, tagIds: [tClient.id] },
    { title: 'Invoice Template', workspaceId: wsClient.id, authorId: david.id, tagIds: [tClient.id] },
    { title: 'NDA Template', workspaceId: wsClient.id, authorId: eve.id, tagIds: [tClient.id, tOnboarding.id] },
    { title: 'Feedback Summary — Beta', workspaceId: wsClient.id, authorId: david.id, tagIds: [tOnboarding.id] },
  ];

  for (const doc of docData) {
    await prisma.document.create({
      data: {
        title: doc.title,
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: `Content for ${doc.title}.` }] }] },
        workspaceId: doc.workspaceId,
        authorId: doc.authorId,
        tags: { create: doc.tagIds.map(tagId => ({ tagId })) }
      }
    });
  }

  console.log('✅ Seed complete');
  console.log(`   Users: ${users.length}`);
  console.log(`   Workspaces: ${workspaces.length}`);
  console.log(`   Tags: ${tags.length}`);
  console.log(`   Documents: ${docData.length}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
