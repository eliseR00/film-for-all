'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useSession } from 'next-auth/react'
import { ForumPost } from '@/types/forum'

export default function ForumPage() {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean
    postId: string
    currentIndex: number
  }>({ isOpen: false, postId: '', currentIndex: 0 })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!lightbox.isOpen) return

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          navigateLightbox('prev')
          break
        case 'ArrowRight':
          event.preventDefault()
          navigateLightbox('next')
          break
        case 'Escape':
          event.preventDefault()
          closeLightbox()
          break
      }
    }

    if (lightbox.isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [lightbox.isOpen, lightbox.currentIndex])

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const maxImages = 10
    const currentCount = images.length
    const availableSlots = maxImages - currentCount

    if (files.length > availableSlots) {
      setError(`You can only upload up to ${maxImages} images. You have ${currentCount} already.`)
      return
    }

    Array.from(files).slice(0, availableSlots).forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Each image must be less than 5MB.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImages(prev => [...prev, result])
        setError(null)
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const openLightbox = (postId: string, imageIndex: number) => {
    setLightbox({ isOpen: true, postId, currentIndex: imageIndex })
  }

  const closeLightbox = () => {
    setLightbox({ isOpen: false, postId: '', currentIndex: 0 })
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const post = posts.find(p => p.id === lightbox.postId)
    if (!post || !post.images) return

    const totalImages = post.images.length
    let newIndex = lightbox.currentIndex

    if (direction === 'prev') {
      newIndex = newIndex > 0 ? newIndex - 1 : totalImages - 1
    } else {
      newIndex = newIndex < totalImages - 1 ? newIndex + 1 : 0
    }

    setLightbox(prev => ({ ...prev, currentIndex: newIndex }))
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
          visibility,
          images,
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
      setVisibility('public')
      setImages([])
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm ${visibility === 'public' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    Public
                  </span>
                  <button
                    type="button"
                    onClick={() => setVisibility(visibility === 'public' ? 'private' : 'public')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      visibility === 'public' ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        visibility === 'public' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm ${visibility === 'private' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    Private
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {visibility === 'public'
                    ? 'Visible to everyone in the forum'
                    : 'Only visible in your profile'
                  }
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photos (Optional)</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each (max 10 images)</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {images.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {images.length} of 10 images uploaded
                    </p>
                  )}
                </div>
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
                      {post.images && post.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {post.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Post image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => openLightbox(post.id, index)}
                            />
                          ))}
                        </div>
                      )}
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

      {/* Lightbox Modal */}
      {lightbox.isOpen && (() => {
        const post = posts.find(p => p.id === lightbox.postId)
        if (!post || !post.images) return null

        return (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative max-w-4xl max-h-full p-4">
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Main image */}
              <img
                src={post.images[lightbox.currentIndex]}
                alt={`Post image ${lightbox.currentIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain"
              />

              {/* Navigation buttons */}
              {post.images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateLightbox('prev')}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigateLightbox('next')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image counter */}
              {post.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {lightbox.currentIndex + 1} / {post.images.length}
                </div>
              )}

              {/* Thumbnail strip for multiple images */}
              {post.images.length > 1 && (
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto">
                  {post.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setLightbox(prev => ({ ...prev, currentIndex: index }))}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 ${
                        index === lightbox.currentIndex ? 'border-white' : 'border-gray-500'
                      } overflow-hidden`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
