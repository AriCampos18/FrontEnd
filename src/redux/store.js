import { configureStore } from "@reduxjs/toolkit";
import produtoReducer from "./produtoReducer";

const store = configureStore({
    reducer:{
        'produto':produtoReducer
    }
});

export default store;