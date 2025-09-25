import { useState, useEffect } from 'react'
import { fetchAllMessages, updateMessage, deleteMessage } from '../../lib/api'

function MessageViewModal({ message, onClose, onMarkAsRead, onMarkAsUnread }) {
  if (!message) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Message Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Message Content */}
          <div className="space-y-6">
            {/* Sender Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{message.name}</h3>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  message.isRead 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {message.isRead ? 'Read' : 'Unread'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Email:</strong> <a href={`mailto:${message.email}`} className="text-blue-600 hover:underline">{message.email}</a></p>
                <p><strong>Date:</strong> {formatDate(message.createdAt)}</p>
              </div>
            </div>

            {/* Message Content */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Message</h4>
              <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-32">
                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              {message.isRead ? (
                <button
                  onClick={() => onMarkAsUnread(message._id)}
                  className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Mark as Unread
                </button>
              ) : (
                <button
                  onClick={() => onMarkAsRead(message._id)}
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageManagement() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'read', 'unread'

  const loadMessages = async () => {
    try {
      setLoading(true)
      const data = await fetchAllMessages()
      console.log('Fetched messages:', data)
      setMessages(data)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const handleMarkAsRead = async (id) => {
    try {
      await updateMessage(id, { isRead: true })
      setMessages(prev => prev.map(msg => 
        msg._id === id ? { ...msg, isRead: true } : msg
      ))
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(prev => ({ ...prev, isRead: true }))
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
      alert('Error updating message status')
    }
  }

  const handleMarkAsUnread = async (id) => {
    try {
      await updateMessage(id, { isRead: false })
      setMessages(prev => prev.map(msg => 
        msg._id === id ? { ...msg, isRead: false } : msg
      ))
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(prev => ({ ...prev, isRead: false }))
      }
    } catch (error) {
      console.error('Error marking message as unread:', error)
      alert('Error updating message status')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(id)
        setMessages(prev => prev.filter(msg => msg._id !== id))
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null)
        }
      } catch (error) {
        console.error('Error deleting message:', error)
        alert('Error deleting message')
      }
    }
  }

  const handleViewMessage = (message) => {
    setSelectedMessage(message)
    // Mark as read when viewing
    if (!message.isRead) {
      handleMarkAsRead(message._id)
    }
  }

  const filteredMessages = messages.filter(message => {
    if (filter === 'read') return message.isRead
    if (filter === 'unread') return !message.isRead
    return true
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMessagePreview = (message, maxLength = 100) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading messages...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Message Management</h2>
          <p className="text-gray-600 mt-2 text-lg">View and manage contact messages</p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3"></div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              filter === 'unread'
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-300'
            }`}
          >
            Unread ({messages.filter(m => !m.isRead).length})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              filter === 'read'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300'
            }`}
          >
            Read ({messages.filter(m => m.isRead).length})
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {filter === 'all' ? 'No messages yet' : `No ${filter} messages`}
            </h3>
            <p className="text-gray-500 text-lg">
              {filter === 'all' 
                ? 'Messages from the contact form will appear here'
                : `No ${filter} messages found`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200/50">
            {filteredMessages.map((message) => (
              <div
                key={message._id}
                className={`p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 transition-all duration-300 cursor-pointer group ${
                  !message.isRead ? 'bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-l-4 border-blue-400' : ''
                }`}
                onClick={() => handleViewMessage(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-300">
                        {message.name}
                      </h3>
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-300 ${
                        message.isRead 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                          : 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200 animate-pulse'
                      }`}>
                        {message.isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                      <a href={`mailto:${message.email}`} className="hover:text-blue-600 hover:underline transition-colors duration-300">
                        {message.email}
                      </a>
                    </p>
                    <p className="text-gray-700 mb-4 text-base leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                      {getMessagePreview(message.message)}
                    </p>
                    <p className="text-sm text-gray-500 font-medium group-hover:text-gray-700 transition-colors duration-300">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewMessage(message)
                      }}
                      className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-110"
                      title="View message"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(message._id)
                      }}
                      className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-110"
                      title="Delete message"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message View Modal */}
      <MessageViewModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onMarkAsRead={handleMarkAsRead}
        onMarkAsUnread={handleMarkAsUnread}
      />
    </div>
  )
}

export default MessageManagement

