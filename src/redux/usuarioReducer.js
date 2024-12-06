import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { gravarUsuario, alterarUsuario, consultarUsuario, excluirUsuario } from "../servicos/servicoUsuario";

import ESTADO from "./estado";

export const buscarUsuarios = createAsyncThunk('buscarUsuarios', async ()=>{
    const resultado = await consultarUsuario();
    console.log(resultado);
    try {
        if (Array.isArray(resultado)){
            return {
                "status":true,
                "mensagem":"Usuarios recuperados com sucesso",
                "listaDeUsuarios":resultado
            }
        }
        else
        {
            return {
                "status":false,
                "mensagem":"Erro ao recuperar os usuarios do backend.",
                "listaDeUsuarios":[]
            }
        }
    }
    catch(erro){
        return {
            "status":false,
            "mensagem":"Erro: " + erro.message,
            "listaDeUsuarios":[]
        }
    }
});

export const apagarUsuario = createAsyncThunk('apagarUsuario', async (usuario)=>{
    const resultado = await excluirUsuario(usuario);
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
export const inserirUsuario = createAsyncThunk('inserirUsuario', async (usuario)=>{
    //Previsibilidade de comportamento ao que será retornado para a aplicação(redutor)
   
    //status e mensagem
    //sucesso => codigo do produto gerado na inclusao
    try{
        const resultado=await gravarUsuario(usuario);
        if(resultado.status)
        {
            //esse o é o payload retornado para o redutor
            usuario.id=resultado.id;
            return{
                "status":resultado.status,
                "mensagem":resultado.mensagem,
                "usuario":usuario
            };
        }
        else{
            return{
                "status":resultado.status,
                "mensagem":resultado.mensagem
            };
        }
    } catch(erro){
        //esse o é o payload retornado para o redutor
        return{
            "status":false,
            "mensagem":"Nao foi possivel se comunicar com o backend" + erro.message
        };
    }
});

export const atualizarUsuario = createAsyncThunk('atualizarUsuario', async (usuario)=>{
    //Previsibilidade de comportamento ao que será retornado para a aplicação(redutor)
   
    //status e mensagem
    //sucesso => codigo do produto gerado na inclusao
    try{
        const resultado=await alterarUsuario(usuario);
        //esse o é o payload retornado para o redutor
        return{
            "status":resultado.status,
            "mensagem":resultado.mensagem,
            "usuario":usuario
        };
    } catch(erro){
        //esse o é o payload retornado para o redutor
        return{
            "status":false,
            "mensagem":"Nao foi possivel se comunicar com o backend" + erro.message
        };
    }
});

const usuarioReducer = createSlice({
    name:'usuario',
    initialState:{
        estado: ESTADO.OCIOSO,
        mensagem:"",
        listaDeUsuarios:[]
    },
    reducers:{},
    extraReducers:(builder)=> {
        builder.addCase(buscarUsuarios.pending, (state, action) =>{
            state.estado=ESTADO.PENDENTE
            state.mensagem="Processando requisição (buscando usuarios)"
        })
        .addCase(buscarUsuarios.fulfilled, (state, action) =>{
          if (action.payload.status){
            state.estado=ESTADO.OCIOSO;
            state.mensagem=action.payload.mensagem;
            state.listaDeUsuarios=action.payload.listaDeUsuarios;
          } 
          else{
            state.estado=ESTADO.ERRO;
            state.mensagem = action.payload.mensagem;
            state.listaDeUsuarios=action.payload.listaDeUsuarios;
          } 
        })
        .addCase(buscarUsuarios.rejected, (state, action) =>{
            state.estado=ESTADO.ERRO;
            state.mensagem = action.payload.mensagem;
            state.listaDeUsuarios=action.payload.listaDeUsuarios;
        })
        .addCase(apagarUsuario.pending, (state,action) =>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(excluindo o usuario do backend";
        })
        .addCase(apagarUsuario.fulfilled,(state,action) =>{
            state.estado=ESTADO.OCIOSO;
            state.mensagem=action.payload.mensagem;
            if(action.payload.status){                        
                state.listaDeUsuarios=state.listaDeUsuarios.filter((item)=> item.id !== action.payload.id);
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(apagarUsuario.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;
        })
        .addCase(inserirUsuario.pending, (state, action)=>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(incluindo o usuario no backend";
        })
        .addCase(inserirUsuario.fulfilled,(state,action) =>{
            if(action.payload.status){     
                state.estado=ESTADO.OCIOSO; 
                state.mensagem=action.payload.mensagem;
                state.listaDeUsuarios.push(action.payload.usuario);
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(inserirUsuario.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;
        })
        .addCase(atualizarUsuario.pending, (state,action)=>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(alterando o usuario no backend";
        })
        .addCase(atualizarUsuario.fulfilled, (state,action)=>{
            if(action.payload.status){     
                state.estado=ESTADO.OCIOSO; 
                state.mensagem=action.payload.mensagem;
                state.listaDeUsuarios=state.listaDeUsuarios.map((item)=> item.id===action.payload.usuario.id ? action.payload.usuario : item);
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(atualizarUsuario.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;
        })
    }
});

export default usuarioReducer.reducer;