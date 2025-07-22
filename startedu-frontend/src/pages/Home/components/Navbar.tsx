import styles from "../Home_style.module.css";
import { fazerLogout, obterUsuario } from "../../../services/authService";

interface Usuario {
  nome: string;
  foto?: string;
}

interface NavbarProps {
  usuario: Usuario | null;
}

const id = obterUsuario()?.id; // Usar o ID do usuário ou 0 se não estiver logado

const Navbar = ({ usuario }: NavbarProps) => {
  console.log("Renderizando Navbar com usuário:", usuario);
  return (
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
        <div
          className={`${styles.tab} ${styles.active}`}
          onClick={() => (window.location.href = "/")}
        >
          Imóveis
        </div>
        <div
          className={styles.tab}
          onClick={() => (window.location.href = `/interesse/${id}`)}
        >
          Meus Interesses
        </div>
        <div
          className={styles.tab}
          onClick={() => (window.location.href = `/match/${id}`)}
        >
          Meus Matchs
        </div>
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
                  backgroundImage: `url(${(() => {
                    const fotoUrl =
                      usuario.foto ||
                      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzRhMDJiNCIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9Ijk2IiByPSI0MCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yMTYsMTg0LjVjMC00OC42LTM5LjQtODgtODgtODhzLTg4LDM5LjQtODgsODhjMCw4LjMsMS4yLDE2LjMsMy4zLDI0YzQuOCwxNS43LDEzLjcsMjkuNSwyNS45LDQwLjJsNS40LDQuNUg5NmwxMTIsMC4ybDEwLjktMC43QzIzMS43LDI0MC40LDI0NCwyMTMuOSwyNDQsMTg0LjVDMjQ0LDE4NC41LDIxNiwxODQuNSwyMTYsMTg0LjV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+";
                    console.log(
                      "URL da foto sendo usada no backgroundImage:",
                      fotoUrl
                    );
                    return fotoUrl;
                  })()})`,
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
  );
};

export default Navbar;
