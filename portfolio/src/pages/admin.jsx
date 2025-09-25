import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { ProfileProvider } from '../contexts/ProfileContext'
import { useAuth } from '../contexts/AuthContext'
import CertificateManagement from '../components/admin/CertificateManagement'
import ResumeManagement from '../components/admin/ResumeManagement'
import ContactManagement from '../components/admin/ContactManagement'
import MessageManagement from '../components/admin/MessageManagement'
import ImprovedDashboard from '../components/admin/ImprovedDashboard'
import CredentialsManagement from '../components/admin/CredentialsManagement'
import ProjectManagement from '../components/admin/ProjectManagement'
import HeroManagement from '../components/admin/HeroManagement'
import AboutManagement from '../components/admin/AboutManagement'
import SkillManagement from '../components/admin/SkillManagement'
import AdminLogin from '../components/AdminLogin'

export default function AdminPage() {
  const { isAuthenticated, loading, logout } = useAuth()
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  const token = null
  const [profile, setProfile] = useState({ name: '', headline: '', bio: '', avatarUrl: '', social: { linkedin: '', github: '', twitter: '', email: '' } })
  const [active, setActive] = useState('dashboard')
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
    if (!isAuthenticated) return
    
    const go = async () => {
      try {
        try {
          const data = await apiFetch('/api/admin/summary')
          setSummary(data)
        } catch (_) {
          setSummary({ projectsCount: 0, messagesCount: 0 })
        }

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
  }, [isAuthenticated])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return (
    <ProfileProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Top Navigation Bar */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-30 shadow-lg">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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
                  <div className="text-gray-500">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-2">
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
                <SidebarItem icon="🛠️" label="Skills" active={active==='skills'} onClick={() => setActive('skills')} />
                <SidebarItem icon="✉️" label="Messages" active={active==='messages'} onClick={() => setActive('messages')} />
                <SidebarItem icon="🔐" label="Security" active={active==='credentials'} onClick={() => setActive('credentials')} />
              </nav>
            </div>
          </aside>
          
          {/* Main content */}
          <section className="lg:col-span-10">
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
            
            {active === 'projects' && (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
                <ProjectManagement />
                </div>
              )}

            {active === 'hero' && (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
                <HeroManagement />
        </div>
      )}

            {active === 'about' && (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
                <AboutManagement />
        </div>
      )}

            {active === 'skills' && (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
                <SkillManagement />
              </div>
            )}
          </section>
        </div>
      </div>
      </div>
    </ProfileProvider>
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