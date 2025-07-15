import React from "react";
import styles from "../Home_style.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ListingCard: React.FC<{ listings: any[]; loading: boolean }> = ({
  listings,
  loading,
}) => {
  const direcionarImovel = (id: number) => {
    window.location.href = `/imovel/${id}`;
  };
  return (
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
  );
};

export default ListingCard;
