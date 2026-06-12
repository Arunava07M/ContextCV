import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ProfileWorkspace from './pages/ProfileWorkspace'
import VaultWorkspace from './pages/VaultWorkspace'
import Generate from './pages/Generate' 
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public Storefront */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />

      {/* Auth Handlers */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      
      {/* Protected SaaS Routes */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <ProfileWorkspace /> : <Navigate to="/login" />} />
      <Route path="/vault" element={user ? <VaultWorkspace /> : <Navigate to="/login" />} />
      <Route path="/generate" element={user ? <Generate /> : <Navigate to="/login" />} />
      
      {/* Catch-all global fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App