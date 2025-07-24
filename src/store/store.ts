import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from  "./authSlice"
import usersSliceReducer from  "./usersSlice"
export const store = configureStore({
    reducer : {
        auth: authSliceReducer,
        users: usersSliceReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 