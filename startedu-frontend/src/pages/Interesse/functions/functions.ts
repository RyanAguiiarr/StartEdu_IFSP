import axios from "axios";
import imovelPadrao from "../../../images/imovel_teste.jpg";

// Interfaces para tipagem
interface ImagemImovel {
  id: number;
  url: string;
  imovel_id: number;
}

interface Imovel {
  id?: number;
  nome: string;
  endereco: string;
  numero: string;
  descricao: string;
  num_quartos?: number;
  num_banheiros?: number;
  mobiliado?: boolean;
  status?: boolean;
  imagens?: ImagemImovel[];
  preco?: string;
  rating?: string;
}

interface Interesse {
  id: number;
  aluno: {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    sexo: string;
  };
  imovel_id: {
    id: number;
    nome: string;
    endereco: string;
    numero: string;
    descricao: string;
    num_quartos: number;
    num_banheiros: number;
    mobiliado: boolean;
    status: boolean;
    preco: string;
    imagens: string[];
  };
  mensagem: string;
  data_interesse: string;
  status: "PENDENTE" | "ACEITO" | "RECUSADO";
}

// Função para buscar interesses do aluno logado
export const buscarInteressesAluno = async (
  alunoId: number
): Promise<Interesse[]> => {
  try {
    // TODO: Implementar chamada real para API
    const response = await axios.get<Interesse[]>(
      `/api/interesses/aluno/${alunoId}`
    );

    // Processar as imagens dos interesses usando a lógica da home
    const interessesComImagens = processarImagensInteresses(response.data);

    return interessesComImagens;
  } catch (error) {
    console.error("Erro ao buscar interesses:", error);
    throw error;
  }
};

// Função para cancelar interesse
export const cancelarInteresse = async (interesseId: number): Promise<void> => {
  try {
    // TODO: Implementar chamada real para API
    await axios.delete(`/api/interesses/${interesseId}`);
  } catch (error) {
    console.error("Erro ao cancelar interesse:", error);
    throw error;
  }
};

// Função para enviar mensagem de interesse
export const enviarInteresse = async (
  alunoId: number,
  imovelId: number,
  mensagem: string
): Promise<Interesse> => {
  try {
    // TODO: Implementar chamada real para API
    const response = await axios.post<Interesse>("/api/interesses", {
      aluno_id: alunoId,
      imovel_id: imovelId,
      mensagem: mensagem,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar interesse:", error);
    throw error;
  }
};

// Função para atualizar status do interesse
export const atualizarStatusInteresse = async (
  interesseId: number,
  novoStatus: "pendente" | "aceito" | "recusado"
): Promise<Interesse> => {
  try {
    // TODO: Implementar chamada real para API
    const response = await axios.patch<Interesse>(
      `/api/interesses/${interesseId}`,
      {
        status: novoStatus,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar status do interesse:", error);
    throw error;
  }
};

// Função para buscar todos os interesses (para proprietários)
export const buscarTodosInteresses = async (): Promise<Interesse[]> => {
  try {
    // TODO: Implementar chamada real para API
    const response = await axios.get<Interesse[]>("/api/interesses");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar todos os interesses:", error);
    throw error;
  }
};

// Função para buscar interesses por imóvel
export const buscarInteressesPorImovel = async (
  imovelId: number
): Promise<Interesse[]> => {
  try {
    // TODO: Implementar chamada real para API
    const response = await axios.get<Interesse[]>(
      `/api/interesses/imovel/${imovelId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar interesses por imóvel:", error);
    throw error;
  }
};

// Função para formatar data
export const formatarData = (dataString: string): string => {
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Função para obter texto do status
export const getStatusText = (status: string): string => {
  switch (status) {
    case "aceito":
      return "Aceito";
    case "recusado":
      return "Recusado";
    default:
      return "Pendente";
  }
};

// Função para validar mensagem de interesse
export const validarMensagemInteresse = (mensagem: string): boolean => {
  return mensagem.trim().length >= 10 && mensagem.trim().length <= 500;
};

// Função para contar interesses por status
export const contarInteressesPorStatus = (interesses: Interesse[]) => {
  return {
    pendentes: interesses.filter((i) => i.status === "PENDENTE").length,
    aceitos: interesses.filter((i) => i.status === "ACEITO").length,
    recusados: interesses.filter((i) => i.status === "RECUSADO").length,
    total: interesses.length,
  };
};

// Função para filtrar interesses por status
export const filtrarInteressesPorStatus = (
  interesses: Interesse[],
  status: "todos" | "PENDENTE" | "ACEITO" | "RECUSADO"
): Interesse[] => {
  if (status === "todos") {
    return interesses;
  }
  return interesses.filter((interesse) => interesse.status === status);
};

// Função para ordenar interesses por data
export const ordenarInteressesPorData = (
  interesses: Interesse[],
  ordem: "asc" | "desc" = "desc"
): Interesse[] => {
  return [...interesses].sort((a, b) => {
    const dataA = new Date(a.data_interesse).getTime();
    const dataB = new Date(b.data_interesse).getTime();
    return ordem === "desc" ? dataB - dataA : dataA - dataB;
  });
};

// Função para processar imagens dos interesses (baseada na lógica da home)
export const processarImagensInteresse = (interesse: Interesse): Interesse => {
  let imageUrl = imovelPadrao; // Imagem padrão

  // Verificamos o formato da propriedade imagens
  console.log("Formato das imagens do interesse:", interesse.imovel_id.imagens);

  if (interesse.imovel_id.imagens) {
    // Se imagens for um array de strings
    if (
      Array.isArray(interesse.imovel_id.imagens) &&
      typeof interesse.imovel_id.imagens[0] === "string"
    ) {
      // Extrair o nome do arquivo do caminho completo usando uma abordagem cross-platform
      const caminhoCompleto = interesse.imovel_id.imagens[0];
      // Remove tanto barras normais (/) quanto invertidas (\) para compatibilidade Windows/Linux
      const filename = caminhoCompleto.split(/[/\\]/).pop();
      if (filename) {
        imageUrl = `http://localhost:8080/imovel/images/${filename}`;
        console.log(`URL da imagem formatada: ${imageUrl}`);
      }
    }
  }

  return {
    ...interesse,
    imovel_id: {
      ...interesse.imovel_id,
      imagens: [imageUrl], // Substitui por array com URL processada
    },
  };
};

// Função para processar array de interesses
export const processarImagensInteresses = (
  interesses: Interesse[]
): Interesse[] => {
  return interesses.map((interesse) => processarImagensInteresse(interesse));
};

// Exports das interfaces para usar em outros arquivos
export type { Interesse, Imovel, ImagemImovel };
