import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api/api'
import { User, CreateUserDto, UpdateUserArgs } from '@/types/types'

export const fetchUsers = createAsyncThunk<User[], void>(
  'users/fetchUsers',
  async () => {
    const { data } = await api.get<User[]>('/v1/users')
    return data
  }
)
export const deleteUser = createAsyncThunk<string, string>(
  'users/deleteUser',
  async (id) => {
    await api.delete(`/v1/users/${id}`)
    return id
  }
)

export const createUser = createAsyncThunk<User, CreateUserDto>(
  'users/createUser',
  async (newUser) => {
    const { data } = await api.post<User>('/v1/users', newUser)
    return data
  }
)

export const updateUser = createAsyncThunk<User, UpdateUserArgs>(
  'users/updateUser',
  async ({ id, changes }) => {
    const { data } = await api.patch<User>(`/v1/users/${id}`, changes)
    return data
  }
)
