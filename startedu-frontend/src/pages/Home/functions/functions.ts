import imovelPadrao from "../../../images/imovel_teste.jpg";
import axios from "axios";

// Interface local para compatibilidade com o componente Home
interface ImovelHome {
  image: string;
  id?: number;
  nome: string;
  endereco: string;
  numero: string;
  descricao: string;
  num_quartos?: number;
  num_banheiros?: number;
  mobiliado?: boolean;
  status?: boolean;
  imagens?: string[];
  title?: string;
  localizacao?: string;
  preco?: string;
  rating?: string;
}

interface MockListing {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  rating: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function tratandoImagensDeImovel(response: any) {
  console.log("Resposta da API:", response);
  console.log("Status da resposta:", response.status);
  console.log("Dados recebidos:", response.data);
  console.log("Tipo de response.data:", typeof response.data);
  console.log("É array?", Array.isArray(response.data));
  // Converte para array se for um objeto único
  const imoveisData = Array.isArray(response.data)
    ? response.data
    : [response.data];

  console.log(`Processando ${imoveisData.length} imóveis`);

  // Adaptando os dados da API para o formato atual do seu componente
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imoveisFormatados = imoveisData.map((imovel: any) => {
    // Primeiro definimos uma imagem padrão
    let imageUrl = imovelPadrao; // Imagem padrão

    // Verificamos o formato da propriedade imagens
    console.log("Formato das imagens:", imovel.imagens);

    if (imovel.imagens) {
      // Se imagens for um array de strings (novo formato)
      if (
        Array.isArray(imovel.imagens) &&
        typeof imovel.imagens[0] === "string"
      ) {
        // Extrair o nome do arquivo do caminho completo usando uma abordagem cross-platform
        const caminhoCompleto = imovel.imagens[0];
        // Remove tanto barras normais (/) quanto invertidas (\) para compatibilidade Windows/Linux
        const filename = caminhoCompleto.split(/[/\\]/).pop();
        if (filename) {
          imageUrl = `http://localhost:8080/imovel/images/${filename}`;
          console.log(`URL da imagem formatada: ${imageUrl}`);
        }
      }
    }
    return {
      id: imovel.id,
      image: imovel.url || imageUrl,
      title: imovel.nome || "Imóvel sem título",
      localizacao:
        imovel.endereco && imovel.numero
          ? `${imovel.endereco}, ${imovel.numero}`
          : "Endereço não informado",
      preco: imovel.preco
        ? `R$ ${imovel.preco}`
        : `R$ ${Math.floor(Math.random() * 500 + 100)}`,
      rating: (Math.random() * (5 - 4) + 4).toFixed(2),
      nome: imovel.nome,
      endereco: imovel.endereco,
      numero: imovel.numero,
      descricao: imovel.descricao,
      num_quartos: imovel.num_quartos,
      num_banheiros: imovel.num_banheiros,
      mobiliado: imovel.mobiliado,
      status: imovel.status,
    };
  });
  return imoveisFormatados;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function tratandoImoveisFicticios(mockListings: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockListings.map((item: any) => {
    // Verificando se location existe antes de fazer o split
    const endereco = item.location
      ? item.location.split(",")[0] || "Endereço não informado"
      : "Endereço não informado";
    const numero =
      item.location && item.location.includes(",")
        ? item.location.split(",")[1]?.trim() || ""
        : "";

    return {
      ...item,
      nome: item.title || "Imóvel sem título",
      endereco: endereco,
      numero: numero,
      descricao: "",
    };
  });

  return mockListings;
}

// Função de busca específica para o componente Home
export const buscarImoveisHome = async (
  searchQuery: string,
  setListings: (listings: ImovelHome[]) => void,
  setLoading: (loading: boolean) => void,
  mockListings: MockListing[]
) => {
  console.log("Iniciando busca de imóveis...");
  console.log("Termo de busca:", searchQuery);

  if (!searchQuery.trim()) {
    console.log("Termo de busca vazio, buscando todos os imóveis");
    // Se termo vazio então busque todos os imóveis
    try {
      setLoading(true);
      // Substitua pela URL correta da sua API
      const response = await axios.get<ImovelHome[]>(
        "http://localhost:8080/imovel"
      );

      console.log("Resposta da API:", response.data);

      if (
        (Array.isArray(response.data) && response.data.length > 0) ||
        (typeof response.data === "object" &&
          response.data !== null &&
          !Array.isArray(response.data))
      ) {
        setListings(await tratandoImagensDeImovel(response));
      } else {
        // Usa dados mockados se a API retornar vazio
        setListings(await tratandoImoveisFicticios(mockListings));
      }
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
      // Usa dados mockados em caso de erro
      setListings(await tratandoImoveisFicticios(mockListings));
    } finally {
      setLoading(false);
    }
    return;
  }

  try {
    setLoading(true);
    console.log(
      `Fazendo requisição para: http://localhost:8080/imovel/${searchQuery}`
    );

    // Chamada da API com parâmetro de busca
    const response = await axios.get<ImovelHome[]>(
      `http://localhost:8080/imovel/${searchQuery}`
    );

    const imoveisFormatados = await tratandoImagensDeImovel(response);
    if (imoveisFormatados.length > 0) {
      setListings(await tratandoImagensDeImovel(response));
    } else {
      // Se não encontrar resultados
      console.log("Nenhum imóvel encontrado na resposta da API");
      setListings([]);
    }
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);

    // Log detalhado do erro
    if (error && typeof error === "object" && "isAxiosError" in error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any;

      console.error("Erro de requisição:");
      console.error("Status:", axiosError.response?.status);
      console.error("Dados:", axiosError.response?.data);
      console.error("Headers:", axiosError.response?.headers);
      console.error("Configuração:", axiosError.config);
    }

    setListings([]);
  } finally {
    console.log("Finalizando busca de imóveis");
    setLoading(false);
  }
};

export { tratandoImagensDeImovel, tratandoImoveisFicticios };
