import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import CertificateManagement from '../components/admin/CertificateManagement'
import ResumeManagement from '../components/admin/ResumeManagement'
import ContactManagement from '../components/admin/ContactManagement'
import MessageManagement from '../components/admin/MessageManagement'
import ImprovedDashboard from '../components/admin/ImprovedDashboard'
import CredentialsManagement from '../components/admin/CredentialsManagement'

export default function AdminPage() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  const token = null
  const [profile, setProfile] = useState({ name: '', headline: '', bio: '', avatarUrl: '', social: { linkedin: '', github: '', twitter: '', email: '' } })
  const [active, setActive] = useState('dashboard') // dashboard | projects | hero | about | messages | certificates | resumes | contacts
  const [about, setAbout] = useState({ 
    title: '', 
    bio: '', 
    imageUrl: '', 
    whatIDo: [], 
    techStacks: [],
    stats: {
      education: 'MCA',
      projects: '3+',
      cgpa: '7.32'
    }
  })
  const [aboutLoading, setAboutLoading] = useState(false)
  const [projectForm, setProjectForm] = useState({ show: false, mode: 'create', data: {} })

  useEffect(() => {
    const go = async () => {
      try {
        // Summary (admin only). If unauthorized, fall back to zeros
        try {
          const data = await apiFetch('/api/admin/summary')
          setSummary(data)
        } catch (_) {
          setSummary({ projectsCount: 0, messagesCount: 0 })
        }

        // Hero/Profile: try admin first, then public fallback
        let p = null
        try {
          p = await apiFetch('/api/admin/profile')
        } catch (_) {
          p = await apiFetch('/api/profile').catch(() => null)
        }
        if (p) setProfile({
          name: p.name || '',
          headline: p.headline || p.bio || p.email || '',
          bio: p.bio || '',
          avatarUrl: p.avatarUrl || '',
          social: { linkedin: p?.social?.linkedin || p.linkedin || '', github: p?.social?.github || p.github || '', twitter: p?.social?.twitter || '', email: p?.social?.email || p.email || '' }
        })

        // About: try admin first, then public fallback
        let a = null
        try {
          a = await apiFetch('/api/admin/about')
        } catch (_) {
          a = await apiFetch('/api/about').catch(() => null)
        }
        if (a) setAbout({ 
          title: a.title || '', 
          bio: a.bio || '', 
          imageUrl: a.imageUrl || '',
          whatIDo: Array.isArray(a.whatIDo) ? a.whatIDo : [],
          techStacks: Array.isArray(a.techStacks) ? a.techStacks : [],
          stats: a.stats || {
            education: 'MCA',
            projects: '3+',
            cgpa: '7.32'
          }
        })
      } catch (e) {
        setError(e.message)
      }
    }
    go()
  }, [])

  // Cookie-based auth; allow component to render and rely on 401 responses from API calls

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Top Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Admin Portal</h1>
                  <p className="text-sm text-gray-500 font-medium">Portfolio Management System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">System Online</span>
                </div>
                <div className="text-gray-500">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <button 
                onClick={() => { window.location.href = '/' }} 
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-semibold rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-6 sticky top-24">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Navigation</h2>
                <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
              <nav className="space-y-1">
                <SidebarItem icon="📊" label="Dashboard" active={active==='dashboard'} onClick={() => setActive('dashboard')} />
                <SidebarItem icon="🗂️" label="Projects" active={active==='projects'} onClick={() => setActive('projects')} />
                <SidebarItem icon="🏆" label="Certificates" active={active==='certificates'} onClick={() => setActive('certificates')} />
                <SidebarItem icon="📄" label="Resumes" active={active==='resumes'} onClick={() => setActive('resumes')} />
                <SidebarItem icon="📞" label="Contact" active={active==='contacts'} onClick={() => setActive('contacts')} />
                <SidebarItem icon="🧑‍💻" label="Hero" active={active==='hero'} onClick={() => setActive('hero')} />
                <SidebarItem icon="ℹ️" label="About" active={active==='about'} onClick={() => setActive('about')} />
                <SidebarItem icon="✉️" label="Messages" active={active==='messages'} onClick={() => setActive('messages')} />
                <SidebarItem icon="🔐" label="Security" active={active==='credentials'} onClick={() => setActive('credentials')} />
              </nav>
            </div>
          </aside>
          {/* Main content */}
          <section className="lg:col-span-9">
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            {active === 'dashboard' && (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
                <ImprovedDashboard summary={summary} onNavigate={setActive} />
              </div>
            )}
            {active === 'projects' && (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-200/50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
                      <p className="text-gray-600 mt-1">Manage your portfolio projects</p>
                    </div>
                    <button 
                      onClick={() => {
                        alert('Button clicked! Opening project form...')
                        setProjectForm({ show: true, mode: 'create', data: {} })
                      }}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Project
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <ProjectManagement 
                    projectForm={projectForm}
                    setProjectForm={setProjectForm}
                  />
                </div>
              </div>
            )}
            {active === 'hero' && (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-200/50">
                  <h2 className="text-2xl font-bold text-gray-900">Hero Section</h2>
                  <p className="text-gray-600 mt-1">Manage your profile information</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Name</label>
                  <input value={profile.name} onChange={(e)=>setProfile({ ...profile, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Headline</label>
                  <input value={profile.headline} onChange={(e)=>setProfile({ ...profile, headline: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Bio</label>
                  <textarea value={profile.bio} onChange={(e)=>setProfile({ ...profile, bio: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Profile Image</label>
                  <ImageUpload 
                    value={profile.avatarUrl}
                    onChange={(url) => setProfile({ ...profile, avatarUrl: url })}
                    folder="portfolio/avatars"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input value={profile.social.email} onChange={(e)=>setProfile({ ...profile, social: { ...profile.social, email: e.target.value } })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">LinkedIn</label>
                  <input value={profile.social.linkedin} onChange={(e)=>setProfile({ ...profile, social: { ...profile.social, linkedin: e.target.value } })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">GitHub</label>
                  <input value={profile.social.github} onChange={(e)=>setProfile({ ...profile, social: { ...profile.social, github: e.target.value } })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Twitter</label>
                  <input value={profile.social.twitter} onChange={(e)=>setProfile({ ...profile, social: { ...profile.social, twitter: e.target.value } })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base" />
                </div>
              </div>
              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button onClick={async () => {
                  try {
                    await apiFetch('/api/admin/profile', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(profile)
                    })
                    alert('Saved')
                  } catch (e) { alert(e.message) }
                }} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm w-full sm:w-auto">Save</button>
                <button onClick={()=>setActive('dashboard')} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm hover:bg-gray-200 w-full sm:w-auto">Cancel</button>
              </div>
            </div>
          )}
          {active === 'about' && (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-200/50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">About Section</h2>
                      <p className="text-gray-600 mt-1">Manage your about page content</p>
                    </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => {
                      // Open preview in new tab
                      const previewData = {
                        title: about.title || 'About Me',
                        bio: about.bio || '',
                        imageUrl: about.imageUrl || '',
                        whatIDo: about.whatIDo || [],
                        techStacks: about.techStacks || [],
                        stats: about.stats || { education: 'MCA', projects: '3+', cgpa: '7.32' }
                      }
                      const previewWindow = window.open('', '_blank')
                      previewWindow.document.write(`
                        <html>
                          <head><title>About Section Preview</title></head>
                          <body style="font-family: system-ui; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);">
                            <div style="max-width: 800px; margin: 0 auto;">
                              <h1 style="color: #1e40af; margin-bottom: 10px;">${previewData.title}</h1>
                              <p style="color: #6b7280; margin-bottom: 20px;">${previewData.bio}</p>
                              <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                                <div style="text-align: center; padding: 10px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                  <div style="font-size: 24px; font-weight: bold; color: #1e40af;">${previewData.stats.education}</div>
                                  <div style="font-size: 12px; color: #6b7280;">Education</div>
                                </div>
                                <div style="text-align: center; padding: 10px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                  <div style="font-size: 24px; font-weight: bold; color: #059669;">${previewData.stats.projects}</div>
                                  <div style="font-size: 12px; color: #6b7280;">Projects</div>
                                </div>
                                <div style="text-align: center; padding: 10px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                  <div style="font-size: 24px; font-weight: bold; color: #7c3aed;">${previewData.stats.cgpa}</div>
                                  <div style="font-size: 12px; color: #6b7280;">CGPA</div>
                                </div>
                              </div>
                              <div style="margin-bottom: 20px;">
                                <h3 style="color: #374151; margin-bottom: 10px;">What I Do:</h3>
                                <ul style="color: #6b7280;">
                                  ${previewData.whatIDo.map(item => `<li>• ${item}</li>`).join('')}
                                </ul>
                              </div>
                              <div>
                                <h3 style="color: #374151; margin-bottom: 10px;">Tech Stack:</h3>
                                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                  ${previewData.techStacks.map(tech => `<span style="background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px;">${tech}</span>`).join('')}
                                </div>
                              </div>
                            </div>
                          </body>
                        </html>
                      `)
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 text-sm hover:bg-blue-200 w-full sm:w-auto text-center"
                  >
                    👁️ Preview
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">Basic Information</h3>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input 
                      value={about.title} 
                      onChange={(e)=>setAbout({ ...about, title: e.target.value })} 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base" 
                      placeholder="e.g., About Me"
                    />
                    <div className="text-xs text-gray-500 mt-1">{about.title.length}/50 characters</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Bio <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      value={about.bio} 
                      onChange={(e)=>setAbout({ ...about, bio: e.target.value })} 
                      rows={4} 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base" 
                      placeholder="Tell visitors about yourself..."
                    />
                    <div className="text-xs text-gray-500 mt-1">{about.bio.length}/500 characters</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">About Image</label>
                    <ImageUpload 
                      value={about.imageUrl}
                      onChange={(url) => setAbout({ ...about, imageUrl: url })}
                      folder="portfolio/about"
                    />
                  </div>
                </div>

                {/* Skills and Experience */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">Skills & Experience</h3>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">What I Do (one per line)</label>
                    <textarea
                      value={(about.whatIDo || []).join('\n')}
                      onChange={(e)=>setAbout({ ...about, whatIDo: e.target.value.split('\n').map(s=>s.trim()).filter(Boolean) })}
                      rows={5}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter each skill or service on a new line..."
                    />
                    <div className="text-xs text-gray-500 mt-1">{(about.whatIDo || []).length} items</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Tech Stacks (comma separated)</label>
                    <input
                      value={(about.techStacks || []).join(', ')}
                      onChange={(e)=>setAbout({ ...about, techStacks: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="React, JavaScript, Python, Node.js..."
                    />
                    <div className="text-xs text-gray-500 mt-1">{(about.techStacks || []).length} technologies</div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">Statistics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Education</label>
                      <input
                        value={about.stats?.education || ''}
                        onChange={(e)=>setAbout({ ...about, stats: { ...about.stats, education: e.target.value } })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g., MCA, B.Tech"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Projects</label>
                      <input
                        value={about.stats?.projects || ''}
                        onChange={(e)=>setAbout({ ...about, stats: { ...about.stats, projects: e.target.value } })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g., 5+, 10+"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">CGPA</label>
                      <input
                        value={about.stats?.cgpa || ''}
                        onChange={(e)=>setAbout({ ...about, stats: { ...about.stats, cgpa: e.target.value } })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g., 8.5, 3.8"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button 
                  onClick={async () => {
                    if (aboutLoading) return
                    try {
                      setAboutLoading(true)
                      setError('')
                      
                      // Basic validation
                      if (!about.title.trim()) {
                        setError('Title is required')
                        return
                      }
                      if (!about.bio.trim()) {
                        setError('Bio is required')
                        return
                      }
                      
                      await apiFetch('/api/admin/about', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(about)
                      })
                      alert('About section saved successfully!')
                      setActive('dashboard')
                    } catch (e) { 
                      setError(e.message || 'Failed to save about section')
                    } finally {
                      setAboutLoading(false)
                    }
                  }} 
                  disabled={aboutLoading}
                  className={`px-4 py-2 rounded-lg text-white text-sm flex items-center justify-center gap-2 w-full sm:w-auto ${
                    aboutLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {aboutLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {aboutLoading ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={()=>{
                    setError('')
                    setActive('dashboard')
                  }} 
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm hover:bg-gray-200 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (confirm('Reset all changes? This will reload the about section data.')) {
                      setError('')
                      // Reload about data
                      window.location.reload()
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800 text-sm hover:bg-yellow-200 w-full sm:w-auto"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
          {active === 'certificates' && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
              <CertificateManagement />
            </div>
          )}
          {active === 'resumes' && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
              <ResumeManagement />
            </div>
          )}
          {active === 'contacts' && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
              <ContactManagement />
            </div>
          )}
          {active === 'messages' && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
              <MessageManagement />
            </div>
          )}
          {active === 'credentials' && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
              <CredentialsManagement />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function ProjectManagement({ projectForm, setProjectForm }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')


  const load = async () => {
    try {
      setLoading(true)
      const data = await apiFetch('/api/admin/projects')
      setItems(data)
    } catch (e) { setErr(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(items.map(item => item.category).filter(Boolean))]

  if (loading) return <div className="text-gray-500">Loading projects...</div>
  if (err) return <div className="text-red-600">{err}</div>

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredItems.map((project) => (
          <div key={project._id || project.title} className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            {/* Project Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110" 
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 backdrop-blur-sm">
                  {project.icon} {project.category}
                </span>
              </div>

              {/* Demo Project Indicator */}
              {!project._id && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 backdrop-blur-sm">
                    Demo
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex space-x-2">
                  {project._id ? (
                    <>
                      <button
                        onClick={() => setProjectForm({ show: true, mode: 'edit', data: project })}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm('Delete this project?')) return
                          try {
                            await apiFetch(`/api/admin/projects/${project._id}`, { method: 'DELETE' })
                            await load()
                          } catch (e) { alert(e.message) }
                        }}
                        className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setProjectForm({ show: true, mode: 'create', data: {} })}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg text-sm"
                    >
                      ➕ Add Real Project
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Project Content */}
            <div className="p-3 sm:p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 flex-1 pr-2">
                  {project.title}
                </h3>
                <span className="text-lg sm:text-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                  {project.icon}
                </span>
              </div>
              
              <p className="text-gray-600 mb-3 line-clamp-2 leading-relaxed text-xs sm:text-sm">
                {project.description}
              </p>

              {/* Tech Stack Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {project.tags?.slice(0, 3).map((tag) => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags?.length > 3 && (
                  <span className="text-xs text-gray-500">+{project.tags.length - 3} more</span>
                )}
              </div>

              {/* Links */}
              <div className="flex flex-col sm:flex-row gap-2">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-xs font-medium"
                  >
                    Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-xs font-medium border border-gray-200"
                  >
                    Code
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterCategory ? 'Try adjusting your search or filter' : 'Get started by adding your first project'}
          </p>
          {!searchTerm && !filterCategory && (
            <button 
              onClick={() => setProjectForm({ show: true, mode: 'create', data: {} })}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Add Project
            </button>
          )}
        </div>
      )}

      {/* Demo Projects Notice */}
      {items.length > 0 && items.every(item => !item._id) && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="text-yellow-600 text-xl mr-3">⚠️</div>
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-1">Demo Projects Detected</h4>
              <p className="text-sm text-yellow-700">
                You're currently viewing demo projects. To manage your own projects, add a new project using the "Add Project" button above.
                Demo projects cannot be edited or deleted.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Project Form Modal */}
      {projectForm.show && (
        <ProjectForm 
          mode={projectForm.mode}
          data={projectForm.data}
          onClose={() => setProjectForm({ show: false, mode: 'create', data: {} })}
          onSave={load}
        />
      )}
    </div>
  )
}

function ProjectForm({ mode, data, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    tags: [],
    demoUrl: '',
    githubUrl: '',
    icon: '',
    category: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (mode === 'edit' && data) {
      setFormData({
        title: data.title || '',
        description: data.description || '',
        image: data.image || '',
        tags: data.tags || [],
        demoUrl: data.demoUrl || '',
        githubUrl: data.githubUrl || '',
        icon: data.icon || '',
        category: data.category || ''
      })
    }
  }, [mode, data])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    try {
      setLoading(true)
      setError('')

      // Validation
      if (!formData.title.trim()) {
        setError('Title is required')
        return
      }
      if (!formData.description.trim()) {
        setError('Description is required')
        return
      }

      const url = mode === 'create' 
        ? '/api/admin/projects'
        : `/api/admin/projects/${data._id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'

      // Additional validation for edit mode
      if (mode === 'edit' && !data._id) {
        setError('Invalid project data. Cannot update project without ID.')
        return
      }

      await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      alert(`Project ${mode === 'create' ? 'created' : 'updated'} successfully!`)
      onSave()
      onClose()
    } catch (e) {
      setError(e.message || `Failed to ${mode === 'create' ? 'create' : 'update'} project`)
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
              {mode === 'create' ? 'Add New Project' : 'Edit Project'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">Basic Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Project title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="e.g., Web Development, Mobile App"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Describe your project..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Project Image</label>
                  <ImageUpload 
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    folder="portfolio/projects"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="🚀"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">Links</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Demo URL</label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="https://your-demo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">Tech Stack</h3>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Add Technologies</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter technology and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-lg text-white flex items-center justify-center gap-2 w-full sm:w-auto ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {loading ? 'Saving...' : (mode === 'create' ? 'Create Project' : 'Update Project')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function ImageUpload({ value, onChange, folder = 'portfolio' }) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'portfolio_uploads') // Make sure this upload preset exists in your Cloudinary dashboard
      formData.append('folder', folder)

      // Upload to Cloudinary
      const response = await fetch(`https://api.cloudinary.com/v1_1/dop1wkyqg/image/upload`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onChange(data.secure_url)
    } catch (err) {
      setError('Upload failed. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
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

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Image Preview */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Current avatar"
            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
          {error}
        </div>
      )}

      {/* Manual URL Input (Fallback) */}
      <div className="border-t pt-4">
        <label className="block text-xs text-gray-500 mb-1">Or enter image URL manually:</label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full text-sm rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center space-x-3 group ${
        active 
          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-xl transform scale-105 border border-indigo-200' 
          : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 hover:text-gray-900 hover:shadow-lg hover:scale-102 border border-transparent hover:border-gray-200'
      }`}
    >
      <span className={`text-xl transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
      <span className="flex-1">{label}</span>
      {active && (
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      )}
    </button>
  )
}

function StatCard({ title, value, from, to }) {
  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/40 shadow">
      <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${from} ${to} bg-clip-text text-transparent`}>{value}</div>
      <div className="text-gray-700 mt-1 text-sm sm:text-base">{title}</div>
    </div>
  )
}

function MessagesList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const data = await apiFetch('/api/admin/messages')
        setItems(data)
      } catch (e) { setErr(e.message) } finally { setLoading(false) }
    })()
  }, [])

  if (loading) return <div className="text-gray-500">Loading messages...</div>
  if (err) return <div className="text-red-600">{err}</div>

  return (
    <div className="space-y-3">
      {items.map((m) => (
        <div key={m._id} className="p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <div className="font-medium text-gray-800 text-sm sm:text-base">
              {m.name} 
              <span className="text-gray-500 text-xs sm:text-sm block sm:inline">({m.email})</span>
            </div>
            <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
          </div>
          {m.subject && <div className="text-xs sm:text-sm text-gray-600 mt-1">Subject: {m.subject}</div>}
          <div className="text-gray-700 mt-2 whitespace-pre-wrap text-sm sm:text-base">{m.message}</div>
        </div>
      ))}
    </div>
  )
}

 
