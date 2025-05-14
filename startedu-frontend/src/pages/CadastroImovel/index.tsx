import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { cadastrarImovel } from "../../services/cadastrarImovelService";

interface ImovelData {
  nome: string;
  endereco: string;
  numero: string;
  descricao: string;
  num_quartos: number;
  num_banheiros: number;
  mobiliado: boolean;
  status: boolean;
}
export function CadastroImovel() {
  const navigate = useNavigate();
  const [imovel, setImovel] = useState<ImovelData>({
    nome: "",
    endereco: "",
    numero: "",
    descricao: "",
    num_quartos: 0,
    num_banheiros: 0,
    mobiliado: false,
    status: false,
  });

  // Uma função única simplificada para lidar com todos os campos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Para checkboxes
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setImovel({
        ...imovel,
        [name]: checkbox.checked,
      });
    }
    // Para campos numéricos
    else if (name === "num_quartos" || name === "num_banheiros") {
      setImovel({
        ...imovel,
        [name]: Number(value) || 0,
      });
    }
    // Para todos os outros campos (texto)
    else {
      setImovel({
        ...imovel,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Aqui você implementaria a chamada à API para enviar os dados
      console.log("Dados do imóvel para enviar:", imovel);

      const response = await cadastrarImovel(imovel);
      console.log("Resposta da API:", response);

      alert("Imóvel cadastrado com sucesso!");

      // Resetar formulário após sucesso
      setImovel({
        nome: "",
        endereco: "",
        numero: "",
        descricao: "",
        num_quartos: 0,
        num_banheiros: 0,
        mobiliado: false,
        status: false,
      });

      navigate("/home");
    } catch (error) {
      console.error("Erro ao cadastrar imóvel:", error);
      alert("Erro ao cadastrar imóvel. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="cadastro-imovel-container">
      <h1>Cadastro de Imóvel</h1>

      <form onSubmit={handleSubmit} className="form-cadastro-imovel">
        {/* Campos de texto mantidos como estavam */}
        <div className="form-group">
          <label htmlFor="nome">Nome do Imóvel*</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={imovel.nome}
            onChange={handleChange}
            required
            placeholder="Ex: Apartamento Centro"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="endereco">Endereço*</label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              value={imovel.endereco}
              onChange={handleChange}
              required
              placeholder="Ex: Rua Aparecido Francisco Natal da Silva"
            />
          </div>

          <div className="form-group small">
            <label htmlFor="numero">Número*</label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={imovel.numero}
              onChange={handleChange}
              required
              placeholder="Ex: 175"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={imovel.descricao}
            onChange={handleChange}
            placeholder="Descreva detalhes sobre o imóvel"
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="num_quartos">Número de Quartos*</label>
            <input
              type="number"
              id="num_quartos"
              name="num_quartos"
              min="0"
              value={imovel.num_quartos}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="num_banheiros">Número de Banheiros*</label>
            <input
              type="number"
              id="num_banheiros"
              name="num_banheiros"
              min="0"
              value={imovel.num_banheiros}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Checkboxes corrigidos */}
        <div className="form-row checkbox-row">
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="mobiliado"
              name="mobiliado"
              checked={imovel.mobiliado}
              onChange={handleChange}
            />
            <label htmlFor="mobiliado">Mobiliado</label>
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="status"
              name="status"
              checked={imovel.status}
              onChange={handleChange}
            />
            <label htmlFor="status">Disponível para aluguel</label>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="btn-cadastrar">
            Cadastrar Imóvel
          </button>
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => window.history.back()}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastroImovel;
