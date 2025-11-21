import { type NextRequest, NextResponse } from "next/server"
import { getLatestContent, getContentByCategory, searchContent } from "@/lib/db-firebase"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (category) {
      const content = await getContentByCategory(category)
      return NextResponse.json(content)
    }

    if (query) {
      const results = await searchContent(query)
      return NextResponse.json(results)
    }

    const content = await getLatestContent(limit)
    return NextResponse.json(content)
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}
