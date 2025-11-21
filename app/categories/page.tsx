import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { getAllCategories } from "@/lib/db-firebase"

export const metadata: Metadata = {
  title: "Categories - TAJAM",
  description: "Browse content by category",
}

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h1 className="text-5xl font-bold mb-16 text-balance">Categories</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group p-6 border border-border rounded hover:bg-border transition-colors"
              >
                <h2 className="text-2xl font-bold group-hover:underline">{category.name}</h2>
                <p className="text-sm text-muted mt-2">Browse articles in this category</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
