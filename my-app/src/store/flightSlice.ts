import { createSlice } from "@reduxjs/toolkit";
import { IFlight, ICargo } from "../models";

function formatDate(date: Date | null): string {
    if (!date) {
        return ""
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes} ${day}.${month}.${year}`;
}

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
            state.flights = payload.map((flight: IFlight) => ({
                ...flight,
                creation_date: formatDate(new Date(flight.creation_date)),
                formation_date: flight.formation_date ? formatDate(new Date(flight.formation_date)) : null,
                completion_date: flight.completion_date ? formatDate(new Date(flight.completion_date)) : null,
            }));
        },
        setFlight: (state, { payload }) => {
            state.flight = {
                ...payload,
                creation_date: formatDate(new Date(payload.creation_date)),
                formation_date: payload.formation_date ? formatDate(new Date(payload.formation_date)) : null,
                completion_date: payload.completion_date ? formatDate(new Date(payload.completion_date)) : null,
            }
        },
        setComposition: (state, { payload }) => {
            state.flightComposition = payload
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