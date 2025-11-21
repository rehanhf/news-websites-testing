import { db } from "./firebase"
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore"
import type { Content, Category } from "./types"

export async function getLatestContent(limitNum = 10): Promise<Content[]> {
  try {
    const q = query(collection(db, "content"), orderBy("createdAt", "desc"), limit(limitNum))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      }))
      .filter((content) => content.published)
      .slice(0, limitNum) as Content[]
  } catch (error) {
    console.error("Error fetching latest content:", error)
    return []
  }
}

export async function getContentBySlug(slug: string): Promise<Content | null> {
  try {
    const q = query(collection(db, "content"), where("slug", "==", slug))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Content
  } catch (error) {
    console.error("Error fetching content by slug:", error)
    return null
  }
}

export async function getContentByCategory(category: string): Promise<Content[]> {
  try {
    const q = query(collection(db, "content"), where("category", "==", category))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      }))
      .filter((content) => content.published)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Content[]
  } catch (error) {
    console.error("Error fetching content by category:", error)
    return []
  }
}

export async function searchContent(searchQuery: string): Promise<Content[]> {
  try {
    const q = query(collection(db, "content"))
    const querySnapshot = await getDocs(q)
    const lowerQuery = searchQuery.toLowerCase()
    return querySnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          }) as Content,
      )
      .filter(
        (c) =>
          c.published &&
          (c.title.toLowerCase().includes(lowerQuery) ||
            c.excerpt.toLowerCase().includes(lowerQuery) ||
            c.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))),
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  } catch (error) {
    console.error("Error searching content:", error)
    return []
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const q = query(collection(db, "content"))
    const querySnapshot = await getDocs(q)

    // Extract unique categories from all published articles
    const categoriesMap = new Map<string, Category>()

    querySnapshot.docs.forEach((doc) => {
      const data = doc.data()
      if (data.published && data.category) {
        const slug = data.category.toLowerCase().replace(/\s+/g, "-")
        if (!categoriesMap.has(slug)) {
          categoriesMap.set(slug, {
            id: slug,
            name: data.category,
            slug: slug,
            createdAt: new Date(),
          })
        }
      }
    })

    return Array.from(categoriesMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function createContent(data: Omit<Content, "id" | "createdAt" | "updatedAt">) {
  try {
    const docRef = await addDoc(collection(db, "content"), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating content:", error)
    throw error
  }
}

export async function updateContent(id: string, data: Partial<Content>) {
  try {
    const docRef = doc(db, "content", id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating content:", error)
    throw error
  }
}

export async function deleteContent(id: string) {
  try {
    await deleteDoc(doc(db, "content", id))
  } catch (error) {
    console.error("Error deleting content:", error)
    throw error
  }
}

export async function getUserProfile(userId: string) {
  try {
    const q = query(collection(db, "users"), where("uid", "==", userId))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

export async function updateUserProfile(userId: string, data: { displayName?: string; email?: string }) {
  try {
    const q = query(collection(db, "users"), where("uid", "==", userId))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const docRef = doc(db, "users", querySnapshot.docs[0].id)
      await updateDoc(docRef, data)
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

export async function getUserArticles(userId: string): Promise<Content[]> {
  try {
    const q = query(collection(db, "content"), where("authorId", "==", userId))
    const querySnapshot = await getDocs(q)
    const articles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Content[]

    // Sort on client side to avoid needing composite index
    return articles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  } catch (error) {
    console.error("Error fetching user articles:", error)
    return []
  }
}
