// Função para validar campos obrigatórios
const validarCampos = (
  aluno: {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    sexo: string;
    dataNascimento: string;
    // adicione outros campos se necessário
  },
  foto: File | null,
  fotoPreview?: string | null
) => {
  const camposObrigatorios = [
    {
      campo: "nome",
      valor: aluno.nome,
      nome: "Nome Completo",
      valido: aluno.nome && aluno.nome.trim().length >= 2,
    },
    {
      campo: "cpf",
      valor: aluno.cpf,
      nome: "CPF",
      valido: aluno.cpf && aluno.cpf.replace(/\D/g, "").length === 11,
    },
    {
      campo: "email",
      valor: aluno.email,
      nome: "E-mail",
      valido: aluno.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(aluno.email),
    },
    {
      campo: "telefone",
      valor: aluno.telefone,
      nome: "Telefone",
      valido: aluno.telefone && aluno.telefone.replace(/\D/g, "").length >= 10,
    },
    {
      campo: "sexo",
      valor: aluno.sexo,
      nome: "Sexo",
      valido: aluno.sexo && ["M", "F", "O", "N"].includes(aluno.sexo),
    },
    {
      campo: "dataNascimento",
      valor: aluno.dataNascimento,
      nome: "Data de Nascimento",
      valido: aluno.dataNascimento && aluno.dataNascimento !== "",
    },
    {
      campo: "foto",
      valor: foto || fotoPreview,
      nome: "Foto de Perfil",
      valido: foto || fotoPreview,
    },
  ];

  return camposObrigatorios;
};

export { validarCampos as validarCamposAluno };
