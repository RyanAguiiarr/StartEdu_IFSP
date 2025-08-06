import { api } from "./api";
import { salvarToken, buscarDadosUsuario, salvarUsuario } from "./authService";
import type { Usuario } from "./authService";

interface UserData {
  email: string;
  senha: string;
  token?: string;
}

interface LoginResponse {
  id: number;
  nome: string;
  email: string;
  token: string;
}

// Adicionar log para depuração
export const logar = async (userData: UserData) => {
  console.log("Chamando API com dados:", userData);
  const response = await api.post<LoginResponse>("/auth/login", userData);

  if (response?.data) {
    console.log("Login realizado com sucesso:", response);

    // Criar objeto do usuário com os dados do login
    const usuarioInicial: Usuario = {
      id: response.data.id,
      nome: response.data.nome,
      email: response.data.email,
      token: response.data.token
    };

    console.log("Salvando dados iniciais do usuário:", usuarioInicial);

    // Salvar token e dados iniciais do usuário
    salvarToken(response.data.token);
    salvarUsuario(usuarioInicial);

    // Tentar buscar dados completos do usuário
    try {
      const usuarioCompleto = await buscarDadosUsuario(userData.email);
      if (usuarioCompleto) {
        console.log("Dados completos do usuário obtidos:", usuarioCompleto);
      }
    } catch (erro) {
      console.log("Erro ao buscar dados completos, mantendo dados iniciais do login:", erro);
    }
  }

  return response;
};
