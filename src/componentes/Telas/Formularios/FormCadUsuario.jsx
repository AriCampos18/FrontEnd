import { Button, Spinner, Col, Form, InputGroup,
    Row, Alert
} from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { consultarPrivilegio } from "../../../servicos/servicoPrivilegio.js"
import ESTADO from '../../../redux/estado.js';
import toast, {Toaster} from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { inserirUsuario, atualizarUsuario } from '../../../redux/usuarioReducer';

export default function FormCadUsuario(props) {
const [usuario, setUsuario] = useState(props.usuarioSelecionado);
const [formValidado, setFormValidado] = useState(false);
const [privilegios, setPrivilegios] = useState([]);
const [temPrivilegios, setTemPrivilegios] = useState(false);
const {estado,mensagem,listaDeUsuarios}=useSelector((state)=>state.usuario);
const [mensagemExibida, setMensagemExibida]= useState("");
const despachante = useDispatch();

//Ao usar REDUX, as categorias não serão recuperadas diretamente do backend (camada de serviço)
//E sim acessando o estado da aplicação particularmente da fatia categoria (categoriaSlice)
//const = {status, mensagem, listaDeProdutos}=useSelector((state)=>{state.categoria});
//Proposito de recuperar de um unico ponto central as informações/dados da aplicação
useEffect(()=>{
   consultarPrivilegio().then((resultado)=>{
       if (Array.isArray(resultado)){
           setPrivilegios(resultado);
           setTemPrivilegios(true);
       }
       else{
           toast.error("Não foi possível carregar os privilegios");
       }
   }).catch((erro)=>{
       setTemPrivilegios(false);
       toast.error("Não foi possível carregar os privilegios");
   });
   
},[]); //didMount

function selecionarPrivilegio(evento){
   setUsuario({...usuario, 
                  privilegio:{
                  codigo: evento.currentTarget.value

                  }});
}

function manipularSubmissao(evento) {
   const form = evento.currentTarget;
   if (form.checkValidity()) {
       if (!props.modoEdicao) {
           //cadastrar o produto
           despachante(inserirUsuario(usuario));
           setMensagemExibida(mensagem);
           setTimeout(()=>{
               setMensagemExibida("");
               setUsuario({
                   id: 0,
                   nome: "",
                   email: "",
                   senha: "",
                   idade: 0,
                   endereco: "",
                   privilegio:""
               });
           },5000);
       }
       else {
           despachante(atualizarUsuario(usuario));
           setMensagemExibida(mensagem);
           //voltar para o modo de inclusão
           setTimeout(()=>{
               props.setModoEdicao(false);
               props.setUsuarioSelecionado({
                    id: 0,
                    nome: "",
                    email: "",
                    senha: "",
                    idade: 0,
                    endereco: "",
                    privilegio:""
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
   setUsuario({ ...usuario, [elemento]: valor });
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
                   <Form.Label>ID</Form.Label>
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
                       <InputGroup.Text id="nome">@</InputGroup.Text>
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
                           Por favor, informe o email do usuario!
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
                           Por favor, informe a senha do usuario!
                       </Form.Control.Feedback>
                   </InputGroup>
               </Form.Group>
           </Row>
           <Row className="mb-4">
                <Form.Group as={Col} md="12">
                        <Form.Label>Endereço:</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            id="endereco"
                            name="endereco"
                            value={usuario.endereco}
                            onChange={manipularMudanca}
                        />
                        <Form.Control.Feedback type="invalid">Por favor, informe o endereco do usuario!</Form.Control.Feedback>
                    </Form.Group>
               <Form.Group as={Col} md={7}>
                   <Form.Label>Privilegio:</Form.Label>
                   <Form.Select id='privilegio' 
                               name='privilegio'
                               onChange={selecionarPrivilegio}>
                               <option value="">Selecione um privilegio</option>
                       {// criar em tempo de execução as categorias existentes no banco de dados
                           privilegios.map((privilegio) =>{
                               return <option value={privilegio.codigo}>
                                           {privilegio.descricao}
                                   </option>
                           })
                       }
                       
                   </Form.Select>
               </Form.Group>
               <Form.Group as={Col} md={1}>
                   {
                   !temPrivilegios ? <Spinner className='mt-4' animation="border" variant="success" />
                   : ""
                   }
               </Form.Group>
           </Row>
           <Row className='mt-2 mb-2'>
               <Col md={1}>
                   <Button type="submit" disabled={!temPrivilegios}>{props.modoEdicao ? "Alterar" : "Confirmar"}</Button>
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