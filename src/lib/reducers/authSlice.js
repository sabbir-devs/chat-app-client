import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Navigate } from "react-router-dom";
import { baseUrl } from "../../utils/constantData/constantData";

const user = JSON.parse(localStorage.getItem('user'))


export const signupUser = createAsyncThunk('signupuser', async (body) => {
    const res = await fetch(`${baseUrl}/user/signup`, {
        method: "POST",
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(body)
    });
    return await res.json();
})
export const loginUser = createAsyncThunk('loginuser', async (body) => {
    const res = await fetch(`${baseUrl}/user/login`, {
        method: "POST",
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(body)
    });
    return await res.json();
})


const authSlice = createSlice({
    name: "user",
    initialState: {
        user: user ? user : null,
        isLoading: false,
        error: null
    },
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
          },
    },
    extraReducers: {
        [signupUser.pending]: (state, action) => {
            state.isLoading = true
        },
        [signupUser.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.error = null;
        },
        [signupUser.rejected]: (state, action) => {
            state.isisLoading = false;
            state.error = action.error.message;
        },
        [loginUser.pending]: (state, action) => {
            state.isLoading = true
        },
        [loginUser.fulfilled]: (state, action) => {
            state.isLoading = false;
            const userer = state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(userer.data[0]))
            localStorage.setItem("accessToken", action.payload.access_token);
            state.error = null;
        },
        [loginUser.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        }
    }
})

export const { reset } = authSlice.actions;
export default authSlice.reducer;