import { createContext, useState, useContext } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    setUser(res.data)
    localStorage.setItem('user', JSON.stringify(res.data))
    return res.data
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    setUser(res.data)
    localStorage.setItem('user', JSON.stringify(res.data))
    return res.data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)