import { useAuth } from '@/contexts/AuthContext'
import { apiFetch } from '@/lib/api'

export default function AuthTest() {
  const { isAuthenticated, user, login, logout } = useAuth()

  const testAuth = async () => {
    try {
      console.log('Testing authentication...')
      const response = await apiFetch('/api/auth/me')
      console.log('Auth test successful:', response)
      alert('Authentication test successful!')
    } catch (error) {
      console.error('Auth test failed:', error)
      alert('Authentication test failed: ' + error.message)
    }
  }

  const testProtectedRoute = async () => {
    try {
      console.log('Testing protected route...')
      const response = await apiFetch('/api/admin/summary')
      console.log('Protected route test successful:', response)
      alert('Protected route test successful!')
    } catch (error) {
      console.error('Protected route test failed:', error)
      alert('Protected route test failed: ' + error.message)
    }
  }

  const handleLogin = async () => {
    const result = await login('admin123@gmail.com', 'admin123')
    if (result.success) {
      alert('Login successful!')
    } else {
      alert('Login failed: ' + result.error)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Authentication Test</h3>
      
      <div className="space-y-2 mb-4">
        <p><strong>Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
        {user && <p><strong>User:</strong> {user.email}</p>}
      </div>

      <div className="space-x-2">
        {!isAuthenticated ? (
          <button 
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        ) : (
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
        
        <button 
          onClick={testAuth}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Auth
        </button>
        
        <button 
          onClick={testProtectedRoute}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test Protected Route
        </button>
      </div>
    </div>
  )
}
