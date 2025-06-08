import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";
import {
  tratandoImagensDeImovel,
  tratandoImoveisFicticios,
} from "./functions/functions";
import logoStartEdu from "../../images/logo.png";

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

const Home = () => {
  const [guestCount, setGuestCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Mock data como fallback caso a API falhe
  const mockListings = [
    {
      id: 1,
      image: "whitefish.jpg",
      title: "Whitefish Estate",
      location: "Whitefish, Montana, United States",
      price: "R$ 10.000",
      rating: "5.0",
    },
    {
      id: 2,
      image: "luxury-barbados.jpg",
      title: "Luxury stay in Weston, Saint James, Barbados",
      location: "Weston, Saint James, Barbados",
      price: "R$ 1.500",
      rating: "5.00",
    },
    {
      id: 3,
      image: "lake-como.jpg",
      title: "Numero 22 - Lake Como - Design Living & Lake View",
      location: "Laglio, Lombardia, Italy",
      price: "R$ 359",
      rating: "4.99",
    },
    {
      id: 4,
      image: "dubai.jpg",
      title: "7,500 sq ft Private Beachfront Estate",
      location: "Dubai, United Arab Emirates",
      price: "R$ 2.478",
      rating: "4.73",
    },
    {
      id: 5,
      image: "tulum.jpg",
      title: "Bohemian & Spacious / Private Pool and Garden",
      location: "Tulum, Quintana Roo, Mexico",
      price: "R$ 199",
      rating: "4.97",
    },
    {
      id: 6,
      image: "aframe.jpg",
      title: "Designer A-Frame Cabin in the Trees",
      location: "Lake Arrowhead, California, United States",
      price: "R$ 225",
      rating: "4.93",
    },
    {
      id: 7,
      image: "aspen.jpg",
      title: "Fully Renovated 2 BR on River w/ Pool - Walk to To",
      location: "Aspen, Colorado, United States",
      price: "R$ 546",
      rating: "5.0",
    },
    {
      id: 8,
      image: "magnolia.jpg",
      title: "Magnolia's Hillcrest Cottage",
      location: "Waco, Texas, United States",
      price: "R$ 500",
      rating: "4.97",
    },
  ];

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

  return (
    <div className="airbnb-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">
          <a href="#">
            <img src={logoStartEdu} alt="logo" />
          </a>
        </div>
        <nav className="nav-tabs">
          <div className="tab active">Imóveis</div>
          <div className="tab">Faculdades</div>
          <div className="tab">Mais Procurados</div>
        </nav>
        <div className="user-profile">
          <div className="profile-pic"></div>
        </div>
      </header>

      {/* View types and filters */}
      <div className="view-controls">
        <div className="view-types"></div>

        <div className="search-bar">
          <div className="search-item search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Procurar acomodações"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  buscarImoveis();
                }
              }}
            />
            <button className="search-button" onClick={buscarImoveis}>
              Buscar
            </button>
          </div>
          <div className="divider"></div>
          <div className="search-item">
            <span>14 - 21 de junho</span>
          </div>

          <div className="divider"></div>
          <div className="search-item guests">
            <button
              className="decrease"
              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
            >
              -
            </button>
            <span>{guestCount} hóspedes</span>
            <button
              className="increase"
              onClick={() => setGuestCount(guestCount + 1)}
            >
              +
            </button>
          </div>
          <button className="filter-button">
            <span className="icon">⋮</span>
          </button>
        </div>
      </div>

      {/* Sidebar navigation */}
      


      {/* Main content - listings grid */}
      <div className="listings-grid">
        {loading ? (
          <div className="loading-message">Carregando imóveis...</div>
        ) : (
          listings.map((item, index) => (
            <div className="listing-card" key={item.id || index}>
              <div
                className="card-image"
                style={{
                  backgroundImage: `url(${
                    typeof item.image === "string"
                      ? item.image
                      : "https://via.placeholder.com/300x200?text=Imóvel"
                  })`,
                }}
              >
                <button className="favorite-btn">♡</button>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3>{item.title || item.nome}</h3>
                  <div className="rating">
                    <span className="star">★</span>
                    <span>{item.rating || "4.5"}</span>
                  </div>
                </div>
                <p className="location">
                  {item.localizacao ||
                    `${item.endereco || ""}, ${item.numero || ""}`}
                </p>

                {/* Exibir detalhes adicionais se disponíveis */}
                <p className="details">
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

                <p className="price">
                  <strong>{item.preco || "R$ --"}</strong> / diária
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="made-in">
        <span>Desenvolvido por StartEdu</span>
      </div>
    </div>
  );
};

export default Home;
