"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    console.log("[v0] Login attempt started")

    try {
      console.log("[v0] Attempting Firebase sign-in with email:", email)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("[v0] Sign-in successful:", userCredential.user.email)

      const idToken = await userCredential.user.getIdToken()
      document.cookie = `authToken=${idToken}; path=/; secure; samesite=strict`
      console.log("[v0] Auth token set immediately, navigating to dashboard")

      setTimeout(() => {
        router.push("/dashboard")
      }, 200)
    } catch (err: any) {
      console.error("[v0] Login error:", err.code, err.message)
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email")
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password")
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format")
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many login attempts. Please try again later")
      } else {
        setError(err.message || "Login failed. Please try again")
      }
      setIsLoading(false)
    }
  }

  if (!isReady) {
    return <div className="text-center">Initializing...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-accent text-accent-foreground rounded font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  )
}
