import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-24 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-bold mb-4">TAJAM</h3>
            <p className="text-sm text-muted-foreground">Sharp, elegant news and editorial content. Cut through the noise.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm">Navigate</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/archive" className="text-muted-foreground hover:text-foreground transition-colors">Archive</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">Categories</Link></li>
              <li><Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">Search</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm">For Authors</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-xs text-muted-foreground">
          <p>&copy; 2025 TAJAM. To the Point.</p>
        </div>
      </div>
    </footer>
  )
}
