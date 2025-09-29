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
import AuthTest from './components/AuthTest'
import { AuthProvider } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'

function App() {
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname === '/admin'
  return (
    <AuthProvider>
      <ProfileProvider>
        <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-gray-50 text-gray-900">
          {!isAdminRoute && <Navbar />}
          <main className="w-full max-w-none px-4 sm:px-6 lg:px-8">
            {isAdminRoute ? (
              <AdminPage />
            ) : (
              <>
                <AuroraBackground className="h-auto min-h-screen">
                  <Hero />
                </AuroraBackground>
                <div className="container mx-auto py-8">
                  <AuthTest />
                </div>
                <About />
                <Projects />
                <Skills />
                <Certificates />
                <Contact />
              </>
            )}
          </main>
          {!isAdminRoute && <Footer />}
        </div>
      </ProfileProvider>
    </AuthProvider>
  )
}

export default App
