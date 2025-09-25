import { useState, useEffect, useRef } from 'react'
import { fetchCertificates, fetchResume } from '../lib/api'

// Fallback certificate data
const fallbackCertificates = [
  {
    _id: 1,
    title: "React Developer Certification",
    issuer: "Meta",
    date: "2024",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&crop=center",
    description: "Advanced React development and component architecture"
  },
  {
    _id: 2,
    title: "JavaScript Algorithms and Data Structures",
    issuer: "freeCodeCamp",
    date: "2023",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
    description: "Problem-solving with JavaScript algorithms"
  },
  {
    _id: 3,
    title: "Python for Data Science",
    issuer: "Coursera",
    date: "2023",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop&crop=center",
    description: "Data analysis and visualization with Python"
  },
  {
    _id: 4,
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "2024",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&crop=center",
    description: "Cloud computing fundamentals and AWS services"
  },
  {
    _id: 5,
    title: "Full Stack Web Development",
    issuer: "The Odin Project",
    date: "2023",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center",
    description: "Complete web development curriculum"
  },
  {
    _id: 6,
    title: "Node.js Backend Development",
    issuer: "Udemy",
    date: "2024",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop&crop=center",
    description: "Server-side JavaScript and API development"
  }
]

function CertificateCard({ certificate, isActive, onMouseEnter, onMouseLeave, onViewCertificate }) {
  return (
    <div 
      className={`flex-shrink-0 w-80 mx-4 group cursor-pointer transition-all duration-500 ${isActive ? 'scale-105' : 'scale-100'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={certificate.image}
            alt={certificate.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Issuer Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
            <span className="text-xs font-semibold text-gray-700">{certificate.issuer}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
              {certificate.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {certificate.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {certificate.date}
            </span>
            <button 
              onClick={() => onViewCertificate(certificate)}
              className="flex items-center text-gray-500 group-hover:text-blue-500 transition-colors duration-300 hover:scale-105"
            >
              <span className="text-xs mr-1">View Certificate</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300 transition-colors duration-500 pointer-events-none" />
      </div>
    </div>
  )
}

function Certificates() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [certificates, setCertificates] = useState(fallbackCertificates)
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)

  // Fetch certificates and resume from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [certificatesData, resumeData] = await Promise.all([
          fetchCertificates(),
          fetchResume().catch(() => null) // Resume is optional
        ])
        setCertificates(certificatesData)
        setResume(resumeData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        // Use fallback data on error
        setCertificates(fallbackCertificates)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Create infinite scroll data by duplicating certificates
  const infiniteCertificates = [...certificates, ...certificates, ...certificates]

  // Continuous circular scrolling effect
  useEffect(() => {
    if (isHovered) return

    const scrollSpeed = 1.0 // Fixed speed for smooth continuous scrolling
    let animationId

    const scroll = () => {
      setScrollPosition(prev => {
        const newPosition = prev + scrollSpeed
        // Reset position when we've scrolled through one complete set
        return newPosition >= certificates.length * 320 ? 0 : newPosition
      })
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isHovered])

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCertificate(null)
  }

  return (
    <section id="certificates" className="relative min-h-screen py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Decorative Background Accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-purple-300/30 to-pink-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300/25 to-purple-300/25 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent sm:text-5xl mb-4">
            Certifications & Achievements
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Professional certifications and achievements that validate my expertise
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        {/* Certificate Carousel */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="ml-3 text-gray-600">Loading certificates...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Infinite Scroll Container */}
              <div 
                className="overflow-hidden rounded-3xl"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div 
                  ref={scrollRef}
                  className="flex"
                  style={{ 
                    transform: `translateX(-${scrollPosition}px)`,
                    width: `${infiniteCertificates.length * 320}px`
                  }}
                >
                  {infiniteCertificates.map((certificate, index) => (
                    <div key={`${certificate._id}-${index}`} className="flex-shrink-0 w-80 mx-4">
                      <CertificateCard 
                        certificate={certificate} 
                        isActive={false}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onViewCertificate={handleViewCertificate}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 shadow">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {certificates.length}+
            </div>
            <div className="text-sm text-gray-600">Certifications</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 shadow">
            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">5+</div>
            <div className="text-sm text-gray-600">Platforms</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 shadow">
            <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">100%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">2024</div>
            <div className="text-sm text-gray-600">Latest Achievement</div>
          </div>
        </div>

         {/* Call to Action */}
         <div className="mt-16 text-center">
           <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-4 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                 </svg>
               </div>
               <div className="text-left">
                 <p className="text-sm text-gray-600 mb-1">Complete Portfolio & Resume</p>
                 <p className="text-xs text-gray-500">Download my detailed resume</p>
               </div>
             </div>
             {resume ? (
               <a
                 href={resume.fileUrl}
                 download={resume.fileName}
                 className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105"
               >
                 <span>Download Resume</span>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                 </svg>
               </a>
             ) : (
               <div className="text-gray-500 text-sm">
                 No resume available
               </div>
             )}
           </div>
         </div>
      </div>

      {/* Certificate Modal */}
      {isModalOpen && selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{selectedCertificate.title}</h3>
                <p className="text-gray-600">{selectedCertificate.issuer} • {selectedCertificate.date}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="relative">
                <img
                  src={selectedCertificate.image}
                  alt={selectedCertificate.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                {/* Download Button */}
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = selectedCertificate.image
                      link.download = `${selectedCertificate.title}.jpg`
                      link.click()
                    }}
                    className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium">Download</span>
                  </button>
                </div>
              </div>
              
              {/* Certificate Description */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{selectedCertificate.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Certificates
