import { api } from "./api";

interface UserData {
  nome: string;
  endereco: string;
  numero: string;
  descricao: string;
  num_quartos: number;
  num_banheiros: number;
  mobiliado: boolean;
  status: boolean;
}

// Adicionar log para depuração
export const cadastrarImovel = (userData: UserData) => {
  console.log("Chamando API com dados:", userData);
  return api.post("/imovel", userData);
};
