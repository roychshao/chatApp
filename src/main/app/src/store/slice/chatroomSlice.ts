import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { chatroom } from "../../types/chatroom";
import { message } from "../../types/message";
import { user } from "../../types/user";

const initialState = {
    roomProfile: {
        rooms: [
            {
                roomId: "",
                roomName: "",
                users: [] as user[],
                messages: [] as message[],
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

interface AppendMessagePayload {
 roomId: string;
 body: message;
}

const chatroomSlice = createSlice({
    name: "chatroom",
    initialState: initialState,
    reducers: {
      appendMessage: (state:any, action:PayloadAction<AppendMessagePayload>) => {
        const { roomId, body } = action.payload;
        const currentRoomIdx = state.roomProfile.rooms.findIndex((room:chatroom) => {
          return room.roomId === roomId;
        })
        const originMessages = state.roomProfile.rooms[currentRoomIdx].messages;
        state.roomProfile.rooms[currentRoomIdx].messages = [...originMessages, body];
      },
      clearChatroomData: (state:any) => {
        state.roomProfile = initialState.roomProfile;
      }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createChatroom.fulfilled, () => {})
            .addCase(updateChatroom.fulfilled, () => {})
            .addCase(deleteChatroom.fulfilled, () => {})
            .addCase(getUserChatrooms.fulfilled, (state:any, action:any) => {
                state.roomProfile.rooms = action.payload;
            })
            .addCase(getChatroomById.fulfilled, (state:any, action:any) => {
               const currentRoomIdx = state.roomProfile.rooms.findIndex((room: chatroom) => room.roomId === action.payload.roomId);
               state.roomProfile.rooms[currentRoomIdx] = action.payload;
            })
    }
});

export const { appendMessage, clearChatroomData } = chatroomSlice.actions;
export default chatroomSlice.reducer;
