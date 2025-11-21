# TAJAM API Reference

## Content Endpoints

### GET /api/content
Fetch published articles with filtering options.

**Query Parameters:**
- `limit`: Number of articles to return (default: 10)
- `category`: Filter by category
- `q`: Search query for title/excerpt/tags

**Example:**
\`\`\`
GET /api/content?limit=20
GET /api/content?category=Design
GET /api/content?q=minimalism
\`\`\`

**Response:**
\`\`\`json
[
  {
    "id": "article-id",
    "title": "Article Title",
    "slug": "article-title",
    "excerpt": "Brief summary...",
    "content": "Full content...",
    "category": "Design",
    "tags": ["tag1", "tag2"],
    "thumbnail": "https://...",
    "author": {
      "id": "user-id",
      "name": "Author Name",
      "email": "author@example.com"
    },
    "createdAt": "2025-11-20T12:00:00Z",
    "updatedAt": "2025-11-20T12:00:00Z",
    "published": true
  }
]
\`\`\`

## Authentication

### Client-Side (Recommended)
Use Firebase SDK directly in your components:

\`\`\`typescript
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const userCredential = await signInWithEmailAndPassword(auth, email, password)
const token = await userCredential.user.getIdToken()
\`\`\`

### useAuth Hook
Use the provided hook to manage authentication state:

\`\`\`typescript
import { useAuth } from '@/hooks/use-auth'

function MyComponent() {
  const { user, loading, error } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return <div>User: {user?.email}</div>
}
\`\`\`

## Database Functions

All database functions are in `lib/db-firebase.ts`:

### getLatestContent(limit?: number)
Get the most recent published articles.

### getContentBySlug(slug: string)
Get a single article by its slug.

### getContentByCategory(category: string)
Get all articles in a specific category.

### searchContent(query: string)
Search articles by title, excerpt, or tags.

### getAllCategories()
Get all available categories.

### createContent(data)
Create a new article (must be authenticated).

### updateContent(id, data)
Update an existing article (must own it).

### deleteContent(id)
Delete an article (must own it).

\`\`\`
