import { api } from "./api";
import { salvarToken, salvarUsuario } from "./authService";

interface UserData {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: string;
  token?: string;
}

// Interface atualizada para incluir os campos retornados pela API
interface RegisterResponse {
  id: number;
  nome: string;
  email: string;
  token: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const cadastrar = async (userData: UserData) => {
  console.log("Chamando API com dados:", userData);
  const response = await api.post<RegisterResponse>("/auth/register", userData);
  
  if (response && response.data) {
    console.log("Cadastro realizado com sucesso:", response);
    
    // Capturar os dados retornados pela API
    const { id, nome, email, token } = response.data;
    
    // Atualizar userData com os dados retornados
    const userDataCompleto: UserData = {
      ...userData,
      id: id,
      nome: nome,
      email: email,
      token: token
    };
    
    // Salvar token e usuário com todos os dados
    salvarToken(token);
    salvarUsuario(userDataCompleto);
  }

  return response;
};