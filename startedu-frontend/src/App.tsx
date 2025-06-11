import Cadastro from "./pages/Cadastro";
import CadastroImovel from "./pages/CadastroImovel";
import Home from "./pages/Home";
import Aluno from "./pages/Aluno";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/imovel" element={<CadastroImovel />} />
        <Route path="/aluno" element={<Aluno />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
