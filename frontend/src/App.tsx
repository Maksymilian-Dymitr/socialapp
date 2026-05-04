import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import { postsApi } from '@/lib/api'

function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">SocialApp</h1>
          </div>
          <div className="flex items-center space-x-6">
            <a href="/home" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/search" className="text-gray-700 hover:text-blue-600">Search</a>
            <a href="/profile" className="text-gray-700 hover:text-blue-600">Profile</a>
            <button className="text-red-600 hover:text-red-800">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function HomePage() {
  const [followedUsers, setFollowedUsers] = useState<string[]>(['sarahmiller'])
  const [postContent, setPostContent] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [feedLoading, setFeedLoading] = useState(true)

  const handleFollow = (username: string) => {
    setFollowedUsers(prev => {
      if (prev.includes(username)) {
        return prev.filter(u => u !== username)
      } else {
        return [...prev, username]
      }
    })
  }

  const isFollowing = (username: string) => followedUsers.includes(username)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handlePost = async () => {
    if (!postContent.trim()) return
    
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('content', postContent)
      if (selectedImage) {
        formData.append('image', selectedImage)
      }
      
      await postsApi.createPost(formData)
      console.log('Post created successfully')
      setPostContent('')
      setSelectedImage(null)
      // Refresh feed
      loadFeed()
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadFeed = async () => {
    setFeedLoading(true)
    try {
      const feedData = await postsApi.getFeed()
      console.log('Feed data:', feedData.data)
      setPosts(feedData.data || [])
    } catch (error: any) {
      console.error('Error loading feed:', error)
      // If API fails (500 error, etc.), show sample posts
      if (error.response?.status === 500) {
        console.log('Backend API error - showing sample posts')
      }
      setPosts([]) // Empty posts array will trigger sample posts display
    } finally {
      setFeedLoading(false)
    }
  }

  // Load feed on component mount
  useEffect(() => {
    loadFeed()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-2xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Home Feed</h1>
        
        {/* Post Creation */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <textarea
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          
          {/* Image Upload */}
          <div className="mt-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              📷 Add Photo
            </label>
            {selectedImage && (
              <span className="ml-3 text-sm text-gray-600">
                {selectedImage.name}
              </span>
            )}
          </div>
          
          {/* Image Preview */}
          {selectedImage && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="max-w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="mt-3 flex justify-end">
            <button
              onClick={handlePost}
              disabled={isLoading || !postContent.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {feedLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{post.user?.username || 'Unknown User'}</h3>
                    <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => handleFollow(post.user?.username)}
                    className={`ml-auto font-medium px-4 py-2 rounded-lg transition-colors ${
                      isFollowing(post.user?.username) 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isFollowing(post.user?.username) ? 'Following' : 'Follow'}
                  </button>
                </div>
                <p className="text-gray-800 mb-4">{post.content}</p>
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt="Post image" 
                    className="w-full rounded-lg mb-4"
                  />
                )}
                <div className="flex items-center space-x-4 text-gray-500">
                  <button className="hover:text-blue-600">❤️ {post.likes || 0}</button>
                  <button className="hover:text-blue-600">💬 {post.comments || 0}</button>
                  <button className="hover:text-blue-600">🔄 {post.shares || 0}</button>
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Sample Posts when no real posts */}
              <div className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="text-center py-4">
                  <p className="text-gray-600 text-sm">📡 Backend API temporarily unavailable - showing sample posts</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">John Doe</h3>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                  <button 
                    onClick={() => handleFollow('johndoe')}
                    className={`ml-auto font-medium px-4 py-2 rounded-lg transition-colors ${
                      isFollowing('johndoe') 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isFollowing('johndoe') ? 'Following' : 'Follow'}
                  </button>
                </div>
                <p className="text-gray-800 mb-4">
                  Just launched my new project! So excited to share it with everyone. 🚀
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop" 
                  alt="Project launch" 
                  className="w-full rounded-lg mb-4"
                />
                <div className="flex items-center space-x-4 text-gray-500">
                  <button className="hover:text-blue-600">❤️ 12</button>
                  <button className="hover:text-blue-600">💬 3</button>
                  <button className="hover:text-blue-600">🔄 1</button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    SM
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">Sarah Miller</h3>
                    <p className="text-sm text-gray-500">5 hours ago</p>
                  </div>
                  <button 
                    onClick={() => handleFollow('sarahmiller')}
                    className={`ml-auto font-medium px-4 py-2 rounded-lg transition-colors ${
                      isFollowing('sarahmiller') 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isFollowing('sarahmiller') ? 'Following' : 'Follow'}
                  </button>
                </div>
                <p className="text-gray-800 mb-4">
                  Beautiful sunset today! Nature never fails to amaze me. 🌅
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" 
                  alt="Sunset" 
                  className="w-full rounded-lg mb-4"
                />
                <div className="flex items-center space-x-4 text-gray-500">
                  <button className="hover:text-blue-600">❤️ 45</button>
                  <button className="hover:text-blue-600">💬 8</button>
                  <button className="hover:text-blue-600">🔄 2</button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    AJ
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">Alex Johnson</h3>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                  <button 
                    onClick={() => handleFollow('alexjohnson')}
                    className={`ml-auto font-medium px-4 py-2 rounded-lg transition-colors ${
                      isFollowing('alexjohnson') 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isFollowing('alexjohnson') ? 'Following' : 'Follow'}
                  </button>
                </div>
                <p className="text-gray-800 mb-4">
                  Working on some cool new features for our app. Can't wait to show you all!
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop" 
                  alt="Coding" 
                  className="w-full rounded-lg mb-4"
                />
                <div className="flex items-center space-x-4 text-gray-500">
                  <button className="hover:text-blue-600">❤️ 28</button>
                  <button className="hover:text-blue-600">💬 5</button>
                  <button className="hover:text-blue-600">🔄 3</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              JD
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
              <p className="text-gray-600">@johndoe</p>
              <p className="text-gray-700 mt-2">Software developer | Coffee enthusiast | Building cool stuff 🚀</p>
            </div>
          </div>
          
          <div className="flex space-x-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">156</div>
              <div className="text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">1,234</div>
              <div className="text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">567</div>
              <div className="text-gray-600">Following</div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Edit Profile
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
              Share Profile
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Posts</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-800 mb-4">
              Just launched my new project! So excited to share it with everyone. 🚀
            </p>
            <p className="text-sm text-gray-500">2 hours ago</p>
            <div className="flex items-center space-x-4 text-gray-500 mt-3">
              <button className="hover:text-blue-600">❤️ 12</button>
              <button className="hover:text-blue-600">💬 3</button>
              <button className="hover:text-blue-600">🔄 1</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchPage() {
  const [followedUsers, setFollowedUsers] = useState<string[]>(['sarahmiller'])

  const handleFollow = (username: string) => {
    setFollowedUsers(prev => {
      if (prev.includes(username)) {
        return prev.filter(u => u !== username)
      } else {
        return [...prev, username]
      }
    })
  }

  const isFollowing = (username: string) => followedUsers.includes(username)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-2xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Discover People</h1>
        
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <input
            type="text"
            placeholder="Search for users..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">John Doe</h3>
                  <p className="text-gray-600">@johndoe</p>
                  <p className="text-sm text-gray-700 mt-1">Software developer</p>
                </div>
              </div>
              <button 
                onClick={() => handleFollow('johndoe')}
                className={`font-medium px-4 py-2 rounded-lg transition-colors ${
                  isFollowing('johndoe') 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing('johndoe') ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Sarah Miller</h3>
                  <p className="text-gray-600">@sarahmiller</p>
                  <p className="text-sm text-gray-700 mt-1">Designer & artist</p>
                </div>
              </div>
              <button 
                onClick={() => handleFollow('sarahmiller')}
                className={`font-medium px-4 py-2 rounded-lg transition-colors ${
                  isFollowing('sarahmiller') 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing('sarahmiller') ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
