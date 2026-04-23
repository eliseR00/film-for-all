import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params
  try {
    const db = getDb()

    // Increment upvotes (handle null values)
    const result = await db.query(
      `UPDATE posts
       SET upvotes = COALESCE(upvotes, 0) + 1
       WHERE id = $1
       RETURNING upvotes`,
      [postId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      upvotes: result.rows[0].upvotes,
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to upvote post' },
      { status: 500 }
    )
  }
}