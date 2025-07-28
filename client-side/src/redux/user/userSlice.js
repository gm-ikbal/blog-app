import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        updateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signOutStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signOutSuccess: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        signOutFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const { signInStart, signInSuccess, signInFailure, updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutStart, signOutSuccess, signOutFailure } = userSlice.actions
export default userSlice.reducer;