import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import chatroomReducer from "./slice/chatroomSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        chatroom: chatroomReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>
