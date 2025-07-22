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
  imovel: {
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

// Tipo para representar um interesse (simplificado - apenas campos usados)
export interface Interesse {
  id: number;
  status: "ACEITO" | "RECUSADO" | "PENDENTE";
  mensagem?: string;
  descricao?: string;
  data_interesse?: string;
  dataCriacao?: string;
  imovel: {
    id: number;
    nome?: string;
    titulo?: string;
    preco: number | string;
    imagens: string[];
    endereco?: string;
    enderecoCompleto?: string;
    numero?: string;
    num_quartos?: number;
    quartos?: number;
    num_banheiros?: number;
    banheiros?: number;
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
  console.log("Buscando interesses para o aluno ID:", alunoId);
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
        mensagem: apiInteresse.mensagem,
        data_interesse: apiInteresse.data_interesse,
        imovel: {
          id: apiInteresse.imovel.id,
          titulo: apiInteresse.imovel.nome,
          nome: apiInteresse.imovel.nome,
          preco: apiInteresse.imovel.preco,
          imagens: processarImagensInteresse(
            Array.isArray(apiInteresse.imovel.imagens)
              ? apiInteresse.imovel.imagens
              : []
          ),
          enderecoCompleto: `${apiInteresse.imovel.endereco}, ${apiInteresse.imovel.numero}`,
          endereco: apiInteresse.imovel.endereco,
          numero: apiInteresse.imovel.numero,
          quartos: apiInteresse.imovel.num_quartos || 0,
          num_quartos: apiInteresse.imovel.num_quartos,
          banheiros: apiInteresse.imovel.num_banheiros || 0,
          num_banheiros: apiInteresse.imovel.num_banheiros,
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
