import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function PrivateOutlet() {
    //TODO perform initial isAuthenticated
    const auth = useAuth()
    const location = useLocation()

    return auth.isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} />
    )
}
