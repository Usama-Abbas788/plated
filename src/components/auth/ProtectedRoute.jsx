import { Navigate, useLocation } from 'react-router-dom'
import { getHomePath } from '../../auth/permissions'
import useAuthStore from '../../stores/authStore'

const ProtectedRoute = ({ permission, children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (permission && !user?.permissions.includes(permission)) {
    return <Navigate to={getHomePath(user?.permissions)} replace />
  }

  return children
}

export default ProtectedRoute
