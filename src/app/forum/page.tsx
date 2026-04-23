'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useSession } from 'next-auth/react'
import { ForumPost } from '@/types/forum'

export default function ForumPage() {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/forum')
        if (!response.ok) {
          throw new Error(`Failed to load posts: ${response.status}`)
        }
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        console.error('Could not load forum posts', err)
        setError('Failed to load forum posts. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const handleUpvote = async (postId: string) => {
    try {
      const response = await fetch(`/api/forum/${postId}/upvote`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to upvote')
      }

      const data = await response.json()

      // Update the local state
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, upvotes: data.upvotes } : post
        )
      )
    } catch (err) {
      console.error('Upvote failed:', err)
      // Could show a toast or error message here
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!session) {
      setError('You must be signed in to create a post.')
      return
    }

    if (!title.trim() || !content.trim()) {
      setError('Please enter both a title and content.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          userId: session?.user?.id,
          userName: session?.user?.name || session?.user?.email || 'Anonymous',
        }),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Unable to create post')
      }

      const post = await response.json()
      setPosts((prev) => [post, ...prev])
      setTitle('')
      setContent('')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Unable to create post')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Community Forum</h1>
          <p className="mt-3 text-gray-600">
            Share new posts, ask questions, and connect with other film lovers.
          </p>
        </div>

        {status !== 'authenticated' ? (
          <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">Sign in to post</h2>
            <p className="mt-3 text-gray-600">
              You must be signed in to create a post. Use the sign in link in the navbar.
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">Create a new post</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Write a short title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Share your thoughts with the community"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Submit Post'}
              </button>
            </form>
          </div>
        )}

        <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Latest posts</h2>
            <span className="text-sm text-gray-500">{posts.length} posts</span>
          </div>

          {error ? (
            <p className="mt-6 text-red-600">{error}</p>
          ) : loading ? (
            <div className="mt-8 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <p className="mt-6 text-gray-600">No posts yet. Be the first to start the conversation.</p>
          ) : (
            <div className="mt-6 space-y-6">
              {posts.map((post) => (
                <article key={post.id} className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                      <p className="mt-2 text-sm text-gray-600">{post.content}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm text-gray-500">
                        <p>{post.userName}</p>
                        <p className="mt-1">{new Date(post.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleUpvote(post.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-700 text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        {post.upvotes}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
