import { useState, useEffect } from "react";
import styles from "./interesse_style.module.css";
import { obterUsuario } from "../../services/authService";
import imagempadrao from "../../images/imovel_teste.jpg";
import AIAssistant from "../../components/AIAssistant/AIAssistant";
import Navbar from "../Home/components/Navbar";
import {
  buscarInteressesAluno,
  cancelarInteresse as cancelarInteresseFunction,
  formatarData,
  getStatusText,
  type Interesse,
} from "./functions/functions";

// Interfaces para tipagem
interface UsuarioNavbar {
  nome: string;
  foto?: string;
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
    imovel: {
      id: 1,
      nome: "Apartamento Moderno no Centro",
      endereco: "Rua das Flores, 123",
      numero: "123",
      num_quartos: 2,
      num_banheiros: 1,
      preco: "R$ 1.200",
      imagens: [imagempadrao],
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
    imovel: {
      id: 2,
      nome: "Casa Compartilhada próxima ao Campus",
      endereco: "Av. Universitária, 456",
      numero: "456",
      num_quartos: 3,
      num_banheiros: 2,
      preco: "R$ 800",
      imagens: [imagempadrao],
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
    imovel: {
      id: 3,
      nome: "Quarto Individual com Banheiro",
      endereco: "Rua dos Estudantes, 789",
      numero: "789",
      num_quartos: 1,
      num_banheiros: 1,
      preco: "R$ 600",
      imagens: [imagempadrao],
    },
    mensagem: "Preciso de um lugar para morar durante o período de estágio.",
    data_interesse: "2024-01-05T16:45:00",
    status: "RECUSADO",
  },
];

const InteressePage = () => {
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

  // Função para cancelar interesse
  const cancelarInteresse = async (interesseId: number) => {
    try {
      await cancelarInteresseFunction(interesseId);
      setInteresses((prev) =>
        prev.filter((interesse) => interesse.id !== interesseId)
      );
    } catch (error) {
      console.error("Erro ao cancelar interesse:", error);
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACEITO":
        return styles.statusAceito;
      case "RECUSADO":
        return styles.statusRecusado;
      default:
        return styles.statusPendente;
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
          const interesses = await buscarInteressesAluno(usuarioLogado.id);
          setInteresses(interesses);
        } catch (error) {
          console.error("Erro ao buscar interesses:", error);
          setInteresses(mockInteresses);
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
                        Array.isArray(interesse.imovel.imagens) &&
                        interesse.imovel.imagens.length > 0
                          ? interesse.imovel.imagens[0]
                          : imagempadrao
                      }
                      alt={interesse.imovel.nome || interesse.imovel.titulo}
                      className={styles.imovelImage}
                    />
                    <div className={styles.imovelDetails}>
                      <h3 className={styles.imovelNome}>
                        {interesse.imovel.nome || interesse.imovel.titulo}
                      </h3>
                      <p className={styles.imovelEndereco}>
                        {interesse.imovel.endereco ||
                          interesse.imovel.enderecoCompleto}
                        , {interesse.imovel.numero || ""}
                      </p>
                      <div className={styles.imovelMeta}>
                        <span className={styles.preco}>
                          {interesse.imovel.preco}
                        </span>
                        <span className={styles.quartos}>
                          🛏️{" "}
                          {interesse.imovel.num_quartos ||
                            interesse.imovel.quartos}{" "}
                          quartos
                        </span>
                        <span className={styles.banheiros}>
                          🚿{" "}
                          {interesse.imovel.num_banheiros ||
                            interesse.imovel.banheiros}{" "}
                          banheiros
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
                    <p className={styles.mensagem}>
                      {interesse.mensagem ||
                        interesse.descricao ||
                        "Sem mensagem"}
                    </p>
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.dataInteresse}>
                      Enviado em:{" "}
                      {formatarData(
                        interesse.data_interesse ||
                          interesse.dataCriacao ||
                          new Date().toISOString()
                      )}
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

export default InteressePage;
