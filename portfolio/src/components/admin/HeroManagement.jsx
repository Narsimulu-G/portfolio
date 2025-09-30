import { useState, useEffect } from 'react'
import { apiFetch } from '../../lib/api'
import { useProfile } from '../../contexts/ProfileContext'

export default function HeroManagement() {
  const { refreshProfile } = useProfile()
  const [hero, setHero] = useState({
    name: '',
    headline: '',
    bio: '',
    avatarUrl: '',
    social: {
      linkedin: '',
      github: '',
      twitter: '',
      email: ''
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchHero()
  }, [])

  const fetchHero = async () => {
    try {
      console.log('Fetching admin hero data...')
      const data = await apiFetch('/api/admin/profile')
      console.log('Hero data fetched:', data)
      setHero(data)
    } catch (error) {
      console.error('Failed to fetch hero data:', error)
      console.log('Error details:', {
        message: error.message,
        status: error.status,
        name: error.name
      })
      
      // Try to provide more specific error messages
      if (error.message.includes('401') || error.message.includes('403')) {
        alert('Authentication required. Please log in again.')
      } else if (error.message.includes('Network error')) {
        alert('Unable to connect to server. Please check your internet connection.')
      } else {
        console.log('Hero fetch failed, continuing with empty data')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiFetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero)
      })
      alert('Hero section updated successfully!')
      
      // Refresh the profile data using context
      await refreshProfile()
    } catch (error) {
      console.error('Failed to update hero:', error)
      alert('Failed to update hero section')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    if (field.startsWith('social.')) {
      const socialField = field.split('.')[1]
      setHero(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value
        }
      }))
    } else {
      setHero(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    console.log('Drop event triggered:', e.dataTransfer.files)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log('File dropped:', e.dataTransfer.files[0])
      handleFile(e.dataTransfer.files[0])
    } else {
      console.log('No files in drop event')
    }
  }

  const handleFile = async (file) => {
    console.log('handleFile called with:', file)
    
    if (!file) {
      console.error('No file provided to handleFile')
      alert('No file selected')
      return
    }

    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type)
      alert('Please select an image file (JPG, PNG, GIF, etc.)')
      return
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      console.error('File too large:', file.size)
      alert('File size must be less than 5MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      console.log('Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type
      })
      
      const response = await apiFetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      })
      
      console.log('Upload response:', response)
      
      if (response.success) {
        console.log('Upload successful:', response)
        // Use relative URL for better frontend compatibility
        const imageUrl = response.relativeUrl || response.url
        console.log('Setting image URL:', imageUrl)
        setHero(prev => ({
          ...prev,
          avatarUrl: imageUrl
        }))
        alert('Image uploaded successfully!')
      } else {
        console.error('Upload failed:', response)
        alert(`Failed to upload image: ${response.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload image: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Hero Section Management</h2>
        <p className="text-gray-600 mt-2 text-lg">Manage your hero section content</p>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={hero.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
              <input
                type="text"
                value={hero.headline}
                onChange={(e) => handleChange('headline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={hero.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">Profile Image</label>
            
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
              onDragEnter={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Drag enter')
                setDragActive(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Drag leave')
                setDragActive(false)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Drag over')
                setDragActive(true)
              }}
              onDrop={handleDrop}
              onClick={() => {
                console.log('Click on drag area')
                document.getElementById('file-input').click()
              }}
            >
              {uploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                  <p className="text-gray-600">Uploading image...</p>
                  <p className="text-sm text-gray-500">Please wait...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 mb-2">Drag and drop an image here</p>
                  <p className="text-sm text-gray-500">or click to browse files</p>
                  <p className="text-xs text-gray-400 mt-2">Max size: 5MB • Supported: JPG, PNG, GIF, WebP</p>
                </div>
              )}
            </div>
            
            {/* Hidden file input */}
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            
            {/* Test Upload Button */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  console.log('Test button clicked')
                  document.getElementById('file-input').click()
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Or click here to browse files
              </button>
            </div>
            
            {/* Image Preview */}
            {hero.avatarUrl && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Preview:</p>
                  <button
                    type="button"
                    onClick={() => setHero(prev => ({ ...prev, avatarUrl: '' }))}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove Image
                  </button>
                </div>
                <img
                  src={hero.avatarUrl}
                  alt="Profile preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Social Links</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={hero.social.linkedin}
                onChange={(e) => handleChange('social.linkedin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
              <input
                type="url"
                value={hero.social.github}
                onChange={(e) => handleChange('social.github', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
              <input
                type="url"
                value={hero.social.twitter}
                onChange={(e) => handleChange('social.twitter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={hero.social.email}
                onChange={(e) => handleChange('social.email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={async () => {
              await fetchHero()
              await refreshProfile()
            }}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
