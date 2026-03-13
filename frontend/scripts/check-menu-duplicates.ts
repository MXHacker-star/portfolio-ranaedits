import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const links = await prisma.menuLink.findMany({
    orderBy: { order: 'asc' }
  })
  
  console.log("Total links:", links.length)
  console.log("------------------------")
  
  const byPath = {};
  const duplicates = [];

  links.forEach(l => {
    console.log(`ID: ${l.id} | Label: ${l.label} | Path: ${l.path} | Order: ${l.order} | ParentID: ${l.parentId}`)
    
    if (byPath[l.path]) {
      duplicates.push({ existing: byPath[l.path], duplicate: l });
    } else {
      byPath[l.path] = l;
    }
  })

  console.log("\n--- Duplicates Found (By Path) ---")
  if (duplicates.length > 0) {
    duplicates.forEach(d => {
      console.log(`Duplicate Path: ${d.duplicate.path}`)
      console.log(`  - Existing: ${d.existing.label} (ID: ${d.existing.id})`)
      console.log(`  - Duplicate: ${d.duplicate.label} (ID: ${d.duplicate.id})`)
    })
  } else {
    console.log("No duplicate paths found.")
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
