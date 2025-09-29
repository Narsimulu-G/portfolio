import { useEffect, useState } from 'react'
import { apiFetch, fixImageUrl } from '@/lib/api'
const demoProjects = [
  {
    title: 'Food Munch',
    description: 'Responsive food browsing website with product videos. Built using HTML, CSS, and Bootstrap.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=1200&auto=format&fit=crop',
    tags: ['HTML', 'CSS', 'Bootstrap'],
    demoUrl: 'http://narsimulu79.ccbp.tech',
    githubUrl: 'https://github.com/yourusername/food-munch',
    icon: '🍕',
    category: 'Web Development'
  },
  {
    title: 'Todos Application',
    description: 'Task management app with CRUD operations and data persistence via Local Storage.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1200&auto=format&fit=crop',
    tags: ['HTML', 'CSS', 'JS', 'Bootstrap'],
    demoUrl: 'http://narsimulu.ccbp.tech',
    githubUrl: 'https://github.com/yourusername/todos-app',
    icon: '✅',
    category: 'Productivity'
  },
  {
    title: 'Wikipedia Search',
    description: 'Custom search app fetching results via REST API calls with responsive UI using Flexbox.',
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=1200&auto=format&fit=crop',
    tags: ['HTML', 'CSS', 'JS', 'REST API', 'Bootstrap'],
    demoUrl: 'http://narsimulu798.ccbp.tech',
    githubUrl: 'https://github.com/yourusername/wikipedia-search',
    icon: '🔍',
    category: 'API Integration'
  },
]

function Projects() {
  const [isPaused, setIsPaused] = useState(false)
  const [projects, setProjects] = useState(demoProjects)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        setError('')
        console.log('=== FETCHING PROJECTS (trigger:', refreshTrigger, ') ===')
        // Add cache busting to prevent stale data
        const cacheBuster = Date.now()
        const data = await apiFetch(`/api/projects?cb=${cacheBuster}`)
        console.log('=== PROJECTS DEBUG ===')
        console.log('Raw projects data from API:', data)
        console.log('Data type:', typeof data)
        console.log('Is array:', Array.isArray(data))
        console.log('Data length:', data?.length)
        
        if (Array.isArray(data) && data.length) {
          console.log('Processing projects...')
          // Map old field names to new ones for backward compatibility
          const mappedProjects = data.map((project, index) => {
            console.log(`--- Project ${index + 1}: ${project.title} ---`)
            console.log('imageUrl:', project.imageUrl)
            console.log('image:', project.image)
            console.log('technologies:', project.technologies)
            console.log('tags:', project.tags)
            console.log('liveUrl:', project.liveUrl)
            console.log('demoUrl:', project.demoUrl)
            
            // Fix image URLs to use production backend
            const fixedImage = fixImageUrl(project.imageUrl || project.image)
            
            const mapped = {
              ...project,
              // Prioritize imageUrl over image for consistency
              image: fixedImage,
              // Use technologies if available, fallback to tags
              tags: project.technologies || project.tags || [],
              // Use liveUrl if available, fallback to demoUrl
              demoUrl: project.liveUrl || project.demoUrl,
              // Ensure all required fields exist with better defaults
              title: project.title || 'Untitled Project',
              description: project.description || 'No description available',
              githubUrl: project.githubUrl || '#',
              icon: project.icon || '🚀',
              category: project.category || 'Web Development',
              featured: project.featured || false
            }
            
            console.log('Final mapped project:', {
              title: mapped.title,
              image: mapped.image,
              tags: mapped.tags,
              demoUrl: mapped.demoUrl
            })
            return mapped
          })
          console.log('=== FINAL PROJECTS WITH IMAGES ===')
          mappedProjects.forEach((p, i) => {
            console.log(`Project ${i + 1}: ${p.title} - Image: ${p.image || 'NO IMAGE'}`)
          })
          setProjects(mappedProjects)
        } else {
          console.log('No projects found or data is not an array, using demo data')
          setProjects(demoProjects)
        }
      } catch (e) {
        setError('Failed to load projects')
        console.error('Error loading projects:', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [refreshTrigger])

  // Global refresh function
  const refreshProjects = () => {
    console.log('🔄 Refreshing projects...')
    setRefreshTrigger(prev => prev + 1)
  }

  // Expose refresh function globally
  useEffect(() => {
    window.refreshProjects = refreshProjects
    return () => {
      delete window.refreshProjects
    }
  }, [])

  return (
    <section id="projects" className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent sm:text-5xl mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            A showcase of my recent work and creative experiments
          </p>
          <button
            onClick={refreshProjects}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm mb-4"
          >
            🔄 Refresh Projects
          </button>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Unable to load projects</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Projects Display */}
        {!loading && !error && (
          <div className="relative overflow-hidden projects-container">
            <style>{`
              @keyframes projectsScrollRTL {
                0% { transform: translateX(-${projects.length * 384}px); }
                100% { transform: translateX(0); }
              }
              /* Pause scrolling when hovering any project card */
              .projects-container:hover .projects-track { animation-play-state: paused; }
            `}</style>
            <div
              className="flex gap-6 projects-track"
              style={{
                width: `${projects.concat(projects, projects).length * 384}px`,
                animation: `projectsScrollRTL ${projects.length * 3}s linear infinite`,
                animationPlayState: isPaused ? 'paused' : 'running'
              }}
            >
          {projects.concat(projects, projects).map((project, index) => (
            <article
              key={`${project.title}-${index}`}
              className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 w-[360px] flex-shrink-0 project-card"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Project Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {(() => {
                  console.log(`=== RENDERING PROJECT IMAGE: ${project.title} ===`)
                  console.log('Project image field:', project.image)
                  console.log('Project imageUrl field:', project.imageUrl)
                  console.log('Will show image:', !!(project.image && project.image !== 'NO IMAGE'))
                  
                  const hasValidImage = project.image && project.image !== 'NO IMAGE' && project.image.startsWith('http')
                  
                  if (hasValidImage) {
                    return (
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110" 
                        loading="lazy"
                        onLoad={() => console.log('✅ Image loaded successfully:', project.image)}
                        onError={(e) => {
                          console.log('❌ Image failed to load:', e.target.src, 'for project:', project.title)
                          e.target.style.display = 'none'
                          // Show fallback
                          const fallback = document.createElement('div')
                          fallback.className = 'h-full w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'
                          fallback.innerHTML = `
                            <div class="text-center text-gray-500">
                              <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <p class="text-sm font-medium">Image not available</p>
                            </div>
                          `
                          e.target.parentNode.appendChild(fallback)
                        }}
                      />
                    )
                  } else {
                    return (
                      <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm font-medium">No image</p>
                          <p className="text-xs text-gray-400 mt-1">Project: {project.title}</p>
                        </div>
                      </div>
                    )
                  }
                })()}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 backdrop-blur-sm">
                    {project.icon} {project.category}
                  </span>
                </div>

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-400/90 text-yellow-900 backdrop-blur-sm">
                      ⭐ Featured
                    </span>
                  </div>
                )}

                {/* Overlay on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-3">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Demo
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 shadow-lg"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <span className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                    {project.icon}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags && project.tags.length > 0 ? (
                    project.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                      No technologies specified
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {project.demoUrl && project.demoUrl !== '#' ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  ) : (
                    <div className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      No Demo
                    </div>
                  )}
                  
                  {project.githubUrl && project.githubUrl !== '#' ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg font-medium border border-gray-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Code
                    </a>
                  ) : (
                    <div className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      No Code
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4">
            <a 
              href="#contact" 
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Let's Work Together
            </a>
            <a 
              href="https://github.com/yourusername" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl font-medium border border-gray-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View All Projects
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects


