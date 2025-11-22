import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getContentBySlug } from "@/lib/db"
import ImageCarousel from "@/components/image-carousel"
export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    type: string
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const content = await getContentBySlug(slug)

  if (!content) {
    return {
      title: "Not Found",
    }
  }

  return {
    title: `${content.title} - TAJAM`,
    description: content.excerpt,
    openGraph: {
      title: content.title,
      description: content.excerpt,
      type: "article",
      images: content.thumbnail ? [{ url: content.thumbnail }] : [],
    },
  }
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params
  const content = await getContentBySlug(slug)

  if (!content) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <article className="mx-auto max-w-3xl px-6 py-24">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs text-muted uppercase tracking-wide">
                {new Date(content.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-xs text-muted uppercase tracking-wide">•</span>
              <span className="text-xs text-muted uppercase tracking-wide">{content.category}</span>
            </div>

            <h1 className="text-5xl font-bold mb-6 text-balance">{content.title}</h1>

            <p className="text-xl text-muted leading-relaxed mb-8">{content.excerpt}</p>

            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1 bg-border rounded text-muted">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-b border-border py-12 mb-12">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold">{content.author.name}</p>
                <p className="text-sm text-muted">{content.author.email}</p>
              </div>
            </div>
          </div>

          <ImageCarousel images={content.galleryImages || []} title={content.title} />

          <div className="prose prose-invert max-w-none mb-12">
            <div className="whitespace-pre-wrap text-base leading-relaxed">{content.content}</div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
