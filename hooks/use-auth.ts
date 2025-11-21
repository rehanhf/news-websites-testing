"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, type User } from "firebase/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("[v0] Setting up auth state listener")
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        console.log("[v0] Auth state changed:", currentUser?.email || "logged out")
        setUser(currentUser)
        setLoading(false)
        setError(null)

        if (currentUser) {
          currentUser.getIdToken().then((token) => {
            document.cookie = `authToken=${token}; path=/; secure; samesite=strict`
            console.log("[v0] Auth token cookie set")
          })
        } else {
          // Clear the cookie when logging out
          document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
          console.log("[v0] Auth token cookie cleared")
        }
      },
      (authError) => {
        console.error("[v0] Auth error:", authError)
        setError(authError.message)
        setLoading(false)
      },
    )

    return () => {
      console.log("[v0] Cleaning up auth listener")
      unsubscribe()
    }
  }, [])

  return { user, loading, error }
}
