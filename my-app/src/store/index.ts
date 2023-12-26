import { configureStore } from "@reduxjs/toolkit";
import cargoReducer from "./cargoSlice";
import flightReducer from "./flightSlice";
import historyReducer from "./historySlice";
import userReducer from "./userSlice";

export const store = configureStore({
    reducer: {
        cargo: cargoReducer,
        flight: flightReducer,
        history: historyReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;