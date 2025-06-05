// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function tratandoImagensDeImovel(response: any) {
  console.log("Resposta da API:", response);
  console.log("Status da resposta:", response.status);
  console.log("Dados recebidos:", response.data);
  console.log("Tipo de response.data:", typeof response.data);
  console.log("É array?", Array.isArray(response.data));
  // Converte para array se for um objeto único
  const imoveisData = Array.isArray(response.data)
    ? response.data
    : [response.data];

  console.log(`Processando ${imoveisData.length} imóveis`);

  // Adaptando os dados da API para o formato atual do seu componente
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imoveisFormatados = imoveisData.map((imovel: any) => {
    // Primeiro definimos uma imagem padrão
    let imageUrl = "https://via.placeholder.com/300x200?text=Imóvel";

    // Verificamos o formato da propriedade imagens
    console.log("Formato das imagens:", imovel.imagens);

    if (imovel.imagens) {
      // Se imagens for um array de strings (novo formato)
      if (
        Array.isArray(imovel.imagens) &&
        typeof imovel.imagens[0] === "string"
      ) {
        // Extrair o nome do arquivo do caminho completo
        const caminhoCompleto = imovel.imagens[0];
        const filename = caminhoCompleto.split("\\").pop(); // Separa pelo caractere de barra invertida
        if (filename) {
          imageUrl = `http://localhost:8080/imovel/images/${filename}`;
          console.log(`URL da imagem formatada: ${imageUrl}`);
        }
      }
    }
    return {
      id: imovel.id,
      image: imovel.url || imageUrl,
      title: imovel.nome || "Imóvel sem título",
      localizacao:
        imovel.endereco && imovel.numero
          ? `${imovel.endereco}, ${imovel.numero}`
          : "Endereço não informado",
      preco: imovel.preco
        ? `R$ ${imovel.preco}`
        : `R$ ${Math.floor(Math.random() * 500 + 100)}`,
      rating: (Math.random() * (5 - 4) + 4).toFixed(2),
      nome: imovel.nome,
      endereco: imovel.endereco,
      numero: imovel.numero,
      descricao: imovel.descricao,
      num_quartos: imovel.num_quartos,
      num_banheiros: imovel.num_banheiros,
      mobiliado: imovel.mobiliado,
      status: imovel.status,
    };
  });
  return imoveisFormatados;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function tratandoImoveisFicticios(mockListings: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockListings.map((item: any) => {
    // Verificando se location existe antes de fazer o split
    const endereco = item.location
      ? item.location.split(",")[0] || "Endereço não informado"
      : "Endereço não informado";
    const numero =
      item.location && item.location.includes(",")
        ? item.location.split(",")[1]?.trim() || ""
        : "";

    return {
      ...item,
      nome: item.title || "Imóvel sem título",
      endereco: endereco,
      numero: numero,
      descricao: "",
    };
  });

  return mockListings;
}

export { tratandoImagensDeImovel, tratandoImoveisFicticios };
