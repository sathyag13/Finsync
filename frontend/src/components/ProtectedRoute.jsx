import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import AccessDenied from './AccessDenied.jsx'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  const userRole = (user.role || 'CUSTOMER').toUpperCase()
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <AccessDenied requiredRoles={allowedRoles} />
  }
  return children
}
