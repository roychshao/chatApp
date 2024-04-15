import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import chatroomReducer from "./slice/chatroomSlice";
import sessionReducer from "./slice/sessionSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session"

const persistConfig = {
    key: 'session',
    storage: storage,
}

const persistedSessionReducer = persistReducer(persistConfig, sessionReducer);

const rootReducer = {
    user: userReducer,
    chatroom: chatroomReducer,
    session: persistedSessionReducer,
}

export const store = configureStore({
    reducer: rootReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
