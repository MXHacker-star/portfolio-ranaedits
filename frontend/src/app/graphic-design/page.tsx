import { getPortfolioItems } from "@/actions/portfolio";
import { getCategories } from "@/actions/categories";

import { GraphicDesignContent } from "./content";

export const dynamic = 'force-dynamic';

export default async function GraphicDesignPage() {
    // Fetch items
    const graphicItems = await getPortfolioItems("Graphic Design");
    const productItems = await getPortfolioItems("Product Design");
    const allItems = [...graphicItems, ...productItems];

    // Get categories from DB instead of hardcoded list
    const allCategories = await getCategories()
    const graphicCategories = allCategories
        .filter(c => c.type === 'graphic')
        .map(c => c.name)

    return (
        <GraphicDesignContent
            allItems={allItems}
            graphicCategories={graphicCategories}
        />
    );
}
