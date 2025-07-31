import { api } from "./api";

interface Usuario {
  id?: number;
  nome?: string;
  email: string;
  foto?: string;
}

interface ImagemAluno {
  url: string;
}

interface AlunoResponse {
  id: number;
  nome: string;
  email: string;
  image?: ImagemAluno;
}

// Função para salvar dados do usuário no localStorage
export const salvarUsuario = (usuario: Usuario | null): void => {
  if (!usuario) {
    localStorage.removeItem("usuario");
    return;
  }
  try {
    localStorage.setItem("usuario", JSON.stringify(usuario));
  } catch (error) {
    console.error("Erro ao salvar usuário no localStorage:", error);
    localStorage.removeItem("usuario");
  }
};

// Função para salvar apenas o token
export const salvarToken = (token: string): void => {
  localStorage.setItem("token", token);
};

// Função para obter o token
export const obterToken = (): string | null => {
  return localStorage.getItem("token");
};

// Função para obter dados do usuário do localStorage
export const obterUsuario = (): Usuario | null => {
  try {
    const usuarioSalvo = localStorage.getItem("usuario");
    if (
      !usuarioSalvo ||
      usuarioSalvo === "undefined" ||
      usuarioSalvo === "null"
    ) {
      return null;
    }
    return JSON.parse(usuarioSalvo);
  } catch (error) {
    console.error("Erro ao obter usuário do localStorage:", error);
    return null;
  }
};

// Função para verificar se usuário está logado
export const estaLogado = (): boolean => {
  const usuario = obterUsuario();
  const token = obterToken();
  return usuario !== null && token !== null && token !== "undefined";
};

// Função para fazer logout
export const fazerLogout = (): void => {
  localStorage.removeItem("usuario");
  localStorage.removeItem("token");
};

// Função para buscar dados completos do usuário logado
export const buscarDadosUsuario = async (
  email: string
): Promise<Usuario | null> => {
  try {
    const token = obterToken();
    if (!token) {
      throw new Error("Token não encontrado");
    }

    // Buscar dados do aluno pelo email (o interceptor já adiciona o token)
    const response = await api.get<AlunoResponse>(`/aluno?email=${email}`);

    if (response.data) {
      const usuarioCompleto: Usuario = {
        id: response.data.id,
        nome: response.data.nome,
        email: response.data.email,
        foto: response.data.image?.url
          ? `http://localhost:8080/aluno/images/${response.data.image.url
              .split(/[/\\]/)
              .pop()}`
          : undefined,
      };
      console.log("Dados completos do usuário:", usuarioCompleto);

      // Salvar os dados completos do usuário
      salvarUsuario(usuarioCompleto);
      return usuarioCompleto;
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
};
