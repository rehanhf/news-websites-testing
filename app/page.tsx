import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ContentGrid from "@/components/content-grid"
import { getLatestContent } from "@/lib/db-firebase"

export const metadata = {
  title: "TAJAM - To the Point",
  description: "Latest news, articles, and editorial content",
  openGraph: {
    title: "TAJAM - Sharp Editorial Content",
    description: "To the Point",
    image: "/og-image.png",
  },
}

export default async function HomePage() {
  const content = await getLatestContent(10)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-16 space-y-2">
            <h1 className="text-6xl font-bold text-balance">TAJAM</h1>
            <p className="text-xl text-muted-foreground">To the Point</p>
          </div>

          <Suspense fallback={<div className="text-muted">Loading content...</div>}>
            <ContentGrid content={content} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
