import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import ContextLogo from '../components/ContextLogo'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profileExists, setProfileExists] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await api.get('/profile')
        if (res.data) setProfileExists(true)
      } catch (err) {
        setProfileExists(false)
      } finally {
        setLoading(false)
      }
    }
    checkProfile()
  }, [])

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-800 font-sans">
      {/* Top Navbar with Logo */}
      <nav className="bg-white border-b border-gray-200 px-8 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <ContextLogo size={24} />
          <span className="text-lg font-bold tracking-tighter text-gray-900">ContextCV</span>
        </Link>
        <div className="flex items-center">
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900">
            Welcome, {user?.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your career assets and generate resumes.</p>
        </div>

        {loading ? (
          <div className="text-sm text-gray-400">Loading dashboard...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Core Profile Card */}
            <div className="bg-white border border-gray-200 rounded-sm p-6 relative flex flex-col h-48">
              <div>
                <h2 className="text-lg font-medium text-gray-800">Core Profile</h2>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {profileExists 
                    ? "Your baseline data is indexed. Contains your summary, skills by domain, experience, and education." 
                    : "You haven't set up your core profile yet. This is required before generating resumes."}
                </p>
              </div>
              
              <div className="mt-auto flex justify-end">
                <Link 
                  to="/profile"
                  className="bg-[#387ed1] hover:bg-blue-700 text-white px-4 py-1.5 rounded-sm text-xs font-medium transition-colors"
                >
                  {profileExists ? "Edit Profile" : "Create Profile"}
                </Link>
              </div>
            </div>

            {/* Career Vault Card */}
            <div className="bg-white border border-gray-200 rounded-sm p-6 relative flex flex-col h-48">
              <div>
                <h2 className="text-lg font-medium text-gray-800">Career Vault</h2>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  The master database of all your past projects, experiences, and hackathons.
                </p>
              </div>
              <div className="mt-auto flex justify-end">
                <Link 
                  to="/vault"
                  className="border border-[#387ed1] text-[#387ed1] hover:bg-blue-50 px-4 py-1.5 rounded-sm text-xs font-medium transition-colors"
                >
                  Open Vault
                </Link>
              </div>
            </div>

            {/* Resume Generator Card */}
            <div className="bg-[#f0f6ff] border border-[#387ed1] rounded-sm p-6 relative flex flex-col h-48">
              <div>
                <h2 className="text-lg font-medium text-gray-800">Resume Generator</h2>
                <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                  Paste a Job Description. Our RAG engine will pull the best data from your Vault and Profile.
                </p>
              </div>
              <div className="mt-auto flex justify-end">
                <Link 
                  to="/generate"
                  className="bg-[#387ed1] hover:bg-blue-700 text-white px-4 py-1.5 rounded-sm text-xs font-medium transition-colors shadow-sm"
                >
                  Start Generation
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard