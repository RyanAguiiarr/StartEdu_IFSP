import { api } from "./api";
import { salvarUsuario } from "./authService";

interface UserData {
  email: string;
  senha: string;
}

// Adicionar log para depuração
export const logar = (userData: UserData) => {
  console.log("Chamando API com dados:", userData);
  salvarUsuario(userData);
  return api.post("/auth/login", userData);
};
