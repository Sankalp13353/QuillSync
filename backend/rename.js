const prisma = require('./prisma/client');

async function run() {
  await prisma.document.updateMany({
    where: { title: 'Project Acme Overview' },
    data: { title: 'Acme Product Brief' }
  });
  console.log("Renamed document successfully.");
}

run().finally(() => prisma.$disconnect());
