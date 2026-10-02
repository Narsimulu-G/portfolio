import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Portfolio from './components/portfolio/Portfolio'
import { AuthProvider } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'

const AdminPage = lazy(() => import('./pages/admin'))

export default function App() {
  return <Router><Routes>
    <Route path="/admin" element={<AuthProvider><ProfileProvider><Suspense fallback={<p role="status">Loading admin…</p>}><main className="min-h-screen bg-gray-50 text-gray-900 px-4 sm:px-6 lg:px-8"><AdminPage /></main></Suspense></ProfileProvider></AuthProvider>} />
    <Route path="/*" element={<Portfolio />} />
  </Routes></Router>
}
