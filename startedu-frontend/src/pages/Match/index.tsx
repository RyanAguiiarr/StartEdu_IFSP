import { useState } from "react";
import styles from "./Match_style.module.css";
import imagempadrao from "../../images/imovel_teste.jpg";
import AIAssistant from "../../components/AIAssistant/AIAssistant";
import Navbar from "../Home/components/Navbar";
import { obterUsuario } from "../../services/authService";
import { alterarStatusMatch, buscarMatches } from "./functions/functions";
import { useEffect } from "react"; // Importando a instância do Axios configurada

interface UsuarioNavbar {
  nome: string;
  foto?: string;
}

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

const mockMatches: Match[] = [
  {
    id: 1,
    imovel: {
      id: 1,
      nome: "Casa Premium - Vila Universitária",
      endereco: "Rua das Flores, 123",
      numero: "123",
      preco: "R$ 1.200",
      imagens: [imagempadrao],
      num_quartos: 3,
      num_banheiros: 2,
    },
    alunosInteressados: [
      {
        id: 2,
        nome: "Maria Silva",
        email: "maria@email.com",
        telefone: "(17) 99999-9999",
        image: imagempadrao,
      },
      {
        id: 3,
        nome: "João Santos",
        email: "joao@email.com",
        telefone: "(17) 88888-8888",
      },
    ],
    dataMatch: "2025-07-16T10:30:00",
    status: "NOVO",
  },
  {
    id: 2,
    imovel: {
      id: 2,
      nome: "Apartamento Moderno Centro",
      endereco: "Av. Central, 456",
      numero: "456",
      preco: "R$ 800",
      imagens: [imagempadrao],
      num_quartos: 2,
      num_banheiros: 1,
    },
    alunosInteressados: [
      {
        id: 4,
        nome: "Ana Costa",
        email: "ana@email.com",
        telefone: "(17) 77777-7777",
      },
    ],
    dataMatch: "2025-07-15T14:20:00",
    status: "VISUALIZADO",
  },
];

const MatchPage = () => {
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [usuario, setUsuario] = useState<UsuarioNavbar | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroCompatibilidade, setFiltroCompatibilidade] = useState<
    "TODOS" | "ALTA" | "MEDIA" | "BAIXA"
  >("TODOS");
  const [filtroStatus, setFiltroStatus] = useState<
    "TODOS" | "NOVO" | "VISUALIZADO" | "CONVERSANDO"
  >("TODOS");
  const [matchSelecionado, setMatchSelecionado] = useState<Match | null>(null);

  const matchesFiltrados = matches.filter((match) => {
    const statusMatch =
      filtroStatus === "TODOS" || match.status === filtroStatus;
    return statusMatch;
  });

  const obterCorStatus = (status: string) => {
    switch (status) {
      case "NOVO":
        return "#2196F3";
      case "VISUALIZADO":
        return "#FF9800";
      case "CONVERSANDO":
        return "#4CAF50";
      default:
        return "#757575";
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      const usuarioLogado = obterUsuario();
      console.log("Usuario logado:", usuarioLogado);

      if (usuarioLogado && usuarioLogado.id) {
        setUsuario({
          nome: usuarioLogado.nome || "Usuário",
          foto: usuarioLogado.foto,
        });
        console.log("Chamando buscarInteressesAluno com ID:", usuarioLogado.id);
        try {
          setLoading(true);
          const matchs = await buscarMatches(usuarioLogado.id);
          setMatches(matchs);
        } catch (error) {
          console.error("Erro ao buscar matchs:", error);
          setMatches(mockMatches);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("Usuário não encontrado ou sem ID");
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar usuario={usuario} />

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              <span className={styles.titleIcon}>💫</span>
              Seus Matches
            </h1>
            <p className={styles.subtitle}>
              Conecte-se com outros estudantes que têm interesse nos mesmos
              imóveis
            </p>
          </div>

          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{matches.length}</div>
              <div className={styles.statLabel}>Total de Matches</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                {matches.filter((m) => m.status === "NOVO").length}
              </div>
              <div className={styles.statLabel}>Novos</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Alta Compatibilidade</div>
            </div>
          </div>
        </div>

        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Compatibilidade:</label>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterButton} ${
                  filtroCompatibilidade === "TODOS" ? styles.active : ""
                }`}
                onClick={() => setFiltroCompatibilidade("TODOS")}
              >
                Todos
              </button>
              <button
                className={`${styles.filterButton} ${styles.alta} ${
                  filtroCompatibilidade === "ALTA" ? styles.active : ""
                }`}
                onClick={() => setFiltroCompatibilidade("ALTA")}
              >
                Alta
              </button>
              <button
                className={`${styles.filterButton} ${styles.media} ${
                  filtroCompatibilidade === "MEDIA" ? styles.active : ""
                }`}
                onClick={() => setFiltroCompatibilidade("MEDIA")}
              >
                Média
              </button>
              <button
                className={`${styles.filterButton} ${styles.baixa} ${
                  filtroCompatibilidade === "BAIXA" ? styles.active : ""
                }`}
                onClick={() => setFiltroCompatibilidade("BAIXA")}
              >
                Baixa
              </button>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status:</label>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterButton} ${
                  filtroStatus === "TODOS" ? styles.active : ""
                }`}
                onClick={() => setFiltroStatus("TODOS")}
              >
                Todos
              </button>
              <button
                className={`${styles.filterButton} ${
                  filtroStatus === "NOVO" ? styles.active : ""
                }`}
                onClick={() => setFiltroStatus("NOVO")}
              >
                Novos
              </button>
              <button
                className={`${styles.filterButton} ${
                  filtroStatus === "VISUALIZADO" ? styles.active : ""
                }`}
                onClick={() => setFiltroStatus("VISUALIZADO")}
              >
                Visualizados
              </button>
              <button
                className={`${styles.filterButton} ${
                  filtroStatus === "CONVERSANDO" ? styles.active : ""
                }`}
                onClick={() => setFiltroStatus("CONVERSANDO")}
              >
                Conversando
              </button>
            </div>
          </div>
        </div>

        <div className={styles.matchesGrid}>
          {loading ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>⏳</div>
              <h3>Carregando matches...</h3>
              <p>Aguarde enquanto buscamos seus matches!</p>
            </div>
          ) : matchesFiltrados.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>💔</div>
              <h3>Nenhum match encontrado</h3>
              <p>Continue explorando imóveis para encontrar mais matches!</p>
            </div>
          ) : (
            matchesFiltrados.map((match) => (
              <div
                key={match.id}
                className={`${styles.matchCard} ${
                  match.status === "NOVO" ? styles.novoMatch : ""
                }`}
                onClick={() => {
                  setMatchSelecionado(match);
                  alterarStatusMatch(match.id, "VISUALIZADO");
                }}
              >
                <div className={styles.matchHeader}>
                  <div className={styles.statusBadges}>
                    <span
                      className={styles.statusBadge}
                      style={{ backgroundColor: obterCorStatus(match.status) }}
                    >
                      {match.status}
                    </span>
                  </div>
                </div>

                <div className={styles.imovelSection}>
                  <div className={styles.imovelImage}>
                    <img
                      src={
                        match.imovel?.imagens && match.imovel.imagens.length > 0
                          ? match.imovel.imagens[0]
                          : imagempadrao
                      }
                      alt={match.imovel?.nome || "Imóvel"}
                    />
                    <div className={styles.imageOverlay}>
                      <span className={styles.heartIcon}>💖</span>
                    </div>
                  </div>

                  <div className={styles.imovelInfo}>
                    <h3 className={styles.imovelNome}>
                      {match.imovel?.nome || "Nome não disponível"}
                    </h3>
                    <p className={styles.imovelEndereco}>
                      {match.imovel?.endereco || "Endereço não disponível"},{" "}
                      {match.imovel?.numero || ""}
                    </p>
                    <div className={styles.imovelMeta}>
                      <span className={styles.preco}>
                        {match.imovel?.preco || "Preço não disponível"}
                      </span>
                      <span className={styles.quartos}>
                        🛏️ {match.imovel?.num_quartos || 0}
                      </span>
                      <span className={styles.banheiros}>
                        🚿 {match.imovel?.num_banheiros || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.alunosSection}>
                  <div className={styles.alunosHeader}>
                    <h4>
                      Outros estudantes interessados (
                      {match.alunosInteressados?.length || 0})
                    </h4>
                  </div>

                  <div className={styles.alunosList}>
                    {(match.alunosInteressados || []).map((aluno) => {
                      console.log(
                        "🖼️ Renderizando aluno:",
                        aluno.nome,
                        "Imagem:",
                        aluno.image
                      );
                      return (
                        <div key={aluno.id} className={styles.alunoCard}>
                          <div className={styles.alunoAvatar}>
                            <img
                              src={aluno.image || imagempadrao}
                              alt={aluno.nome}
                              onLoad={() =>
                                console.log("✅ Imagem carregada:", aluno.image)
                              }
                              onError={() =>
                                console.log(
                                  "❌ Erro ao carregar imagem:",
                                  aluno.image
                                )
                              }
                            />
                          </div>

                          <div className={styles.alunoInfo}>
                            <h5 className={styles.alunoNome}>{aluno.nome}</h5>
                          </div>

                          <div className={styles.alunoActions}>
                            <button className={styles.chatButton}>💬</button>
                            <button className={styles.perfilButton}>👤</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.matchFooter}>
                  <div className={styles.dataMatch}>
                    Match realizado em{" "}
                    {new Date(match.dataMatch).toLocaleDateString("pt-BR")}
                  </div>
                  <div className={styles.matchActions}>
                    <button className={styles.detalhesButton}>
                      Ver Detalhes
                    </button>
                    <button className={styles.grupoButton}>Criar Grupo</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {matchSelecionado && (
        <div
          className={styles.modalOverlay}
          onClick={() => setMatchSelecionado(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Detalhes do Match</h2>
              <button
                className={styles.closeButton}
                onClick={() => setMatchSelecionado(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.modalImovel}>
                <img
                  src={
                    matchSelecionado.imovel?.imagens &&
                    matchSelecionado.imovel.imagens.length > 0
                      ? matchSelecionado.imovel.imagens[0]
                      : imagempadrao
                  }
                  alt={matchSelecionado.imovel?.nome || "Imóvel"}
                  className={styles.modalImage}
                />
                <div className={styles.modalImovelInfo}>
                  <h3>
                    {matchSelecionado.imovel?.nome || "Nome não disponível"}
                  </h3>
                  <p>
                    {matchSelecionado.imovel?.endereco ||
                      "Endereço não disponível"}
                    , {matchSelecionado.imovel?.numero || ""}
                  </p>
                  <div className={styles.modalImovelMeta}>
                    <span>
                      {matchSelecionado.imovel?.preco || "Preço não disponível"}
                    </span>
                    <span>
                      🛏️ {matchSelecionado.imovel?.num_quartos || 0} quartos
                    </span>
                    <span>
                      🚿 {matchSelecionado.imovel?.num_banheiros || 0} banheiros
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.modalAlunos}>
                <h4>Estudantes Interessados</h4>
                {(matchSelecionado.alunosInteressados || []).map((aluno) => {
                  console.log(
                    "🖼️ Modal - Renderizando aluno:",
                    aluno.nome,
                    "Imagem:",
                    aluno.image
                  );
                  return (
                    <div key={aluno.id} className={styles.modalAlunoCard}>
                      <img
                        src={aluno.image || imagempadrao}
                        alt={aluno.nome}
                        onLoad={() =>
                          console.log(
                            "✅ Modal - Imagem carregada:",
                            aluno.image
                          )
                        }
                        onError={() =>
                          console.log(
                            "❌ Modal - Erro ao carregar imagem:",
                            aluno.image
                          )
                        }
                      />
                      <div className={styles.modalAlunoInfo}>
                        <h5>{aluno.nome}</h5>
                        <div className={styles.modalAlunoContato}>
                          <span>📧 {aluno.email}</span>
                          <span>📱 {aluno.telefone}</span>
                        </div>
                      </div>
                      <div className={styles.modalAlunoActions}>
                        <button className={styles.modalChatButton}>
                          Conversar
                        </button>
                        <button className={styles.modalPerfilButton}>
                          Ver Perfil
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <AIAssistant />
    </div>
  );
};

export default MatchPage;
