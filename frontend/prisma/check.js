const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

p.package.findMany({ orderBy: { order: 'asc' } })
    .then(r => {
        console.log('Total packages:', r.length);
        r.forEach(x => console.log(`  [${x.order}] ${x.name} | ${x.price} | popular:${x.isPopular}`));
    })
    .finally(() => p.$disconnect());
