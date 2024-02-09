import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    profile: {
        id: "",
        name: "",
        age: 0,
        gender: "",
        email: "",
    },
};

export const register:any = createAsyncThunk("user/register", async (userData: any) => {
    const { name, age, gender, email, password } = userData;
    const res = await axios.post("localhost:8080/api/user/register", {
        name: name,
        age: age,
        gender: gender,
        email: email,
        password: password,
    },
    { withCredentials: true });
    return res.data;
});

export const signin:any = createAsyncThunk("user/signin", async (userData: any) => {
    const { email, password } = userData;
    const res = await axios.post("localhost:8080/api/user/signin", {
        email: email,
        password: password,
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
                id: action.payload.id,
            }
        })
    },
});


export default userSlice.reducer;
