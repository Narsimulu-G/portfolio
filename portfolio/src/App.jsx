import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { AuroraBackground } from '@/components/ui/aurora-background'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Certificates from './components/Certificates'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminPage from '@/pages/admin'
import { AuthProvider } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'

function HomePage() {
  return (
    <>
      <AuroraBackground className="h-auto min-h-screen">
        <Hero />
      </AuroraBackground>
      <About />
      <Projects />
      <Skills />
      <Certificates />
      <Contact />
    </>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-gray-50 text-gray-900">
            <Routes>
              <Route path="/admin" element={
                <>
                  <main className="w-full max-w-none px-4 sm:px-6 lg:px-8">
                    <AdminPage />
                  </main>
                </>
              } />
              <Route path="/*" element={
                <>
                  <Navbar />
                  <main className="w-full max-w-none px-4 sm:px-6 lg:px-8">
                    <HomePage />
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
