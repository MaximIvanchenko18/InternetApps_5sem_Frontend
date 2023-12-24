import { createSlice } from "@reduxjs/toolkit";
import { ICargo } from "../models";


interface cargosState {
    cargos: ICargo[] | undefined
    cargo: ICargo | undefined
    searchText: string
    searchLowPrice: number | undefined
    searchHighPrice: number | undefined
}

const initialState: cargosState = {
    cargos: undefined,
    cargo: undefined,
    searchText: '',
    searchLowPrice: undefined,
    searchHighPrice: undefined,
}

const cargoSlice = createSlice({
    name: 'cargo',
    initialState,
    reducers: {
        setCargos: (state, { payload }) => {
            state.cargos = payload
        },
        setCargo: (state, { payload }) => {
            state.cargo = payload
        },
        setSearchText: (state, { payload }) => {
            state.searchText = payload
        },
        setLowPrice: (state, { payload }) => {
            state.searchLowPrice = payload
        },
        setHighPrice: (state, { payload }) => {
            state.searchHighPrice = payload
        },
        resetCargo: (state) => {
            state.cargo = undefined;
        },
    },
});

export default cargoSlice.reducer;

export const { setCargos, setCargo, setSearchText, setLowPrice, setHighPrice, resetCargo } = cargoSlice.actions;