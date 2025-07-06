import { useState, useEffect } from "react";
import styles from "./Home_style.module.css";
import axios from "axios";
import {
  tratandoImagensDeImovel,
  tratandoImoveisFicticios,
} from "./functions/functions";
import { fazerLogout, obterUsuario } from "../../services/authService";
import imagempadrao from "../../images/imovel_teste.jpg";
import AIAssistant from "../../components/AIAssistant/AIAssistant";

// Defina uma interface para tipar os dados dos imóveis
interface ImagemImovel {
  id: number;
  url: string;
  imovel_id: number;
}

interface Imovel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
  id?: number;
  nome: string;
  endereco: string;
  numero: string;
  descricao: string;
  num_quartos?: number;
  num_banheiros?: number;
  mobiliado?: boolean;
  status?: boolean;
  imagens?: ImagemImovel[]; // Relação com tabela de imagens
  title?: string;
  localizacao?: string;
  preco?: string;
  rating?: string;
}

// Mock data como fallback caso a API falhe
const mockListings = [
  {
    id: 1,
    image: imagempadrao,
    title: "Whitefish Estate",
    location: "Whitefish, Montana, United States",
    price: "R$ 10.000",
    rating: "5.0",
  },
  {
    id: 2,
    image: imagempadrao,
    title: "Luxury stay in Weston, Saint James, Barbados",
    location: "Weston, Saint James, Barbados",
    price: "R$ 1.500",
    rating: "5.00",
  },
  {
    id: 3,
    image: imagempadrao,
    title: "Numero 22 - Lake Como - Design Living & Lake View",
    location: "Laglio, Lombardia, Italy",
    price: "R$ 359",
    rating: "4.99",
  },
  {
    id: 4,
    image: imagempadrao,
    title: "7,500 sq ft Private Beachfront Estate",
    location: "Dubai, United Arab Emirates",
    price: "R$ 2.478",
    rating: "4.73",
  },
  {
    id: 5,
    image: imagempadrao,
    title: "Bohemian & Spacious / Private Pool and Garden",
    location: "Tulum, Quintana Roo, Mexico",
    price: "R$ 199",
    rating: "4.97",
  },
  {
    id: 6,
    image: imagempadrao,
    title: "Designer A-Frame Cabin in the Trees",
    location: "Lake Arrowhead, California, United States",
    price: "R$ 225",
    rating: "4.93",
  },
  {
    id: 7,
    image: imagempadrao,
    title: "Fully Renovated 2 BR on River w/ Pool - Walk to To",
    location: "Aspen, Colorado, United States",
    price: "R$ 546",
    rating: "5.0",
  },
  {
    id: 8,
    image: imagempadrao,
    title: "Magnolia's Hillcrest Cottage",
    location: "Waco, Texas, United States",
    price: "R$ 500",
    rating: "4.97",
  },
];

const direcionarImovel = (id: number) => {
  window.location.href = `/imovel/${id}`;
};

const Home = () => {
  const [guestCount, setGuestCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<{
    nome: string;
    foto?: string;
  } | null>(null);

  // Função de busca por nome do imóvel
  const buscarImoveis = async () => {
    console.log("Iniciando busca de imóveis...");
    console.log("Termo de busca:", searchQuery);

    if (!searchQuery.trim()) {
      console.log("Termo de busca vazio, buscando todos os imóveis");
      // Se termo vazio então busque todos os imóveis
      try {
        setLoading(true);
        // Substitua pela URL correta da sua API
        const response = await axios.get<Imovel[]>(
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
      const response = await axios.get<Imovel[]>(
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

  // Função para buscar imóveis da API
  useEffect(() => {
    const fetchImoveis = async () => {
      try {
        setLoading(true);
        // Substitua pela URL correta da sua API
        const response = await axios.get<Imovel[]>(
          "http://localhost:8080/imovel"
        );

        console.log("Resposta inicial da API:", response.data);

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
        console.error("Erro ao buscar imóveis iniciais:", error);
        // Usa dados mockados em caso de erro
        setListings(await tratandoImoveisFicticios(mockListings));
      } finally {
        setLoading(false);
      }
    };

    fetchImoveis();
  }, []); // Executa apenas uma vez quando o componente monta

  // Adicionar useEffect para obter dados do usuário
  useEffect(() => {
    const usuarioLogado = obterUsuario();
    if (usuarioLogado && typeof usuarioLogado.nome === "string") {
      setUsuario({
        nome: usuarioLogado.nome ?? "",
        foto: usuarioLogado.foto,
      });
    }
  }, []);

  return (
    <div className={styles.airbnbContainer}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <a href="#">
            {/* Remover a imagem e substituir pelo texto estilizado */}
            <div className={styles.textLogo}>
              <span className={styles.logoStart}>Start</span>
              <span className={styles.logoEdu}>Edu</span>
              <div className={styles.logoGlow}></div>
            </div>
          </a>
        </div>
        <nav className={styles.navTabs}>
          <div className={`${styles.tab} ${styles.active}`}>Imóveis</div>
          <div className={styles.tab}>Faculdades</div>
          <div className={styles.tab}>Mais Procurados</div>
        </nav>
        <div className={styles.navActions}>
          <button
            className={styles.btnAnunciar}
            onClick={() => (window.location.href = "/imovel")}
            title="Anunciar um novo imóvel"
          >
            <span className={styles.btnIcon}>+</span>
            <span className={styles.btnText}>Anunciar Imóvel</span>
          </button>
          <div className={styles.userProfile}>
            {usuario ? (
              <div className={styles.userMenu}>
                <div
                  className={styles.profilePic}
                  style={{
                    backgroundImage: `url(${
                      usuario.foto ||
                      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzRhMDJiNCIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9Ijk2IiByPSI0MCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yMTYsMTg0LjVjMC00OC42LTM5LjQtODgtODgtODhzLTg4LDM5LjQtODgsODhjMCw4LjMsMS4yLDE2LjMsMy4zLDI0YzQuOCwxNS43LDEzLjcsMjkuNSwyNS45LDQwLjJsNS40LDQuNUg5NmwxMTIsMC4ybDEwLjktMC43QzIzMS43LDI0MC40LDI0NCwyMTMuOSwyNDQsMTg0LjVDMjQ0LDE4NC41LDIxNiwxODQuNSwyMTYsMTg0LjV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  title={usuario.nome}
                />
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownItem}>
                    Olá, {usuario.nome.split(" ")[0]}
                  </div>
                  <div className={styles.dropdownDivider}></div>
                  <div
                    className={styles.dropdownItem}
                    onClick={() => (window.location.href = "/aluno")}
                  >
                    Editar Perfil
                  </div>
                  <div
                    className={styles.dropdownItem}
                    onClick={() => {
                      fazerLogout();
                      window.location.reload();
                    }}
                  >
                    Sair
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={styles.profilePic}
                onClick={() => (window.location.href = "/login")}
                title="Fazer login ou cadastro"
              />
            )}
          </div>
        </div>
      </header>

      {/* View types and filters */}
      <div className={styles.viewControls}>
        <div className={styles.viewTypes}></div>

        <div className={styles.searchBar}>
          <div
            className={`${styles.searchItem} ${styles.searchInputContainer}`}
          >
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Procurar acomodações"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  buscarImoveis();
                }
              }}
            />
            <button className={styles.searchButton} onClick={buscarImoveis}>
              Buscar
            </button>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.searchItem}>
            <span>14 - 21 de junho</span>
          </div>

          <div className={styles.divider}></div>
          <div className={`${styles.searchItem} ${styles.guests}`}>
            <button
              className={styles.decrease}
              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
            >
              -
            </button>
            <span>{guestCount} hóspedes</span>
            <button
              className={styles.increase}
              onClick={() => setGuestCount(guestCount + 1)}
            >
              +
            </button>
          </div>
          <button className={styles.filterButton}>
            <span className={styles.icon}>⋮</span>
          </button>
        </div>
      </div>

      {/* Sidebar navigation */}

      {/* Main content - listings grid */}
      <div className={styles.listingsGrid}>
        {loading ? (
          <div className={styles.loadingMessage}>Carregando imóveis...</div>
        ) : (
          listings.map((item, index) => (
            <div
              className={styles.listingCard}
              key={item.id || index}
              onClick={() => direcionarImovel(item.id || index)}
            >
              <div
                className={styles.cardImage}
                style={{
                  backgroundImage: `url(${
                    typeof item.image === "string"
                      ? item.image
                      : "https://via.placeholder.com/300x200?text=Imóvel"
                  })`,
                }}
              >
                <button className={styles.favoriteBtn}>♡</button>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3>{item.title || item.nome}</h3>
                  <div className={styles.rating}>
                    <span className={styles.star}>★</span>
                    <span>{item.rating || "4.5"}</span>
                  </div>
                </div>
                <p className={styles.location}>
                  {item.localizacao ||
                    `${item.endereco || ""}, ${item.numero || ""}`}
                </p>

                {/* Exibir detalhes adicionais se disponíveis */}
                <p className={styles.details}>
                  {item.num_quartos !== undefined &&
                    `${item.num_quartos} quarto(s)`}
                  {item.num_quartos !== undefined &&
                    item.num_banheiros !== undefined &&
                    " • "}
                  {item.num_banheiros !== undefined &&
                    `${item.num_banheiros} banheiro(s)`}
                  {(item.num_quartos !== undefined ||
                    item.num_banheiros !== undefined) &&
                    item.mobiliado !== undefined &&
                    " • "}
                  {item.mobiliado !== undefined &&
                    (item.mobiliado ? "Mobiliado" : "Não mobiliado")}
                </p>

                <p className={styles.price}>
                  <strong>{item.preco || "R$ --"}</strong> / diária
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className={styles.madeIn}>
        <span>Desenvolvido por StartEdu</span>
      </div>

      {/* Assistente IA */}
      <AIAssistant />
    </div>
  );
};

export default Home;
