import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  fetchUsers,
  deleteUser,
  createUser,
  updateUser,
} from './usersThunks'

import { User } from "@/types/types"

interface UsersState {
  list: User[]
  loading: boolean
}

const initialState: UsersState = {
  list: [],
  loading: false,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchUsers.pending, (s) => { s.loading = true })
    b.addCase(fetchUsers.fulfilled, (s, a: PayloadAction<User[]>) => {
      s.list = a.payload
      s.loading = false
    })
    b.addCase(fetchUsers.rejected, (s) => { s.loading = false })

    b.addCase(deleteUser.fulfilled, (s, a: PayloadAction<string>) => {
      s.list = s.list.filter(u => u.id !== a.payload)
    })

    b.addCase(createUser.fulfilled, (s, a: PayloadAction<User>) => {
      s.list.push(a.payload)
    })

    b.addCase(updateUser.fulfilled, (s, a: PayloadAction<User>) => {
      s.list = s.list.map(u => u.id === a.payload.id ? a.payload : u)
    })
  },
})

export default usersSlice.reducer
