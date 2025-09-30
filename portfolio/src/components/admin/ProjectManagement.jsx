import { useState, useEffect } from 'react'
import { apiFetch } from '../../lib/api'

export default function ProjectManagement() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    technologies: [],
    featured: false,
    icon: '🚀',
    category: 'Web Development'
  })
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      console.log('Fetching admin projects...')
      const data = await apiFetch('/api/admin/projects')
      console.log('Fetched projects:', data)
      console.log('First project fields:', data[0] ? Object.keys(data[0]) : 'No projects')
      console.log('First project imageUrl:', data[0]?.imageUrl)
      console.log('First project image:', data[0]?.image)
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
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
        alert(`Failed to fetch projects: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Prepare data with both old and new field formats for backward compatibility
      const projectData = {
        ...formData,
        // Ensure both old and new field formats are saved
        image: formData.imageUrl, // Save to old 'image' field for backward compatibility
        tags: formData.technologies, // Save to old 'tags' field for backward compatibility
        demoUrl: formData.liveUrl, // Save to old 'demoUrl' field for backward compatibility
        // Add default values for required fields
        icon: formData.icon || '🚀',
        category: formData.category || 'Web Development'
      }
      
      if (editingProject) {
        console.log('Updating project with ID:', editingProject._id)
        console.log('Project data being sent:', projectData)
        const response = await apiFetch(`/api/admin/projects/${editingProject._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
        console.log('Update response:', response)
      } else {
        console.log('Creating new project with data:', projectData)
        const response = await apiFetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
        console.log('Create response:', response)
      }
      
      fetchProjects()
      setShowForm(false)
      setEditingProject(null)
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        liveUrl: '',
        githubUrl: '',
        technologies: [],
        featured: false,
        icon: '🚀',
        category: 'Web Development'
      })
      
      // Refresh public projects section
      if (window.refreshProjects) {
        console.log('🔄 Calling refreshProjects from admin...')
        window.refreshProjects()
      } else {
        console.log('⚠️ refreshProjects function not available')
      }
      
      alert(editingProject ? 'Project updated successfully!' : 'Project created successfully!')
    } catch (error) {
      console.error('Failed to save project:', error)
      if (error.message.includes('404')) {
        alert('Project not found. It may have been deleted. Please refresh the page.')
      } else if (error.message.includes('401') || error.message.includes('403')) {
        alert('Authentication required. Please log in again.')
      } else {
        alert(`Failed to save project: ${error.message}`)
      }
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title || '',
      description: project.description || '',
      // Map both old and new field formats
      imageUrl: project.imageUrl || project.image || '',
      liveUrl: project.liveUrl || project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      technologies: project.technologies || project.tags || [],
      featured: project.featured || false,
      // Add additional fields
      icon: project.icon || '🚀',
      category: project.category || 'Web Development'
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await apiFetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
        fetchProjects()
        
        // Refresh public projects section
        if (window.refreshProjects) {
          console.log('🔄 Calling refreshProjects from admin delete...')
          window.refreshProjects()
        }
        
        alert('Project deleted successfully!')
      } catch (error) {
        console.error('Failed to delete project:', error)
        if (error.message.includes('404')) {
          alert('Project not found. It may have been deleted already.')
        } else if (error.message.includes('401') || error.message.includes('403')) {
          alert('Authentication required. Please log in again.')
        } else {
          alert(`Failed to delete project: ${error.message}`)
        }
      }
    }
  }

  const handleAdd = () => {
    setEditingProject(null)
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      liveUrl: '',
      githubUrl: '',
      technologies: [],
      featured: false,
      icon: '🚀',
      category: 'Web Development'
    })
    setShowForm(true)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Drag event:', e.type)
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
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await apiFetch('/api/upload/project', {
        method: 'POST',
        body: formData
      })

      if (response.success) {
        setFormData(prev => ({ ...prev, imageUrl: response.url }))
        console.log('Image uploaded successfully:', response.url)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Project Management</h2>
          <p className="text-gray-600 mt-2 text-lg">Manage your portfolio projects</p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3"></div>
        </div>
        <button
          onClick={handleAdd}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Project
        </button>
      </div>

      {showForm && (
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
                
                {/* Drag and Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${
                    dragActive
                      ? 'border-blue-400 bg-blue-50 scale-105 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => {
                    console.log('Click on drag area')
                    document.getElementById('project-file-input').click()
                  }}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                      <p className="text-sm text-gray-600">Uploading image...</p>
                    </div>
                  ) : formData.imageUrl ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={formData.imageUrl}
                        alt="Project preview"
                        className="w-20 h-20 object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600 mb-1">Drag and drop an image here</p>
                      <p className="text-xs text-gray-500">or click to browse files</p>
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  id="project-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />

                {/* Alternative browse button */}
                <div className="mt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Browse button clicked')
                      document.getElementById('project-file-input').click()
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Or click here to browse files
                  </button>
                </div>

                {/* Image URL input as fallback */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Or enter image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Remove image button */}
                {formData.imageUrl && (
                  <div className="mt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                      className="text-sm text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon (emoji)</label>
                <input
                  type="text"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  placeholder="🚀"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Mobile">Mobile</option>
                  <option value="API Integration">API Integration</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technologies (comma-separated)</label>
              <input
                type="text"
                value={formData.technologies.join(', ')}
                onChange={(e) => setFormData({...formData, technologies: e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech)})}
                placeholder="React, Node.js, MongoDB, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                Featured Project
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingProject ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first project</p>
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {projects.map((project) => (
              <div key={project._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {(project.imageUrl || project.image) ? (
                  <img
                    src={project.imageUrl || project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      console.log('Image failed to load:', e.target.src)
                      e.target.style.display = 'none'
                      // Show fallback content
                      const fallback = document.createElement('div')
                      fallback.className = 'w-full h-48 bg-gray-200 flex items-center justify-center'
                      fallback.innerHTML = `
                        <div class="text-center text-gray-500">
                          <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p class="text-sm">Image not available</p>
                        </div>
                      `
                      e.target.parentNode.appendChild(fallback)
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">No image</p>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title}</h3>
                    {project.featured && (
                      <span className="px-2 py-1 text-xs font-bold text-yellow-600 bg-yellow-100 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                  {(project.technologies || project.tags) && (project.technologies?.length > 0 || project.tags?.length > 0) && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {(project.technologies || project.tags || []).map((tech, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
