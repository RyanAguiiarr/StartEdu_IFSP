import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";

// Defina uma interface para tipar os dados dos imóveis
interface Imovel {
  id?: number;
  nome: string;
  endereco: string;
  numero: string;
  descricao: string;
  num_quartos?: number;
  num_banheiros?: number;
  mobiliado?: boolean;
  status?: boolean;
  image?: string;
  title?: string;
  location?: string;
  price?: string;
  rating?: string;
}

const Home = () => {
  const [guestCount, setGuestCount] = useState(4);
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  // Função de busca por nome do imóvel
  const buscarImoveis = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      // Chamada da API com parâmetro de busca
      const response = await axios.get(
        `http://localhost:8080/imovel/${searchQuery}`
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        // Adaptando os dados da API para o formato atual do seu componente
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const imoveisFormatados = response.data.map((imovel: any) => ({
          id: imovel.id,
          image:
            imovel.image || "https://via.placeholder.com/300x200?text=Imóvel",
          title: imovel.nome || "Imóvel sem título",
          location:
            imovel.endereco && imovel.numero
              ? `${imovel.endereco}, ${imovel.numero}`
              : "Endereço não informado",
          price: `R$ ${Math.floor(Math.random() * 500 + 100)}`,
          rating: (Math.random() * (5 - 4) + 4).toFixed(2),
          nome: imovel.nome,
          endereco: imovel.endereco,
          numero: imovel.numero,
          descricao: imovel.descricao,
          num_quartos: imovel.num_quartos,
          num_banheiros: imovel.num_banheiros,
          mobiliado: imovel.mobiliado,
          status: imovel.status,
        }));

        setListings(imoveisFormatados);
      } else {
        // Se não encontrar resultados
        setListings([]);
      }
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
      setListings([]);
    } finally {
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
        const response = await axios.get("http://localhost:8080/imovel");

        if (Array.isArray(response.data) && response.data.length > 0) {
          // Adaptando os dados da API para o formato atual do seu componente
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const imoveisFormatados = response.data.map((imovel: any) => ({
            id: imovel.id,
            // Usa uma imagem padrão se não houver imagem
            image:
              imovel.image || "https://via.placeholder.com/300x200?text=Imóvel",
            title: imovel.nome || "Imóvel sem título",
            location:
              imovel.endereco && imovel.numero
                ? `${imovel.endereco}, ${imovel.numero}`
                : "Endereço não informado",
            price: `R$ ${Math.floor(Math.random() * 500 + 100)}`, // Preço aleatório para exemplo
            rating: (Math.random() * (5 - 4) + 4).toFixed(2), // Rating aleatório para exemplo
            // Mantém os dados originais também
            nome: imovel.nome,
            endereco: imovel.endereco,
            numero: imovel.numero,
            descricao: imovel.descricao,
            num_quartos: imovel.num_quartos,
            num_banheiros: imovel.num_banheiros,
            mobiliado: imovel.mobiliado,
            status: imovel.status,
          }));

          setListings(imoveisFormatados);
        } else {
          // Usa dados mockados se a API retornar vazio
          setListings(
            mockListings.map((item) => ({
              ...item,
              nome: item.title || "Imóvel sem título",
              endereco:
                item.location?.split(",")[0] || "Endereço não informado",
              numero: item.location?.split(",")[1]?.trim() || "",
              descricao: "",
            }))
          );
        }
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
        // Usa dados mockados em caso de erro
        setListings(
          mockListings.map((item) => ({
            ...item,
            nome: item.title || "Imóvel sem título",
            endereco: item.location?.split(",")[0] || "Endereço não informado",
            numero: item.location?.split(",")[1]?.trim() || "",
            descricao: "",
          }))
        );
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
          <svg width="102" height="32" fill="#FF385C">
            <path d="M29.3864 22.7101C29.2429 22.3073 29.0752 21.9176 28.9157 21.5565C28.6701 21.0011 28.4129 20.4446 28.1641 19.9067L28.1444 19.864C25.9255 15.0589 23.5439 10.1881 21.0659 5.38701L20.9607 5.18316C20.7079 4.69289 20.4466 4.18596 20.1784 3.68786C19.8604 3.0575 19.4745 2.4636 19.0276 1.91668C18.5245 1.31651 17.8956 0.833822 17.1853 0.502654C16.475 0.171486 15.7005 -9.83959e-05 14.9165 4.23317e-08C14.1325 9.84805e-05 13.3581 0.171877 12.6478 0.503224C11.9376 0.834571 11.3088 1.31742 10.8059 1.91771C10.3595 2.46476 9.97383 3.05853 9.65572 3.68858C9.38521 4.19115 9.12145 4.70278 8.8664 5.19757L8.76872 5.38696C6.29061 10.1884 3.90903 15.0592 1.69015 19.8639L1.65782 19.9338C1.41334 20.463 1.16057 21.0102 0.919073 21.5563C0.75949 21.9171 0.592009 22.3065 0.448355 22.7103C0.0369063 23.8104 -0.094204 24.9953 0.0668098 26.1585C0.237562 27.334 0.713008 28.4447 1.44606 29.3804C2.17911 30.3161 3.14434 31.0444 4.24614 31.4932C5.07835 31.8299 5.96818 32.002 6.86616 32C7.14824 31.9999 7.43008 31.9835 7.71027 31.9509C8.846 31.8062 9.94136 31.4366 10.9321 30.8639C12.2317 30.1338 13.5152 29.0638 14.9173 27.5348C16.3194 29.0638 17.6029 30.1338 18.9025 30.8639C19.8932 31.4367 20.9886 31.8062 22.1243 31.9509C22.4045 31.9835 22.6864 31.9999 22.9685 32C23.8664 32.002 24.7561 31.8299 25.5883 31.4932C26.6901 31.0444 27.6554 30.3161 28.3885 29.3804C29.1216 28.4447 29.5971 27.3341 29.7679 26.1585C29.9287 24.9952 29.7976 23.8103 29.3864 22.7101ZM14.9173 24.377C13.1816 22.1769 12.0678 20.1338 11.677 18.421C11.5169 17.7792 11.4791 17.1131 11.5656 16.4573C11.6339 15.9766 11.8105 15.5176 12.0821 15.1148C12.4163 14.6814 12.8458 14.3304 13.3374 14.0889C13.829 13.8475 14.3696 13.7219 14.9175 13.7219C15.4655 13.722 16.006 13.8476 16.4976 14.0892C16.9892 14.3307 17.4186 14.6817 17.7528 15.1151C18.0244 15.5181 18.201 15.9771 18.2693 16.4579C18.3556 17.1137 18.3177 17.7799 18.1573 18.4217C17.7661 20.1345 16.6526 22.1771 14.9173 24.377ZM27.7406 25.8689C27.6212 26.6908 27.2887 27.4674 26.7762 28.1216C26.2636 28.7759 25.5887 29.2852 24.8183 29.599C24.0393 29.9111 23.1939 30.0217 22.3607 29.9205C21.4946 29.8089 20.6599 29.5239 19.9069 29.0824C18.7501 28.4325 17.5791 27.4348 16.2614 25.9712C18.3591 23.3846 19.669 21.0005 20.154 18.877C20.3723 17.984 20.4196 17.0579 20.2935 16.1475C20.1791 15.3632 19.8879 14.615 19.4419 13.9593C18.9194 13.2519 18.2378 12.6768 17.452 12.2805C16.6661 11.8842 15.798 11.6777 14.9175 11.6777C14.0371 11.6777 13.1689 11.8841 12.383 12.2803C11.5971 12.6765 10.9155 13.2515 10.393 13.9589C9.94707 14.6144 9.65591 15.3624 9.5414 16.1465C9.41524 17.0566 9.4623 17.9822 9.68011 18.8749C10.1648 20.9993 11.4748 23.384 13.5732 25.9714C12.2555 27.4348 11.0845 28.4325 9.92769 29.0825C9.17468 29.5239 8.34007 29.809 7.47395 29.9205C6.64065 30.0217 5.79525 29.9111 5.0162 29.599C4.24581 29.2852 3.57092 28.7759 3.05838 28.1217C2.54585 27.4674 2.21345 26.6908 2.09411 25.8689C1.97932 25.0334 2.07701 24.1825 2.37818 23.3946C2.49266 23.0728 2.62663 22.757 2.7926 22.3818C3.0274 21.851 3.27657 21.3115 3.5244 20.7898L3.5244 20.7898C5.76063 15.9805 8.10021 11.0732 10.5406 6.3818C10.7799 5.96181 11.0348 5.51812 11.2724 5.1229C11.7099 4.43169 12.2805 3.84483 12.9506 3.40196C13.6207 2.95908 14.3734 2.67545 15.1544 2.57822C15.9354 2.48099 16.7315 2.57273 17.4662 2.84768C18.2009 3.12263 18.8529 3.57354 19.3695 4.16196C19.707 4.5563 19.9876 5.00474 20.2251 5.45284C20.463 5.85992 20.7185 6.30362 20.9612 6.71669C23.4014 11.4074 25.7415 16.3144 27.9785 21.1235L28.0007 21.1625C28.2485 21.6841 28.4976 22.2236 28.7322 22.7545C28.8981 23.1294 29.0319 23.4452 29.1463 23.7677C29.4475 24.5553 29.5451 25.406 29.4305 26.2414C29.3137 27.0059 28.9378 27.7171 28.3637 28.2373C27.8908 28.7559 27.3202 29.1743 26.6883 29.4673C26.0564 29.7603 25.3751 29.9211 24.6836 29.9401L24.6186 29.9442C23.1625 29.9442 21.7691 29.4474 20.5793 28.4935L20.5364 28.4595C19.1646 27.4058 18.0353 26.022 17.2381 24.4109L14.918 25.4487L12.5984 24.4109C11.8015 26.0219 10.6726 27.4058 9.30122 28.4595L9.2583 28.4935C8.06936 29.4331 6.69224 29.9177 5.2443 29.9177C5.08165 29.9177 4.91805 29.9114 4.75334 29.8996L4.74451 29.8996C4.05274 29.8809 3.37137 29.7201 2.73944 29.4271C2.10751 29.134 1.53693 28.7158 1.06362 28.1973C0.484215 27.6771 0.108998 26.9571 -0.00283237 26.1839C-0.117563 25.3486 -0.0199845 24.4978 0.281435 23.7103L0.294157 23.6789C0.40848 23.3562 0.542351 23.0402 0.708123 22.6654C0.942737 22.1336 1.19231 21.5937 1.44026 21.0717L1.48516 20.9814C3.73146 16.1723 6.07105 11.2652 8.51158 6.57508C8.75049 6.15839 9.00955 5.7073 9.2749 5.26155C9.60253 4.71579 10.0177 4.2349 10.4957 3.84571C12.5522 2.13437 15.3596 2.13437 17.4154 3.84571C17.8936 4.23549 18.309 4.71715 18.6367 5.26375C18.902 5.71081 19.1607 6.16218 19.3994 6.57826C21.8391 11.2677 24.1789 16.1745 26.4254 20.9835L26.4583 21.0478C26.7064 21.5699 26.956 22.1099 27.1906 22.642C27.3874 23.0822 27.5457 23.4489 27.6796 23.7942C27.9812 24.5822 28.0786 25.4332 27.9637 26.2689L27.7406 25.8689Z" />
            <path d="M41.6847 24.1196C40.8856 24.1196 40.1505 23.9594 39.4792 23.6391C38.808 23.3188 38.2327 22.8703 37.7212 22.2937C37.2098 21.7172 36.8263 21.0445 36.5386 20.3078C36.2509 19.539 36.123 18.7062 36.123 17.8093C36.123 16.9124 36.2829 16.0475 36.5705 15.2787C36.8582 14.51 37.2737 13.8373 37.7852 13.2287C38.2966 12.6521 38.9039 12.1716 39.6071 11.8513C40.3103 11.531 41.0455 11.3708 41.8765 11.3708C42.6756 11.3708 43.3788 11.531 44.0181 11.8833C44.6574 12.2037 45.1688 12.6841 45.5843 13.2927L45.6802 11.7232H48.6209V23.7992H45.6802L45.5843 22.0375C45.1688 22.6781 44.6254 23.1906 43.9222 23.575C43.2829 23.9274 42.5158 24.1196 41.6847 24.1196ZM42.4519 21.2367C43.0272 21.2367 43.5386 21.0765 44.0181 20.7882C44.4656 20.4679 44.8172 20.0515 45.1049 19.539C45.3606 19.0265 45.4884 18.4179 45.4884 17.7452C45.4884 17.0725 45.3606 16.4639 45.1049 15.9513C44.8492 15.4388 44.4656 15.0223 44.0181 14.7021C43.5706 14.3818 43.0272 14.2537 42.4519 14.2537C41.8765 14.2537 41.3651 14.4139 40.8856 14.7021C40.4382 15.0223 40.0866 15.4388 39.7989 15.9513C39.5432 16.4639 39.4153 17.0725 39.4153 17.7452C39.4153 18.4179 39.5432 19.0265 39.7989 19.539C40.0546 20.0515 40.4382 20.4679 40.8856 20.7882C41.3651 21.0765 41.8765 21.2367 42.4519 21.2367Z" />
          </svg>
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
      <div className="sidebar">
        <div className="sidebar-icon active">
          <span>🏠</span>
        </div>
        <div className="sidebar-icon">
          <span>🏙️</span>
        </div>
        <div className="sidebar-icon">
          <span>🏕️</span>
        </div>
        <div className="sidebar-icon">
          <span>📋</span>
        </div>
        <div className="sidebar-icon">
          <span>⛱️</span>
        </div>
        <div className="sidebar-icon">
          <span>🏊</span>
        </div>
        <div className="sidebar-icon">
          <span>🏔️</span>
        </div>
        <div className="sidebar-icon">
          <span>🏰</span>
        </div>
        <div className="sidebar-icon">
          <span>🏡</span>
        </div>
        <div className="sidebar-icon">
          <span>🌊</span>
        </div>
        <div className="sidebar-icon">
          <span>🏂</span>
        </div>
        <div className="sidebar-icon">
          <span>🌴</span>
        </div>
      </div>

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
                    item.image?.includes("http")
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
                  {item.location ||
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
                  <strong>{item.price || "R$ --"}</strong> / diária
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
