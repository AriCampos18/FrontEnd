import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { consultarFornecedor, excluirFornecedor, gravarFornecedor, alterarFornecedor } from "../servicos/servicoFornecedor";

import ESTADO from "./estado.js";

export const buscarFornecedores = createAsyncThunk('buscarFornecedores', async ()=>{
    //lista de produtos
    const resultado = await consultarFornecedor();
    //se for um array/lista a consulta funcionou
    try {
        if (Array.isArray(resultado)){
            return {
                "status":true,
                "mensagem":"Fornecedores recuperados com sucesso",
                "listaDeFornecedores":resultado
            }
        }
        else
        {
            return {
                "status":false,
                "mensagem":"Erro ao recuperar os fornecedores do backend.",
                "listaDeFornecedores":[]
            }
        }
    }
    catch(erro){
        return {
            "status":false,
            "mensagem":"Erro: " + erro.message,
            "listaDeFornecedores":[]
        }
    }
});

export const apagarFornecedor = createAsyncThunk('apagarFornecedor', async (fornecedor)=>{
//dar previsibilidade ao conteúdo do payload
    //lista de produtos
    console.log(fornecedor);
    const resultado = await excluirFornecedor(fornecedor);
    //se for um array/lista a consulta funcionou
    console.log(resultado);
    try {
            return {
                "status":resultado.status,
                "mensagem":resultado.mensagem,
                "cnpj":fornecedor.cnpj
            }
    }
    catch(erro){
        return {
            "status":false,
            "mensagem":"Erro: " + erro.message,
        }
    } 
});

export const inserirFornecedor = createAsyncThunk('inserirFornecedor', async (fornecedor)=>{
    //Previsibilidade de comportamento ao que será retornado para a aplicação(redutor)
   
    //status e mensagem
    //sucesso => codigo do produto gerado na inclusao
    try{
        const resultado=await gravarFornecedor(fornecedor);
        if(resultado.status)
        {
            //esse o é o payload retornado para o redutor
            fornecedor.cnpj=resultado.cnpj;
            return{
                "status":resultado.status,
                "mensagem":resultado.mensagem,
                "fornecedor":fornecedor
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

export const atualizarFornecedor = createAsyncThunk('atualizarFornecedor', async (fornecedor)=>{
    //Previsibilidade de comportamento ao que será retornado para a aplicação(redutor)
   
    //status e mensagem
    //sucesso => codigo do produto gerado na inclusao
    try{
        const resultado=await alterarFornecedor(fornecedor);
        //esse o é o payload retornado para o redutor
        return{
            "status":resultado.status,
            "mensagem":resultado.mensagem,
            "fornecedor":fornecedor
        };
    } catch(erro){
        //esse o é o payload retornado para o redutor
        return{
            "status":false,
            "mensagem":"Nao foi possivel se comunicar com o backend" + erro.message
        };
    }
});

const fornecedorReducer = createSlice({
    name:'fornecedor',
    initialState:{
        estado: ESTADO.OCIOSO,
        mensagem:"",
        listaDeFornecedores:[]
    },
    reducers:{},
    extraReducers:(builder)=> {
        builder.addCase(buscarFornecedores.pending, (state, action) =>{
            state.estado=ESTADO.PENDENTE
            state.mensagem="Processando requisição (buscando fornecedores)"
        })
        .addCase(buscarFornecedores.fulfilled, (state, action) =>{
          if (action.payload.status){
            state.estado=ESTADO.OCIOSO;
            state.mensagem=action.payload.mensagem;
            state.listaDeFornecedores=action.payload.listaDeFornecedores;
          } 
          else{
            state.estado=ESTADO.ERRO;
            state.mensagem = action.payload.mensagem;
            state.listaDeFornecedores=action.payload.listaDeFornecedores;
          } 
        })
        .addCase(buscarFornecedores.rejected, (state, action) =>{
            state.estado=ESTADO.ERRO;
            state.mensagem = action.payload.mensagem;
            state.listaDeFornecedores=action.payload.listaDeFornecedores;
        })
        .addCase(apagarFornecedor.pending, (state,action) =>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(excluindo o fornecedor do backend)";
        })
        .addCase(apagarFornecedor.fulfilled,(state,action) =>{
            state.estado=ESTADO.OCIOSO;
            state.mensagem=action.payload.mensagem;
            if(action.payload.status){                        
                state.listaDeFornecedores=state.listaDeFornecedores.filter((item)=> item.cnpj !== action.payload.cnpj);
                //altera a lista de produtos
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(apagarFornecedor.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;//action.payload.mensagem;
        })
        .addCase(inserirFornecedor.pending, (state, action)=>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(incluindo o produto no backend";
        })
        .addCase(inserirFornecedor.fulfilled,(state,action) =>{
            if(action.payload.status){     
                //sucesso da inclusão do produto                  
                state.estado=ESTADO.OCIOSO; 
                state.mensagem=action.payload.mensagem;
                state.listaDeFornecedores.push(action.payload.fornecedor);
                //altera a lista de produtos
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(inserirFornecedor.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;//action.payload.mensagem;
        })
        .addCase(atualizarFornecedor.pending, (state,action)=>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(alterando o fornecedor no backend";
        })
        .addCase(atualizarFornecedor.fulfilled, (state,action)=>{
            if(action.payload.status){     
                //sucesso da inclusão do produto                  
                state.estado=ESTADO.OCIOSO; 
                state.mensagem=action.payload.mensagem;
                state.listaDeFornecedores=state.listaDeFornecedores.map((item)=> item.cnpj===action.payload.fornecedor.cnpj ? action.payload.fornecedor : item);
                //altera a lista de produtos
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(atualizarFornecedor.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;//action.payload.mensagem;
        })
    }
});

export default fornecedorReducer.reducer;