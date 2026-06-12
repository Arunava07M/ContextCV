import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import ContextLogo from '../components/ContextLogo'

const VaultWorkspace = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    type: 'Project',
    techStack: '',
    dateOrDuration: '',
    bulletsText: ''
  })

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const res = await api.get('/vault')
      setEntries(res.data)
    } catch (err) {
      console.log('Error fetching vault entries')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const openForm = (entry = null) => {
    if (entry) {
      setEditingId(entry._id)
      setFormData({
        title: entry.title,
        type: entry.type,
        techStack: entry.techStack.join(', '),
        dateOrDuration: entry.dateOrDuration || '',
        bulletsText: entry.bullets.join('\n')
      })
    } else {
      setEditingId(null)
      setFormData({ title: '', type: 'Project', techStack: '', dateOrDuration: '', bulletsText: '' })
    }
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const bulletArray = formData.bulletsText
      .split('\n')
      .map(b => b.trim())
      .filter(b => b !== '')

    const payload = {
      title: formData.title,
      type: formData.type,
      techStack: formData.techStack,
      dateOrDuration: formData.dateOrDuration,
      bullets: bulletArray
    }

    try {
      if (editingId) {
        await api.put(`/vault/${editingId}`, payload)
      } else {
        await api.post('/vault', payload)
      }
      fetchEntries()
      closeForm()
    } catch (err) {
      alert('Failed to save entry. Check console.')
      console.log(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry permanently?')) return
    try {
      await api.delete(`/vault/${id}`)
      fetchEntries()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-800 font-sans pb-20">
      <nav className="bg-white border-b border-gray-200 px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-medium text-[#387ed1] hover:underline">
            &larr; Back to Dashboard
          </Link>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-2 cursor-default">
            <ContextLogo size={18} />
            <span className="text-md font-bold tracking-tight text-gray-800">Career Vault</span>
          </div>
        </div>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-8">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Career Vault</h1>
            <p className="text-xs text-gray-400 mt-1">Dump all your raw projects, experiences, and hackathons here.</p>
          </div>
          {!showForm && (
            <button 
              onClick={() => openForm()}
              className="bg-[#387ed1] hover:bg-blue-700 text-white px-4 py-2 rounded-sm text-xs font-medium transition-colors"
            >
              + Add New Entry
            </button>
          )}
        </div>

        {showForm ? (
          <div className="bg-white border border-gray-200 rounded-sm p-6 mb-8">
            <div className="flex justify-between mb-4">
              <h2 className="text-md font-medium text-gray-800">{editingId ? 'Edit Entry' : 'New Vault Entry'}</h2>
              <button onClick={closeForm} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Title (Project Name / Role)</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1]" required />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1] bg-white">
                    <option>Project</option>
                    <option>Work Experience</option>
                    <option>Hackathon</option>
                    <option>Internship</option>
                    <option>Open Source</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Tech Stack (comma separated)</label>
                  <input type="text" value={formData.techStack} onChange={(e) => setFormData({...formData, techStack: e.target.value})} placeholder="React, Node, MongoDB" className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1]" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Date / Duration</label>
                  <input type="text" value={formData.dateOrDuration} onChange={(e) => setFormData({...formData, dateOrDuration: e.target.value})} placeholder="e.g. Jan 2026 - Present" className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1]" />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Raw Bullets (Paste descriptions here. Each new line is a bullet point)</label>
                <textarea 
                  rows="6" 
                  value={formData.bulletsText} 
                  onChange={(e) => setFormData({...formData, bulletsText: e.target.value})} 
                  placeholder="- Built a full stack application...&#10;- Optimized database queries by 40%..."
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1] resize-none" 
                />
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="bg-[#387ed1] text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-blue-700 transition-colors">
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            {loading ? (
              <p className="text-sm text-gray-400">Loading vault...</p>
            ) : entries.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-sm bg-gray-50">
                <p className="text-sm text-gray-500">Your vault is empty.</p>
                <p className="text-xs text-gray-400 mt-1">Add your past work here so the AI can pull from it later.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map(entry => (
                  <div key={entry._id} className="bg-white border border-gray-200 rounded-sm p-5 hover:border-gray-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-md font-medium text-gray-800">{entry.title}</h3>
                        <div className="flex gap-3 text-xs text-gray-500 mt-1">
                          <span className="font-medium px-2 py-0.5 bg-gray-100 rounded-sm">{entry.type}</span>
                          {entry.dateOrDuration && <span>{entry.dateOrDuration}</span>}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => openForm(entry)} className="text-xs text-[#387ed1] hover:underline">Edit</button>
                        <button onClick={() => handleDelete(entry._id)} className="text-xs text-red-500 hover:underline">Delete</button>
                      </div>
                    </div>
                    
                    {entry.techStack.length > 0 && (
                      <p className="text-xs text-gray-500 mb-3 font-mono bg-gray-50 inline-block px-2 py-1 rounded-sm">
                        {entry.techStack.join(' • ')}
                      </p>
                    )}
                    
                    <ul className="list-disc pl-4 space-y-1">
                      {entry.bullets.map((bullet, i) => (
                        <li key={i} className="text-sm text-gray-600">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VaultWorkspace