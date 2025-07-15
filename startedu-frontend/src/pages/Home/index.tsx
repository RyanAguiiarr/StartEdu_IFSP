import { useState, useEffect } from "react";
import styles from "./Home_style.module.css";
import { buscarImoveisHome } from "./functions/functions";
import { obterUsuario } from "../../services/authService";
import imagempadrao from "../../images/imovel_teste.jpg";
import AIAssistant from "../../components/AIAssistant/AIAssistant";
import Navbar from "./components/Navbar";
import ListingCard from "./components/listings_grid";

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
    await buscarImoveisHome(
      searchQuery,
      (listings) => setListings(listings as Imovel[]),
      setLoading,
      mockListings
    );
  };

  // Função para buscar imóveis da API
  useEffect(() => {
    const fetchImoveis = async () => {
      // Usa a função isolada para carregar todos os imóveis inicialmente
      await buscarImoveisHome(
        "",
        (listings) => setListings(listings as Imovel[]),
        setLoading,
        mockListings
      );
    };

    fetchImoveis();
  }, []); // Executa apenas uma vez quando o componente monta

  // Adicionar useEffect para obter dados do usuário
  useEffect(() => {
    const usuarioLogado = obterUsuario();
    console.log("Usuário logado obtido:", usuarioLogado);
    console.log("LocalStorage usuario:", localStorage.getItem("usuario"));

    if (usuarioLogado && usuarioLogado.nome) {
      console.log("URL da foto do usuário:", usuarioLogado.foto);
      setUsuario({
        nome: usuarioLogado.nome,
        foto: usuarioLogado.foto,
      });
    } else {
      console.log("Usuário não encontrado ou sem nome");
    }
  }, []);

  return (
    <div className={styles.airbnbContainer}>
      {/* Navbar */}
      <Navbar usuario={usuario} />

      {/* View types and filters */}
      {/* Sidebar navigation */}
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

      {/* Main content - listings grid */}
      <ListingCard listings={listings} loading={loading} />
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
