import * as React from "react";
import * as Form from "@radix-ui/react-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { cadastrar } from "../../services/cadastroService";
import { logar } from "../../services/loginService"; // Importe o serviço de login
import styles from "./Cadastro_style.module.css";

const Cadastro = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const isLoginMode = mode === "login";

  // Estados compartilhados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleCadastro = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Resetar estados
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    // Log para verificar se os dados estão sendo coletados corretamente
    console.log("nome:", formData.get("nome"));
    console.log("email:", formData.get("email"));
    console.log("senha:", formData.get("senha"));
    console.log("tipoUsuario:", formData.get("tipoUsuario"));

    const userData = {
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      senha: formData.get("senha") as string,
      tipoUsuario: formData.get("tipoUsuario") as string,
    };

    // Log do objeto completo
    console.log("Dados do usuário:", userData);

    try {
      console.log("Enviando requisição para API...");
      const response = await cadastrar(userData);
      console.log("Resposta da API:", response);
      setSuccess(true);
      navigate("/"); // Redireciona para a página inicial após o cadastro

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Erro ao cadastra:", err);
      // Log detalhado do erro
      if (err.response) {
        console.error("Resposta de erro:", err.response.data);
        console.error("Status:", err.response.status);
        setError(
          `Erro ${err.response.status}: ${JSON.stringify(err.response.data)}`
        );
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

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const loginData = {
      email: formData.get("email") as string,
      senha: formData.get("senha") as string,
    };

    try {
      await logar(loginData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/home");
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);
      if (err.response) {
        setError(
          `Erro ${err.response.status}: ${JSON.stringify(err.response.data)}`
        );
      } else if (err.request) {
        setError("Erro de conexão: o servidor não respondeu.");
      } else {
        setError(`Erro: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.fundo}>
      <Form.Root
        className={styles.formRoot}
        onSubmit={isLoginMode ? handleLogin : handleCadastro}
      >
        <h1 className={styles.formTitle}>
          {isLoginMode ? "Login" : "Cadastre-se"}
        </h1>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && (
          <div className={styles.successMessage}>
            {isLoginMode
              ? "Login realizado com sucesso!"
              : "Cadastro realizado com sucesso!"}
          </div>
        )}

        {/* Campos compartilhados */}
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
          {!isLoginMode && (
            <p className={styles.formHint}>
              A senha deve conter pelo menos 6 caracteres
            </p>
          )}
        </Form.Field>

        {/* Campos específicos para cadastro */}
        {!isLoginMode && (
          <>
            {/* Campo Nome */}
            <Form.Field className={styles.formField} name="nome">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label className={styles.formLabel}>Nome</Form.Label>
                <Form.Message
                  className={styles.formMessage}
                  match="valueMissing"
                >
                  Por favor, informe seu nome
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input className={styles.input} type="text" required />
              </Form.Control>
            </Form.Field>

            {/* Campo Tipo de Usuário */}
            <Form.Field className={styles.formField} name="tipoUsuario">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label className={styles.formLabel}>
                  Tipo de Usuário
                </Form.Label>
                <Form.Message
                  className={styles.formMessage}
                  match="valueMissing"
                >
                  Por favor, selecione o tipo de usuário
                </Form.Message>
              </div>
              <Form.Control asChild>
                <select className={styles.input} required defaultValue="">
                  <option value="" disabled>
                    Selecione uma opção
                  </option>
                  <option value="ALUNO">ALUNO</option>
                  <option value="IMOBILIARIA">IMOBILIÁRIA</option>
                </select>
              </Form.Control>
            </Form.Field>
          </>
        )}

        {/* Links de Ajuda */}
        <div className={styles.formLinks}>
          {isLoginMode ? (
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
          ) : (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
              className={styles.formLink}
            >
              Já tem uma conta? Logar
            </a>
          )}
        </div>

        {/* Botão de Envio */}
        <Form.Submit asChild>
          <button className={styles.button} disabled={loading}>
            {isLoginMode
              ? loading
                ? "Entrando..."
                : "Entrar"
              : loading
              ? "Cadastrando..."
              : "Cadastrar"}
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default Cadastro;
