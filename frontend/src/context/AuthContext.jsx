import { createContext, useContext, useState } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('finsync_user')
      return stored && stored !== 'undefined' ? JSON.parse(stored) : null
    } catch (e) {
      return null
    }
  })

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    persist(data)
    return data
  }

  const register = async (fullName, email, password, phoneNumber) => {
    const { data } = await api.post('/auth/register', { fullName, email, password, phoneNumber })
    persist(data)
    return data
  }

  const persist = (data) => {
    localStorage.setItem('finsync_token', data.token)
    localStorage.setItem('finsync_user', JSON.stringify(data))
    setUser(data)
  }

  const logout = () => {
    localStorage.removeItem('finsync_token')
    localStorage.removeItem('finsync_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
