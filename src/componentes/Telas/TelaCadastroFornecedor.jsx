import { Alert } from "react-bootstrap";
import FormCadFornecedor from "./Formularios/FormCadFornecedor";
import Pagina from "../layouts/Pagina";
import { useEffect, useState } from "react";
import TabelaFornecedores from "./Tabelas/TabelaFornecedores";
//import { produtos } from "../../dados/mockProdutos";
import { consultarFornecedor } from "../../servicos/servicoFornecedor";

export default function TelaCadastroFornecedor(props) {
    const [exibirTabela, setExibirTabela] = useState(true);
    /*const [listaDeProdutos, setListaDeProdutos] = useState([]);*/
    const [modoEdicao, setModoEdicao] = useState(false);
    //const [produtos, setProdutos] = useState([]);
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState({
        cnpj:"",
        nomeEmpresa:"",
        nomeResponsavel:"",
        telefone:"",
        email:"",
        endereco:"",
        cidade:"",
        uf:""
    });
   
    return (
        <div>
            <Pagina>
                <Alert className="mt-02 mb-02 success text-center" variant="success">
                    <h2>
                        Cadastro de Fornecedor
                    </h2>
                </Alert>
                {
                    exibirTabela ?
                        <TabelaFornecedores setExibirTabela={setExibirTabela}
                                        setModoEdicao={setModoEdicao}
                                        setFornecedorSelecionado={setFornecedorSelecionado} /> :
                        <FormCadFornecedor setExibirTabela={setExibirTabela}
                                         fornecedorSelecionado={fornecedorSelecionado}
                                         setFornecedorSelecionado={setFornecedorSelecionado}
                                         modoEdicao={modoEdicao}
                                         setModoEdicao={setModoEdicao}

                                         />
                }
            </Pagina>
        </div>
    );

}