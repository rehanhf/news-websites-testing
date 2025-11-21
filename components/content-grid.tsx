import Link from 'next/link'
import Image from 'next/image'
import { Content } from '@/lib/types'

interface ContentGridProps {
  content: Content[]
}

export default function ContentGrid({ content }: ContentGridProps) {
  if (content.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        No content published yet.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {content.map((item) => (
        <article key={item.id} className="group border-b border-border pb-8 last:border-b-0">
          <Link href={`/${item.type}/${item.slug}`} className="block">
            <div className="flex gap-8 items-start">
              {item.thumbnail && (
                <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden bg-border rounded">
                  <Image
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:opacity-75 transition-opacity"
                  />
                </div>
              )}
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <time className="text-xs text-muted-foreground-foreground uppercase tracking-wide">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:opacity-75 transition-opacity line-clamp-2">
                  {item.title}
                </h2>
                <p className="text-muted-foreground line-clamp-2 mb-3">{item.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags && item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-border rounded text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}
