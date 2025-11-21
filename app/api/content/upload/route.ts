import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateTags } from '@/lib/tag-generator'

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { title, content, excerpt, category, type, thumbnail } = data

    // Validation
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate tags automatically
    const tags = generateTags(title, content)

    // Create slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    // TODO: Save to database
    const newContent = {
      id: String(Date.now()),
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 150),
      type: type || 'article',
      category,
      tags,
      thumbnail,
      author: {
        id: session.authorId,
        email: session.email,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      published: true,
    }

    return NextResponse.json(newContent, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
