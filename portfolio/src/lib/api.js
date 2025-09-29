// Basic API base resolver: prefer Vite env, else detect environment
function getApiBase() {
  // Check for Vite environment variable first
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE
  }
  
  // Check if we're in development (localhost or 127.0.0.1)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    const port = window.location.port
    
    // If running on localhost with Vite dev server, use relative URLs (proxy)
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && port === '5173') {
      return '' // Use relative URLs for Vite proxy
    }
    
    // If running on localhost but not Vite dev server, use direct backend
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
      return 'http://localhost:4000'
    }
  }
  
  // Default to production backend
  return 'https://portfolio-j9s6.onrender.com'
}

export const API_BASE = getApiBase()

// Log the API base for debugging
console.log('🌐 API Base URL:', API_BASE || '(using relative URLs for proxy)')

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(options.headers || {})
  
  // Ensure proper headers for CORS
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  headers.set('Accept', 'application/json')
  
  // Use cookie-based auth; always send credentials
  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include',
    mode: 'cors',
    cache: 'no-cache'
  }
  
  try {
    const res = await fetch(url, fetchOptions)
    const data = await res.json().catch(() => ({}))
    
    if (!res.ok) {
      const message = (data && (data.error || data.message)) || `Request failed: ${res.status}`
      console.error(`API Error ${res.status}:`, message, 'URL:', url)
      throw new Error(message)
    }
    return data
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Network error:', error.message, 'URL:', url)
      throw new Error('Network error: Unable to connect to server')
    }
    throw error
  }
}

// Helper function to fix image URLs
export function fixImageUrl(url) {
  if (!url) return url
  
  // Fix localhost URLs
  if (url.includes('localhost:4000')) {
    return url.replace('http://localhost:4000', 'https://portfolio-j9s6.onrender.com')
  }
  
  // Fix old backend URLs
  if (url.includes('portfolio-g2wj.onrender.com')) {
    return url.replace('https://portfolio-g2wj.onrender.com', 'https://portfolio-j9s6.onrender.com')
  }
  
  // Fix old backend URLs
  if (url.includes('portfolio-backend-4h8x.onrender.com')) {
    return url.replace('https://portfolio-backend-4h8x.onrender.com', 'https://portfolio-j9s6.onrender.com')
  }
  
  return url
}

// Certificate API functions
export async function fetchCertificates() {
  return apiFetch('/api/certificates')
}

export async function fetchAllCertificates() {
  return apiFetch('/api/admin/certificates')
}

export async function createCertificate(certificate) {
  return apiFetch('/api/admin/certificates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(certificate)
  })
}

export async function updateCertificate(id, certificate) {
  return apiFetch(`/api/admin/certificates/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(certificate)
  })
}

export async function deleteCertificate(id) {
  return apiFetch(`/api/admin/certificates/${id}`, {
    method: 'DELETE'
  })
}

// Resume API functions
export async function fetchResume() {
  return apiFetch('/api/resume')
}

export async function fetchAllResumes() {
  return apiFetch('/api/admin/resumes')
}

export async function createResume(resume) {
  return apiFetch('/api/admin/resumes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resume)
  })
}

export async function updateResume(id, resume) {
  return apiFetch(`/api/admin/resumes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resume)
  })
}

export async function deleteResume(id) {
  return apiFetch(`/api/admin/resumes/${id}`, {
    method: 'DELETE'
  })
}

// Contact API functions
export async function fetchContact() {
  return apiFetch('/api/contact')
}

export async function fetchAllContacts() {
  return apiFetch('/api/admin/contacts')
}

export async function createContact(contact) {
  return apiFetch('/api/admin/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact)
  })
}

export async function updateContact(id, contact) {
  return apiFetch(`/api/admin/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact)
  })
}

export async function deleteContact(id) {
  return apiFetch(`/api/admin/contacts/${id}`, {
    method: 'DELETE'
  })
}

// Message API functions
export async function sendMessage(message) {
  return apiFetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  })
}

export async function fetchAllMessages() {
  return apiFetch('/api/admin/messages')
}

export async function updateMessage(id, message) {
  return apiFetch(`/api/admin/messages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  })
}

export async function deleteMessage(id) {
  return apiFetch(`/api/admin/messages/${id}`, {
    method: 'DELETE'
  })
}

// Skills API functions
export async function fetchSkills() {
  return apiFetch('/api/skills')
}

export async function fetchAllSkills() {
  return apiFetch('/api/admin/skills')
}

export async function createSkill(skill) {
  return apiFetch('/api/admin/skills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skill)
  })
}

export async function updateSkill(id, skill) {
  return apiFetch(`/api/admin/skills/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skill)
  })
}

export async function deleteSkill(id) {
  return apiFetch(`/api/admin/skills/${id}`, {
    method: 'DELETE'
  })
}

export async function reorderSkill(id, targetOrder) {
  return apiFetch(`/api/admin/skills/${id}/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetOrder })
  })
}

