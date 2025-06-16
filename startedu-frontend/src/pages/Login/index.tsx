import * as React from "react";
import * as Form from "@radix-ui/react-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login_style.css";

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

    const loginData = {
      email: formData.get("email") as string,
      senha: formData.get("senha") as string,
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
        navigate("/home");
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);
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

  return (
    <div className="fundo">
      <Form.Root className="FormRoot" onSubmit={handleSubmit}>
        <h1 className="FormTitle">Login</h1>

        {error && <div className="ErrorMessage">{error}</div>}
        {success && (
          <div className="SuccessMessage">Login realizado com sucesso!</div>
        )}

        {/* Campo Email */}
        <Form.Field className="FormField" name="email">
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <Form.Label className="FormLabel">Email</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Por favor, informe seu email
            </Form.Message>
            <Form.Message className="FormMessage" match="typeMismatch">
              Por favor, informe um email válido
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input className="Input" type="email" required />
          </Form.Control>
        </Form.Field>

        {/* Campo Senha */}
        <Form.Field className="FormField" name="senha">
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <Form.Label className="FormLabel">Senha</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Por favor, informe sua senha
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input className="Input" type="password" required minLength={6} />
          </Form.Control>
        </Form.Field>

        {/* Links de Ajuda */}
        <div className="FormLinks">
          <a href="/" className="FormLink">
            Não tem uma conta? Cadastre-se
          </a>
        </div>

        {/* Botão de Envio */}
        <Form.Submit asChild>
          <button className="Button" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default Login;
