import { useState, useEffect } from "react";
import styles from "./interesse_style.module.css";
import { obterUsuario } from "../../services/authService";
import imagempadrao from "../../images/imovel_teste.jpg";
import AIAssistant from "../../components/AIAssistant/AIAssistant";
import Navbar from "../Home/components/Navbar";
import { api } from "../../services/api";

// Função para processar imagens dos interesses
const processarImagensInteresse = (interesse: Interesse): Interesse => {
  let imageUrl = imagempadrao; // Imagem padrão

  // Verificamos o formato da propriedade imagens
  console.log("Formato das imagens do interesse:", interesse.imovel_id.imagens);

  if (interesse.imovel_id.imagens && interesse.imovel_id.imagens.length > 0) {
    // Se imagens for um array de objetos ImagemImovel
    const primeiraImagem = interesse.imovel_id.imagens[0];

    if (
      primeiraImagem &&
      typeof primeiraImagem === "object" &&
      primeiraImagem.url
    ) {
      // Se for objeto com URL, processar como caminho
      const caminhoCompleto = primeiraImagem.url;
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
      imagens: [{ id: 1, url: imageUrl }], // Substitui por array com URL processada
    },
  };
};

// Função para processar array de interesses
const processarImagensInteresses = (interesses: Interesse[]): Interesse[] => {
  return interesses.map((interesse) => processarImagensInteresse(interesse));
};

// Interfaces para tipagem
interface ImagemImovel {
  id: number;
  url: string;
}

interface Aluno {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  sexo: string;
  image?: {
    id: number;
    url: string;
  };
  cadastro_id?: number;
}

interface Imovel {
  id: number;
  nome: string;
  endereco: string;
  numero: string;
  descricao: string;
  imagens?: ImagemImovel[];
  localizacao?: string;
  preco?: string;
  num_quartos?: number;
  num_banheiros?: number;
  mobiliado?: boolean;
  status?: boolean;
  imobiliaria_id?: number;
  image?: string;
}

interface Interesse {
  id: number;
  aluno: Aluno;
  imovel_id: Imovel;
  mensagem: string;
  data_interesse: string;
  status: "PENDENTE" | "ACEITO" | "RECUSADO";
}

interface UsuarioNavbar {
  nome: string;
  foto?: string;
}

// Interface para a resposta da API
interface ApiResponse {
  dados?: Interesse[];
  sucesso?: boolean;
  mensagem?: string;
}

// Mock data para desenvolvimento
const mockInteresses: Interesse[] = [
  {
    id: 1,
    aluno: {
      id: 1,
      nome: "Ryan Cantareli de Aguiar",
      cpf: "478.707.038-00",
      email: "ryanzinlindo.4321@gmail.com",
      telefone: "(17) 99626-8399",
      dataNascimento: "2006-03-02",
      sexo: "M",
    },
    imovel_id: {
      id: 1,
      nome: "Apartamento Moderno no Centro",
      endereco: "Rua das Flores, 123",
      numero: "123",
      descricao:
        "Apartamento moderno com 2 quartos e 1 banheiro, localizado no centro da cidade.",
      num_quartos: 2,
      num_banheiros: 1,
      mobiliado: true,
      status: true,
      preco: "R$ 1.200",
      imagens: [{ id: 1, url: imagempadrao }],
    },
    mensagem: "Tenho interesse neste imóvel para o próximo semestre letivo.",
    data_interesse: "2024-01-15T10:30:00",
    status: "PENDENTE",
  },
  {
    id: 2,
    aluno: {
      id: 1,
      nome: "Ryan Cantareli de Aguiar",
      cpf: "478.707.038-00",
      email: "ryanzinlindo.4321@gmail.com",
      telefone: "(17) 99626-8399",
      dataNascimento: "2006-03-02",
      sexo: "M",
    },
    imovel_id: {
      id: 2,
      nome: "Casa Compartilhada próxima ao Campus",
      endereco: "Av. Universitária, 456",
      numero: "456",
      descricao:
        "Casa para compartilhar com outros estudantes, ambiente acolhedor.",
      num_quartos: 3,
      num_banheiros: 2,
      mobiliado: false,
      status: true,
      preco: "R$ 800",
      imagens: [{ id: 1, url: imagempadrao }],
    },
    mensagem: "Gostaria de saber mais detalhes sobre a disponibilidade.",
    data_interesse: "2024-01-10T14:20:00",
    status: "ACEITO",
  },
  {
    id: 3,
    aluno: {
      id: 1,
      nome: "Ryan Cantareli de Aguiar",
      cpf: "478.707.038-00",
      email: "ryanzinlindo.4321@gmail.com",
      telefone: "(17) 99626-8399",
      dataNascimento: "2006-03-02",
      sexo: "M",
    },
    imovel_id: {
      id: 3,
      nome: "Quarto Individual com Banheiro",
      endereco: "Rua dos Estudantes, 789",
      numero: "789",
      descricao: "Quarto individual mobiliado com banheiro privativo.",
      num_quartos: 1,
      num_banheiros: 1,
      mobiliado: true,
      status: true,
      preco: "R$ 600",
      imagens: [{ id: 1, url: imagempadrao }],
    },
    mensagem: "Preciso de um lugar para morar durante o período de estágio.",
    data_interesse: "2024-01-05T16:45:00",
    status: "RECUSADO",
  },
];

const Interesse = () => {
  const [interesses, setInteresses] = useState<Interesse[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<UsuarioNavbar | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<
    "todos" | "PENDENTE" | "ACEITO" | "RECUSADO"
  >("todos");

  console.log("Componente Interesse renderizado. Estado atual:", {
    interesses,
    loading,
    usuario,
    filtroStatus,
    isInteressesArray: Array.isArray(interesses),
  });

  // Função para buscar interesses do aluno logado
  const buscarInteresses = async (alunoId: number) => {
    console.log("Iniciando buscarInteresses com ID:", alunoId);

    try {
      setLoading(true);
      setInteresses([]); // Limpar estado anterior

      // Tentativa de buscar da API
      try {
        console.log("Tentando buscar da API...");
        const response = await api.get<ApiResponse>(`/interesse/${alunoId}`);
        console.log("Resposta da API completa:", response.data);
        console.log("Tipo da resposta:", typeof response.data);
        console.log(
          "Tem propriedade 'dados'?",
          response.data && "dados" in response.data
        );
        console.log("Valor de 'dados':", response.data?.dados);
        console.log("'dados' é array?", Array.isArray(response.data?.dados));

        // Verifica se a resposta tem a propriedade 'dados' que é um array
        if (response.data && Array.isArray(response.data.dados)) {
          console.log(
            "✅ Dados da API são um array válido:",
            response.data.dados
          );
          const interessesComImagens = processarImagensInteresses(
            response.data.dados as Interesse[]
          );
          setInteresses(interessesComImagens);
          return;
        } else if (Array.isArray(response.data)) {
          // Fallback se a resposta for diretamente um array
          console.log(
            "✅ Resposta da API é diretamente um array:",
            response.data
          );
          const interessesComImagens = processarImagensInteresses(
            response.data as Interesse[]
          );
          setInteresses(interessesComImagens);
          return;
        } else {
          console.log(
            "❌ Dados da API não são um array válido, usando mock. Estrutura:",
            response.data
          );
        }
      } catch (apiError) {
        console.log("❌ API não disponível, usando dados mock:", apiError);
      }

      // Fallback para dados mock
      console.log("Usando dados mock...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const interessesMock = mockInteresses.filter(
        (interesse) => interesse.aluno.id === alunoId
      );
      console.log("Interesses mock filtrados:", interessesMock);
      setInteresses(interessesMock);
    } catch (error) {
      console.error("Erro ao buscar interesses:", error);
      setInteresses([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para cancelar interesse
  const cancelarInteresse = async (interesseId: number) => {
    try {
      // TODO: Implementar chamada real para API
      // await axios.delete(`/api/interesses/${interesseId}`);

      setInteresses((prev) =>
        prev.filter((interesse) => interesse.id !== interesseId)
      );
    } catch (error) {
      console.error("Erro ao cancelar interesse:", error);
    }
  };

  // Função para formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "aceito":
        return styles.statusAceito;
      case "recusado":
        return styles.statusRecusado;
      default:
        return styles.statusPendente;
    }
  };

  // Função para obter texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case "aceito":
        return "Aceito";
      case "recusado":
        return "Recusado";
      default:
        return "Pendente";
    }
  };

  // Filtrar interesses por status
  const interessesFiltrados = (
    Array.isArray(interesses) ? interesses : []
  ).filter(
    (interesse) => filtroStatus === "todos" || interesse.status === filtroStatus
  );

  // Carregar dados do usuário e interesses
  useEffect(() => {
    const usuarioLogado = obterUsuario();
    console.log("Usuario logado:", usuarioLogado);

    if (usuarioLogado && usuarioLogado.id) {
      setUsuario({
        nome: usuarioLogado.nome || "Usuário",
        foto: usuarioLogado.foto,
      });
      console.log("Chamando buscarInteresses com ID:", usuarioLogado.id);
      buscarInteresses(usuarioLogado.id);
    } else {
      console.log("Usuário não encontrado ou sem ID");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <Navbar usuario={usuario} />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando seus interesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar usuario={usuario} />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Meus Interesses</h1>
          <p className={styles.subtitle}>
            Acompanhe os imóveis que você manifestou interesse
          </p>
        </div>

        {/* Filtros */}
        <div className={styles.filtersContainer}>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${
                filtroStatus === "todos" ? styles.active : ""
              }`}
              onClick={() => setFiltroStatus("todos")}
            >
              Todos ({Array.isArray(interesses) ? interesses.length : 0})
            </button>
            <button
              className={`${styles.filterButton} ${
                filtroStatus === "PENDENTE" ? styles.active : ""
              }`}
              onClick={() => setFiltroStatus("PENDENTE")}
            >
              Pendentes (
              {Array.isArray(interesses)
                ? interesses.filter((i) => i.status === "PENDENTE").length
                : 0}
              )
            </button>
            <button
              className={`${styles.filterButton} ${
                filtroStatus === "ACEITO" ? styles.active : ""
              }`}
              onClick={() => setFiltroStatus("ACEITO")}
            >
              Aceitos (
              {Array.isArray(interesses)
                ? interesses.filter((i) => i.status === "ACEITO").length
                : 0}
              )
            </button>
            <button
              className={`${styles.filterButton} ${
                filtroStatus === "RECUSADO" ? styles.active : ""
              }`}
              onClick={() => setFiltroStatus("RECUSADO")}
            >
              Recusados (
              {Array.isArray(interesses)
                ? interesses.filter((i) => i.status === "RECUSADO").length
                : 0}
              )
            </button>
          </div>
        </div>

        {/* Lista de interesses */}
        <div className={styles.interessesContainer}>
          {interessesFiltrados.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏠</div>
              <h3>Nenhum interesse encontrado</h3>
              <p>
                {filtroStatus === "todos"
                  ? "Você ainda não manifestou interesse em nenhum imóvel."
                  : `Você não possui interesses com status "${getStatusText(
                      filtroStatus
                    )}".`}
              </p>
            </div>
          ) : (
            interessesFiltrados.map((interesse) => (
              <div key={interesse.id} className={styles.interesseCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.imovelInfo}>
                    <img
                      src={
                        interesse.imovel_id.imagens?.[0]?.url || imagempadrao
                      }
                      alt={interesse.imovel_id.nome}
                      className={styles.imovelImage}
                    />
                    <div className={styles.imovelDetails}>
                      <h3 className={styles.imovelNome}>
                        {interesse.imovel_id.nome}
                      </h3>
                      <p className={styles.imovelEndereco}>
                        {interesse.imovel_id.endereco},{" "}
                        {interesse.imovel_id.numero}
                      </p>
                      <div className={styles.imovelMeta}>
                        <span className={styles.preco}>
                          {interesse.imovel_id.preco}
                        </span>
                        <span className={styles.quartos}>
                          🛏️ {interesse.imovel_id.num_quartos} quartos
                        </span>
                        <span className={styles.banheiros}>
                          🚿 {interesse.imovel_id.num_banheiros} banheiros
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.statusContainer}>
                    <span
                      className={`${styles.statusBadge} ${getStatusColor(
                        interesse.status
                      )}`}
                    >
                      {getStatusText(interesse.status)}
                    </span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.mensagemContainer}>
                    <h4>Sua mensagem:</h4>
                    <p className={styles.mensagem}>{interesse.mensagem}</p>
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.dataInteresse}>
                      Enviado em: {formatarData(interesse.data_interesse)}
                    </span>

                    <div className={styles.acoes}>
                      {interesse.status === "PENDENTE" && (
                        <button
                          className={styles.botaoCancelar}
                          onClick={() => cancelarInteresse(interesse.id)}
                        >
                          Cancelar Interesse
                        </button>
                      )}

                      {interesse.status === "ACEITO" && (
                        <button className={styles.botaoContato}>
                          Entrar em Contato
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AIAssistant />
    </div>
  );
};

export default Interesse;
