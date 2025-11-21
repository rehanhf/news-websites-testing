export interface Content {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  type: "article" | "multimedia"
  category: string
  tags: string[]
  thumbnail?: string
  galleryImages?: string[]
  author: {
    id: string
    name: string
    email: string
  }
  createdAt: Date
  updatedAt: Date
  published: boolean
}

export interface Author {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  createdAt: Date
}
