
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/authHook'

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, status } = useAppSelector(s => s.auth)
  const location = useLocation()

  if (status === 'loading') {
    return null
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  return <Outlet />
}
