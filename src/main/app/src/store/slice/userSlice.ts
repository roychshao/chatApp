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
  friends: [
    {
      userId: "",
      name: "",
      age: 0,
      gender: "",
      email: "",
    }
  ]
};

export const register:any = createAsyncThunk("user/register", async (userData: user) => {
  const res = await axios.post("http://localhost:8080/api/user/register", {
    userId: userData.userId,
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

export const getUserFriends:any = createAsyncThunk("user/getUserFriends", async (userId: string) => {
  const res = await axios.get(`http://localhost:8080/api/user/friend/${userId}`, {
    withCredentials: true
  });
  return res.data;
})

export const addUserFriend:any = createAsyncThunk("user/addUserFriends", async (meAndFriend: user[]) => {
  const res = await axios.post("http://localhost:8080/api/user/friend/add", meAndFriend,
    { withCredentials: true });
  return res.data;
})

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    clearUserData: (state:any) => {
      state.profile = initialState.profile;
      state.friends = initialState.friends;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state:any, action:any) => {
        state.profile = action.payload;
      })
      .addCase(signin.fulfilled, (state:any, action:any) => {
        state.profile = action.payload;
      })
      .addCase(getUserFriends.fulfilled, (state:any, action:any) => {
        state.friends = action.payload;
      })
      .addCase(addUserFriend.fulfilled, () => {})
  },
});

export const { clearUserData } = userSlice.actions;
export default userSlice.reducer;
