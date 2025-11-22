import { Timestamp } from "firebase/firestore"
import type { Content } from "./types"

export function buildContent(
  id: string,
  data: any,
  user: any,
  original?: Content
): Content {
  return {
    id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    type: data.type as "article" | "multimedia",
    category: data.category,
    tags: data.tags,
    thumbnail: data.thumbnail,
    galleryImages: data.galleryImages,
    author: {
      id: user.uid,
      name: data.author,
      email: user.email,
    },
    createdAt: original?.createdAt ?? new Date(),
    updatedAt: new Date(),
    published: true,
  }
}