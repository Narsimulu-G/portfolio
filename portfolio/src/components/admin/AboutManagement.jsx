import { useState, useEffect } from 'react'
import { apiFetch } from '../../lib/api'

export default function AboutManagement() {
  const [about, setAbout] = useState({
    title: '',
    bio: '',
    imageUrl: '',
    whatIDo: [],
    techStacks: [],
    stats: {
      education: '',
      projects: '',
      cgpa: ''
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newWhatIDo, setNewWhatIDo] = useState('')
  const [newTechStack, setNewTechStack] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const data = await apiFetch('/api/admin/about')
      setAbout({
        title: data.title || '',
        bio: data.bio || '',
        imageUrl: data.imageUrl || '',
        whatIDo: data.whatIDo || [],
        techStacks: data.techStacks || [],
        stats: {
          education: data.stats?.education || '',
          projects: data.stats?.projects || '',
          cgpa: data.stats?.cgpa || ''
        }
      })
    } catch (error) {
      console.error('Failed to fetch about data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiFetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(about)
      })
      alert('About section updated successfully!')
    } catch (error) {
      console.error('Failed to update about:', error)
      alert('Failed to update about section')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    if (field.startsWith('stats.')) {
      const statField = field.split('.')[1]
      setAbout(prev => ({
        ...prev,
        stats: {
          education: prev.stats?.education || '',
          projects: prev.stats?.projects || '',
          cgpa: prev.stats?.cgpa || '',
          ...prev.stats,
          [statField]: value
        }
      }))
    } else {
      setAbout(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const addWhatIDo = () => {
    if (newWhatIDo.trim()) {
      setAbout(prev => ({
        ...prev,
        whatIDo: [...prev.whatIDo, newWhatIDo.trim()]
      }))
      setNewWhatIDo('')
    }
  }

  const removeWhatIDo = (index) => {
    setAbout(prev => ({
      ...prev,
      whatIDo: prev.whatIDo.filter((_, i) => i !== index)
    }))
  }

  const addTechStack = () => {
    if (newTechStack.trim()) {
      setAbout(prev => ({
        ...prev,
        techStacks: [...prev.techStacks, newTechStack.trim()]
      }))
      setNewTechStack('')
    }
  }

  const removeTechStack = (index) => {
    setAbout(prev => ({
      ...prev,
      techStacks: prev.techStacks.filter((_, i) => i !== index)
    }))
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = async (file) => {
    if (file.type.startsWith('image/')) {
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const data = await apiFetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (data.success) {
          setAbout(prev => ({
            ...prev,
            imageUrl: data.url
          }))
          alert('Image uploaded successfully!')
        } else {
          alert(`Failed to upload image: ${data.error || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert('Failed to upload image. Please try again.')
      } finally {
        setUploading(false)
      }
    } else {
      alert('Please select an image file (PNG, JPG, GIF, etc.)')
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
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">About Section Management</h2>
        <p className="text-gray-600 mt-2 text-lg">Manage your about section content</p>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={about.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={about.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="Or enter image URL"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Choose File
                </label>
              </div>
            </div>
          </div>

          {/* Drag and Drop Area */}
          <div
            className={`mt-6 border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
              dragActive 
                ? 'border-blue-400 bg-blue-50 scale-105' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-gray-600 font-medium">Uploading image...</p>
                <p className="text-gray-500 text-sm">Please wait</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600 font-medium mb-1">Drag and drop an image here</p>
                <p className="text-gray-500 text-sm">or click to browse files</p>
                <p className="text-gray-400 text-xs mt-2">Supports PNG, JPG, GIF, WebP</p>
              </div>
            )}
          </div>
          
          {/* Image Preview */}
          {about.imageUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <img
                src={about.imageUrl}
                alt="About preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={about.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">What I Do</h3>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newWhatIDo}
                onChange={(e) => setNewWhatIDo(e.target.value)}
                placeholder="Add a skill or service"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWhatIDo())}
              />
              <button
                type="button"
                onClick={addWhatIDo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {about.whatIDo.map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeWhatIDo(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Tech Stacks</h3>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTechStack}
                onChange={(e) => setNewTechStack(e.target.value)}
                placeholder="Add a technology"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
              />
              <button
                type="button"
                onClick={addTechStack}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {about.techStacks.map((tech, index) => (
                <div key={index} className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => removeTechStack(index)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
              <input
                type="text"
                value={about.stats?.education || ''}
                onChange={(e) => handleChange('stats.education', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Projects</label>
              <input
                type="text"
                value={about.stats?.projects || ''}
                onChange={(e) => handleChange('stats.projects', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CGPA</label>
              <input
                type="text"
                value={about.stats?.cgpa || ''}
                onChange={(e) => handleChange('stats.cgpa', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
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
