// lib/slugify.ts
export default function slugify(title: string, maxLength = 120) {
  if (!title) return ""
  return title
    .toString()
    .toLowerCase()
    .trim()
    // remove punctuation (keeps letters, numbers, spaces, and hyphen)
    .replace(/[^\w\s-]/g, "")
    // convert whitespace to single hyphen
    .replace(/\s+/g, "-")
    // collapse repeated hyphens
    .replace(/-+/g, "-")
    // trim hyphens from ends
    .replace(/^-+|-+$/g, "")
    // limit length (don't cut mid-word if possible, but we keep simple slice)
    .slice(0, maxLength)
}