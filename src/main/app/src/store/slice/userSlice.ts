import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { user } from './../../types/user';
import axios from "axios";

const initialState = {
    profile: {
        userId: "",
        name: "",
        age: 0,
        gender: "",
        email: "",
    },
};

export const register:any = createAsyncThunk("user/register", async (userData: user) => {
    const res = await axios.post("http://localhost:8080/api/user/register", {
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        email: userData.email,
        password: userData.password,
    },
    { withCredentials: true });
    return res.data;
});

export const signin:any = createAsyncThunk("user/signin", async (userData: user) => {
    const res = await axios.post("http://localhost:8080/api/user/signin", {
        email: userData.email,
        password: userData.password,
    },
    { withCredentials: true });
    return res.data;
});

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state:any, action:any) => {
                state.profile = action.payload;
            })
            .addCase(signin.fulfilled, (state:any, action:any) => {
                state.profile = {
                    ...state.profile,
                    userId: action.payload.userId,
                }
            })
    },
});


export default userSlice.reducer;
