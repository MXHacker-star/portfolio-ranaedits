const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const defaultFAQs = [
    {
        question: "What is your typical turnaround time?",
        answer: "For most projects, I deliver the first draft within 48 hours. However, complex projects may take 3-5 days. I always provide a specific timeline before we start.",
        category: "General",
        order: 1
    },
    {
        question: "Do you offer revisions?",
        answer: "Yes! I offer unlimited revisions until you are 100% satisfied with the result. My goal is to maximize your retention and engagement.",
        category: "Process",
        order: 2
    },
    {
        question: "What software do you use?",
        answer: "I primarily use Adobe Premiere Pro and After Effects for video editing. For graphic design, I use Photoshop and Illustrator.",
        category: "Technical",
        order: 3
    },
]

async function main() {
    console.log('Seeding FAQs...')
    await prisma.fAQ.deleteMany({}) // Clear old tests/data
    for (const faq of defaultFAQs) {
        await prisma.fAQ.create({ data: faq })
    }
    console.log('FAQs seeded successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
