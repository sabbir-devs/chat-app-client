import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../lib/reducers/authSlice";

const store = configureStore({
    reducer:{
        user: authSlice,
    },
});
export default store