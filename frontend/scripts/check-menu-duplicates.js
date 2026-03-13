const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const links = await prisma.menuLink.findMany({
        orderBy: { order: 'asc' }
    });
    
    console.log("Total links:", links.length);
    console.log("---");
    links.forEach(l => {
        console.log(`ID: ${l.id} | Label: ${l.label} | Path: ${l.path} | Order: ${l.order} | ParentID: ${l.parentId}`);
    });
    
    // Check for duplicates by path or label
    const byPath = {};
    const duplicates = [];
    links.forEach(l => {
        if (byPath[l.path]) {
             duplicates.push({ existing: byPath[l.path], duplicate: l });
        } else {
             byPath[l.path] = l;
        }
    });

    console.log("\n--- Duplicates Found ---");
    if (duplicates.length > 0) {
        for (const d of duplicates) {
            console.log(`Duplicate Path: ${d.duplicate.path}`);
            console.log(`  - Keeping: ${d.existing.label} (ID: ${d.existing.id})`);
            console.log(`  - Deleting: ${d.duplicate.label} (ID: ${d.duplicate.id})`);
            
            // Delete the duplicate
            await prisma.menuLink.delete({
                where: { id: d.duplicate.id }
            });
            console.log(`    -> Deleted ID: ${d.duplicate.id}`);
        }
        console.log("Cleanup complete.");
    } else {
        console.log("No duplicate paths found.");
    }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
