import { createSlice } from "@reduxjs/toolkit";

interface searchState {
    searchText: string
    searchLowPrice: number
    searchHighPrice: number

    user: string
    status: string
    formationDateStart: string | null
    formationDateEnd: string | null
}

const initialState: searchState = {
    searchText: '',
    searchLowPrice: -1,
    searchHighPrice: -1,

    user: '',
    status: '',
    formationDateStart: null,
    formationDateEnd: null,
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchText: (state, { payload }) => {
            state.searchText = payload
        },
        setLowPrice: (state, { payload }) => {
            state.searchLowPrice = payload
        },
        setHighPrice: (state, { payload }) => {
            state.searchHighPrice = payload
        },
        setUser: (state, { payload }) => {
            state.user = payload
        },
        setStatus: (state, { payload }) => {
            state.status = payload
        },
        setDateStart: (state, { payload }) => {
            state.formationDateStart = payload
        },
        setDateEnd: (state, { payload }) => {
            state.formationDateEnd = payload
        },
        reset: (state) => {
            state = initialState
        }
    },
});

export default searchSlice.reducer;

export const { setSearchText, setLowPrice, setHighPrice, setUser, setStatus, setDateStart, setDateEnd, reset } = searchSlice.actions;