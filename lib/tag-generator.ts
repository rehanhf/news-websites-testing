export function generateTags(title: string, content: string): string[] {
  const text = `${title} ${content}`.toLowerCase()
  
  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which',
    'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'as',
  ])

  // Extract words (3+ characters)
  const words = text.match(/\b\w{3,}\b/g) || []
  
  // Count word frequency
  const frequency = new Map<string, number>()
  words.forEach((word) => {
    if (!stopWords.has(word)) {
      frequency.set(word, (frequency.get(word) || 0) + 1)
    }
  })

  // Get top 5 most frequent words as tags
  const tags = Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word)

  return tags
}
