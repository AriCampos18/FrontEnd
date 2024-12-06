import { useState, useEffect } from 'react';
import { Button, Spinner, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { gravarPrivilegio } from "../../../servicos/servicoPrivilegio";

import toast, {Toaster} from 'react-hot-toast';

export default function FormCadPrivilegios(props) {
    const [privilegio, setPrivilegio] = useState(props.privilegioSelecionado);
    const [formValidado, setFormValidado] = useState(false);

    useEffect(() => {
        setPrivilegio(props.privilegioSelecionado);
    }, [props.privilegioSelecionado]);
    

    function manipularSubmissao(evento) {
        const form = evento.currentTarget;
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                gravarPrivilegio(privilegio)
                .then((resultado)=>{
                    if (resultado.status){
                        props.setExibirTabela(true);
                    }
                    else{
                        toast.error(resultado.mensagem);
                    }
                });
            } 
            else {
                props.setListaDePrivilegios(props.listaDePrivilegios.map((item) => 
                    item.codigo !== privilegio.codigo ? item : privilegio
                ));
                props.setModoEdicao(false);
                props.setPrivilegioSelecionado({ 
                    codigo: 0, 
                    descricao: "" 
                });
                props.setExibirTabela(true);
            }
        } 
        else {
            setFormValidado(true);
        }
        evento.preventDefault();
        evento.stopPropagation();
    }

    function manipularMudanca(evento) {
        const { name, value } = evento.target;
        setPrivilegio({ ...privilegio, [name]: value });
    }

    return (
        <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
            <Row className="mb-4">
                <Form.Group as={Col} md="4">
                    <Form.Label>Código</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="codigo"
                        name="codigo"
                        value={privilegio.codigo}
                        disabled={props.modoEdicao}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type='invalid'>
                        Por favor, informe o código do privilegio!
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="12">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="descricao"
                        name="descricao"
                        value={privilegio.descricao}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor, informe a descrição do privilegio!
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className='mt-2 mb-2'>
                <Col md={1}>
                    <Button type="submit">{props.modoEdicao ? "Alterar" : "Confirmar"}</Button>
                </Col>
                <Col md={{ offset: 1 }}>
                    <Button onClick={() => props.setExibirTabela(true)}>Voltar</Button>
                </Col>
            </Row>
            <Toaster position="top-right"/>
        </Form>
    );
}