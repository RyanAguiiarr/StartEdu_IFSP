import { api } from "./api";

interface UserData {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: string;
}

// Adicionar log para depuração
export const cadastrar = (userData: UserData) => {
  console.log("Chamando API com dados:", userData);
  return api.post("/auth/register", userData);
};
