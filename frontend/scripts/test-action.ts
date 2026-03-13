
import { getPortfolioItems } from "../src/actions/portfolio"

async function main() {
    console.log("Fetching Video Editing items via action...")
    const items = await getPortfolioItems("Video Editing")
    const verticalItems = items.filter(i => i.orientation === "vertical")
    console.log(`Found ${verticalItems.length} VERTICAL items.`)
    verticalItems.forEach(item => {
        console.log(`Title: ${item.title}, Orientation: ${item.orientation}, SubCat: ${item.subCategory}`)
    })
}

main()
