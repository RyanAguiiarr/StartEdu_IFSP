import * as React from "react";
import * as Form from "@radix-ui/react-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Login_style.module.css";

import { logar } from "../../services/loginService";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Resetar estados
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    // Log para verificar se os dados estão sendo coletados corretamente
    console.log("email:", formData.get("email"));
    console.log("senha:", formData.get("senha"));
    console.log("token:", formData.get("token"));

    const loginData = {
      email: formData.get("email") as string,
      senha: formData.get("senha") as string,
      token: formData.get("token") as string | undefined,
    };

    // Log do objeto completo
    console.log("Dados de login:", loginData);

    try {
      console.log("Enviando requisição para API...");
      const response = await logar(loginData);
      console.log("Resposta da API:", response);
      setSuccess(true);

      // Redireciona para a página inicial após o login
      setTimeout(() => {
        navigate("/");
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);
      // Log detalhado do erro
      if (err.response) {
        console.error("Resposta de erro:", err.response.data);
        console.error("Status:", err.response.status);
        setError(`Erro ${err.response.status}: ${err.response.data}`);
      } else if (err.request) {
        console.error("Sem resposta:", err.request);
        setError("Erro de conexão: o servidor não respondeu.");
      } else {
        console.error("Erro de configuração:", err.message);
        setError(`Erro: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.fundo}>
      <Form.Root className={styles.formRoot} onSubmit={handleSubmit}>
        <h1 className={styles.formTitle}>Login</h1>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && (
          <div className={styles.successMessage}>
            Login realizado com sucesso!
          </div>
        )}

        {/* Campo Email */}
        <Form.Field className={styles.formField} name="email">
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <Form.Label className={styles.formLabel}>Email</Form.Label>
            <Form.Message className={styles.formMessage} match="valueMissing">
              Por favor, informe seu email
            </Form.Message>
            <Form.Message className={styles.formMessage} match="typeMismatch">
              Por favor, informe um email válido
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input className={styles.input} type="email" required />
          </Form.Control>
        </Form.Field>

        {/* Campo Senha */}
        <Form.Field className={styles.formField} name="senha">
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <Form.Label className={styles.formLabel}>Senha</Form.Label>
            <Form.Message className={styles.formMessage} match="valueMissing">
              Por favor, informe sua senha
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input
              className={styles.input}
              type="password"
              required
              minLength={6}
            />
          </Form.Control>
        </Form.Field>

        {/* Links de Ajuda */}
        <div className={styles.formLinks}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/cadastro"); // Use minúsculas para consistência
            }}
            className={styles.formLink}
          >
            Não tem uma conta? Cadastre-se
          </a>
        </div>

        {/* Botão de Envio */}
        <Form.Submit asChild>
          <button className={styles.button} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default Login;
