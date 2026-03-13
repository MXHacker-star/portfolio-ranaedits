
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Checking for vertical videos...")
    const verticalItems = await prisma.portfolioItem.findMany({
        where: { orientation: "vertical" }
    })
    console.log(`Vertical Items found in DB: ${verticalItems.length}`)
    // console.log("Vertical Items found:", verticalItems)

    const allItems = await prisma.portfolioItem.findMany()
    console.log(`Total items in DB: ${allItems.length}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
