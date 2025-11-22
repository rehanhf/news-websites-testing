import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getLatestContent } from "@/lib/db"
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Archive - TAJAM",
  description: "Browse all published content on TAJAM",
}

export default async function ArchivePage() {
  const content = await getLatestContent(50)
  const years = new Map<number, typeof content>()

  content.forEach((item) => {
    const year = new Date(item.createdAt).getFullYear()
    if (!years.has(year)) {
      years.set(year, [])
    }
    years.get(year)?.push(item)
  })

  const sortedYears = Array.from(years.entries()).sort((a, b) => b[0] - a[0])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h1 className="text-5xl font-bold mb-16 text-balance">Archive</h1>

          {sortedYears.length === 0 ? (
            <p className="text-muted">No content yet.</p>
          ) : (
            <div className="space-y-12">
              {sortedYears.map(([year, items]) => (
                <div key={year}>
                  <h2 className="text-2xl font-bold mb-6 text-muted">{year}</h2>
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <li key={item.id} className="border-b border-border pb-4 last:border-b-0">
                        <a
                          href={`/${item.type}/${item.slug}`}
                          className="group block hover:opacity-75 transition-opacity"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-grow min-w-0">
                              <h3 className="font-bold mb-1 group-hover:underline line-clamp-2">{item.title}</h3>
                              <p className="text-sm text-muted">{item.category}</p>
                            </div>
                            <time className="text-sm text-muted flex-shrink-0">
                              {new Date(item.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </time>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
