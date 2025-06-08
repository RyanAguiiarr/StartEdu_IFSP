import * as React from "react";
import * as Form from "@radix-ui/react-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cadastrar } from "../../services/cadastroService";
import "./style.css";

const Cadastro = () => {
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
      navigate("/home"); // Redireciona para a página inicial após o cadastro

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

  return (
    <div className="fundo">
    <Form.Root className="FormRoot" onSubmit={handleSubmit}>
      <h1 className="FormTitle">Cadastre-se</h1>

      {error && <div className="ErrorMessage">{error}</div>}
      {success && (
        <div className="SuccessMessage">Cadastro realizado com sucesso!</div>
      )}

      {/* Campo Nome */}
      <Form.Field className="FormField" name="nome">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Form.Label className="FormLabel">Nome</Form.Label>
          <Form.Message className="FormMessage" match="valueMissing">
            Por favor, informe seu nome
          </Form.Message>
        </div>
        <Form.Control asChild>
          <input className="Input" type="text" required />
        </Form.Control>
      </Form.Field>

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

      {/* Campo Tipo de Usuário */}
      <Form.Field className="FormField" name="tipoUsuario">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Form.Label className="FormLabel">Tipo de Usuário</Form.Label>
          <Form.Message className="FormMessage" match="valueMissing">
            Por favor, selecione o tipo de usuário
          </Form.Message>
        </div>
        <Form.Control asChild>
          <select className="Input" required defaultValue="">
            <option value="" disabled>
              Selecione uma opção
            </option>
            <option value="ALUNO">ALUNO</option>
            <option value="IMOBILIARIA">IMOBILIÁRIA</option>
          </select>
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
        <p className="FormHint">A senha deve conter pelo menos 6 caracteres</p>
      </Form.Field>

      {/* Botão de Envio */}
      <Form.Submit asChild>
        <button className="Button" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </Form.Submit>
    </Form.Root>
    </div>
  );
};

export default Cadastro;
