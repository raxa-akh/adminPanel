import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './store/authHook'
import { fetchMe } from './store/authThunks'
import { ProtectedRoute } from './routes/ProtectedRoute'
import AppLayout from './components/AppLayout'
import LoginPage from './pages/LoginPage'
import UsersList from './pages/UserList'
import UserFormPageRHF from './pages/UserFromPageReact'
import UserFormPageFormik from './pages/UserFromPageFormik'
import "./App.css"
export default function App() {
  const dispatch = useAppDispatch()
  const { status } = useAppSelector(s => s.auth)

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  if (status === 'loading') {
    return <div style={{textAlign:'center',marginTop:100}}>Загрузка…</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/users" replace />} />
            <Route path="users" element={<UsersList />} />
            <Route path="users/newReact" element={<UserFormPageRHF />} />
            <Route path="users/newFormik" element={<UserFormPageFormik />} />
            <Route path="users/:id/edit" element={<UserFormPageRHF />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
