import { createContext, useContext, useState } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('finsync_user')
      if (stored && stored !== 'undefined') {
        const parsed = JSON.parse(stored)
        if (parsed && !parsed.role) {
          parsed.role = 'CUSTOMER'
        }
        return parsed
      }
      return null
    } catch (e) {
      return null
    }
  })

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    persist(data)
    return data
  }

  const register = async (fullNameOrObj, email, password, phoneNumber, role = 'CUSTOMER', empNo = '') => {
    let payload = {}
    if (typeof fullNameOrObj === 'object' && fullNameOrObj !== null) {
      payload = fullNameOrObj
    } else {
      payload = { fullName: fullNameOrObj, email, password, phoneNumber, role, empNo }
    }
    const { data } = await api.post('/auth/register', payload)
    return data
  }

  const switchRole = (newRole) => {
    if (!user) return
    const updatedUser = { ...user, role: newRole }
    localStorage.setItem('finsync_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
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
    <AuthContext.Provider value={{ user, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
