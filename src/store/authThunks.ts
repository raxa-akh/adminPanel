import { createAsyncThunk } from '@reduxjs/toolkit'
import api from "@/api/api"

interface User{
    sub: string;
    email: string;
}

export const fetchMe = createAsyncThunk<User>(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<User>('/v1/auth/me')
      return data
    } catch (e) {
      return rejectWithValue(`Error: ${e}`)
    }
  }
)

export const login = createAsyncThunk<User, { email: string; password: string }>(
  'auth/login',
  async (creds, { rejectWithValue }) => {
    try {
      const { data } = await api.post<User>('/v1/auth/login', creds)
      return data
    } catch (e) {
      return rejectWithValue(`Неправильные логин/пароль : ${e}`)
    }
  }
)

export const logout = createAsyncThunk<void>(
  'auth/logout',
  async () => {
    await api.post('/v1/auth/logout')
  }
)
