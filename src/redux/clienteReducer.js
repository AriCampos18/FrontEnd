import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { consultarCliente, excluirCliente, gravarCliente, alterarCliente } from "../servicos/servicoCliente.js";

import ESTADO from "./estado.js";

export const buscarClientes = createAsyncThunk('buscarClientes', async ()=>{
    //lista de produtos
    const resultado = await consultarCliente();
    //se for um array/lista a consulta funcionou

    try {
        if (Array.isArray(resultado)){
            console.log(resultado);
            return {
                "status":true,
                "mensagem":"Clientes recuperados com sucesso",
                "listaDeClientes":resultado
            }
        }
        else
        {
            return {
                "status":false,
                "mensagem":"Erro ao recuperar os clientes do backend.",
                "listaDeClientes":[]
            }
        }
    }
    catch(erro){
        return {
            "status":false,
            "mensagem":"Erro: " + erro.message,
            "listaDeClientes":[]
        }
    }
});

export const apagarCliente = createAsyncThunk('apagarCliente', async (cliente)=>{
//dar previsibilidade ao conteúdo do payload
    //lista de produtos
    console.log(cliente);
    const resultado = await excluirCliente(cliente);
    //se for um array/lista a consulta funcionou
    console.log(resultado);
    try {
            return {
                "status":resultado.status,
                "mensagem":resultado.mensagem,
                "cpf":cliente.cpf
            }
    }
    catch(erro){
        return {
            "status":false,
            "mensagem":"Erro: " + erro.message,
        }
    } 
});

export const inserirCliente = createAsyncThunk('inserirCliente', async (cliente)=>{
    //Previsibilidade de comportamento ao que será retornado para a aplicação(redutor)
   
    //status e mensagem
    //sucesso => codigo do produto gerado na inclusao
    try{
        const resultado=await gravarCliente(cliente);
        if(resultado.status)
        {
            //esse o é o payload retornado para o redutor
            cliente.cpf=resultado.cpf;
            return{
                "status":resultado.status,
                "mensagem":resultado.mensagem,
                "cliente":cliente
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

export const atualizarCliente = createAsyncThunk('atualizarCliente', async (cliente)=>{
    //Previsibilidade de comportamento ao que será retornado para a aplicação(redutor)
   
    //status e mensagem
    //sucesso => codigo do produto gerado na inclusao
    try{
        const resultado=await alterarCliente(cliente);
        //esse o é o payload retornado para o redutor
        return{
            "status":resultado.status,
            "mensagem":resultado.mensagem,
            "cliente":cliente
        };
    } catch(erro){
        //esse o é o payload retornado para o redutor
        return{
            "status":false,
            "mensagem":"Nao foi possivel se comunicar com o backend" + erro.message
        };
    }
});

const clienteReducer = createSlice({
    name:'cliente',
    initialState:{
        estado: ESTADO.OCIOSO,
        mensagem:"",
        listaDeClientes:[]
    },
    reducers:{},
    extraReducers:(builder)=> {
        builder.addCase(buscarClientes.pending, (state, action) =>{
            state.estado=ESTADO.PENDENTE
            state.mensagem="Processando requisição (buscando clientes)"
        })
        .addCase(buscarClientes.fulfilled, (state, action) =>{
            if (action.payload.status){
            state.estado=ESTADO.OCIOSO;
            state.mensagem=action.payload.mensagem;
            state.listaDeClientes=action.payload.listaDeClientes;
            } 
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
                state.listaDeClientes=action.payload.listaDeClientes;
            } 
        })
        .addCase(buscarClientes.rejected, (state, action) =>{
            state.estado=ESTADO.ERRO;
            state.mensagem = action.payload.mensagem;
            state.listaDeClientes=action.payload.listaDeClientes;
        })
        .addCase(apagarCliente.pending, (state,action) =>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(excluindo o cliente do backend";
        })
        .addCase(apagarCliente.fulfilled,(state,action) =>{
            state.estado=ESTADO.OCIOSO;
            state.mensagem=action.payload.mensagem;
            if(action.payload.status){                        
                state.listaDeClientes=state.listaDeClientes.filter((item)=> item.cpf !== action.payload.cpf);
                //altera a lista de produtos
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(apagarCliente.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;//action.payload.mensagem;
        })
        .addCase(inserirCliente.pending, (state, action)=>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(incluindo o cliente no backend";
        })
        .addCase(inserirCliente.fulfilled,(state,action) =>{
            if(action.payload.status){     
                //sucesso da inclusão do produto                  
                state.estado=ESTADO.OCIOSO; 
                state.mensagem=action.payload.mensagem;
                state.listaDeClientes.push(action.payload.cliente);
                //altera a lista de produtos
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(inserirCliente.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;//action.payload.mensagem;
        })
        .addCase(atualizarCliente.pending, (state,action)=>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(alterando o cliente no backend";
        })
        .addCase(atualizarCliente.fulfilled, (state,action)=>{
            if(action.payload.status){     
                //sucesso da inclusão do produto                  
                state.estado=ESTADO.OCIOSO; 
                state.mensagem=action.payload.mensagem;
                state.listaDeClientes=state.listaDeClientes.map((item)=> item.cpf===action.payload.cliente.cpf ? action.payload.cliente : item);
                //altera a lista de produtos
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(atualizarCliente.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;//action.payload.mensagem;
        })
    }
});

export default clienteReducer.reducer;