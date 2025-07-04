import { api } from "./api";
import { salvarUsuario } from "./authService";

interface UserData {
  nome: string;
  email: string;
  tipoUsuario: string;
  token?: string;
}

// Adicionar log para depuração
interface RegisterResponse {
  token: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const cadastrar = async (userData: UserData) => {
  console.log("Chamando API com dados:", userData);
  const response = await api.post<RegisterResponse>("/auth/register", userData);
  if (response) {
    console.log("Cadastro realizado com sucesso:", response);
    userData.token = response.data.token; // Supondo que a API retorne um token
    salvarUsuario(userData);
  }

  return response;
};
