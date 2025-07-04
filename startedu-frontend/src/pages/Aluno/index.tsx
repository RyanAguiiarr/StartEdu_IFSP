import React, { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {
  salvarUsuario,
  obterUsuario,
  buscarDadosUsuario,
} from "../../services/authService";
import styles from "./Aluno_style.module.css";
import { validarCamposAluno } from "./functions/functions";

// Usando uma imagem base64 inline (uma imagem de avatar simples em roxo)
const defaultProfileImage =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzVhMTg5YSIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9Ijk2IiByPSI0MCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yMTYsMTg0LjVjMC00OC42LTM5LjQtODgtODgtODhzLTg4LDM5LjQtODgsODhjMCw4LjMsMS4yLDE2LjMsMy4zLDI0YzQuOCwxNS43LDEzLjcsMjkuNSwyNS45LDQwLjJsNS40LDQuNUg5NmwxMTIsMC4ybDEwLjktMC43QzIzMS43LDI0MC40LDI0NCwyMTMuOSwyNDQsMTg0LjVDMjQ0LDE4NC41LDIxNiwxODQuNSwyMTYsMTg0LjV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+";

interface AlunoData {
  id?: number;
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

  validarCamposAluno(aluno, foto);

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

    // Validação dos campos obrigatórios
    const validacao = validarCamposAluno(aluno, foto);
    const camposInvalidos = validacao.filter((item) => !item.valido);

    if (camposInvalidos.length > 0) {
      const mensagensErro = camposInvalidos.map((item) => {
        switch (item.campo) {
          case "nome":
            return `${item.nome} deve ter pelo menos 2 caracteres`;
          case "cpf":
            return `${item.nome} deve ter 11 dígitos`;
          case "email":
            return `${item.nome} deve ter um formato válido`;
          case "telefone":
            return `${item.nome} deve ter pelo menos 10 dígitos`;
          case "foto":
            return `${item.nome} é obrigatória`;
          default:
            return `${item.nome} é obrigatório`;
        }
      });

      console.log("validção", validacao);
      console.log("Campos inválidos:", mensagensErro);
      console.log("Dados do aluno:", aluno);
      console.log("Foto selecionada:", foto);

      setMensagem({
        tipo: "erro",
        texto: `Verifique os seguintes campos: ${mensagensErro.join(", ")}`,
      });
      setLoading(false);
      return;
    }

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

      let response;
      const usuarioLogado = obterUsuario();

      // Verificar se é atualização (usuário existe) ou criação (novo usuário)
      if (usuarioLogado && usuarioLogado.id) {
        // Usuário já existe - fazer PUT (atualização)
        response = await axios.put("http://localhost:8080/aluno", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Novo usuário - fazer POST (criação)
        response = await axios.post("http://localhost:8080/aluno", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // se for mandado um email no formData, o backend irá atualizar o email no cadastro do alunoData
      const emailAntigo = usuarioLogado?.email;
      if (aluno.email && emailAntigo && aluno.email !== emailAntigo) {
        try {
          await axios.put(
            `http://localhost:8080/auth`,
            {
              emailAntigo: emailAntigo,
              novoEmail: aluno.email,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Email atualizado com sucesso no cadastro");
        } catch (emailError) {
          console.error("Erro ao atualizar email no cadastro:", emailError);
          // Continua o processo mesmo se falhar a atualização do email
        }
      }

      // Obter dados do aluno da resposta
      const alunoSalvo = response.data as {
        id?: string;
        nome?: string;
        email?: string;
        telefone?: string;
        imagem?: string;
        // adicione outros campos se necessário
      };

      // Buscar e salvar dados completos do usuário atualizado
      if (alunoSalvo.email) {
        await buscarDadosUsuario(alunoSalvo.email);
      } else {
        // Fallback: salvar dados básicos se não conseguir buscar dados completos
        salvarUsuario({
          id: Number(alunoSalvo.id),
          nome: alunoSalvo.nome || "",
          email: alunoSalvo.email || aluno.email || "",
          foto: fotoPreview || defaultProfileImage,
        });
      }

      setMensagem({
        tipo: "sucesso",
        texto: "Perfil atualizado com sucesso!",
      });

      // Limpar formulário após 2 segundos
      setTimeout(() => {
        setMensagem(null);
        // Redirecionar para a página inicial
        window.location.href = "/";
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
    <div className={styles.perfilAlunoContainer}>
      <div className={styles.perfilHeader}>
        <h1>Perfil do Aluno</h1>
        <p>Personalize suas informações de perfil</p>
      </div>

      {mensagem && (
        <div className={`${styles.mensagem} ${styles[mensagem.tipo]}`}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.perfilForm}>
        <div className={styles.fotoPerfilContainer}>
          <div
            className={styles.fotoPerfil}
            onClick={handleClickFoto}
            style={{
              backgroundImage: `url(${fotoPreview || defaultProfileImage})`,
            }}
          >
            <div className={styles.fotoOverlay}>
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

        <div className={styles.formGroup}>
          <label htmlFor="nome">Nome Completo*</label>
          <input
            type="text"
            required
            id="nome"
            name="nome"
            value={aluno.nome}
            onChange={handleChange}
            placeholder="Ex: Maria Silva"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="cpf">CPF*</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={aluno.cpf}
              required
              onChange={(e) =>
                setAluno({ ...aluno, cpf: formatarCPF(e.target.value) })
              }
              placeholder="Ex: 123.456.789-00"
              maxLength={14}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dataNascimento">Data de Nascimento*</label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={aluno.dataNascimento}
              required
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">E-mail*</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={aluno.email}
            onChange={handleChange}
            placeholder="Ex: maria@email.com"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="telefone">Telefone*</label>
            <input
              type="text"
              id="telefone"
              required
              name="telefone"
              value={aluno.telefone}
              onChange={(e) =>
                setAluno({
                  ...aluno,
                  telefone: formatarTelefone(e.target.value),
                })
              }
              placeholder="Ex: (11) 98765-4321"
              maxLength={15}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="sexo">Sexo*</label>
            <select
              id="sexo"
              required
              name="sexo"
              value={aluno.sexo}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
              <option value="N">Prefiro não informar</option>
            </select>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.btnSalvar} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Perfil"}
          </button>
          <button
            type="button"
            className={styles.btnCancelar}
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
