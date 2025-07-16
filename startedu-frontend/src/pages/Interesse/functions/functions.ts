import { api } from "../../../services/api";

// Interface para a resposta da API
interface ApiResponse {
  dados: ApiInteresse[];
  mensagem: string;
  sucesso: boolean;
}

// Interface para o interesse como vem da API
interface ApiInteresse {
  id: number;
  aluno: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    cpf?: string;
    dataNascimento?: string;
    sexo?: string;
  };
  imovel_id: {
    id: number;
    nome: string;
    endereco: string;
    numero: string;
    descricao: string;
    num_quartos?: number;
    num_banheiros?: number;
    mobiliado?: boolean;
    preco: number | string;
    imagens?: unknown[];
  };
  mensagem: string;
  data_interesse: string;
  status: "ACEITO" | "RECUSADO" | "PENDENTE";
}

// Tipo para representar um interesse
export interface Interesse {
  id: number;
  descricao?: string;
  dataCriacao?: string;
  status: "ACEITO" | "RECUSADO" | "PENDENTE";
  valorSugerido?: number;
  mensagem?: string;
  data_interesse?: string;
  imovel: {
    id: number;
    titulo?: string;
    nome?: string;
    descricao: string;
    preco: number | string;
    imagens: string[] | { id: number; url: string }[];
    enderecoCompleto?: string;
    endereco?: string;
    numero?: string;
    categoria?: string;
    tipo?: string;
    area?: number;
    quartos?: number;
    num_quartos?: number;
    banheiros?: number;
    num_banheiros?: number;
    vagas?: number;
    mobiliado?: boolean;
    status?: boolean;
    dataCriacao?: string;
    usuario?: {
      id: number;
      nome: string;
      email: string;
      telefone: string;
    };
  };
  aluno: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    cpf?: string;
    dataNascimento?: string;
    sexo?: string;
  };
}

// Função para processar imagens de interesse
export const processarImagensInteresse = (imagens: unknown[]): string[] => {
  console.log("Processando imagens:", imagens);

  if (!Array.isArray(imagens) || imagens.length === 0) {
    console.log("Imagens não é um array ou está vazio:", imagens);
    return [];
  }

  return imagens
    .map((imagem) => {
      // Se for uma string, processa da mesma forma que a Home
      if (typeof imagem === "string") {
        // Se já for uma URL completa, retorna como está
        if (imagem.startsWith("http")) {
          return imagem;
        }

        // Extrair o nome do arquivo do caminho completo usando uma abordagem cross-platform
        // Remove tanto barras normais (/) quanto invertidas (\) para compatibilidade Windows/Linux
        const filename = imagem.split(/[/\\]/).pop();
        if (filename) {
          const imageUrl = `http://localhost:8080/imovel/images/${filename}`;
          console.log(`URL da imagem formatada: ${imageUrl}`);
          return imageUrl;
        }

        // Fallback para uploads se não conseguir extrair o filename
        return `http://localhost:8080/uploads/${imagem}`;
      }

      // Se for um objeto com propriedade url
      if (typeof imagem === "object" && imagem !== null && "url" in imagem) {
        const obj = imagem as { url?: string };
        if (obj.url && typeof obj.url === "string") {
          if (obj.url.startsWith("http")) {
            return obj.url;
          }

          const filename = obj.url.split(/[/\\]/).pop();
          if (filename) {
            return `http://localhost:8080/imovel/images/${filename}`;
          }

          return `http://localhost:8080/uploads/${obj.url}`;
        }
      }

      // Se for um objeto com propriedade nome/name
      if (typeof imagem === "object" && imagem !== null) {
        const obj = imagem as { nome?: string; name?: string };
        const nomeImagem = obj.nome || obj.name;
        if (nomeImagem && typeof nomeImagem === "string") {
          if (nomeImagem.startsWith("http")) {
            return nomeImagem;
          }

          const filename = nomeImagem.split(/[/\\]/).pop();
          if (filename) {
            return `http://localhost:8080/imovel/images/${filename}`;
          }

          return `http://localhost:8080/uploads/${nomeImagem}`;
        }
      }

      // Fallback: converte para string e tenta extrair filename
      const imagemStr = String(imagem);
      if (imagemStr && imagemStr !== "undefined" && imagemStr !== "null") {
        if (imagemStr.startsWith("http")) {
          return imagemStr;
        }

        const filename = imagemStr.split(/[/\\]/).pop();
        if (filename) {
          return `http://localhost:8080/imovel/images/${filename}`;
        }

        return `http://localhost:8080/uploads/${imagemStr}`;
      }

      return "";
    })
    .filter(Boolean); // Remove valores falsy
};

// Função para buscar interesses do aluno
export const buscarInteressesAluno = async (
  alunoId: number
): Promise<Interesse[]> => {
  try {
    const response = await api.get(`/interesse/${alunoId}`);

    console.log("Dados recebidos da API:", response.data);

    // A API retorna: { data: { dados: [...], mensagem: "...", sucesso: true } }
    const apiData = response.data as ApiResponse;

    if (!apiData.sucesso || !apiData.dados) {
      throw new Error(apiData.mensagem || "Erro ao buscar interesses");
    }

    const interessesData = apiData.dados;
    return interessesData.map(
      (apiInteresse: ApiInteresse): Interesse => ({
        id: apiInteresse.id,
        descricao: apiInteresse.mensagem,
        dataCriacao: apiInteresse.data_interesse,
        status: apiInteresse.status,
        valorSugerido: 0,
        mensagem: apiInteresse.mensagem,
        data_interesse: apiInteresse.data_interesse,
        imovel: {
          id: apiInteresse.imovel_id.id,
          titulo: apiInteresse.imovel_id.nome,
          nome: apiInteresse.imovel_id.nome,
          descricao: apiInteresse.imovel_id.descricao,
          preco: apiInteresse.imovel_id.preco,
          imagens: processarImagensInteresse(
            Array.isArray(apiInteresse.imovel_id.imagens)
              ? apiInteresse.imovel_id.imagens
              : []
          ),
          enderecoCompleto: `${apiInteresse.imovel_id.endereco}, ${apiInteresse.imovel_id.numero}`,
          endereco: apiInteresse.imovel_id.endereco,
          numero: apiInteresse.imovel_id.numero,
          categoria: "Residencial",
          tipo: "Apartamento",
          area: 0,
          quartos: apiInteresse.imovel_id.num_quartos || 0,
          num_quartos: apiInteresse.imovel_id.num_quartos,
          banheiros: apiInteresse.imovel_id.num_banheiros || 0,
          num_banheiros: apiInteresse.imovel_id.num_banheiros,
          vagas: 0,
          mobiliado: apiInteresse.imovel_id.mobiliado || false,
          status: true,
          dataCriacao: apiInteresse.data_interesse,
        },
        aluno: apiInteresse.aluno,
      })
    );
  } catch (error) {
    console.error("Erro ao buscar interesses:", error);
    throw error;
  }
};

// Função para cancelar interesse
export const cancelarInteresse = async (interesseId: number): Promise<void> => {
  try {
    await api.delete(`/interesse/${interesseId}`);
  } catch (error) {
    console.error("Erro ao cancelar interesse:", error);
    throw error;
  }
};

// Função para formatar data
export const formatarData = (data: string): string => {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Função para obter texto do status
export const getStatusText = (status: string): string => {
  const statusMap = {
    ACEITO: "Aceito",
    RECUSADO: "Recusado",
    PENDENTE: "Pendente",
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

// Função para obter cor do status
export const getStatusColor = (status: string): string => {
  const colorMap = {
    ACEITO: "#4CAF50",
    RECUSADO: "#f44336",
    PENDENTE: "#FF9800",
  };
  return colorMap[status as keyof typeof colorMap] || "#757575";
};
