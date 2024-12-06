import { Button, Spinner, Col, Form, InputGroup,
    Row, Alert
} from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { alterarCliente } from '../../../servicos/servicoCliente.js';
import ESTADO from '../../../redux/estado.js';
import {Toaster} from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { inserirCliente, atualizarCliente } from '../../../redux/clienteReducer.js';

export default function FormCadCliente(props) {
const [cliente, setCliente] = useState(props.clienteSelecionado);
const [formValidado, setFormValidado] = useState(false);
const {estado,mensagem,listaDeClientes}=useSelector((state)=>state.cliente);
const [mensagemExibida, setMensagemExibida]= useState("");
const despachante = useDispatch();

function manipularSubmissao(evento) {
   const form = evento.currentTarget;
   if (form.checkValidity()) {
       if (!props.modoEdicao) {
           despachante(inserirCliente(cliente));
           setMensagemExibida(mensagem);
           setTimeout(()=>{
               setMensagemExibida("");
               setCliente({
                   cpf: "",
                   nome: "",
                   telefone: "",
                   endereco: "",
                   cidade: "",
                   uf: ""
               });
           },5000);
       }
       else {
           despachante(atualizarCliente(cliente));
           setMensagemExibida(mensagem);
           setTimeout(()=>{
               props.setModoEdicao(false);
               props.setClienteSelecionado({
                    cpf: "",
                    nome: "",
                    telefone: "",
                    endereco: "",
                    cidade: "",
                    uf: ""
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
   setCliente({ ...cliente, [elemento]: valor });
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
       <div>
       <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
           <Row className="mb-4">
               <Form.Group as={Col} md="4">
                   <Form.Label>CPF</Form.Label>
                   <Form.Control
                       required
                       type="text"
                       id="cpf"
                       name="cpf"
                       value={cliente.cpf}
                       disabled={props.modoEdicao}
                       onChange={manipularMudanca}
                   />
                   <Form.Control.Feedback type='invalid'>Por favor, informe o cpf do cliente!</Form.Control.Feedback>
               </Form.Group>
           </Row>
           <Row className="mb-4">
               <Form.Group as={Col} md="12">
                   <Form.Label>Nome completo</Form.Label>
                   <Form.Control
                       required
                       type="text"
                       id="nome"
                       name="nome"
                       value={cliente.nome}
                       onChange={manipularMudanca}
                   />
                   <Form.Control.Feedback type="invalid">Por favor, informe o nome do cliente!</Form.Control.Feedback>
               </Form.Group>
           </Row>
           <Row className="mb-4">
               <Form.Group as={Col} md="4">
                   <Form.Label>Telefone</Form.Label>
                       <Form.Control
                           type="text"
                           id="telefone"
                           name="telefone"
                           value={cliente.telefone}
                           onChange={manipularMudanca}
                           required
                       />
                       <Form.Control.Feedback type="invalid">
                           Por favor, informe o telefone do cliente!
                       </Form.Control.Feedback>
               </Form.Group>
               <Form.Group as={Col} md="4">
                   <Form.Label>Endereco</Form.Label>
                       <Form.Control
                           type="text"
                           id="endereco"
                           name="endereco"
                           aria-describedby="endereco"
                           value={cliente.endereco}
                           onChange={manipularMudanca}
                           required
                       />
                       <Form.Control.Feedback type="invalid">
                           Por favor, informe o endereco do cliente!
                       </Form.Control.Feedback>
               </Form.Group>
               <Form.Group as={Col} md="4">
                   <Form.Label>Cidade</Form.Label>
                       <Form.Control
                           type="text"
                           id="cidade"
                           name="cidade"
                           aria-describedby="cidade"
                           value={cliente.cidade}
                           onChange={manipularMudanca}
                           required
                       />
                       <Form.Control.Feedback type="invalid">
                           Por favor, informe a cidade do cliente!
                       </Form.Control.Feedback>
               </Form.Group>
           </Row>
           <Row className="mb-4">
               <Form.Group as={Col} md={7}>
                   <Form.Label>Estado:</Form.Label>
                   <Form.Select id='uf' 
                               name='uf'
                               value={cliente.uf}
                               onChange={manipularMudanca}>
                                <option value="">Selecione o estado</option>
                                <option value="SP">São Paulo</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="RS">Rio Grande do Sul</option>
                                <option value="BA">Bahia</option>
                                <option value="PR">Paraná</option>
                                <option value="MT">Mato Grosso</option>
                                <option value="MS">Mato Grosso do Sul</option>
                                <option value="PB">Paraíba</option>
                                <option value="AM">Amazonas</option>
                                <option value="AP">Amapá</option>
                                <option value="SC">Santa Catarina</option>
                                <option value="AC">Acre</option>
                                <option value="TC">Tocantins</option>
                                <option value="PA">Pará</option>
                                <option value="RO">Rondônia</option>
                                <option value="RR">Roraima</option>
                                <option value="AL">Alagoas</option>
                                <option value="CE">Ceará</option>
                                <option value="MR">Maranhão</option>
                                <option value="PB">Pernambuco</option>
                                <option value="PI">Piauí</option>
                                <option value="RN">Rio Grande do Norte</option>
                                <option value="SE">Sergipe</option>
                                <option value="GO">Goiás</option>
                                <option value="ES">Espírito Santo</option>
                   </Form.Select>
               </Form.Group>
           </Row>
           <Row className='mt-2 mb-2'>
               <Col md={1}>
                   <Button type="submit">{props.modoEdicao ? "Alterar" : "Confirmar"}</Button>
               </Col>
               <Col md={{ offset: 1 }}>
                   <Button onClick={() => {
                       props.setExibirTabela(true);
                   }}>Voltar</Button>
               </Col>
           </Row>
           <Toaster position="top-right"/>
       </Form>
       {
           mensagemExibida ? <Alert variant='succeess'>{mensagem}</Alert>:""
       }
       </div>
   );
}
}