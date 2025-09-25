import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

function AdminDashboard({ open, onClose }) {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    if (!open) return
    const fetchSummary = async () => {
      const data = await apiFetch('/api/admin/summary')
      setSummary(data)
    }
    fetchSummary()
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[92vw] max-w-2xl rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Admin Dashboard</h3>
          <button onClick={onClose} className="rounded-full w-9 h-9 bg-gray-100 hover:bg-gray-200">✕</button>
        </div>
        {!summary ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <div className="text-3xl font-bold text-blue-700">{summary.projectsCount ?? 0}</div>
              <div className="text-sm text-blue-700/80">Projects</div>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center">
              <div className="text-3xl font-bold text-purple-700">{summary.messagesCount ?? 0}</div>
              <div className="text-sm text-purple-700/80">Messages</div>
            </div>
            <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-center">
              <div className="text-3xl font-bold text-green-700">{summary.certificatesCount ?? 0}</div>
              <div className="text-sm text-green-700/80">Certificates</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard


