import { useState, useEffect } from 'react'
import { fetchContact, sendMessage } from '../lib/api'

function Contact() {
  const [contactData, setContactData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', null

  useEffect(() => {
    const loadContactData = async () => {
      try {
        setLoading(true)
        const data = await fetchContact()
        setContactData(data)
      } catch (error) {
        console.error('Failed to fetch contact data:', error)
        // Use fallback data
        setContactData({
          title: "Let's Work Together",
          subtitle: "Get In Touch",
          description: "Tell me about your project and I'll get back within 24 hours.",
          email: "narasimha.2003g@gmail.com",
          phone: "+91 7981528890",
          address: "Hyderabad, Telangana, 500036",
          socialLinks: {
            linkedin: "https://www.linkedin.com/in/g-narsimulu",
            github: "https://github.com/Narsimulu-G",
            twitter: "",
            instagram: "",
            facebook: ""
          }
        })
      } finally {
        setLoading(false)
      }
    }
    loadContactData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name.trim()) {
      alert('Please enter your name')
      return
    }
    if (!formData.email.trim()) {
      alert('Please enter your email')
      return
    }
    if (!formData.message.trim()) {
      alert('Please enter a message')
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitStatus(null)
      
      await sendMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      })
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
      
    } catch (error) {
      console.error('Error sending message:', error)
      setSubmitStatus('error')
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section id="contact" className="min-h-screen py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Loading contact information...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="min-h-screen py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent sm:text-5xl mb-4">
            {contactData?.title || "Let's Work Together"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            {contactData?.description || "Tell me about your project and I'll get back within 24 hours."}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form card */}
          <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-8">
              <div className="mb-6 flex items-center">
                <span className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold mr-4">📧</span>
                <h3 className="text-2xl font-bold text-gray-800">Send a Message</h3>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-6">
                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-green-800 font-medium">Message sent successfully! I'll get back to you soon.</p>
                    </div>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <p className="text-red-800 font-medium">Failed to send message. Please try again.</p>
                    </div>
                  </div>
                )}

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="rounded-lg border border-gray-300 bg-white/90 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                    placeholder="Your full name" 
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="rounded-lg border border-gray-300 bg-white/90 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                    placeholder="name@example.com" 
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="min-h-32 resize-y rounded-lg border border-gray-300 bg-white/90 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                    placeholder="What are you building?" 
                  />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <p className="text-xs text-gray-500">By sending, you agree to be contacted about your request.</p>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`rounded-full px-6 py-3 text-white shadow-lg transition-all duration-200 font-medium ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info cards */}
          <div className="space-y-6">
            <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold mr-3">📞</span>
                  Contact Details
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3 flex-shrink-0"></span>
                    <span>Email: </span>
                    <a className="text-blue-600 hover:text-blue-800 underline ml-1" href={`mailto:${contactData?.email}`}>
                      {contactData?.email}
                    </a>
                  </li>
                  {contactData?.phone && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3 flex-shrink-0"></span>
                      <span>Phone: </span>
                      <a className="text-blue-600 hover:text-blue-800 underline ml-1" href={`tel:${contactData.phone}`}>
                        {contactData.phone}
                      </a>
                    </li>
                  )}
                  {contactData?.address && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3 flex-shrink-0"></span>
                      Location: {contactData.address}
                    </li>
                  )}
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3 flex-shrink-0"></span>
                    Timezone: IST (UTC+5:30)
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold mr-3">🌐</span>
                  Social Links
                </h3>
                <div className="flex flex-wrap gap-3">
                  {contactData?.socialLinks?.linkedin && (
                    <a href={contactData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {contactData?.socialLinks?.github && (
                    <a href={contactData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200 hover:from-gray-100 hover:to-gray-200 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                  {contactData?.socialLinks?.twitter && (
                    <a href={contactData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 border border-sky-200 hover:from-sky-100 hover:to-blue-100 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      Twitter
                    </a>
                  )}
                  {contactData?.socialLinks?.instagram && (
                    <a href={contactData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 text-pink-700 border border-pink-200 hover:from-pink-100 hover:to-purple-100 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z"/>
                      </svg>
                      Instagram
                    </a>
                  )}
                  {contactData?.socialLinks?.facebook && (
                    <a href={contactData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </a>
                  )}
                  <a href={`mailto:${contactData?.email}`} className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200 hover:from-red-100 hover:to-pink-100 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact


