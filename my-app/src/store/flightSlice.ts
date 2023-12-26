import { createSlice } from "@reduxjs/toolkit";
import { IFlight, ICargo } from "../models";

interface flightState {
    draft: string | null
    flights: IFlight[] | null
    flight: IFlight | null
    flightComposition: ICargo[]

    statusFilter: string
    formationDateStart: string | null
    formationDateEnd: string | null
}

const initialState: flightState = {
    draft: null,
    flights: null,
    flight: null,
    flightComposition: [],

    statusFilter: '',
    formationDateStart: null,
    formationDateEnd: null,
}

const flightSlice = createSlice({
    name: 'flight',
    initialState,
    reducers: {
        setDraft: (state, { payload }) => {
            state.draft = payload
        },
        setFlights: (state, { payload }) => {
            state.flights = payload
        },
        setFlight: (state, { payload }) => {
            state.flight = payload
        },
        setComposition: (state, { payload }) => {
            state.flight = payload
        },
        resetFlight: (state) => {
            state.flight = null
        },
        setStatusFilter: (state, { payload }) => {
            state.statusFilter = payload
        },
        setDateStart: (state, { payload }) => {
            state.formationDateStart = payload ? payload.toISOString() : null
        },
        setDateEnd: (state, { payload }) => {
            state.formationDateEnd = payload ? payload.toISOString() : null
        },
    },
});

export default flightSlice.reducer;

export const { setDraft, setFlights, setFlight, setComposition, resetFlight, setStatusFilter, setDateStart, setDateEnd } = flightSlice.actions;