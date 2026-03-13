const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const defaultTeam = [
    {
        name: "Rana",
        role: "Founder & Lead Editor",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
        order: 1
    },
    {
        name: "Sarah",
        role: "Creative Director",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
        order: 2
    },
    {
        name: "David",
        role: "Motion Graphics",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
        order: 3
    },
    {
        name: "Emily",
        role: "Script Writer",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
        order: 4
    }
]

async function main() {
    console.log('Seeding team members...')
    await prisma.teamMember.deleteMany({})
    for (const member of defaultTeam) {
        await prisma.teamMember.create({ data: member })
    }
    console.log('Team members seeded successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
