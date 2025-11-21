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
    const querySnapshot = await getDocs(collection(db, "categories"))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Category[]
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
