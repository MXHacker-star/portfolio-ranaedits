const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultLogos = [
    { name: "Zoom", imageUrl: "https://cdn.simpleicons.org/zoom/white" },
    { name: "Google", imageUrl: "https://cdn.simpleicons.org/google/white" },
    { name: "Amazon", imageUrl: "https://cdn.simpleicons.org/amazon/white" },
    { name: "Netflix", imageUrl: "https://cdn.simpleicons.org/netflix/white" },
    { name: "Airbnb", imageUrl: "https://cdn.simpleicons.org/airbnb/white" },
    { name: "Uber", imageUrl: "https://cdn.simpleicons.org/uber/white" },
    { name: "Spotify", imageUrl: "https://cdn.simpleicons.org/spotify/white" },
    { name: "Stripe", imageUrl: "https://cdn.simpleicons.org/stripe/white" },
];

async function main() {
    console.log('Seeding Client Logos to DB...');

    try {
        // 1. Seed SectionContent for Client Logos
        const existingContent = await prisma.sectionContent.findUnique({
            where: { section: 'client-logos' }
        });

        if (!existingContent) {
            console.log('Inserting default SectionContent for Client Logos...');
            await prisma.sectionContent.create({
                data: {
                    section: 'client-logos',
                    title: 'TRUSTED BY TOP BRANDS',
                    subtitle: 'AS SEEN IN', // Using subtitle for the top label
                }
            });
            console.log('✅ SectionContent for client-logos created.');
        } else {
            console.log('ℹ️ SectionContent for client-logos already exists. Skipping.');
        }

        // 2. Seed ClientLogos
        const count = await prisma.clientLogo.count();

        if (count === 0) {
            console.log(`Inserting ${defaultLogos.length} Client Logos...`);

            // Cannot use createMany here directly if we want explicit ordered inserts, but we can do a loop
            let index = 0;
            for (const logo of defaultLogos) {
                await prisma.clientLogo.create({
                    data: {
                        name: logo.name,
                        imageUrl: logo.imageUrl,
                        order: index++
                    }
                });
            }
            console.log('✅ Client Logos seeded.');
        } else {
            console.log(`ℹ️ Client Logos already found (${count}). Skipping inserts to avoid duplicates.`);
        }

    } catch (error) {
        console.error('❌ Error during seeding:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
