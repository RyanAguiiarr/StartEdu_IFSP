import { api } from "./api";
import { salvarToken, buscarDadosUsuario } from "./authService";

interface UserData {
  email: string;
  senha: string;
  token?: string;
}

interface LoginResponse {
  token: string;
}

// Adicionar log para depuração
export const logar = async (userData: UserData) => {
  console.log("Chamando API com dados:", userData);
  const response = await api.post<LoginResponse>("/auth/login", userData);

  if (response && response.data && response.data.token) {
    console.log("Login realizado com sucesso:", response);

    // Salvar o token
    salvarToken(response.data.token);

    // Buscar e salvar dados completos do usuário
    const usuarioCompleto = await buscarDadosUsuario(userData.email);
    console.log("Dados completos do usuário:", usuarioCompleto);
  }

  return response;
};
