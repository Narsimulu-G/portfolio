import { useState, useEffect } from 'react'
import { fetchAllCertificates, createCertificate, updateCertificate, deleteCertificate } from '../../lib/api'

function CertificateForm({ certificate, onSave, onCancel, isOpen }) {
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    image: '',
    isActive: true,
    order: 0
  })
  const [isDragOver, setIsDragOver] = useState(false)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    if (certificate) {
      setFormData({
        title: certificate.title || '',
        issuer: certificate.issuer || '',
        date: certificate.date || '',
        image: certificate.image || '',
        isActive: certificate.isActive !== undefined ? certificate.isActive : true,
        order: certificate.order || 0
      })
      setImagePreview(certificate.image || '')
    } else {
      setFormData({
        title: '',
        issuer: '',
        date: '',
        image: '',
        isActive: true,
        order: 0
      })
      setImagePreview('')
    }
  }, [certificate])

  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const uploadToCloudinary = async (file) => {
    // Check file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Please select an image smaller than 5MB.')
    }
    
    // Compress the image before converting to base64
    try {
      const compressedImage = await compressImage(file, 800, 0.7)
      return compressedImage
    } catch (error) {
      console.error('Image compression failed:', error)
      // Fallback to original file if compression fails
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(file)
      })
    }
    
    // Uncomment below for Cloudinary upload (requires proper setup)
    /*
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ml_default')
    
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dovmtmu7y/image/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Cloudinary upload error:', errorData)
        throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`)
      }
      
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      // Fallback to base64
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(file)
      })
    }
    */
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Show preview immediately
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
      
      // Upload to Cloudinary
      try {
        const imageUrl = await uploadToCloudinary(file)
        setFormData({ ...formData, image: imageUrl })
      } catch (error) {
        console.error('Image upload failed:', error)
        alert(`Image upload failed: ${error.message}. Please try again or use a URL instead.`)
        // Reset the file input
        e.target.value = ''
        setImagePreview('')
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        // Show preview immediately
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target.result)
        }
        reader.readAsDataURL(file)
        
        // Upload to Cloudinary
        try {
          const imageUrl = await uploadToCloudinary(file)
          setFormData({ ...formData, image: imageUrl })
        } catch (error) {
          console.error('Image upload failed:', error)
          alert(`Image upload failed: ${error.message}. Please try again or use a URL instead.`)
          setImagePreview('')
        }
      } else {
        alert('Please select an image file')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Please enter a certificate title')
      return
    }
    if (!formData.issuer.trim()) {
      alert('Please enter an issuer')
      return
    }
    if (!formData.date.trim()) {
      alert('Please select a date')
      return
    }
    if (!formData.image.trim()) {
      alert('Please upload an image or enter an image URL')
      return
    }
    
    try {
      if (certificate && (certificate._id || certificate.id)) {
        const id = certificate._id || certificate.id
        console.log('Updating certificate with ID:', id)
        await updateCertificate(id, formData)
      } else {
        console.log('Creating new certificate')
        await createCertificate(formData)
      }
      onSave()
    } catch (error) {
      console.error('Error saving certificate:', error)
      console.error('Certificate object:', certificate)
      alert('Error saving certificate: ' + error.message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {certificate ? 'Edit Certificate' : 'Add New Certificate'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., React Developer Certification"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Issuer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Meta, Coursera, Udemy"
                  />
                </div>
                
                 <div className="space-y-2">
                   <label className="block text-sm font-medium text-gray-700">
                     Date <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="date"
                     required
                     value={formData.date}
                     onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                   />
                 </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

             {/* Media Section */}
             <div className="space-y-6">
               <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                 Certificate Image
               </h3>
               
               <div className="space-y-4">
                 {/* Drag and Drop Area */}
                 <div
                   className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                     isDragOver
                       ? 'border-blue-500 bg-blue-50'
                       : 'border-gray-300 hover:border-gray-400'
                   }`}
                   onDragOver={handleDragOver}
                   onDragLeave={handleDragLeave}
                   onDrop={handleDrop}
                 >
                   <input
                     type="file"
                     accept="image/*"
                     onChange={handleImageChange}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   />
                   
                   {imagePreview ? (
                     <div className="space-y-4">
                       <img
                         src={imagePreview}
                         alt="Certificate preview"
                         className="mx-auto max-w-xs max-h-48 object-contain rounded-lg border border-gray-200"
                       />
                       <div className="text-sm text-gray-600">
                         Click or drag to change image
                       </div>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                         <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                         </svg>
                       </div>
                       <div>
                         <p className="text-lg font-medium text-gray-900">Upload Certificate Image</p>
                         <p className="text-sm text-gray-600">
                           Drag and drop an image here, or click to select
                         </p>
                       </div>
                     </div>
                   )}
                 </div>

                 {/* Alternative URL Input */}
                 <div className="space-y-2">
                   <label className="block text-sm font-medium text-gray-700">
                     Or enter image URL
                   </label>
                   <input
                     type="url"
                     value={formData.image}
                     onChange={(e) => {
                       setFormData({ ...formData, image: e.target.value })
                       setImagePreview(e.target.value)
                     }}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                     placeholder="https://example.com/certificate-image.jpg"
                   />
                 </div>
               </div>
             </div>

            {/* Settings Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Settings
              </h3>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (show on website)
                </label>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {certificate ? 'Update Certificate' : 'Create Certificate'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function CertificateManagement() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState(null)

  const loadCertificates = async () => {
    try {
      setLoading(true)
      const data = await fetchAllCertificates()
      console.log('Fetched certificates:', data)
      setCertificates(data)
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCertificates()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await deleteCertificate(id)
        await loadCertificates()
      } catch (error) {
        console.error('Error deleting certificate:', error)
        alert('Error deleting certificate: ' + error.message)
      }
    }
  }

  const handleEdit = (certificate) => {
    console.log('Editing certificate:', certificate)
    console.log('Certificate ID:', certificate._id)
    setEditingCertificate(certificate)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingCertificate(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingCertificate(null)
  }

  const handleFormSave = () => {
    setShowForm(false)
    setEditingCertificate(null)
    loadCertificates()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading certificates...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Certificate Management</h2>
          <p className="text-gray-600 mt-2 text-lg">Manage your professional certificates and achievements</p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3"></div>
        </div>
        <button
          onClick={handleAdd}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Certificate
        </button>
      </div>

      {/* Certificates Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Issuer
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 sm:px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
                      <p className="text-gray-500 mb-4">Get started by adding your first certificate</p>
                      <button
                        onClick={handleAdd}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Certificate
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                certificates.map((certificate) => (
                  <tr key={certificate._id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 transition-all duration-300 group">
                    <td className="px-4 sm:px-6 py-5 whitespace-nowrap">
                      <div className="flex-shrink-0">
                        <img
                          src={certificate.image}
                          alt={certificate.title}
                          className="h-16 w-20 object-cover rounded-xl border-2 border-gray-200 group-hover:border-blue-300 transition-colors duration-300 shadow-sm group-hover:shadow-md"
                        />
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-5">
                      <div className="text-sm font-bold text-gray-900 max-w-xs truncate group-hover:text-blue-700 transition-colors duration-300">
                        {certificate.title}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{certificate.issuer}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{certificate.date}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{certificate.order}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 ${
                          certificate.isActive
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {certificate.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(certificate)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 hover:text-blue-800 transition-all duration-300 font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(certificate._id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 hover:text-red-800 transition-all duration-300 font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CertificateForm
        certificate={editingCertificate}
        onSave={handleFormSave}
        onCancel={handleFormClose}
        isOpen={showForm}
      />
    </div>
  )
}

export default CertificateManagement
