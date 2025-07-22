import { api } from "../../../services/api";

interface AlunoMatch {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  image?: string;
  foto?: unknown; // Para lidar com fotos vindas da API
}

interface ImovelMatch {
  id: number;
  nome: string;
  endereco: string;
  numero: string;
  preco: string;
  imagens: string[];
  num_quartos: number;
  num_banheiros: number;
}

interface Match {
  id: number;
  imovel: ImovelMatch;
  alunosInteressados: AlunoMatch[];
  dataMatch: string;
  status: "NOVO" | "VISUALIZADO" | "CONVERSANDO";
}

// Interface para o match como vem da API
interface ApiMatch {
  id: number;
  alunoMatch: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    foto?: unknown;
  }[];
  imovelMatch: {
    id: number;
    nome: string;
    endereco: string;
    numero: string;
    preco: string | number;
    imagens?: unknown[];
    num_quartos: number;
    num_banheiros: number;
  };
  dataMatch: string;
  status: "NOVO" | "VISUALIZADO" | "CONVERSANDO";
}

interface ApiResponse {
  dados: ApiMatch[];
  mensagem: string;
  sucesso: boolean;
}

export const buscarMatches = async (usuarioId: number): Promise<Match[]> => {
  try {
    const response = await api.get<ApiResponse>(`/match/${usuarioId}`);

    console.log("Resposta da API:", response.data);

    if (!response.data.sucesso || !response.data.dados) {
      throw new Error(response.data.mensagem || "Erro ao buscar matches");
    }

    // Mapear os dados da API para o formato esperado pelo componente
    const matches = response.data.dados.map((apiMatch: ApiMatch): Match => {
      console.log("🎯 Processando match da API:", apiMatch);
      console.log("👥 Alunos no match:", apiMatch.alunoMatch);

      const alunosProcessados = (apiMatch.alunoMatch || []).map((aluno) => {
        console.log("👤 Processando aluno:", aluno);
        console.log("📸 Foto original do aluno:", aluno.foto);

        const imagemProcessada = processarFotoAluno(aluno.foto);
        console.log("🖼️ Imagem processada:", imagemProcessada);

        return {
          id: aluno.id,
          nome: aluno.nome,
          email: aluno.email,
          telefone: aluno.telefone,
          image: imagemProcessada,
        };
      });

      console.log("✅ Alunos processados:", alunosProcessados);

      return {
        id: apiMatch.id,
        imovel: {
          id: apiMatch.imovelMatch.id,
          nome: apiMatch.imovelMatch.nome,
          endereco: apiMatch.imovelMatch.endereco,
          numero: apiMatch.imovelMatch.numero,
          preco: String(apiMatch.imovelMatch.preco),
          imagens: processarImagensInteresse(
            Array.isArray(apiMatch.imovelMatch.imagens)
              ? apiMatch.imovelMatch.imagens
              : []
          ),
          num_quartos: apiMatch.imovelMatch.num_quartos,
          num_banheiros: apiMatch.imovelMatch.num_banheiros,
        },
        alunosInteressados: alunosProcessados,
        dataMatch: apiMatch.dataMatch,
        status: apiMatch.status,
      };
    });

    console.log("Matches mapeados:", matches);
    return matches;
  } catch (error) {
    console.error("Erro ao buscar matches:", error);
    throw error;
  }
};
// Interface para a resposta da AP

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

// Função para processar foto do aluno
export const processarFotoAluno = (foto: unknown): string => {
  console.log("🔍 Processando foto do aluno:", foto, "Tipo:", typeof foto);

  if (!foto) {
    console.log("❌ Foto é null/undefined");
    return "";
  }

  // Se for uma string
  if (typeof foto === "string") {
    console.log("📄 Foto é string:", foto);

    // Se já for uma URL completa, retorna como está
    if (foto.startsWith("http")) {
      console.log("✅ URL completa detectada:", foto);
      return foto;
    }

    // Extrair o nome do arquivo do caminho completo
    const filename = foto.split(/[/\\]/).pop();
    if (filename) {
      const imageUrl = `http://localhost:8080/aluno/images/${filename}`;
      console.log("✅ URL da foto do aluno formatada:", imageUrl);
      return imageUrl;
    }

    // Fallback para uploads
    const fallbackUrl = `http://localhost:8080/uploads/${foto}`;
    console.log("⚠️ Usando fallback uploads:", fallbackUrl);
    return fallbackUrl;
  }

  // Se for um objeto com propriedade url
  if (typeof foto === "object" && foto !== null && "url" in foto) {
    const obj = foto as { url?: string };
    console.log("📦 Foto é objeto com url:", obj.url);

    if (obj.url && typeof obj.url === "string") {
      if (obj.url.startsWith("http")) {
        console.log("✅ URL completa no objeto:", obj.url);
        return obj.url;
      }

      const filename = obj.url.split(/[/\\]/).pop();
      if (filename) {
        const imageUrl = `http://localhost:8080/aluno/images/${filename}`;
        console.log("✅ URL formatada do objeto:", imageUrl);
        return imageUrl;
      }

      const fallbackUrl = `http://localhost:8080/uploads/${obj.url}`;
      console.log("⚠️ Fallback do objeto:", fallbackUrl);
      return fallbackUrl;
    }
  }

  // Se for um objeto com propriedade nome/name
  if (typeof foto === "object" && foto !== null) {
    const obj = foto as { nome?: string; name?: string };
    const nomeFoto = obj.nome || obj.name;
    console.log("📦 Foto é objeto com nome/name:", nomeFoto);

    if (nomeFoto && typeof nomeFoto === "string") {
      if (nomeFoto.startsWith("http")) {
        console.log("✅ URL completa no nome:", nomeFoto);
        return nomeFoto;
      }

      const filename = nomeFoto.split(/[/\\]/).pop();
      if (filename) {
        const imageUrl = `http://localhost:8080/aluno/images/${filename}`;
        console.log("✅ URL formatada do nome:", imageUrl);
        return imageUrl;
      }

      const fallbackUrl = `http://localhost:8080/uploads/${nomeFoto}`;
      console.log("⚠️ Fallback do nome:", fallbackUrl);
      return fallbackUrl;
    }
  }

  // Fallback: converte para string e tenta extrair filename
  const fotoStr = String(foto);
  console.log("🔄 Convertendo para string:", fotoStr);

  if (fotoStr && fotoStr !== "undefined" && fotoStr !== "null") {
    if (fotoStr.startsWith("http")) {
      console.log("✅ URL da string convertida:", fotoStr);
      return fotoStr;
    }

    const filename = fotoStr.split(/[/\\]/).pop();
    if (filename) {
      const imageUrl = `http://localhost:8080/aluno/images/${filename}`;
      console.log("✅ URL final da string:", imageUrl);
      return imageUrl;
    }

    const fallbackUrl = `http://localhost:8080/uploads/${fotoStr}`;
    console.log("⚠️ Fallback final:", fallbackUrl);
    return fallbackUrl;
  }

  console.log("❌ Nenhuma foto processável encontrada");
  return "";
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
