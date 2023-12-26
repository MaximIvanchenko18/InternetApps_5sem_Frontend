import { createSlice } from "@reduxjs/toolkit";

interface userState {
    login: string | null
}

const initialState: userState = {
    login: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLogin: (state, { payload }) => {
            state.login = payload
        },
        resetLogin: (state) => {
            state.login = null
        },
    },
});

export default userSlice.reducer;

export const { setLogin, resetLogin } = userSlice.actions;