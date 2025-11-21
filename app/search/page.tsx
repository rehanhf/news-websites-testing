'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ContentGrid from '@/components/content-grid'
import { Content } from '@/lib/types'

function SearchContent() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const query = searchParams.get('q') || ''

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = formData.get('q') as string

    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h1 className="text-5xl font-bold mb-12 text-balance">Search</h1>

          <form onSubmit={handleSearch} className="mb-12">
            <div className="flex gap-2">
              <input
                type="text"
                name="q"
                placeholder="Search articles..."
                defaultValue={query}
                className="flex-grow px-4 py-3 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-background rounded font-semibold hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </div>
          </form>

          {isLoading ? (
            <p className="text-muted">Searching...</p>
          ) : results.length > 0 ? (
            <>
              <p className="text-sm text-muted mb-8">Found {results.length} result{results.length !== 1 ? 's' : ''}</p>
              <ContentGrid content={results} />
            </>
          ) : query ? (
            <p className="text-muted">No results found for "{query}"</p>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
