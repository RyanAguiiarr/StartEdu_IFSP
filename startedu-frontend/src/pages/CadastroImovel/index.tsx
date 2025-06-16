/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./CadastroImovel_style.css";
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

  // Estado para armazenar as imagens selecionadas
  const [imagens, setImagens] = useState<File[]>([]);
  // Estado para mostrar preview das imagens
  const [imagensPreview, setImagensPreview] = useState<string[]>([]);
  // Estado para mostrar mensagens
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

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
      // Converte para número e limita o valor máximo para 127 (valor máximo para TINYINT)
      const numValue = Number(value) || 0;
      const limitedValue = Math.min(numValue, 127);

      setImovel({
        ...imovel,
        [name]: limitedValue,
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

  // Função para lidar com o upload de imagens
  const handleImagemChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const novasImagens = Array.from(e.target.files);
    setImagens([...imagens, ...novasImagens]);

    // Criar previews das imagens
    const novosPreviews = novasImagens.map((file) => URL.createObjectURL(file));
    setImagensPreview([...imagensPreview, ...novosPreviews]);
  };

  // Função para remover uma imagem
  const removerImagem = (index: number) => {
    const novasImagens = [...imagens];
    const novosPreviews = [...imagensPreview];

    // Liberar a URL do objeto para evitar vazamento de memória
    URL.revokeObjectURL(novosPreviews[index]);

    novasImagens.splice(index, 1);
    novosPreviews.splice(index, 1);

    setImagens(novasImagens);
    setImagensPreview(novosPreviews);
  };

  // Modificar o handleSubmit para ajustar o formato dos dados
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensagem({ tipo: "", texto: "" });

    try {
      // Criar FormData para enviar dados multipart/form-data
      const formData = new FormData();

      // Adicionar campos do imóvel no formato que o backend espera
      formData.append("nome", imovel.nome);
      formData.append("endereco", imovel.endereco);
      formData.append("numero", imovel.numero);
      formData.append("descricao", imovel.descricao || "");
      formData.append("num_quartos", String(imovel.num_quartos));
      formData.append("num_banheiros", String(imovel.num_banheiros));

      // Para boolean, envie como "true" ou "false" em string
      formData.append("mobiliado", imovel.mobiliado ? "true" : "false");
      formData.append("status", imovel.status ? "true" : "false");

      // Adicionar as imagens
      imagens.forEach((imagem) => {
        formData.append("imagens", imagem);
      });

      console.log("Enviando dados para cadastro de imóvel");

      // Log detalhado dos dados enviados (para depuração)
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await cadastrarImovel(formData);
      console.log("Resposta da API:", response);

      setMensagem({
        tipo: "sucesso",
        texto: "Imóvel cadastrado com sucesso!",
      });

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
      setImagens([]);
      setImagensPreview([]);

      // Redirecionar após um breve delay
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("Erro ao cadastrar imóvel:", error);

      // Exiba mensagem de erro mais detalhada se disponível
      let mensagemErro =
        "Erro ao cadastrar imóvel. Verifique os dados e tente novamente.";

      // Se for um erro do Axios e tivermos a mensagem de erro do backend
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as any;
        if (axiosError.response?.data?.message) {
          mensagemErro = axiosError.response.data.message;
        } else if (
          typeof axiosError.response?.data === "string" &&
          axiosError.response.data
        ) {
          mensagemErro = axiosError.response.data;
        }
      }

      setMensagem({
        tipo: "erro",
        texto: mensagemErro,
      });
    }
  };

  return (
    <div className="fundo">
      <div className="cadastro-imovel-container">
        <h1>Cadastro de Imóvel</h1>

        {mensagem.texto && (
          <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>
        )}

        <form onSubmit={handleSubmit} className="form-cadastro-imovel">
          {/* Campos existentes */}
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

          {/* Campos numéricos com valores máximos */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="num_quartos">Número de Quartos*</label>
              <input
                type="number"
                id="num_quartos"
                name="num_quartos"
                min="0"
                max="127"
                value={imovel.num_quartos}
                onChange={handleChange}
                required
              />
              <small className="form-hint">Máximo: 127</small>
            </div>

            <div className="form-group">
              <label htmlFor="num_banheiros">Número de Banheiros*</label>
              <input
                type="number"
                id="num_banheiros"
                name="num_banheiros"
                min="0"
                max="127"
                value={imovel.num_banheiros}
                onChange={handleChange}
                required
              />
              <small className="form-hint">Máximo: 127</small>
            </div>
          </div>

          {/* Novo campo para upload de imagens */}
          <div className="form-group">
            <label htmlFor="imagens">Imagens do Imóvel</label>
            <div className="imagem-upload-container">
              <label htmlFor="imagens" className="imagem-upload-label">
                <span>Escolher imagens</span>
                <input
                  type="file"
                  id="imagens"
                  name="imagens"
                  accept="image/*"
                  multiple
                  onChange={handleImagemChange}
                  className="imagem-input"
                />
              </label>
              <span className="imagem-info">
                Formatos aceitos: JPG, PNG. Máx: 5MB
              </span>
            </div>

            {/* Preview das imagens */}
            {imagensPreview.length > 0 && (
              <div className="imagens-preview">
                {imagensPreview.map((preview, index) => (
                  <div key={index} className="imagem-preview-container">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="imagem-preview"
                    />
                    <button
                      type="button"
                      onClick={() => removerImagem(index)}
                      className="remover-imagem"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkboxes */}
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
    </div>
  );
}

export default CadastroImovel;
