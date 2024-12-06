import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { gravarCategoria, consultarCategoria, alterarCategoria, excluirCategoria } from "../servicos/servicoCategoria";

import ESTADO from "./estado";

export const buscarCategorias = createAsyncThunk('buscarCategorias', async ()=>{
    //lista de categoria
    const resultado = await consultarCategoria();
    //se for um array/lista a consulta funcionou
    try {
        if (Array.isArray(resultado)){
            return {
                "status":true,
                "mensagem":"Categorias recuperados com sucesso",
                "listaDeCategorias": resultado,
            }
        }
        else
        {
            return {
                "status":false,
                "mensagem":"Erro ao recuperar os categorias do backend.",
                "listaDeCategorias":[]
            }
        }
    }
    catch(erro){
        return {
            "status":false,
            "mensagem":"Erro: " + erro.message,
            "listaDeCategorias":[]
        }
    }
});

export const apagarCategoria = createAsyncThunk('apagarCategoria', async (categoria)=>{
//dar previsibilidade ao conteúdo do payload
    //lista de categorias
    console.log(categoria);
    const resultado = await excluirCategoria(categoria);
    //se for um array/lista a consulta funcionou
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
export const inserirCategoria = createAsyncThunk('inserirCategoria', async (categoria)=>{
    //Previsibilidade de comportamento ao que será retornado para a aplicação(redutor)
   
    //status e mensagem
    //sucesso => codigo do produto gerado na inclusao
    try{
        const resultado=await gravarCategoria(categoria);
        if(resultado.status)
        {
            //esse o é o payload retornado para o redutor
            categoria.codigo=resultado.codigo;
            return{
                "status":resultado.status,
                "mensagem":resultado.mensagem,
                "categoria":categoria
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

export const atualizarCategoria = createAsyncThunk('atualizarCategoria', async (categoria)=>{
    //Previsibilidade de comportamento ao que será retornado para a aplicação(redutor)
   
    //status e mensagem
    //sucesso => codigo do produto gerado na inclusao
    try{
        const resultado=await alterarCategoria(categoria);
        //esse o é o payload retornado para o redutor
        return{
            "status":resultado.status,
            "mensagem":resultado.mensagem,
            "categoria":categoria
        };
    } catch(erro){
        //esse o é o payload retornado para o redutor
        return{
            "status":false,
            "mensagem":"Nao foi possivel se comunicar com o backend" + erro.message
        };
    }
});


const categoriaReducer = createSlice({
    name:'categoria',
    initialState:{
        estado: ESTADO.OCIOSO,
        mensagem:"",
        listaDeCategorias:[]
    },
    reducers:{},
    extraReducers:(builder)=> {
        builder.addCase(buscarCategorias.pending, (state, action) =>{
            state.estado=ESTADO.PENDENTE
            state.mensagem="Processando requisição (buscando categorias)"
        })
        .addCase(buscarCategorias.fulfilled, (state, action) =>{
          if (action.payload.status){
            state.estado=ESTADO.OCIOSO;
            state.mensagem=action.payload.mensagem;
            state.listaDeCategorias=action.payload.listaDeCategorias;
          } 
          else{
            state.estado=ESTADO.ERRO;
            state.mensagem = action.payload.mensagem;
            state.listaDeCategorias=action.payload.listaDeCategorias;
          } 
        })
        .addCase(buscarCategorias.rejected, (state, action) =>{
            state.estado=ESTADO.ERRO;
            state.mensagem = action.payload.mensagem;
            state.listaDeCategorias=action.payload.listaDeCategorias;
        })
        .addCase(apagarCategoria.pending, (state,action) =>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(excluindo a categoria do backend";
        })
        .addCase(apagarCategoria.fulfilled,(state,action) =>{
            state.estado=ESTADO.OCIOSO;
            state.mensagem=action.payload.mensagem;
            if(action.payload.status){                        
                state.listaDeCategorias=state.listaDeCategorias.filter((item)=> item.codigo !== action.payload.codigo);
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(apagarCategoria.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;
        })
        .addCase(inserirCategoria.pending, (state, action)=>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(incluindo o Categoria no backend";
        })
        .addCase(inserirCategoria.fulfilled,(state,action) =>{
            if(action.payload.status){     
                state.estado=ESTADO.OCIOSO; 
                state.mensagem=action.payload.mensagem;
                state.listaDeCategorias.push(action.payload.categoria);
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(inserirCategoria.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;
        })
        .addCase(atualizarCategoria.pending, (state,action)=>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(alterando o categoria no backend";
        })
        .addCase(atualizarCategoria.fulfilled, (state,action)=>{
            if(action.payload.status){     
                state.estado=ESTADO.OCIOSO; 
                state.mensagem=action.payload.mensagem;
                state.listaDeCategorias=state.listaDeCategorias.map((item)=> item.codigo===action.payload.categoria.codigo ? action.payload.categoria : item);
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(atualizarCategoria.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;
        })
    }
});

export default categoriaReducer.reducer;