import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Login() {
    const auth = useAuth()
    const location = useLocation()

    return !auth.isAuthenticated ? (
        <div>Login</div>
    ) : (
        <Navigate to="/" state={{ from: location }} />
    )
}