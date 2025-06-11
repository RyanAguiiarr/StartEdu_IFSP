import React, { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { salvarUsuario } from "../../services/authService";
import "./style.css";

// Usando uma imagem base64 inline (uma imagem de avatar simples em roxo)
const defaultProfileImage =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzVhMTg5YSIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9Ijk2IiByPSI0MCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yMTYsMTg0LjVjMC00OC42LTM5LjQtODgtODgtODhzLTg4LDM5LjQtODgsODhjMCw4LjMsMS4yLDE2LjMsMy4zLDI0YzQuOCwxNS43LDEzLjcsMjkuNSwyNS45LDQwLjJsNS40LDQuNUg5NmwxMTIsMC4ybDEwLjktMC43QzIzMS43LDI0MC40LDI0NCwyMTMuOSwyNDQsMTg0LjVDMjQ0LDE4NC41LDIxNiwxODQuNSwyMTYsMTg0LjV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+";

interface AlunoData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  sexo: string;
  dataNascimento: string;
}

const PerfilAluno: React.FC = () => {
  const [aluno, setAluno] = useState<AlunoData>({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    sexo: "",
    dataNascimento: "",
  });

  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [foto, setFoto] = useState<File | null>(null);
  const [mensagem, setMensagem] = useState<{
    tipo: string;
    texto: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAluno({ ...aluno, [name]: value });
  };

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    setFoto(selectedFile);

    // Criar preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    try {
      const formData = new FormData();

      // Adicionar dados do aluno ao FormData
      Object.entries(aluno).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Adicionar a foto se existir
      if (foto) {
        formData.append("imagen", foto);
      }

      // Enviar para a API
      const response = await axios.post(
        "http://localhost:8080/aluno",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Obter dados do aluno da resposta
      const alunoSalvo = response.data as {
        id: string;
        nome: string;
        email: string;
        // adicione outros campos se necessário
      };

      // Salvar dados do usuário no localStorage
      salvarUsuario({
        id: Number(alunoSalvo.id),
        nome: alunoSalvo.nome,
        email: alunoSalvo.email,
        foto: fotoPreview || defaultProfileImage, // Salvar o preview da foto que já está em base64
      });

      setMensagem({
        tipo: "sucesso",
        texto: "Perfil atualizado com sucesso!",
      });

      // Limpar formulário após 2 segundos
      setTimeout(() => {
        setMensagem(null);
        // Redirecionar para a página inicial
        window.location.href = "/home";
      }, 2000);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMensagem({
        tipo: "erro",
        texto: "Erro ao atualizar perfil. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClickFoto = () => {
    fileInputRef.current?.click();
  };

  const formatarCPF = (cpf: string) => {
    return cpf
      .replace(/\D/g, "") // Remove caracteres não numéricos
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após os primeiros 3 dígitos
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após os segundos 3 dígitos
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2") // Coloca hífen antes dos últimos 2 dígitos
      .substring(0, 14); // Limita a 14 caracteres (incluindo pontos e hífen)
  };

  const formatarTelefone = (telefone: string) => {
    return telefone
      .replace(/\D/g, "") // Remove caracteres não numéricos
      .replace(/(\d{2})(\d)/, "($1) $2") // Coloca parênteses em volta dos primeiros 2 dígitos
      .replace(/(\d{5})(\d)/, "$1-$2") // Coloca hífen após os primeiros 5 dígitos
      .substring(0, 15); // Limita a 15 caracteres
  };

  return (
    <div className="perfil-aluno-container">
      <div className="perfil-header">
        <h1>Perfil do Aluno</h1>
        <p>Personalize suas informações de perfil</p>
      </div>

      {mensagem && (
        <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>
      )}

      <form onSubmit={handleSubmit} className="perfil-form">
        <div className="foto-perfil-container">
          <div
            className="foto-perfil"
            onClick={handleClickFoto}
            style={{
              backgroundImage: `url(${fotoPreview || defaultProfileImage})`,
            }}
          >
            <div className="foto-overlay">
              <span>Alterar foto</span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFotoChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nome">Nome Completo*</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={aluno.nome}
            onChange={handleChange}
            required
            placeholder="Ex: Maria Silva"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cpf">CPF*</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={aluno.cpf}
              onChange={(e) =>
                setAluno({ ...aluno, cpf: formatarCPF(e.target.value) })
              }
              required
              placeholder="Ex: 123.456.789-00"
              maxLength={14}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dataNascimento">Data de Nascimento*</label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={aluno.dataNascimento}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={aluno.email}
            onChange={handleChange}
            required
            placeholder="Ex: maria@email.com"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telefone">Telefone*</label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={aluno.telefone}
              onChange={(e) =>
                setAluno({
                  ...aluno,
                  telefone: formatarTelefone(e.target.value),
                })
              }
              required
              placeholder="Ex: (11) 98765-4321"
              maxLength={15}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sexo">Sexo*</label>
            <select
              id="sexo"
              name="sexo"
              value={aluno.sexo}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
              <option value="N">Prefiro não informar</option>
            </select>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="btn-salvar" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Perfil"}
          </button>
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PerfilAluno;
