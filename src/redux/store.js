import { configureStore } from "@reduxjs/toolkit";
import produtoReducer from "./produtoReducer";
import clienteReducer from "./clienteReducer";
import fornecedorReducer from "./fornecedorReducer";
import categoriaReducer from "./categoriaReducer";
import usuarioReducer from "./usuarioReducer";
import privilegioReducer from "./privilegioReducer";

const store = configureStore({
    reducer:{
        'produto':produtoReducer,
        'categoria':categoriaReducer,
        'cliente':clienteReducer,
        'usuario':usuarioReducer,
        'privilegio':privilegioReducer,
        'fornecedor':fornecedorReducer
    }
});

export default store;