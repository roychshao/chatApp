import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import chatroomReducer from "./slice/chatroomSlice";
import sessionReducer from "./slice/sessionSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        chatroom: chatroomReducer,
        session: sessionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>
