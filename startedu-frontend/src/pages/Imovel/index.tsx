import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obterUsuario } from "../../services/authService";
import axios from "axios";
import styles from "./Imovel_style.module.css";
import { format } from "date-fns";
import AIAssistant from "../../components/AIAssistant/AIAssistant";
import { motion } from "framer-motion";
import imagemTeste from "../../images/imovel_teste.jpg";

// Ícones
import {
  FaHeart,
  FaShare,
  FaStar,
  FaBed,
  FaBath,
  FaWifi,
  FaSnowflake,
  FaSwimmingPool,
  FaParking,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaUmbrellaBeach,
  FaTv,
  FaUtensils,
} from "react-icons/fa";

// Tipos
interface ImagemImovel {
  id: number;
  url: string;
  imovel_id: number;
}

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
  imagens?: ImagemImovel[] | string[];
  preco?: string;
  localizacao?: string;
}

// Constantes
const DEFAULT_PLACEHOLDER =
  "https://via.placeholder.com/800x600?text=Sem+imagem+disponível";
const DEFAULT_IMAGE = imagemTeste;

// Animações
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const DetalheImovel: React.FC = () => {
  // Hooks
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const photoRef = useRef<HTMLDivElement>(null);

  // Estados
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [imagemPrincipal, setImagemPrincipal] = useState<string>("");
  const [imagens, setImagens] = useState<string[]>([]);
  const [dataSelecionada] = useState<Date[]>([
    new Date(),
    new Date(new Date().setDate(new Date().getDate() + 30)),
  ]);
  const [qtdHospedes, setQtdHospedes] = useState(1);
  const [mostrarTodasFotos, setMostrarTodasFotos] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [selectedTab, setSelectedTab] = useState("fotos");

  // Carregamento da página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Carregamento do imóvel
  useEffect(() => {
    const carregarImovel = async () => {
      try {
        setCarregando(true);
        const response = await axios.get(
          `http://localhost:8080/imovel/imoveis/${id}`
        );
        const data = response.data as Imovel;

        // Processamento de imagens
        if (data.imagens && data.imagens.length > 0) {
          const imagensProcessadas = [];

          // Processamento baseado no tipo de imagens recebido
          if (typeof data.imagens[0] === "string") {
            for (const caminhoCompleto of data.imagens as string[]) {
              const filename = caminhoCompleto.split("/").pop() || "";
              const imageUrl = `http://localhost:8080/imovel/images/${filename}`;
              imagensProcessadas.push(imageUrl);
            }
          } else {
            for (const img of data.imagens as ImagemImovel[]) {
              const caminhoCompleto = img.url;
              const filename = caminhoCompleto.split("/").pop() || "";
              const imageUrl = `http://localhost:8080/imovel/images/${filename}`;
              imagensProcessadas.push(imageUrl);
            }
          }

          // Atualização de estado com as imagens processadas
          if (imagensProcessadas.length > 0) {
            setImagemPrincipal(imagensProcessadas[0]);
            setImagens(imagensProcessadas);

            const imagensFormatadas = imagensProcessadas.map((url, index) => ({
              id: index + 1,
              url: url,
              imovel_id: Number(id),
            }));

            setImovel({
              ...data,
              imagens: imagensFormatadas,
            });
          } else {
            setImagemPrincipal(DEFAULT_IMAGE);
            setImagens([DEFAULT_IMAGE]);
            setImovel(data);
          }
        } else {
          setImagemPrincipal(DEFAULT_IMAGE);
          setImagens([DEFAULT_IMAGE]);
          setImovel(data);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes do imóvel:", error);
        setImagemPrincipal(DEFAULT_IMAGE);
        setImagens([DEFAULT_IMAGE]);
      } finally {
        setCarregando(false);
      }
    };

    carregarImovel();
  }, [id]);

  // Funções auxiliares
  const handleReservar = () => {
    const usuario = obterUsuario();
    if (!usuario) {
      navigate("/login");
      return;
    }
    alert("Reserva solicitada com sucesso!");
  };

  const toggleSalvar = () => setSalvo(!salvo);
  const toggleMostrarFotos = () => setMostrarTodasFotos(!mostrarTodasFotos);

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
    const element = document.getElementById(tab);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    if (e.currentTarget.src.includes("/imovel/images/")) {
      e.currentTarget.src = DEFAULT_IMAGE;
      e.currentTarget.onerror = null;
    } else {
      e.currentTarget.src = DEFAULT_PLACEHOLDER;
      e.currentTarget.onerror = null;
    }
  };

  // Telas de carregamento e erro
  if (carregando) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          className={styles.loadingSpinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.p {...fadeIn}>Carregando detalhes do imóvel...</motion.p>
      </div>
    );
  }

  if (!imovel) {
    return (
      <div className={styles.errorContainer}>
        <h2>Imóvel não encontrado</h2>
        <p>O imóvel que você está procurando não existe ou foi removido.</p>
        <button onClick={() => navigate("/")}>
          Voltar para a página inicial
        </button>
      </div>
    );
  }

  // Cálculo do preço total
  const precoBase = parseInt(imovel.preco || "500");
  const precoTotal = precoBase * 3 + 150;

  return (
    <div className={styles.pageContainer}>
      <motion.div
        className={styles.imovelContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header com ações */}
        <header className={styles.imovelHeader}>
          <motion.div
            className={styles.headerBack}
            onClick={() => navigate("/")}
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft />
            <span>Voltar</span>
          </motion.div>
          <div className={styles.headerActions}>
            <motion.button
              className={styles.actionButton}
              onClick={() => alert("Compartilhar")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShare /> <span>Compartilhar</span>
            </motion.button>
            <motion.button
              className={`${styles.actionButton} ${salvo ? styles.saved : ""}`}
              onClick={toggleSalvar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHeart /> <span>{salvo ? "Salvo" : "Salvar"}</span>
            </motion.button>
          </div>
        </header>

        {/* Galeria de Fotos */}
        <div className={styles.gallerySection} ref={photoRef} id="fotos">
          <motion.div
            className={styles.mainImageContainer}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={imagemPrincipal}
              alt={imovel.nome}
              className={styles.mainImage}
              onError={handleImageError}
            />
            <button
              className={styles.galleryViewButton}
              onClick={toggleMostrarFotos}
            >
              Ver todas as fotos
            </button>
          </motion.div>
          {imagens.length > 1 && (
            <div className={styles.thumbnailStrip}>
              {imagens.slice(0, 5).map((imagem, index) => (
                <motion.div
                  key={index}
                  className={`${styles.thumbnail} ${
                    imagemPrincipal === imagem ? styles.activeThumbnail : ""
                  }`}
                  onClick={() => setImagemPrincipal(imagem)}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={imagem}
                    alt={`Foto ${index + 1} de ${imovel.nome}`}
                    onError={handleImageError}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Avaliação */}
        <div className={styles.ratingContainer}>
          <div className={styles.starRating}>
            <FaStar className={styles.starIcon} />
            <span className={styles.ratingValue}>5.0</span>
          </div>
          <div className={styles.ratingText}>
            <span>Excelente</span>
          </div>
        </div>

        {/* Tabs de navegação */}
        <div className={styles.tabsContainer}>
          {["fotos", "comodidades", "localização"].map((tab) => (
            <motion.button
              key={tab}
              className={`${styles.tabButton} ${
                selectedTab === tab ? styles.active : ""
              }`}
              onClick={() => handleTabClick(tab)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {selectedTab === tab && (
                <motion.div
                  className={styles.tabIndicator}
                  layoutId="tabIndicator"
                />
              )}
            </motion.button>
          ))}
        </div>

        <motion.div
          className={styles.contentContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className={styles.detailsContainer}>
            {/* Informações principais */}
            <motion.section
              className={styles.mainInfo}
              {...fadeIn}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.basicDetails}>
                <motion.h1
                  className={styles.propertyTitle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {imovel.nome}
                </motion.h1>
                <div className={styles.locationText}>
                  <FaMapMarkerAlt className={styles.locationIcon} />
                  <span>
                    {imovel.endereco}, {imovel.numero}
                    {imovel.localizacao && `, ${imovel.localizacao}`}
                  </span>
                </div>

                <div className={styles.propertyBadges}>
                  <motion.div
                    className={styles.propertyBadge}
                    whileHover={{ scale: 1.05 }}
                  >
                    <FaBed className={styles.badgeIcon} />
                    <span>
                      {imovel.num_quartos || 1} quarto
                      {(imovel.num_quartos || 1) > 1 ? "s" : ""}
                    </span>
                  </motion.div>
                  <motion.div
                    className={styles.propertyBadge}
                    whileHover={{ scale: 1.05 }}
                  >
                    <FaBath className={styles.badgeIcon} />
                    <span>
                      {imovel.num_banheiros || 1} banheiro
                      {(imovel.num_banheiros || 1) > 1 ? "s" : ""}
                    </span>
                  </motion.div>
                  {imovel.mobiliado && (
                    <motion.div
                      className={styles.propertyBadge}
                      whileHover={{ scale: 1.05 }}
                    >
                      <FaCheckCircle className={styles.badgeIcon} />
                      <span>Mobiliado</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.section>

            {/* Comodidades */}
            <motion.section
              className={styles.amenitiesSection}
              id="comodidades"
              {...fadeIn}
              transition={{ delay: 0.4 }}
            >
              <h2 className={styles.sectionTitle}>O que este lugar oferece</h2>
              <div className={styles.featuresList}>
                {[
                  { id: 1, icon: <FaWifi />, text: "Wi-Fi de alta velocidade" },
                  { id: 2, icon: <FaSnowflake />, text: "Ar-condicionado" },
                  { id: 3, icon: <FaSwimmingPool />, text: "Acesso à piscina" },
                  { id: 4, icon: <FaParking />, text: "Estacionamento" },
                  { id: 5, icon: <FaShieldAlt />, text: "Segurança 24h" },
                  {
                    id: 6,
                    icon: <FaUmbrellaBeach />,
                    text: "Proximidade a lazer",
                  },
                  { id: 7, icon: <FaTv />, text: "Smart TV" },
                  { id: 8, icon: <FaUtensils />, text: "Cozinha equipada" },
                ].map((feature) => (
                  <motion.div
                    key={feature.id}
                    className={styles.featureItem}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div className={styles.featureIconWrapper}>
                      {feature.icon}
                    </div>
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Sobre este espaço */}
            <motion.section
              className={styles.descriptionSection}
              {...fadeIn}
              transition={{ delay: 0.6 }}
            >
              <h2 className={styles.sectionTitle}>Sobre este espaço</h2>
              <div className={styles.descriptionContent}>
                <p>{imovel.descricao}</p>
              </div>
            </motion.section>

            {/* Localização */}
            <motion.section
              className={styles.locationSection}
              id="localização"
              {...fadeIn}
              transition={{ delay: 0.7 }}
            >
              <h2 className={styles.sectionTitle}>Localização</h2>
              <motion.div
                className={styles.mapContainer}
                whileHover={{ scale: 1.01 }}
              >
                <iframe
                  title="Localização do imóvel"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    `${imovel.endereco}, ${imovel.numero}, ${
                      imovel.localizacao || ""
                    }`
                  )}&output=embed`}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </motion.div>
              <div className={styles.locationDetails}>
                <h3 className={styles.proximityTitle}>Pontos próximos</h3>
                <div className={styles.proximityList}>
                  <div className={styles.proximityItem}>
                    <FaCheckCircle className={styles.proximityIcon} />
                    <span>Campus universitário - 500m</span>
                  </div>
                  <div className={styles.proximityItem}>
                    <FaCheckCircle className={styles.proximityIcon} />
                    <span>Supermercado - 300m</span>
                  </div>
                  <div className={styles.proximityItem}>
                    <FaCheckCircle className={styles.proximityIcon} />
                    <span>Ponto de ônibus - 100m</span>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Card de reserva */}
          <div className={styles.bookingContainer}>
            <motion.div
              className={styles.bookingCard}
              {...fadeIn}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.cardGlow}></div>
              <div className={styles.priceContainer}>
                <span className={styles.price}>R$ {imovel.preco || "500"}</span>
                <span className={styles.priceUnit}>/mês</span>
              </div>
              <div className={styles.taxInfo}>
                <FaCheckCircle className={styles.checkIcon} />
                <span>Os preços incluem todas as taxas</span>
              </div>

              <motion.div
                className={styles.dateSelection}
                whileHover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              >
                <div className={styles.dateColumns}>
                  <div className={styles.dateColumn}>
                    <div className={styles.dateLabel}>Início</div>
                    <div className={styles.dateInput}>
                      <input
                        type="text"
                        value={format(dataSelecionada[0], "dd/MM/yyyy")}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className={styles.dateColumn}>
                    <div className={styles.dateLabel}>Término</div>
                    <div className={styles.dateInput}>
                      <input
                        type="text"
                        value={format(dataSelecionada[1], "dd/MM/yyyy")}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.guestsInput}>
                  <div className={styles.guestsLabel}>Hóspedes</div>
                  <div className={styles.guestsSelect}>
                    <select
                      value={qtdHospedes}
                      onChange={(e) => setQtdHospedes(parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num} hóspede{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>

              <motion.button
                className={styles.reserveButton}
                onClick={handleReservar}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Reservar
              </motion.button>

              <p className={styles.noChargeText}>Você ainda não será cobrado</p>

              <div className={styles.priceBreakdown}>
                <motion.div
                  className={styles.priceRow}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span>R$ {precoBase} x 3 meses</span>
                  <span>R$ {precoBase * 3}</span>
                </motion.div>
                <motion.div
                  className={styles.priceRow}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span>Taxa de limpeza</span>
                  <span>R$ 150,00</span>
                </motion.div>
                <motion.div
                  className={`${styles.priceRow} ${styles.totalRow}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <span>Total</span>
                  <span>R$ {precoTotal.toFixed(2)}</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Galeria Modal */}
      {mostrarTodasFotos && (
        <motion.div
          className={styles.galleryModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            className={styles.closeModalButton}
            onClick={toggleMostrarFotos}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
          <motion.div
            className={styles.galleryGrid}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {imagens.map((imagem, index) => (
              <motion.div
                key={index}
                className={styles.galleryItem}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={imagem}
                  alt={`Foto ${index + 1} de ${imovel.nome}`}
                  onError={handleImageError}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      <AIAssistant />
    </div>
  );
};

export default DetalheImovel;
