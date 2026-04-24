'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import FilmCard from '@/components/FilmCard'
import { useFavorites } from '@/hooks/useFavorites'

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { favorites, toggleFavorite, isFavorited } = useFavorites()
  const [favoriteFilms, setFavoriteFilms] = useState([])
  const [loadingFavorites, setLoadingFavorites] = useState(true)
  const [userPosts, setUserPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    postId: '',
    currentIndex: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    const fetchFavoriteFilms = async () => {
      if (favorites.length > 0) {
        setLoadingFavorites(true)
        try {
          const response = await fetch('/api/films')
          const allFilms = await response.json()
          const favFilms = allFilms.filter(film => favorites.includes(film.id))
          setFavoriteFilms(favFilms)
        } catch (error) {
          console.error('Error fetching favorite films:', error)
        } finally {
          setLoadingFavorites(false)
        }
      } else {
        setFavoriteFilms([])
        setLoadingFavorites(false)
      }
    }
    fetchFavoriteFilms()
  }, [favorites])

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (session?.user?.id) {
        setLoadingPosts(true)
        try {
          const response = await fetch(`/api/forum?userId=${session.user.id}`)
          if (response.ok) {
            const posts = await response.json()
            setUserPosts(posts)
          }
        } catch (error) {
          console.error('Error fetching user posts:', error)
        } finally {
          setLoadingPosts(false)
        }
      } else {
        setUserPosts([])
        setLoadingPosts(false)
      }
    }
    fetchUserPosts()
  }, [session?.user?.id])

  const openLightbox = (postId, imageIndex) => {
    setLightbox({ isOpen: true, postId, currentIndex: imageIndex })
  }

  const closeLightbox = () => {
    setLightbox({ isOpen: false, postId: '', currentIndex: 0 })
  }

  const navigateLightbox = (direction) => {
    const post = userPosts.find(p => p.id === lightbox.postId)
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

  useEffect(() => {
    const handleKeyDown = (event) => {
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
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [lightbox.isOpen, lightbox.currentIndex])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          <div className="mt-8">
            <div className="flex flex-col items-center">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}

              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {session.user?.name || 'User'}
              </h2>
              <p className="text-gray-600">{session.user?.email}</p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{session.user?.name || 'Not provided'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{session.user?.email || 'Not provided'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium capitalize">
                      {session.user?.image?.includes('googleusercontent.com') ? 'Google' : 'Other'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Member since:</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">My Favorite Films</h3>
                {loadingFavorites ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : favoriteFilms.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteFilms.map(film => (
                      <FilmCard
                        key={film.id}
                        film={film}
                        onFavorite={toggleFavorite}
                        isFavorited={isFavorited(film.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 py-4">No favorite films yet. Discover some films and add them to your favorites!</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">My Posts</h3>
                {loadingPosts ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : userPosts.length > 0 ? (
                  <div className="space-y-4">
                    {userPosts.map((post) => (
                      <article key={post.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-semibold text-gray-900">{post.title}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                post.visibility === 'public'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {post.visibility === 'public' ? 'Public' : 'Private'}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post.content}</p>
                            {post.images && post.images.length > 0 && (
                              <div className="mt-2 grid grid-cols-3 gap-1">
                                {post.images.slice(0, 3).map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    className="w-full h-16 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => openLightbox(post.id, index)}
                                  />
                                ))}
                                {post.images.length > 3 && (
                                  <div className="w-full h-16 bg-gray-200 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-600">
                                    +{post.images.length - 3} more
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                              {post.upvotes}
                            </div>
                            <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 py-4">No posts yet. Share your thoughts in the forum!</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>

                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/')}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Back to Home
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox.isOpen && (() => {
        const post = userPosts.find(p => p.id === lightbox.postId)
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