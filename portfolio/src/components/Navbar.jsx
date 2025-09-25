import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import LoginModal from './LoginModal'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
]

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }
  return (
    <div className="fixed inset-x-0 top-2 sm:top-8 z-50 animate-[fadeInDown_.3s_ease-out] px-2 sm:px-0">
      <div className="mx-auto max-w-7xl">
        {/* Desktop Navbar */}
        <div className="hidden sm:block">
          <div className="relative mx-auto w-full max-w-[760px] flex items-center justify-between rounded-full border border-transparent bg-white/95 px-6 lg:px-10 py-2.5 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] backdrop-blur">
            <div className="pointer-events-none absolute inset-0 rounded-full [background:linear-gradient(90deg,rgba(109,40,217,0.35),rgba(59,130,246,0.35),rgba(236,72,153,0.35))] opacity-30" />
            
            {/* Desktop Navigation */}
            <div className="flex items-center gap-6">
              {links.map(l => (
                <a key={l.href} href={l.href} className="relative text-base text-gray-700 hover:text-brand transition-colors duration-300">
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-brand transition-all duration-200 group-hover:w-full" />
                  {l.label}
                </a>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="flex items-center gap-3">
              {!isAuthenticated ? (
                <button onClick={() => setShowLogin(true)} className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 transition">
                  Login
                </button>
              ) : (
                <>
                  <button onClick={() => { window.location.href = '/admin' }} className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition">
                    Admin
                  </button>
                  <button onClick={logout} className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="sm:hidden">
          <div className="relative mx-auto w-full flex items-center justify-between rounded-2xl border border-transparent bg-white/95 px-3 py-3 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] backdrop-blur">
            <div className="pointer-events-none absolute inset-0 rounded-2xl [background:linear-gradient(90deg,rgba(109,40,217,0.35),rgba(59,130,246,0.35),rgba(236,72,153,0.35))] opacity-30" />
            
            {/* Mobile Logo/Brand */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Portfolio
              </span>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="mt-2 w-full rounded-2xl bg-white/95 backdrop-blur border border-gray-200 shadow-lg py-4">
              <div className="flex flex-col space-y-1 px-4">
                {links.map(l => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={closeMobileMenu}
                    className="px-4 py-3 text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
                  >
                    {l.label}
                  </a>
                ))}
                
                {/* Mobile Auth Buttons */}
                <div className="border-t border-gray-200 mt-3 pt-3">
                  {!isAuthenticated ? (
                    <button 
                      onClick={() => {
                        setShowLogin(true)
                        closeMobileMenu()
                      }} 
                      className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600 text-white text-base hover:bg-blue-700 transition font-medium"
                    >
                      Login
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => { 
                          window.location.href = '/admin'
                          closeMobileMenu()
                        }} 
                        className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg bg-indigo-600 text-white text-base hover:bg-indigo-700 transition font-medium"
                      >
                        Admin
                      </button>
                      <button 
                        onClick={() => {
                          logout()
                          closeMobileMenu()
                        }} 
                        className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-base hover:bg-gray-200 transition font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} onSuccess={() => setShowLogin(false)} />
    </div>
  )
}

export default Navbar


