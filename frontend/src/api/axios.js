import axios from 'axios'

// Simple Axios instance for Spring Boot REST API backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
})

// Attach JWT Bearer authorization token to outgoing HTTP requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('finsync_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 Unauthorized globally (e.g. token expired or session invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('finsync_token')
      localStorage.removeItem('finsync_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
