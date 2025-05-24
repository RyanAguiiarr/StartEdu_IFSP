import { api } from "./api";

// Atualizado para receber um FormData para suportar upload de arquivos
export const cadastrarImovel = async (formData: FormData) => {
  try {
    console.log("Chamando API com FormData para cadastro de imóvel");

    // Configurar headers para multipart/form-data
    const response = await api.post("/imovel", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("Erro no serviço de cadastro de imóvel:", error);
    throw error; // Re-throw para que o componente possa tratar
  }
};
