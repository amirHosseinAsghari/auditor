import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthState } from '@/store/features/auth/authSlice'

export const useAuth = () => {
    const authState = useSelector(selectAuthState)

    return useMemo(() => (authState), [authState])
}
