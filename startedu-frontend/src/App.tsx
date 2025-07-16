import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Aluno from "./pages/Aluno";
import CadastroImovel from "./pages/CadastroImovel";
import Imovel from "./pages/Imovel";
import Interesse from "./pages/Interesse";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aluno" element={<Aluno />} />
        <Route path="/imovel" element={<CadastroImovel />} />
        <Route path="/imovel/:id" element={<Imovel />} />
        <Route path="/interesse/:id" element={<Interesse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
