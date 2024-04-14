import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sessions: {
        userId: "",
        gender: "",
        selectedRoomId: "",
    }
};

const sessionSlice = createSlice({
    name: "session",
    initialState: initialState,
    reducers: {
        setUserId: (state, action) => {
            state.sessions.userId = action.payload;
        },
        setGender: (state, action) => {
            state.sessions.gender = action.payload;
        },
        setSelectedRoomId: (state, action) => {
            state.sessions.selectedRoomId = action.payload;
        },

    }
})

export const { setUserId, setGender, setSelectedRoomId } = sessionSlice.actions;
export default sessionSlice.reducer;
