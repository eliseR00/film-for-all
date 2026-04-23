import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const db = getDb()
    let query = `SELECT id, user_id, user_name, title, content, created_at, COALESCE(upvotes, 0) as upvotes
                 FROM posts`
    let params: string[] = []

    if (userId) {
      query += ` WHERE user_id = $1`
      params = [userId]
    }

    query += ` ORDER BY created_at DESC`

    const result = await db.query<{
      id: string
      user_id: string
      user_name: string
      title: string
      content: string
      created_at: string
      upvotes: number
    }>(query, params)

    return NextResponse.json(
      result.rows.map((row: {
        id: string
        user_id: string
        user_name: string
        title: string
        content: string
        created_at: string
        upvotes: number
      }) => ({
        id: row.id,
        userId: row.user_id,
        userName: row.user_name,
        title: row.title,
        content: row.content,
        createdAt: row.created_at,
        upvotes: row.upvotes,
      }))
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to load posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const title = (body.title || '').toString().trim()
    const content = (body.content || '').toString().trim()
    const userId = (body.userId || '').toString().trim()
    const userName = (body.userName || 'Anonymous').toString().trim()

    if (!userId || !userName) {
      return new NextResponse('User information is required', { status: 400 })
    }

    if (!title || !content) {
      return new NextResponse('Title and content are required', { status: 400 })
    }

    const db = getDb()
    const result = await db.query(
      `INSERT INTO posts (user_id, user_name, title, content, upvotes)
       VALUES ($1, $2, $3, $4, 0)
       RETURNING id, user_id, user_name, title, content, created_at, upvotes`,
      [userId, userName, title, content]
    )

    const post = result.rows[0]

    return NextResponse.json({
      id: post.id,
      userId: post.user_id,
      userName: post.user_name,
      title: post.title,
      content: post.content,
      createdAt: post.created_at,
      upvotes: post.upvotes,
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
