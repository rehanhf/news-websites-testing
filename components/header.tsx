"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export default function Header() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    const html = document.documentElement
    const newIsDark = !isDark

    if (newIsDark) {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
    setIsDark(newIsDark)
  }

  if (!mounted) return null

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <nav className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          TAJAM
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden sm:flex gap-6 text-sm">
            <Link href="/archive" className="hover:text-muted transition-colors">
              Archive
            </Link>
            <Link href="/categories" className="hover:text-muted transition-colors">
              Categories
            </Link>
            <Link href="/search" className="hover:text-muted transition-colors">
              Search
            </Link>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-border rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>
    </header>
  )
}
