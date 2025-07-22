import axios from "axios";
import {
  obterUsuario,
  buscarDadosUsuario,
} from "../../../services/authService";
import imagemTeste from "../../../images/imovel_teste.jpg";

// Tipos
export interface ImagemImovel {
  id: number;
  url: string;
  imovel_id: number;
}

export interface Imovel {
  id?: number;
  nome: string;
  endereco: string;
  numero: string;
  descricao: string;
  num_quartos?: number;
  num_banheiros?: number;
  mobiliado?: boolean;
  status?: boolean;
  imagens?: ImagemImovel[] | string[];
  preco?: string;
  localizacao?: string;
}

export interface ApiResponse<T> {
  sucesso: boolean;
  mensagem: string;
  dados: T;
}

export interface InteresseResponse {
  id: number;
  aluno: { id: number };
  imovel: { id: number };
  mensagem: string;
  data_interesse: string;
  status: string;
}

// Constantes
export const DEFAULT_PLACEHOLDER =
  "https://via.placeholder.com/800x600?text=Sem+imagem+disponível";
export const DEFAULT_IMAGE = imagemTeste;

// Lista de comodidades padrão
export const COMODIDADES_PADRAO = [
  { id: 1, icon: "FaWifi", text: "Wi-Fi de alta velocidade" },
  { id: 2, icon: "FaSnowflake", text: "Ar-condicionado" },
  { id: 3, icon: "FaSwimmingPool", text: "Acesso à piscina" },
  { id: 4, icon: "FaParking", text: "Estacionamento" },
  { id: 5, icon: "FaShieldAlt", text: "Segurança 24h" },
  { id: 6, icon: "FaUmbrellaBeach", text: "Proximidade a lazer" },
  { id: 7, icon: "FaTv", text: "Smart TV" },
  { id: 8, icon: "FaUtensils", text: "Cozinha equipada" },
];

// Função para processar imagens do imóvel
export const processarImagensImovel = (
  imagensData: ImagemImovel[] | string[]
): string[] => {
  if (!imagensData || imagensData.length === 0) {
    return [DEFAULT_IMAGE];
  }

  const imagensProcessadas: string[] = [];

  // Se são strings (caminhos de arquivo)
  if (typeof imagensData[0] === "string") {
    for (const caminhoCompleto of imagensData as string[]) {
      const filename = caminhoCompleto.split(/[/\\]/).pop();
      const imageUrl = `http://localhost:8080/imovel/images/${filename}`;
      imagensProcessadas.push(imageUrl);
    }
  } else {
    // Se são objetos ImagemImovel
    for (const img of imagensData as ImagemImovel[]) {
      const caminhoCompleto = img.url;
      const filename = caminhoCompleto.split(/[/\\]/).pop();
      const imageUrl = `http://localhost:8080/imovel/images/${filename}`;
      imagensProcessadas.push(imageUrl);
    }
  }

  return imagensProcessadas.length > 0 ? imagensProcessadas : [DEFAULT_IMAGE];
};

// Função para carregar dados do imóvel
export const carregarDadosImovel = async (id: string): Promise<Imovel> => {
  try {
    const response = await axios.get(
      `http://localhost:8080/imovel/imoveis/${id}`
    );
    return response.data as Imovel;
  } catch (error) {
    console.error("Erro ao carregar detalhes do imóvel:", error);
    throw new Error("Não foi possível carregar os dados do imóvel");
  }
};

// Função para garantir que temos dados completos do usuário
export const garantirDadosCompletos = async () => {
  const usuario = obterUsuario();

  if (!usuario) {
    throw new Error("Usuário não logado");
  }

  // Se o usuário existe mas não tem ID, tentar buscar dados completos
  if (!usuario.id && usuario.email) {
    console.log("ID do usuário não encontrado, buscando dados completos...");
    try {
      const usuarioCompleto = await buscarDadosUsuario(usuario.email);
      if (usuarioCompleto && usuarioCompleto.id) {
        console.log("Dados completos recuperados:", usuarioCompleto);
        return usuarioCompleto;
      }
    } catch (error) {
      console.error("Erro ao buscar dados completos:", error);
    }
  }

  if (!usuario.id) {
    throw new Error("ID do usuário não encontrado. Faça login novamente.");
  }

  return usuario;
};

// Função para manifestar interesse no imóvel
export const manifestarInteresse = async (
  imovelId: string,
  imovelNome: string
): Promise<boolean> => {
  console.log("=== MANIFESTAR INTERESSE - INÍCIO ===");

  let usuario = obterUsuario();
  console.log("Usuário obtido do localStorage:", usuario);

  if (!usuario) {
    console.error("Usuário não logado");
    throw new Error("Usuário não logado");
  }

  // Se o usuário existe mas não tem ID, tentar buscar dados completos
  if (!usuario.id && usuario.email) {
    console.log(
      "ID do usuário não encontrado, tentando buscar dados completos..."
    );
    try {
      const usuarioCompleto = await buscarDadosUsuario(usuario.email);
      if (usuarioCompleto && usuarioCompleto.id) {
        usuario = usuarioCompleto;
        console.log("Dados completos do usuário recuperados:", usuario);
      }
    } catch (error) {
      console.error("Erro ao buscar dados completos do usuário:", error);
    }
  }

  // Validações adicionais
  if (!usuario.id) {
    console.error("ID do usuário não encontrado:", usuario);
    console.error(
      "Estrutura completa do usuário:",
      JSON.stringify(usuario, null, 2)
    );
    throw new Error("ID do usuário não encontrado. Faça login novamente.");
  }

  if (!imovelId || isNaN(Number(imovelId))) {
    console.error("ID do imóvel inválido:", imovelId);
    throw new Error("ID do imóvel inválido");
  }

  try {
    const interesseData = {
      aluno: {
        id: Number(usuario.id), // Garantir que é um número
      },
      imovel: {
        id: Number(imovelId),
      },
      mensagem: `Interesse manifestado pelo usuário ${usuario.nome} no imóvel ${imovelNome}`,
      data_interesse: new Date(),
      status: "PENDENTE",
    };

    console.log(
      "Dados sendo enviados para API:",
      JSON.stringify(interesseData, null, 2)
    );

    const response = await axios.post<ApiResponse<InteresseResponse>>(
      "http://localhost:8080/interesse",
      interesseData
    );

    console.log("Resposta da API:", response.data);
    return response.data?.sucesso || false;
  } catch (error) {
    console.error("Erro ao manifestar interesse:", error);
    return false;
  }
};

// Função para calcular preço total
export const calcularPrecoTotal = (precoBase: string): number => {
  const preco = parseInt(precoBase || "500");
  return preco * 3 + 150; // 3 meses + taxa de limpeza
};

// Função para lidar com erro de imagem
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>
): void => {
  if (e.currentTarget.src.includes("/imovel/images/")) {
    e.currentTarget.src = DEFAULT_IMAGE;
    e.currentTarget.onerror = null;
  } else {
    e.currentTarget.src = DEFAULT_PLACEHOLDER;
    e.currentTarget.onerror = null;
  }
};

// Função para verificar se usuário está logado
export const verificarUsuarioLogado = (): boolean => {
  const usuario = obterUsuario();
  return !!usuario;
};

// Função para formatar informações de quarto/banheiro
export const formatarInformacaoQuarto = (
  tipo: "quarto" | "banheiro",
  quantidade?: number
): string => {
  const qtd = quantidade || 1;
  const plural = qtd > 1 ? "s" : "";
  return `${qtd} ${tipo}${plural}`;
};

// Função para gerar URL do mapa
export const gerarUrlMapa = (
  endereco: string,
  numero: string,
  localizacao?: string
): string => {
  const enderecoCompleto = `${endereco}, ${numero}${
    localizacao ? `, ${localizacao}` : ""
  }`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    enderecoCompleto
  )}&output=embed`;
};

// Função auxiliar para criar datas iniciais
export const criarDatasIniciais = (): Date[] => {
  const hoje = new Date();
  const futuro = new Date();
  futuro.setDate(hoje.getDate() + 30);
  return [hoje, futuro];
};
