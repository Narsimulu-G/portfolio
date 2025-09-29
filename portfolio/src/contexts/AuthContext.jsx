import { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...')
      const response = await apiFetch('/api/auth/me')
      console.log('Auth check successful:', response)
      setUser(response.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.log('Auth check failed:', error.message)
      // Clear localStorage token if auth fails
      localStorage.removeItem('authToken')
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email)
      console.log('Current cookies before login:', document.cookie)
      
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      console.log('Login response:', response)
      console.log('Cookies after login:', document.cookie)
      
      // Store token in localStorage as fallback
      if (response.token) {
        localStorage.setItem('authToken', response.token)
        console.log('Token stored in localStorage as fallback')
      }
      
      console.log('Login successful, waiting before checking auth status...')
      
      // Add a small delay to ensure cookie is set
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('Cookies before auth check:', document.cookie)
      await checkAuthStatus()
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error.message)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear localStorage token
      localStorage.removeItem('authToken')
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  const updateCredentials = async (newEmail, newPassword, currentPassword) => {
    try {
      await apiFetch('/api/auth/update-credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          newEmail, 
          newPassword, 
          currentPassword 
        })
      })
      await checkAuthStatus()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    updateCredentials,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
