import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ContentGrid from '@/components/content-grid'
import { getContentByCategory, getAllCategories } from '@/lib/db-firebase'
export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((cat) => ({
    slug: cat.slug,
  }))
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params
  const categories = await getAllCategories()
  const category = categories.find((cat) => cat.slug === slug)

  if (!category) {
    return { title: 'Not Found' }
  }

  return {
    title: `${category.name} - TAJAM`,
    description: `Explore ${category.name} articles on TAJAM`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const categories = await getAllCategories()
  const category = categories.find((cat) => cat.slug === slug)

  if (!category) {
    notFound()
  }

  const content = await getContentByCategory(category.name)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-16">
            <h1 className="text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-lg text-muted">
              {content.length} article{content.length !== 1 ? 's' : ''}
            </p>
          </div>

          {content.length > 0 ? (
            <ContentGrid content={content} />
          ) : (
            <p className="text-muted">No articles in this category yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
