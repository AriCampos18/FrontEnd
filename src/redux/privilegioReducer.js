import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { consultarPrivilegio, excluirPrivilegio } from "../servicos/servicoPrivilegio";

import ESTADO from "./estado";

export const buscarPrivilegios = createAsyncThunk('buscarPrivilegios', async ()=>{
    const resultado = await consultarPrivilegio();
    try {
        if (Array.isArray(resultado)){
            return {
                "status":true,
                "mensagem":"Privilegios recuperados com sucesso",
                "listaDePrivilegios": resultado,
            }
        }
        else
        {
            return {
                "status":false,
                "mensagem":"Erro ao recuperar os privilegios do backend.",
                "listaDePrivilegios":[]
            }
        }
    }
    catch(erro){
        return {
            "status":false,
            "mensagem":"Erro: " + erro.message,
            "listaDePrivilegios":[]
        }
    }
});

export const apagarPrivilegio = createAsyncThunk('apagarPrivilegio', async (privilegio)=>{
    console.log(privilegio);
    const resultado = await excluirPrivilegio(privilegio);
    console.log(resultado);
    try {
            return {
                "status":resultado.status,
                "mensagem":resultado.mensagem,
            }
    }
    catch(erro){
        return {
            "status":false,
            "mensagem":"Erro: " + erro.message,
        }
    } 
});

const privilegioReducer = createSlice({
    name:'privilegio',
    initialState:{
        estado: ESTADO.OCIOSO,
        mensagem:"",
        listaDePrivilegios:[]
    },
    reducers:{},
    extraReducers:(builder)=> {
        builder.addCase(buscarPrivilegios.pending, (state, action) =>{
            state.estado=ESTADO.PENDENTE
            state.mensagem="Processando requisição (buscando privilegios)"
        })
        .addCase(buscarPrivilegios.fulfilled, (state, action) =>{
          if (action.payload.status){
            state.estado=ESTADO.OCIOSO;
            state.mensagem=action.payload.mensagem;
            state.listaDePrivilegios=action.payload.listaDePrivilegios;
          } 
          else{
            state.estado=ESTADO.ERRO;
            state.mensagem = action.payload.mensagem;
            state.listaDePrivilegios=action.payload.listaDePrivilegios;
          } 
        })
        .addCase(buscarPrivilegios.rejected, (state, action) =>{
            state.estado=ESTADO.ERRO;
            state.mensagem = action.payload.mensagem;
            state.listaDePrivilegios=action.payload.listaDePrivilegios;
        })
        .addCase(apagarPrivilegio.pending, (state,action) =>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(excluindo o privilegio do backend";
        })
        .addCase(apagarPrivilegio.fulfilled,(state,action) =>{
            state.estado=ESTADO.OCIOSO;
            state.mensagem=action.payload.mensagem;
            if(action.payload.status){                        
                state.listaDePrivilegios=state.listaDePrivilegios.filter((item)=> item.codigo !== action.payload.codigo);
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(apagarPrivilegio.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;//action.payload.mensagem;
        })
        .addCase(inserirPrivilegio.pending, (state, action)=>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(incluindo o privilegio no backend";
        })
        .addCase(inserirPrivilegio.fulfilled,(state,action) =>{
            if(action.payload.status){     
                state.estado=ESTADO.OCIOSO; 
                state.mensagem=action.payload.mensagem;
                state.listaDePrivilegios.push(action.payload.privilegio);
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(inserirPrivilegio.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;//action.payload.mensagem;
        })
        .addCase(atualizarPrivilegio.pending, (state,action)=>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(alterando o orivilegio no backend";
        })
        .addCase(atualizarPrivilegio.fulfilled, (state,action)=>{
            if(action.payload.status){     
                state.estado=ESTADO.OCIOSO; 
                state.mensagem=action.payload.mensagem;
                state.listaDePrivilegios=state.listaDePrivilegios.map((item)=> item.codigo===action.payload.privilegio.codigo ? action.payload.privilegio : item);
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(atualizarPrivilegio.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;//action.payload.mensagem;
        })
    }
});

export default privilegioReducer.reducer;