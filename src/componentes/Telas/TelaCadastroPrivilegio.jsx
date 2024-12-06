import { Alert } from "react-bootstrap";
import FormCadPrivilegios from "./Formularios/FormCadPrivilegios";
import Pagina from "../layouts/Pagina";
import { useState } from "react";
import TabelaPrivilegios from "./Tabelas/TabelaPrivilegio";

export default function TelaCadastroPrivilegios(props) {
    const [exibirTabela, setExibirTabela] = useState(true);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [privilegioSelecionado, setPrivilegioSelecionado] = useState({
        codigo: 0,
        descricao: ""
    });

    return (
        <div>
            <Pagina>
                <Alert className="mt-02 mb-02 success text-center" variant="success">
                    <h2>Cadastro de Privilegio</h2>
                </Alert>
                {
                    exibirTabela ?
                        <TabelaPrivilegios 
                                        setExibirTabela={setExibirTabela}
                                        setModoEdicao={setModoEdicao}
                                        setPrivilegioSelecionado={setPrivilegioSelecionado} /> :
                        <FormCadPrivilegios 
                                        setExibirTabela={setExibirTabela}
                                        privilegiosSelecionado={privilegioSelecionado}
                                        setPrivilegioSelecionado={setPrivilegioSelecionado}
                                        modoEdicao={modoEdicao}
                                        setModoEdicao={setModoEdicao} />
                }
            </Pagina>
        </div>
    );
}
