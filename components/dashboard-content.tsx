"use client"

import type React from "react"
export const dynamic = "force-dynamic"
export const revalidate = 0

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore"
import type { Content } from "@/lib/types"
import slugify from "@/lib/slugify"
import { Trash2, Edit2, Plus } from "lucide-react"

export default function DashboardContent() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"articles" | "upload" | "profile">("articles")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [articles, setArticles] = useState<Content[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
  })
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Design",
    excerpt: "",
    content: "",
    tags: "",
    thumbnail: "",
    galleryImages: [] as string[],
  })
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    console.log("[v0] Setting up dashboard auth")
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log("[v0] Dashboard auth state:", currentUser?.email || "not logged in")
      if (!currentUser) {
        console.log("[v0] No user, redirecting to login")
        router.push("/login")
      } else {
        setUser(currentUser)
        setProfileData({
          displayName: currentUser.displayName || "",
          email: currentUser.email || "",
        })
        fetchArticles(currentUser.uid)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const fetchArticles = async (userId: string) => {
    try {
      console.log("[v0] Fetching articles for user:", userId)
      const q = query(collection(db, "content"), where("authorId", "==", userId))
      const querySnapshot = await getDocs(q)
      const fetchedArticles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Content[]
      const sorted = fetchedArticles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      setArticles(sorted)
      console.log("[v0] Fetched articles:", sorted.length)
    } catch (error) {
      console.error("[v0] Error fetching articles:", error)
    }
  }

  const handleLogout = async () => {
    try {
      console.log("[v0] Logging out")
      await signOut(auth)
      localStorage.removeItem("authToken")
      router.push("/login")
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  const handleThumbnailUpload = async (file: File) => {
    try {
      console.log("[v0] Uploading thumbnail:", file.name)
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      console.log("[v0] Upload successful:", data.url)
      setFormData({ ...formData, thumbnail: data.url })
    } catch (error) {
      console.error("[v0] Error uploading thumbnail:", error)
      alert("Failed to upload thumbnail. Please try again.")
    }
  }

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files) return

    const uploadedUrls: string[] = []

    for (const file of Array.from(files)) {
      try {
        console.log("[v0] Uploading gallery image:", file.name)
        const formDataToSend = new FormData()
        formDataToSend.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataToSend,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()
        console.log("[v0] Gallery image uploaded:", data.url)
        uploadedUrls.push(data.url)
      } catch (error) {
        console.error("[v0] Error uploading gallery image:", error)
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData({
        ...formData,
        galleryImages: [...formData.galleryImages, ...uploadedUrls],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.log("[v0] Submitting article")

    try {
      if (!user) throw new Error("User not authenticated")
      if (!formData.author.trim()) throw new Error("Author name is required")

      const slug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 120)
      const contentData = {
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        thumbnail: formData.thumbnail,
        galleryImages: formData.galleryImages,
        type: "article",
        published: true,
        author: {
          id: user.uid,
          name: formData.author,
          email: user.email,
        },
        authorId: user.uid,
        updatedAt: Timestamp.now(),
      }

      if (editingId) {
        await updateDoc(doc(db, "content", editingId), contentData)
        setArticles(articles.map((a) => (a.id === editingId ? { ...a, ...contentData } : a)))
        console.log("[v0] Article updated")
      } else {
        contentData.createdAt = Timestamp.now()
        const docRef = await addDoc(collection(db, "content"), contentData)
        setArticles([{ id: docRef.id, ...contentData, createdAt: new Date() }, ...articles])
        console.log("[v0] Article published")
      }

      setFormData({
        title: "",
        author: "",
        category: "",
        excerpt: "",
        content: "",
        tags: "",
        thumbnail: "",
        galleryImages: [],
      })
      setEditingId(null)
      alert(editingId ? "Article updated successfully!" : "Article published successfully!")
    } catch (error) {
      console.error("[v0] Error submitting article:", error)
      alert(error instanceof Error ? error.message : "Failed to publish article")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      await deleteDoc(doc(db, "content", id))
      setArticles(articles.filter((a) => a.id !== id))
    } catch (error) {
      console.error("Error deleting article:", error)
      alert("Failed to delete article")
    }
  }

  const handleEdit = (article: Content) => {
    setFormData({
      title: article.title,
      author: article.author?.name || "",
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      tags: article.tags.join(", "),
      thumbnail: article.thumbnail || "",
      galleryImages: article.galleryImages || [],
    })
    setEditingId(article.id)
    setActiveTab("upload")
  }

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!user) throw new Error("User not authenticated")

      await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: profileData.displayName,
          email: profileData.email,
        }),
      })

      setUser({ ...user, displayName: profileData.displayName, email: profileData.email })
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
      alert("Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-24 text-muted-foreground">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome, {user.displayName || user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-accent rounded hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-8 mb-12 border-b border-border">
        <button
          onClick={() => setActiveTab("articles")}
          className={`pb-4 font-semibold transition-colors ${
            activeTab === "articles"
              ? "text-foreground border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          My Articles ({articles.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("upload")
            setEditingId(null)
            setFormData({
              title: "",
              author: "",
              category: "Design",
              excerpt: "",
              content: "",
              tags: "",
              thumbnail: "",
              galleryImages: [],
            })
          }}
          className={`pb-4 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "upload"
              ? "text-foreground border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Plus className="w-4 h-4" />
          {editingId ? "Edit Article" : "New Article"}
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-4 font-semibold transition-colors ${
            activeTab === "profile"
              ? "text-foreground border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Profile
        </button>
      </div>

      {activeTab === "articles" && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Articles</h2>
          {articles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No articles yet.</p>
              <button
                onClick={() => setActiveTab("upload")}
                className="text-accent hover:underline mt-4 inline-block font-medium"
              >
                Create your first article →
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="border border-border rounded-lg p-6 hover:border-accent transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{article.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{article.excerpt}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{article.category}</span>
                        <span>{article.createdAt.toLocaleDateString()}</span>
                        <span className={article.published ? "text-green-600" : "text-yellow-600"}>
                          {article.published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="p-2 hover:bg-border rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "upload" && (
        <div>
          <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit Article" : "Upload New Article"}</h2>
          <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title *
              </label>
              <input
                id="title"
                type="text"
                placeholder="Article title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium mb-2">
                Author Name *
              </label>
              <input
                id="author"
                type="text"
                placeholder="Your name as it will appear on articles"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
                className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option>Design</option>
                  <option>Editorial</option>
                  <option>Technology</option>
                  <option>Culture</option>
                  <option>Politics</option>
                  <option>Socials</option>
                  <option>Enviroment</option>
                </select>
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  placeholder="tag1, tag2, tag3"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                Excerpt
              </label>
              <input
                id="excerpt"
                type="text"
                placeholder="Brief summary of your article"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium mb-2">
                Thumbnail Image
              </label>
              <input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleThumbnailUpload(file)
                }}
                className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {formData.thumbnail && (
                <div className="mt-3 relative w-full h-32 rounded overflow-hidden border border-border">
                  <img
                    src={formData.thumbnail || "/placeholder.svg"}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="gallery" className="block text-sm font-medium mb-2">
                Gallery Images (optional - for article carousel)
              </label>
              <input
                id="gallery"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleGalleryUpload(e.target.files)}
                className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {formData.galleryImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-3">{formData.galleryImages.length} image(s) added</p>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.galleryImages.map((image, index) => (
                      <div key={index} className="relative rounded border border-border overflow-hidden h-24 group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              galleryImages: formData.galleryImages.filter((_, i) => i !== index),
                            })
                          }}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                Content *
              </label>
              <textarea
                id="content"
                rows={12}
                placeholder="Your article content..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-accent text-accent-foreground rounded font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? "Publishing..." : editingId ? "Update Article" : "Publish Article"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({
                      title: "",
                      author: "",
                      category: "Design",
                      excerpt: "",
                      content: "",
                      tags: "",
                      thumbnail: "",
                      galleryImages: [],
                    })
                  }}
                  className="px-6 py-2 border border-border rounded hover:bg-border transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {activeTab === "profile" && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
          <form onSubmit={handleProfileUpdate} className="max-w-2xl space-y-6">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="Your display name"
                value={profileData.displayName}
                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-accent text-accent-foreground rounded font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
