import { Button, Container, Table, Spinner, Alert} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { buscarFornecedores, apagarFornecedor } from "../../../redux/fornecedorReducer";
import { useEffect } from "react";
import ESTADO from "../../../redux/estado.js";

export default function TabelaFornecedores(props) {

    const {estado, mensagem, listaDeFornecedores} = useSelector(state => state.fornecedor);
    const despachante = useDispatch(); //consegue enviar uma action ao estado a partir da interface

    useEffect(()=>{
        despachante(buscarFornecedores());
    },[despachante]); //ciclo de vida de atualização do componente

    function editarFornecedor(fornecedor){
        props.setModoEdicao(true);
        props.setFornecedorSelecionado(fornecedor);
        props.setExibirTabela(false);
    }

    function excluirFornecedorFrontEnd(fornecedor){
        if(window.confirm("Deseja realmente excluir o fornecedor " + fornecedor.cnpj)){
            despachante(apagarFornecedor(fornecedor)); //envia a action apagarProduto
        }
    }

    if (estado === ESTADO.PENDENTE){
        return (
            <div>
                <Spinner animation="border" role="status"></Spinner>
                <Alert variant="primary">{ mensagem }</Alert>
            </div>
        );
    }
    else if (estado === ESTADO.ERRO){
        return(
            <div>
                <Alert variant="danger">{ mensagem }</Alert>
            </div>
        );
    }
    else if (estado===ESTADO.OCIOSO){

        return (
            <>
                <Container>
                    <Button className="mb-3" variant="primary"
                        onClick={() => {
                            props.setExibirTabela(false);
                        }}>
                        Adicionar
                    </Button>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>CNPJ</th>
                                <th>Empresa</th>
                                <th>Responsavel</th>
                                <th>Telefone</th>
                                <th>E-Mail</th>
                                <th>Endereco</th>
                                <th>Cidade</th>
                                <th>UF</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listaDeFornecedores?.map((fornecedor) => {
                                    return (
                                        <tr> 
                                            <td>{fornecedor.cnpj}</td>
                                            <td>{fornecedor.nomeEmpresa}</td>
                                            <td>{fornecedor.nomeResponsavel}</td>
                                            <td>{fornecedor.telefone}</td>
                                            <td>{fornecedor.email}</td>
                                            <td>{fornecedor.endereco}</td>
                                            <td>{fornecedor.cidade}</td>
                                            <td>{fornecedor.uf}</td>
                                            <td>
                                                <Button onClick={()=>{
                                                    editarFornecedor(fornecedor);
                                                }}variant="warning">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                                    </svg>
                                                </Button> <Button onClick={ ()=> {
                                                    excluirFornecedorFrontEnd(fornecedor);
                                                }} variant="danger">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                    </svg>           
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <p>Quatidade de fornecedores cadastrados: {listaDeFornecedores.length}</p>
                </Container>
            </>
        );

    }
}