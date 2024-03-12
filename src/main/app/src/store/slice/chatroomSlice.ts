import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { chatroom } from "../../types/chatroom";


const initialState = {
    roomProfile: {
        rooms: [
            {
                roomId: "",
                roomName: "",
                users: [],
                messages: []
            }
        ]
    }
};

export const getUserChatrooms: any = createAsyncThunk("chatroom/getUserChatrooms", async (userId: string) => {
    const res = await axios.get(`http://localhost:8080/api/chatroom/user/${userId}`, {
        withCredentials: true
    });
    return res.data;
});

export const getChatroomById: any = createAsyncThunk("chatroom/getChatroomById", async (roomId: string) => {
    const res = await axios.get(`http://localhost:8080/api/chatroom/${roomId}`, {
        withCredentials: true
    });
    return res.data;
});

export const createChatroom: any = createAsyncThunk("chatroom/createChatroom", async (chatroomData: chatroom) => {
    const res = await axios.post("http://localhost:8080/api/chatroom/create", {
        roomId: chatroomData.roomId,
        roomName: chatroomData.roomName,
        users: chatroomData.users,
        messages: chatroomData.messages,
    },
    { withCredentials: true });
    return res.data;
});

export const updateChatroom: any = createAsyncThunk("chatroom/updateChatroom", async (chatroomData: chatroom) => {
    const res = await axios.post("http://localhost:8080/api/chatroom/update", {
        roomId: chatroomData.roomId,
        roomName: chatroomData.roomName,
        users: chatroomData.users,
        messages: chatroomData.messages,
    },
    { withCredentials: true });
    return res.data;
});

export const deleteChatroom: any = createAsyncThunk("chatroom/deleteChatroom", async (chatroomData: chatroom) => {
    const res = await axios.post("http://localhost:8080/api/chatroom/delete", {
        roomId: chatroomData.roomId,
        users: chatroomData.users,
        messages: chatroomData.messages,
    },
    { withCredentials: true });
    return res.data;
});

const chatroomSlice = createSlice({
    name: "chatroom",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createChatroom.fulfilled, () => {})
            .addCase(updateChatroom.fulfilled, () => {})
            .addCase(deleteChatroom.fulfilled, () => {})
            .addCase(getUserChatrooms.fulfilled, (state:any, action:any) => {
                state.roomProfile.rooms = action.payload;
            })
    }
});

export default chatroomSlice.reducer;
