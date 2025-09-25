import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export default function SkillManagement() {
  const { isAuthenticated } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    show: false,
    mode: 'create',
    data: { 
      name: '', 
      category: 'Technical', 
      level: 'Intermediate', 
      icon: '', 
      description: '',
      isFeatured: false,
      order: 0
    }
  });


  useEffect(() => {
    if (isAuthenticated) {
      fetchSkills();
    }
  }, [isAuthenticated]);

  // Simple skills display - no filtering or sorting
  const displaySkills = skills;

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/admin/skills');
      setSkills(data);
    } catch (err) {
      setError('Failed to fetch skills.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setForm({
      show: true,
      mode: 'create',
      data: { 
        name: '', 
        category: 'Technical', 
        level: 'Intermediate', 
        icon: '', 
        description: '',
        isFeatured: false,
        order: 0
      }
    });
  };

  const handleEdit = (skill) => {
    setForm({
      show: true,
      mode: 'edit',
      data: { ...skill }
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await apiFetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
      fetchSkills();
    } catch (err) {
      setError('Failed to delete skill.');
      console.error(err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      if (form.mode === 'create') {
        await apiFetch('/api/admin/skills', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.data) 
        });
      } else {
        await apiFetch(`/api/admin/skills/${form.data._id}`, { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.data) 
        });
      }
      setForm({ show: false, mode: 'create', data: {} });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchSkills();
    } catch (err) {
      setError('Failed to save skill.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const clearFilters = () => {
    // Since we don't have filters in this simplified version, just refresh the skills
    fetchSkills();
  };





  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Technical': return 'bg-blue-100 text-blue-800';
      case 'Programming Languages': return 'bg-purple-100 text-purple-800';
      case 'Frameworks': return 'bg-indigo-100 text-indigo-800';
      case 'Tools': return 'bg-pink-100 text-pink-800';
      case 'Soft Skills': return 'bg-green-100 text-green-800';
      case 'Certifications': return 'bg-yellow-100 text-yellow-800';
      case 'Languages': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">Please log in to manage skills</div>
          <div className="text-gray-400 text-sm">Authentication required</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Skill Management</h2>
        <p className="text-gray-600 mt-2 text-lg">Manage your skills and expertise</p>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3"></div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Skill saved successfully.</span>
        </div>
      )}

      {/* Add Skill Button */}
      <div className="mb-6">
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Skill
          </div>
        </button>
      </div>



      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displaySkills.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {skills.length === 0 ? 'No skills yet' : 'No skills match your filters'}
            </h3>
            <p className="text-gray-500 mb-4">
              {skills.length === 0 
                ? 'Get started by adding your first skill' 
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {skills.length === 0 ? (
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Skill
              </button>
            ) : (
              <button
                onClick={clearFilters}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          displaySkills.map((skill) => (
            <div 
              key={skill._id} 
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    
                    {skill.icon && (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg">
                        {skill.icon}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {skill.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(skill.category)}`}>
                          {skill.category}
                        </span>
                        {skill.isFeatured && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {skill.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{skill.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getLevelColor(skill.level)}`}>
                    {skill.level}
                  </span>
                  <div className="text-xs text-gray-500">
                    {new Date(skill.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Skill Modal */}
      {form.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {form.mode === 'create' ? 'Add New Skill' : 'Edit Skill'}
                </h2>
                <button
                  onClick={() => setForm({ show: false, mode: 'create', data: {} })}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.data.name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g., React, JavaScript, Project Management"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={form.data.category}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    >
                      <option value="Technical">Technical</option>
                      <option value="Programming Languages">Programming Languages</option>
                      <option value="Frameworks">Frameworks</option>
                      <option value="Tools">Tools</option>
                      <option value="Soft Skills">Soft Skills</option>
                      <option value="Certifications">Certifications</option>
                      <option value="Languages">Languages</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency Level *</label>
                    <select
                      name="level"
                      value={form.data.level}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Emoji)</label>
                    <input
                      type="text"
                      name="icon"
                      value={form.data.icon}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g., ⚛️, 💻, 🎨"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={form.data.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Brief description of your experience with this skill..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.data.isFeatured}
                    onChange={handleFormChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-3 block text-sm text-gray-900">
                    Featured Skill (will be highlighted)
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setForm({ show: false, mode: 'create', data: {} })}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : (form.mode === 'create' ? 'Add Skill' : 'Update Skill')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
