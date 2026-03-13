import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Resetting content to defaults...")

    // Delete all packages to restore default hardcoded ones with translations
    await prisma.package.deleteMany({})
    console.log("Cleared Packages.")

    // Delete all stats to restore default hardcoded ones
    await prisma.statItem.deleteMany({})
    console.log("Cleared Stats.")

    // Delete section content (About, etc) to restore defaults
    await prisma.sectionContent.deleteMany({})
    console.log("Cleared Section Content.")

    // Delete HeroSection content to restore default YouTube video and translations
    await prisma.heroSection.deleteMany({})
    console.log("Cleared HeroSection.")

    // Clear MenuLinks 
    await prisma.menuLink.deleteMany({})
    console.log("Cleared Menu Links.")

    console.log("Reset complete. Frontend should now use hardcoded defaults.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
