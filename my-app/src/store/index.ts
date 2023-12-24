import { configureStore } from "@reduxjs/toolkit";
import cargoReducer from "./cargoSlice";
import flightReducer from "./flightSlice";

export const store = configureStore({
    reducer: {
        cargo: cargoReducer,
        flight: flightReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;