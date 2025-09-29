import { useEffect, useState } from 'react'
import { apiFetch, fixImageUrl } from '@/lib/api'

function About() {
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [stats, setStats] = useState({ education: 'MCA', projects: '3+', cgpa: '7.32' })
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [aboutRes] = await Promise.all([
          apiFetch('/api/about').catch(() => null)
        ])
        if (!mounted) return
        // Map About payload to local profile-like shape for rendering
        const mapped = aboutRes ? {
          name: aboutRes.title || 'About Me',
          bio: aboutRes.bio || '',
          avatarUrl: fixImageUrl(aboutRes.imageUrl) || ''
        } : null
        setProfile(mapped)
        setSkills(Array.isArray(aboutRes?.techStacks) ? aboutRes.techStacks : [])
        setWhatIDo(Array.isArray(aboutRes?.whatIDo) ? aboutRes.whatIDo : [])
        setStats(aboutRes?.stats || { education: 'MCA', projects: '3+', cgpa: '7.32' })
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load About section')
      }
    })()
    return () => { mounted = false }
  }, [])

  const displayName = profile?.name || 'About Me'
  const bio = profile?.bio || "I specialize in building responsive web applications using React.js and modern web technologies. I'm passionate about creating user-friendly interfaces and solving complex problems through code."
  const avatarUrl = profile?.avatarUrl || 'https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg'
  const [whatIDo, setWhatIDo] = useState([])
  return (
    <section id="about" className="min-h-screen py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {displayName}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
            {bio}
          </p>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid items-start gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-2">
          {/* Left: Highlights */}
          <div className="space-y-4 sm:space-y-6">
            <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold mr-2 sm:mr-3">💻</span>
                  What I do
                </h3>
                <ul className="grid gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                  {(whatIDo.length ? whatIDo : [
                    'Build responsive web applications using React.js and modern frameworks',
                    'Develop backend APIs and services with Python and Node.js',
                    'Create user-friendly interfaces with HTML, CSS, and Bootstrap',
                    'Work with databases and implement CRUD operations'
                  ]).map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold mr-2 sm:mr-3">⚡</span>
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {(skills?.length ? skills : ["React.js","Python","JavaScript","HTML","CSS","Bootstrap","Node.js","Express","SQLite"]).map((tech) => (
                    <span key={tech} className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Photo + Stats */}
          <div className="relative">
            <div className="group relative mx-auto max-w-sm sm:max-w-md overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <img
                src={avatarUrl}
                alt={profile?.name ? `${profile.name} avatar` : 'Profile avatar'}
                className="h-64 sm:h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="grid grid-cols-3 divide-x divide-blue-200/70 bg-gradient-to-r from-white/90 to-blue-50/90 text-center text-xs sm:text-sm backdrop-blur">
                <div className="p-3 sm:p-4 group-hover:bg-blue-50/50 transition-colors duration-300">
                  <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{stats.education}</div>
                  <div className="text-gray-600 text-xs">Education</div>
                </div>
                <div className="p-3 sm:p-4 group-hover:bg-blue-50/50 transition-colors duration-300">
                  <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.projects}</div>
                  <div className="text-gray-600 text-xs">Projects</div>
                </div>
                <div className="p-3 sm:p-4 group-hover:bg-blue-50/50 transition-colors duration-300">
                  <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.cgpa}</div>
                  <div className="text-gray-600 text-xs">CGPA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About


