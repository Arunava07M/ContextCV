import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ContextLogo from '../components/ContextLogo'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed, try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] font-sans">
      <div className="w-full max-w-md">
        
        {/* Logo link back to landing page */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 cursor-pointer text-[#222222] hover:opacity-80 transition-opacity">
            <ContextLogo size={32} />
            <span className="text-3xl font-bold tracking-tighter">ContextCV</span>
          </Link>
        </div>

        <div className="bg-white border border-[#eeeeee] rounded-sm p-8">
          <h1 className="text-xl font-medium text-[#444444] mb-1">Signup</h1>
          <p className="text-sm text-[#9b9b9b] mb-8">Create your career vault</p>

          {error && (
            <div className="bg-[#fff4f4] text-[#d93025] border border-[#fce8e6] text-sm p-3 rounded-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-sm text-[#666666] mb-1 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-[#eeeeee] rounded-sm focus:outline-none focus:border-[#387ed1] text-sm text-[#444444] bg-[#fcfcfc] transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-[#666666] mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-[#eeeeee] rounded-sm focus:outline-none focus:border-[#387ed1] text-sm text-[#444444] bg-[#fcfcfc] transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-[#666666] mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-[#eeeeee] rounded-sm focus:outline-none focus:border-[#387ed1] text-sm text-[#444444] bg-[#fcfcfc] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[#387ed1] text-white py-2.5 rounded-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 text-sm"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <p className="text-sm text-[#9b9b9b] mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-[#387ed1] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup