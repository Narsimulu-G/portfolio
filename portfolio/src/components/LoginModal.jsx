import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

function LoginModal({ open, onClose, onSuccess }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setEmail('')
      setPassword('')
      setError('')
      setLoading(false)
    }
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(email, password)
      if (result.success) {
        onSuccess?.()
        onClose?.()
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[90vw] max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Admin Login</h3>
        {error && (
          <div className="mb-3 rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin123@gmail.com" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
          </div>
          <button disabled={loading} type="submit" className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium disabled:opacity-60">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal


