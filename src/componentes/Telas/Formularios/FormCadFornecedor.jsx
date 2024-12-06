import { Button, Spinner, Col, Form, InputGroup,
    Row, Alert
} from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { alterarFornecedor } from '../../../servicos/servicoFornecedor';
import ESTADO from '../../../redux/estado.js';
import toast, {Toaster} from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { inserirFornecedor, atualizarFornecedor } from '../../../redux/fornecedorReducer';

export default function FormCadProdutos(props) {
const [fornecedor, setFornecedor] = useState(props.fornecedorSelecionado);
const [formValidado, setFormValidado] = useState(false);
const {estado,mensagem,listaDeFornecedores}=useSelector((state)=>state.fornecedor);
const [mensagemExibida, setMensagemExibida]= useState("");
const despachante = useDispatch();

function manipularSubmissao(evento) {
   const form = evento.currentTarget;
   if (form.checkValidity()) {
       if (!props.modoEdicao) {
           despachante(inserirFornecedor(fornecedor));
           setMensagemExibida(mensagem);
           setTimeout(()=>{
               setMensagemExibida("");
               setFornecedor({
                   cnpj: "",
                   nomeEmpresa:"",
                   nomeResponsavel:"",
                   telefone:"",
                   email: "",
                   endereco: "",
                   cidade:"",
                   uf:""
               });
           },5000);
       }
       else {
           despachante(atualizarFornecedor(fornecedor));
           setMensagemExibida(mensagem);
           setTimeout(()=>{
               props.setModoEdicao(false);
               props.setFornecedorSelecionado({
                    cnpj: "",
                    nomeEmpresa:"",
                    nomeResponsavel:"",
                    telefone:"",
                    email: "",
                    endereco: "",
                    cidade:"",
                    uf:""
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
   setFornecedor({ ...fornecedor, [elemento]: valor });
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
                   <Form.Label>CNPJ</Form.Label>
                   <Form.Control
                       required
                       type="text"
                       id="cnpj"
                       name="cnpj"
                       value={fornecedor.cnpj}
                       disabled={props.modoEdicao}
                       onChange={manipularMudanca}
                   />
                   <Form.Control.Feedback type='invalid'>Por favor, informe o cnpj do fornecedor!</Form.Control.Feedback>
               </Form.Group>
           </Row>
           <Row className="mb-4">
               <Form.Group as={Col} md="12">
                   <Form.Label>Nome da Empresa</Form.Label>
                   <Form.Control
                       required
                       type="text"
                       id="nomeEmpresa"
                       name="nomeEmpresa"
                       value={fornecedor.nomeEmpresa}
                       onChange={manipularMudanca}
                   />
                   <Form.Control.Feedback type="invalid">Por favor, informe o nome da empresa fornecedora!</Form.Control.Feedback>
               </Form.Group>
           </Row>
           <Row className="mb-4">
               <Form.Group as={Col} md="12">
                   <Form.Label>Nome do Responsável</Form.Label>
                   <Form.Control
                       required
                       type="text"
                       id="nomeResponsavel"
                       name="nomeResponsavel"
                       value={fornecedor.nomeResponsavel}
                       onChange={manipularMudanca}
                   />
                   <Form.Control.Feedback type="invalid">Por favor, informe o nome do responsavel!</Form.Control.Feedback>
               </Form.Group>
           </Row>
           <Row className="mb-4">
               <Form.Group as={Col} md="4">
                   <Form.Label>Telefone</Form.Label>
                   <InputGroup hasValidation>
                       <InputGroup.Text id="precoCusto">+55</InputGroup.Text>
                       <Form.Control
                           type="text"
                           id="telefone"
                           name="telefone"
                           aria-describedby="telefone"
                           value={fornecedor.telefone}
                           onChange={manipularMudanca}
                           required
                       />
                       <Form.Control.Feedback type="invalid">
                           Por favor, informe o telefone!
                       </Form.Control.Feedback>
                   </InputGroup>
               </Form.Group>
               <Form.Group as={Col} md="4">
                   <Form.Label>Email</Form.Label>
                       <Form.Control
                           type="text"
                           id="email"
                           name="email"
                           aria-describedby="email"
                           value={fornecedor.email}
                           onChange={manipularMudanca}
                           required
                       />
                       <Form.Control.Feedback type="invalid">
                           Por favor, informe o email do fornecedor!
                       </Form.Control.Feedback>
               </Form.Group>
           </Row>
           <Row className="mb-4">
               <Form.Group as={Col} md="12">
                   <Form.Label>Endereco</Form.Label>
                   <Form.Control
                       required
                       type="text"
                       id="endereco"
                       name="endereco"
                       value={fornecedor.endereco}
                       onChange={manipularMudanca}
                   />
                   <Form.Control.Feedback type="invalid">Por favor, informe o enedereco do fornecedor!</Form.Control.Feedback>
               </Form.Group>
           </Row>
           <Row className="mb-4">
               <Form.Group as={Col} md="4">
                   <Form.Label>Cidade</Form.Label>
                   <Form.Control
                       required
                       type="text"
                       id="cidade"
                       name="cidade"
                       value={fornecedor.cidade}
                       onChange={manipularMudanca}
                   />
                   <Form.Control.Feedback type="invalid">Por favor, informe a cidade do fornecedor!</Form.Control.Feedback>
               </Form.Group>
               <Form.Group as={Col} md="4">
                   <Form.Label>Estado</Form.Label>
                   <InputGroup hasValidation>
                       <InputGroup.Text id="uf">UF</InputGroup.Text>
                       <Form.Select id='uf' 
                               name='uf'
                               value={fornecedor.uf}
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
                       <Form.Control.Feedback type="invalid">
                           Por favor, informe o estado!
                       </Form.Control.Feedback>
                   </InputGroup>
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