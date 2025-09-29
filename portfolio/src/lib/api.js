// Basic API base resolver: prefer Vite env, else production backend
export const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
  || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:4000' : 'https://portfolio-g2wj.onrender.com')

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(options.headers || {})
  
  // Ensure proper headers for CORS
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')
  
  // Use cookie-based auth; always send credentials
  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include',
    mode: 'cors',
    cache: 'no-cache'
  }
  
  const res = await fetch(url, fetchOptions)
  const data = await res.json().catch(() => ({}))
  
  if (!res.ok) {
    const message = (data && (data.error || data.message)) || `Request failed: ${res.status}`
    throw new Error(message)
  }
  return data
}

// Helper function to fix image URLs
export function fixImageUrl(url) {
  if (!url) return url
  if (url.startsWith('http://localhost:4000')) {
    return url.replace('http://localhost:4000', 'https://portfolio-g2wj.onrender.com')
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

