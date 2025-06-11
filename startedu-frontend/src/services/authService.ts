interface Usuario {
  id?: number;
  nome: string;
  email: string;
  foto?: string;
}

// Função para salvar dados do usuário no localStorage
export const salvarUsuario = (usuario: Usuario): void => {
  localStorage.setItem("usuario", JSON.stringify(usuario));
};

// Função para obter dados do usuário do localStorage
export const obterUsuario = (): Usuario | null => {
  const usuarioSalvo = localStorage.getItem("usuario");
  if (usuarioSalvo) {
    return JSON.parse(usuarioSalvo);
  }
  return null;
};

// Função para verificar se usuário está logado
export const estaLogado = (): boolean => {
  return localStorage.getItem("usuario") !== null;
};

// Função para fazer logout
export const fazerLogout = (): void => {
  localStorage.removeItem("usuario");
};
