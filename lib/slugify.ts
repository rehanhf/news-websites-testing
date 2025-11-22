export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove punctuation including :
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120)            // keep but not too short
}