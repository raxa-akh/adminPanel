import { createSlice } from '@reduxjs/toolkit'
import { fetchMe, login, logout } from './authThunks'
import type { UserAuth } from '@/types/types'

interface AuthState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  isAuthenticated: boolean
  user: UserAuth | null
}

const initialState: AuthState = {
  status: 'idle',
  isAuthenticated: false,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearCredentials(state) {
      state.isAuthenticated = false
      state.user = null
      state.status = 'idle'
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchMe.pending, (s) => {
      s.status = 'loading'
    })
    b.addCase(fetchMe.fulfilled, (s, { payload }) => {
      s.status = 'succeeded'
      s.isAuthenticated = true
      s.user = payload
    })
    b.addCase(fetchMe.rejected, (s) => {
      s.status = 'failed'
      s.isAuthenticated = false
      s.user = null
    })

    b.addCase(login.fulfilled, (s, { payload }) => {
      s.isAuthenticated = true
      s.user = payload
      s.status = 'succeeded'
    })
    b.addCase(login.rejected, (s) => {
      s.isAuthenticated = false
      s.user = null
      s.status = 'failed'
    })

    b.addCase(logout.fulfilled, (s) => {
      s.isAuthenticated = false
      s.user = null
      s.status = 'idle'
    })
  },
})

export const { clearCredentials } = authSlice.actions
export default authSlice.reducer
