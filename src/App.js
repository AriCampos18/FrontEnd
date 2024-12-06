import TelaCadastroProduto from "./componentes/Telas/TelaCadastroProduto";
import TelaCadastroCategoria from "./componentes/Telas/TelaCadastroCategoria";
import TelaCadastroCliente from "./componentes/Telas/TelaCadastroCliente";
import TelaCadastroFornecedor from "./componentes/Telas/TelaCadastroFornecedor";
import TelaCadastroUsuario from "./componentes/Telas/TelaCadastroUsuario";
import TelaCadastroPrivilegios from "./componentes/Telas/TelaCadastroPrivilegio";
import TelaMenu from "./componentes/Telas/TelaMenu";
import Tela404 from "./componentes/Telas/Tela404";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TelaLogin from "./componentes/Telas/TelaLogin";
import { useState, createContext } from "react";
import store from './redux/store';
import { Provider } from "react-redux";

export const ContextoUsuario=createContext();

function App() {

  const [usuario,setUsuario]=useState({
    "usuario":"",
    "logado":false
  });

  if(!usuario.logado){
    return(
      <ContextoUsuario.Provider value={{usuario,setUsuario}}>
        <TelaLogin/>
      </ContextoUsuario.Provider>
    );
  }
  else{
    return (
      <div className="App">
        <Provider store={store}>
        <ContextoUsuario.Provider value ={{usuario,setUsuario}}>
          <BrowserRouter>
            { //A ordem das rotas é importante 
            }
            <Routes>
              <Route path="/produto" element={<TelaCadastroProduto />} />
              <Route path="/categoria" element={<TelaCadastroCategoria />} />
              <Route path="/usuario" element={<TelaCadastroUsuario />} />
              <Route path="/cliente" element={<TelaCadastroCliente/>} />
              <Route path="/privilegio" element={<TelaCadastroPrivilegios />} />
              <Route path="/fornecedor" element={<TelaCadastroFornecedor/>}/>
              <Route path="/" element={<TelaMenu />} />
              <Route path="*" element={<Tela404 />} />
            </Routes>
          </BrowserRouter>
        </ContextoUsuario.Provider>
        </Provider>
      </div>
    );
  }
}

export default App;
