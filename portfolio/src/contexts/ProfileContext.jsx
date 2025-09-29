import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiFetch, fixImageUrl } from '@/lib/api'

const ProfileContext = createContext()

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    name: 'Narsimulu G',
    bio: 'Full-stack developer passionate about building responsive web applications.',
    avatarUrl: 'https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg'
  })
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching profile data...')
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const [profileData, resumeData] = await Promise.race([
        Promise.all([
          apiFetch('/api/profile').catch(err => {
            console.warn('Profile API failed, using fallback:', err)
            return null
          }),
          apiFetch('/api/resume').catch(() => null) // Resume is optional
        ]),
        timeoutPromise
      ])
      
      console.log('Profile data fetched:', profileData)
      console.log('Resume data fetched:', resumeData)
      
      // Use profile data if available, otherwise use fallback
      const finalProfileData = profileData || {
        name: 'Narsimulu G',
        bio: 'Full-stack developer passionate about building responsive web applications.',
        avatarUrl: 'https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg'
      }
      
      // Ensure avatarUrl is always set
      if (!finalProfileData.avatarUrl) {
        finalProfileData.avatarUrl = 'https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg'
      }
      
      // Fix avatarUrl to be a full URL if it's a relative path
      if (finalProfileData?.avatarUrl && finalProfileData.avatarUrl.startsWith('/')) {
        const baseUrl = import.meta.env.VITE_API_BASE || 'https://portfolio-j9s6.onrender.com'
        finalProfileData.avatarUrl = `${baseUrl}${finalProfileData.avatarUrl}`
        console.log('Fixed avatarUrl:', finalProfileData.avatarUrl)
      }
      
      // Fix any problematic URLs (localhost, old backend URLs)
      if (finalProfileData?.avatarUrl) {
        finalProfileData.avatarUrl = fixImageUrl(finalProfileData.avatarUrl)
        console.log('Fixed avatarUrl with utility:', finalProfileData.avatarUrl)
      }
      
      console.log('Final profile data before setting:', finalProfileData)
      
      setProfile(finalProfileData)
      setResume(resumeData)
    } catch (err) {
      console.error('Failed to fetch profile data:', err)
      setError(err.message)
      // Set fallback profile data
      const fallbackProfile = {
        name: 'Narsimulu G',
        bio: 'Full-stack developer passionate about building responsive web applications.',
        avatarUrl: 'https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg'
      }
      console.log('Setting fallback profile:', fallbackProfile)
      setProfile(fallbackProfile)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshProfile = useCallback(() => {
    return fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    console.log('ProfileContext: useEffect triggered, calling fetchProfile')
    fetchProfile()
  }, [fetchProfile])

  // Set a fallback profile after 8 seconds if still loading (increased timeout)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading && !profile) {
        console.log('ProfileContext: Setting fallback profile due to timeout')
        const timeoutProfile = {
          name: 'Narsimulu G',
          bio: 'Full-stack developer passionate about building responsive web applications.',
          avatarUrl: 'https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg'
        }
        console.log('Setting timeout fallback profile:', timeoutProfile)
        setProfile(timeoutProfile)
        setLoading(false)
      }
    }, 8000)

    return () => clearTimeout(timer)
  }, [loading, profile])

  // Debug logging
  useEffect(() => {
    console.log('ProfileContext: State changed', { loading, error, profile: !!profile })
  }, [loading, error, profile])

  const value = {
    profile,
    resume,
    loading,
    error,
    refreshProfile,
    fetchProfile
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}
