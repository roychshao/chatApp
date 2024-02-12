// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { user } from './../../types/user';
// import { message } from './../../types/message';
// import axios from 'axios';
// import { chatroom } from "../../types/chatroom";

// const initialState = {
//     roomProfile: {
//         roomId: "",
//         users: [],
//         messages: []
//     }
// };

// export const createChatroom: any = createAsyncThunk("chatroom/createChatroom", async (chatroomData: chatroom) => {
//     const res = await axios.post("http://localhost:8080/api/chatroom/create", {
//         roomId: chatroomData.roomId,
//         users: chatroomData.users,
//         messages: chatroomData.messages,
//     },
//     { withCredentials: true });
//     return res.data;
// });

// export const updateChatroom: any = createAsyncThunk("chatroom/updateChatroom", async (chatroomData: chatroom) => {
//     const res = await axios.post("http://localhost:8080/api/chatroom/update", {
//         roomId: chatroomData.roomId,
//         users: chatroomData.users,
//         messages: chatroomData.messages,
//     },
//     { withCredentials: true });
//     return res.data;
// });
