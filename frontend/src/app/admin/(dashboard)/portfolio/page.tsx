import { getPortfolioItems } from "@/actions/portfolio"
import { PortfolioManager } from "@/components/admin/PortfolioManager"

export const dynamic = 'force-dynamic'

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const { category } = await searchParams
    const items = await getPortfolioItems(category)

    return <PortfolioManager items={items} category={category} />
}
