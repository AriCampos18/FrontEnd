import { Button, Spinner, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { consultarPrivilegio } from "../../../servicos/servicoPrivilegio";
import { gravarUsuario } from "../../../servicos/servicoUsuario";

import toast, {Toaster} from 'react-hot-toast';

export default function FormCadUsuario(props) {
    const [usuario, setUsuario] = useState(props.usuarioSelecionado);
    const [formValidado, setFormValidado] = useState(false);
    const [privilegio, setPrivilegio] = useState([]);
    const [temPrivilegio, setTemPrivilegio] = useState(false);

    useEffect(()=>{
        consultarPrivilegio().then((resultado)=>{
            if (Array.isArray(resultado)){
                setPrivilegio(resultado);
                setTemPrivilegio(true);
            }
            else{
                toast.error("Não foi possível carregar os privilegios");
            }
        }).catch((erro)=>{
            setTemPrivilegio(false);
            toast.error("Não foi possível carregar os privilegios");
        });
        
    },[]); //didMount

    function selecionarPrivilegio(evento){
        setPrivilegio({...usuario, 
                       privilegio:{
                       codigo: evento.currentTarget.value
                       }});
    }

    function manipularSubmissao(evento) {
        const form = evento.currentTarget;
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                gravarUsuario(usuario)
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
                props.setListaDeUsuarios(props.listaDeUsuarios.map((item) => {
                    if (item.codigo !== usuario.id)
                        return item
                    else
                        return usuario
                }));

                props.setModoEdicao(false);
                props.setUsuarioSelecionado({
                    id: 0,
                    nome: "",
                    email: "",
                    senha: "",
                    idade: 0,
                    endereco: "",
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
        const elemento = evento.target.name;
        const valor = evento.target.value;
        setUsuario({ ...usuario, [elemento]: valor });
    }

    return (
        <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
            <Row className="mb-4">
                <Form.Group as={Col} md="4">
                    <Form.Label>Id</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="id"
                        name="id"
                        value={usuario.id}
                        disabled={props.modoEdicao}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type='invalid'>Por favor, informe o id do usuario!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="8">
                        <Form.Label>Nome:</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="text"
                                id="nome"
                                name="nome"
                                aria-describedby="nome"
                                value={usuario.nome}
                                onChange={manipularMudanca}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor, informe o nome do usuario!
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Idade:</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="text"
                                id="idade"
                                name="idade"
                                aria-describedby="idade"
                                value={usuario.idade}
                                onChange={manipularMudanca}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor, informe a idade do usuario!
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="8">
                    <Form.Label>Email:</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text id="email">@</InputGroup.Text>
                        <Form.Control
                            type="text"
                            id="email"
                            name="email"
                            aria-describedby="email"
                            value={usuario.email}
                            onChange={manipularMudanca}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, informe o email do usuario!
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4">
                    <Form.Label>Senha:</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            type="text"
                            id="senha"
                            name="senha"
                            aria-describedby="senha"
                            value={usuario.senha}
                            onChange={manipularMudanca}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, informe a senha!
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="5">
                    <Form.Label>Endereco:</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="endereco"
                        name="endereco"
                        value={usuario.endereco}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">Por favor, informe o seu endereço!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md={7}>
                    <Form.Label>Privilegio:</Form.Label>
                    <Form.Select id='privilegio' 
                                 name='privilegio'
                                 onChange={selecionarPrivilegio}>
                        {
                            privilegio.map((privilegio) =>{
                                return <option value={privilegio.codigo}>
                                            {privilegio.descricao}
                                       </option>
                            })
                        }
                        
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md={1}>
                    {
                      !temPrivilegio ? <Spinner className='mt-4' animation="border" variant="success" />
                      : ""
                    }
                </Form.Group>
            </Row>
            <Row className='mt-2 mb-2'>
                <Col md={1}>
                    <Button type="submit" disabled={!temPrivilegio}>{props.modoEdicao ? "Alterar" : "Confirmar"}</Button>
                </Col>
                <Col md={{ offset: 1 }}>
                    <Button onClick={() => {
                        props.setExibirTabela(true);
                    }}>Voltar</Button>
                </Col>
            </Row>
            <Toaster position="top-right"/>
        </Form>
        
    );
}