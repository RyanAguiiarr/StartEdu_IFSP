import { api } from "./api";
import { salvarUsuario } from "./authService";

interface UserData {
  email: string;
  senha: string;
  token?: string;
}

// Adicionar log para depuração
export const logar = async (userData: UserData) => {
  console.log("Chamando API com dados:", userData);
  const response = await api.post("/auth/login", userData);
  if (
    response &&
    response.data &&
    typeof response.data === "object" &&
    "token" in response.data
  ) {
    console.log("Login realizado com sucesso:", response);
    salvarUsuario(userData);
  }
  return response;
};
