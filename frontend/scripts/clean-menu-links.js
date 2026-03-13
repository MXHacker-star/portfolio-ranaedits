const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanMenus() {
    console.log("Starting menu cleanup...");
    const links = await prisma.menuLink.findMany({
        orderBy: { order: 'asc' }
    });
    
    console.log(`Found ${links.length} total links.`);
    
    // Group by path, keeping the first one seen (with lowest order)
    const seenPaths = new Set();
    const toDelete = [];
    
    for (const link of links) {
        if (seenPaths.has(link.path)) {
            // It's a duplicate
            toDelete.push(link);
        } else {
            // First time seeing this path
            seenPaths.add(link.path);
        }
    }
    
    if (toDelete.length === 0) {
        console.log("No duplicates found to delete.");
        return;
    }
    
    console.log(`Found ${toDelete.length} duplicates to delete.`);
    
    for (const link of toDelete) {
        console.log(`Deleting duplicate: Label='${link.label}', Path='${link.path}', ID='${link.id}'`);
        await prisma.menuLink.delete({
            where: { id: link.id }
        });
    }
    
    console.log("Cleanup finished successfully!");
}

cleanMenus()
  .catch(e => {
      console.error("Error during cleanup:", e);
      process.exit(1);
  })
  .finally(async () => {
      await prisma.$disconnect();
  });
