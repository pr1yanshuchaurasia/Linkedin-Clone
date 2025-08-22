// STEPS for State Management
// Submit Action
// Handle action in it's reducer
// Register Here -> Reducer

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer"


export const store = configureStore({
    reducer: {
        auth: authReducer
    }
})