import { createSlice } from "@reduxjs/toolkit";

interface flightState {
    draft: string | null
}

const initialState: flightState = {
    draft: null
}

const flightSlice = createSlice({
    name: 'cargoFilter',
    initialState,
    reducers: {
        setDraft: (state, { payload }) => {
            state.draft = payload
        },
    },
});

export default flightSlice.reducer;

export const { setDraft } = flightSlice.actions;