import { useState, useEffect } from 'react';
import { Button, Spinner, Col, Form, InputGroup, Row, Alert } from 'react-bootstrap';
import { gravarPrivilegio } from "../../../servicos/servicoPrivilegio";
import { useDispatch, useSelector } from 'react-redux';
import toast, {Toaster} from 'react-hot-toast';
import { atualizarPrivilegio, inserirPrivilegio } from '../../../redux/privilegioReducer';
import ESTADO from '../../../redux/estado';

export default function FormCadPrivilegios(props) {
    const [privilegio, setPrivilegio] = useState(props.privilegioSelecionado);
    const [formValidado, setFormValidado] = useState(false);
    const {estado,mensagem,listaDePrivilegios}=useSelector(state=>state.privilegio);
    const [mensagemExibida, setMensagemExibida]= useState("");
    const despachante = useDispatch();
    

    function manipularSubmissao(evento) {
        const form = evento.currentTarget;
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                despachante(inserirPrivilegio(privilegio));
                setMensagemExibida(mensagem);
                setTimeout(()=>{
                    setMensagemExibida("");
                    setPrivilegio({
                        codigo:0,
                        descricao:""
                    });
                },5000);
            } 
            else {
                despachante(atualizarPrivilegio(privilegio));
                setMensagemExibida(mensagem);
                setTimeout(()=>{
                    props.setModoEdicao(false);
                    props.setPrivilegioSelecionado({
                        codigo:0,
                        descricao:""
                    });
                    props.setExibirTabela(true);
                },5000);
            }
        } 
        else {
            setFormValidado(true);
        }
        evento.preventDefault();
        evento.stopPropagation();
    }

    function manipularMudanca(evento) {
        const elemento = evento.target.name;
        const valor = evento.target.value;
        setPrivilegio({ ...privilegio, [elemento]: valor });
    }

    if(estado==ESTADO.PENDENTE){
        return (
            <div>
                <Spinner animation="border" role="status"></Spinner>
                <Alert variant="primary">{ mensagem }</Alert>
            </div>
        );
     }
     else if(estado==ESTADO.ERRO){
        return(
            <div>
                <Alert variant="danger">{ mensagem }</Alert>
                <Button onClick={() => {
                            props.setExibirTabela(true);
                        }}>Voltar</Button>
            </div>
        );
     }
     else if(estado==ESTADO.OCIOSO){
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
}