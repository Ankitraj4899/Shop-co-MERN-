import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation()
  const { user, isLoading } = useAuth()

  if (isLoading) return <main className="commerce-state">Checking authentication...</main>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />
  return children
}

export default ProtectedRoute