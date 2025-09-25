import { useProfile } from '@/contexts/ProfileContext'
import { useState, useEffect } from 'react'

function Hero() {
  try {
    const { profile, resume, loading, error } = useProfile()
  // Removed typing animation states
  // Removed stats states
    // Removed imageLoading state - images display immediately

  // Debug profile data
  useEffect(() => {
    console.log('Hero Profile Data:', profile)
    console.log('Profile Avatar URL:', profile?.avatarUrl)
  }, [profile])

  // Removed stats-related effects
  
  // Remove loading state - show content immediately

  if (error) {
    return (
      <section id="home" className="relative overflow-hidden min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-gray-600">Failed to load profile data</p>
            <p className="text-sm text-gray-500 mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Fallback if profile is null but not loading
  if (!profile) {
    return (
      <section id="home" className="relative overflow-hidden min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="text-gray-600">No profile data available</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="home" className="relative overflow-hidden min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full">
      {/* Enhanced background elements - Responsive positioning */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 h-16 w-16 sm:h-32 sm:w-32 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 h-12 w-12 sm:h-24 sm:w-24 rounded-full bg-gradient-to-r from-indigo-400/30 to-pink-400/30 blur-2xl animate-[float_6s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-20 w-20 sm:h-40 sm:w-40 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-400/20 blur-3xl animate-[float_10s_ease-in-out_infinite]" />
      </div>

      {/* Left side colorful elements - Hidden on mobile for better performance */}
      <div className="hidden sm:block absolute left-0 top-0 w-1/4 h-full -z-10">
        <div className="absolute top-1/4 left-8 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-2xl animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute top-3/4 left-4 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500/25 to-indigo-500/25 blur-xl animate-[float_8s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-1/2 left-12 h-48 w-48 rounded-full bg-gradient-to-br from-pink-500/15 to-rose-500/15 blur-2xl animate-[float_10s_ease-in-out_infinite]"></div>
        
        {/* Decorative shapes */}
        <div className="absolute top-1/3 left-16 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-[float_4s_ease-in-out_infinite]"></div>
        <div className="absolute top-2/3 left-8 w-6 h-6 bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full animate-[float_5s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-1/6 left-20 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-[float_3s_ease-in-out_infinite]"></div>
      </div>

      {/* Right side colorful elements - Hidden on mobile for better performance */}
      <div className="hidden sm:block absolute right-0 top-0 w-1/4 h-full -z-10">
        <div className="absolute top-1/3 right-8 h-56 w-56 rounded-full bg-gradient-to-bl from-green-500/20 to-teal-500/20 blur-2xl animate-[float_7s_ease-in-out_infinite]"></div>
        <div className="absolute top-2/3 right-4 h-40 w-40 rounded-full bg-gradient-to-bl from-orange-500/25 to-yellow-500/25 blur-xl animate-[float_9s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-1/6 right-12 h-36 w-36 rounded-full bg-gradient-to-bl from-emerald-500/15 to-cyan-500/15 blur-2xl animate-[float_11s_ease-in-out_infinite]"></div>
        
        {/* Decorative shapes */}
        <div className="absolute top-1/4 right-16 w-5 h-5 bg-gradient-to-r from-green-400 to-teal-400 rounded-full animate-[float_4s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-3/4 right-8 w-4 h-4 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/2 right-20 w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-[float_5s_ease-in-out_infinite_reverse]"></div>
      </div>

      <div className="mx-auto max-w-7xl min-h-screen flex items-center py-8 sm:py-16">
        <div className="w-full rounded-2xl sm:rounded-3xl bg-gradient-to-r from-white/80 via-blue-50/80 to-indigo-50/80 px-4 py-12 sm:px-6 sm:py-16 lg:px-10 xl:px-14 ring-1 ring-blue-200/60 backdrop-blur shadow-2xl">
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/70 via-blue-50/30 to-transparent" />
          <div className="relative z-10">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left order-2 sm:order-1">
              <p className="mb-3 sm:mb-4 text-base sm:text-lg text-gray-700 animate-[fadeInDown_.4s_ease-out]">Hello I&apos;M</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight animate-[fadeInDown_.6s_ease-out]">
                <span className="text-gray-800">
                  {profile?.name?.split(' ')[0] || 'Narsimulu'}
                </span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">G.</span>
              </h1>
              <p className="mt-4 sm:mt-6 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base text-gray-600 animate-[fadeInDown_.8s_ease-out]">
                {profile?.bio || 'Full-stack developer passionate about building responsive web applications.'}
              </p>

              {/* Removed animated stats section */}

              {/* Action Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 animate-[fadeInDown_1s_ease-out]">
                <a href="#projects" className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:shadow-xl">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  View Work
                </a>
                {resume && (
                  <a 
                    href={resume.fileUrl} 
                    download={resume.fileName}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-white/90 text-gray-700 rounded-full font-medium shadow-lg ring-1 ring-gray-200/60 transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-xl"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Resume
                  </a>
                )}
              </div>

              {/* Social Media Icons */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 animate-[fadeInDown_1.2s_ease-out]">
                <span className="text-sm font-medium text-gray-600">Follow me:</span>
                <div className="flex gap-2 sm:gap-3">
                  <a href={profile?.social?.linkedin || "https://www.linkedin.com/in/g-narsimulu"} target="_blank" rel="noopener noreferrer" className="group flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 shadow-lg ring-1 ring-blue-200/60 transition-all duration-500 hover:bg-blue-50 hover:scale-110 hover:shadow-xl hover:rotate-12">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href={profile?.social?.github || "https://github.com/Narsimulu-G"} target="_blank" rel="noopener noreferrer" className="group flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 shadow-lg ring-1 ring-gray-200/60 transition-all duration-500 hover:bg-gray-50 hover:scale-110 hover:shadow-xl hover:rotate-12">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 group-hover:text-gray-900 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a href={`mailto:${profile?.social?.email || 'narasimha.2003g@gmail.com'}`} className="group flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 shadow-lg ring-1 ring-red-200/60 transition-all duration-500 hover:bg-red-50 hover:scale-110 hover:shadow-xl hover:rotate-12">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 group-hover:text-red-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                  <a href={profile?.social?.twitter || "https://twitter.com/yourusername"} target="_blank" rel="noopener noreferrer" className="group flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 shadow-lg ring-1 ring-sky-200/60 transition-all duration-500 hover:bg-sky-50 hover:scale-110 hover:shadow-xl hover:rotate-12">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-sky-600 group-hover:text-sky-700 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Floating Action Button */}
              <div className="mt-8 flex justify-center lg:justify-start">
                <button 
                  onClick={() => {
                    const element = document.getElementById('contact')
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Let's Chat
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-xl animate-[fadeInDown_1.2s_ease-out] order-1 sm:order-2">
              <div className="relative mx-auto aspect-square sm:aspect-[4/3] w-full">
                {/* Desktop Image - Hidden on mobile */}
                <div className="hidden sm:block">
                  <div className="absolute right-2 sm:right-6 top-2 sm:top-4 h-48 w-48 sm:h-[300px] sm:w-[300px] lg:h-[380px] lg:w-[380px] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-2xl shadow-blue-500/30 animate-[float_6s_ease-in-out_infinite]" />
                  <div className="absolute right-0 top-0 h-52 w-52 sm:h-[350px] sm:w-[350px] lg:h-[430px] lg:w-[430px] rounded-full border-4 sm:border-8 border-blue-200/80 animate-[float_8s_ease-in-out_infinite_reverse]" />
                  {/* Removed image loading spinner */}
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt="Narsimulu G - Full Stack Developer"
                      className={`absolute right-1 top-1 sm:right-4 sm:top-4 h-50 w-50 sm:h-[320px] sm:w-[320px] lg:h-[400px] lg:w-[400px] object-cover rounded-full shadow-2xl transition-all duration-500 hover:scale-105 `}
                      loading="lazy"
                      onLoad={() => {
                        console.log('Profile image loaded successfully')
                      }}
                      onError={(e) => {
                        console.log('Profile image failed to load, using fallback')
                        e.target.src = "https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg"
                      }}
                    />
                  ) : (
                    <img
                      src="https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg"
                      alt="Narsimulu G - Full Stack Developer"
                      className={`absolute right-1 top-1 sm:right-4 sm:top-4 h-50 w-50 sm:h-[320px] sm:w-[320px] lg:h-[400px] lg:w-[400px] object-cover rounded-full shadow-2xl transition-all duration-500 hover:scale-105 `}
                      loading="lazy"
                      onLoad={() => {
                        console.log('Fallback image loaded successfully')
                      }}
                      onError={() => {
                        console.log('Fallback image also failed to load')
                      }}
                    />
                  )}
                  {/* Enhanced floating accent dots - Hidden on mobile for better performance */}
                  <div className="absolute -top-4 -left-4 h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[float_4s_ease-in-out_infinite]" />
                  <div className="absolute -bottom-6 -right-6 h-6 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 animate-[float_5s_ease-in-out_infinite_reverse]" />
                </div>

                {/* Mobile Image - Hidden on desktop */}
                <div className="block sm:hidden">
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-70 w-70 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30" />
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-74 w-74 rounded-full border-4 border-purple-200/80" />
                  {/* Removed mobile image loading spinner */}
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt="Narsimulu G - Full Stack Developer Mobile"
                      className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-70 w-70 object-cover rounded-full shadow-2xl transition-all duration-500 hover:scale-105 `}
                      loading="lazy"
                      onLoad={() => {
                        console.log('Mobile profile image loaded successfully')
                      }}
                      onError={(e) => {
                        console.log('Mobile profile image failed to load, using fallback')
                        e.target.src = "https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg"
                      }}
                    />
                  ) : (
                    <img
                      src="https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg"
                      alt="Narsimulu G - Full Stack Developer Mobile"
                      className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-70 w-70 object-cover rounded-full shadow-2xl transition-all duration-500 hover:scale-105 `}
                      loading="lazy"
                      onLoad={() => {
                        console.log('Mobile fallback image loaded successfully')
                      }}
                      onError={() => {
                        console.log('Mobile fallback image also failed to load')
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center text-gray-600">
          <span className="text-sm font-medium mb-2">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
  } catch (error) {
    console.error('Hero component error:', error)
    return (
      <section id="home" className="relative overflow-hidden min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-gray-600">Something went wrong</p>
            <p className="text-sm text-gray-500 mt-2">Please refresh the page</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </section>
    )
  }
}

export default Hero