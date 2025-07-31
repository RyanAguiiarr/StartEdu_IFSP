import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";
import { api } from "./api";

export const logarComGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Enviar dados para o backend
    const response = await api.post("/auth/google", {
      email: result.user.email,
      nome: result.user.displayName,
      googleId: result.user.uid,
      foto: result.user.photoURL,
    });

    // Definir o tipo esperado da resposta
    interface Usuario {
      email: string;
      nome: string;
      googleId: string;
      foto: string | null;
      // Adicione outros campos conforme necessário
    }

    interface GoogleAuthResponse {
      token: string;
      usuario: Usuario;
    }
    const data = response.data as GoogleAuthResponse;

    // Salvar token e dados do usuário
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    return response.data;
  } catch (error) {
    console.error("Erro no login com Google:", error);
    throw error;
  }
};
