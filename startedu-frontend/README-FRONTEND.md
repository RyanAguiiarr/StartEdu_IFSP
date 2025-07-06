# 🏠 StartEdu Frontend

Sistema de acomodações estudantis desenvolvido com React, TypeScript e Vite.

## 🚀 Acesse o Projeto Online

O projeto está hospedado no GitHub Pages:
**[https://seu-usuario.github.io/startedu-frontend/](https://seu-usuario.github.io/startedu-frontend/)**

## 📋 Funcionalidades

- 🔐 **Autenticação** - Login e cadastro de alunos
- 👤 **Perfil do Aluno** - Visualização e edição de dados pessoais
- 🏠 **Cadastro de Imóveis** - Proprietários podem anunciar acomodações
- 🔍 **Busca de Imóveis** - Filtros por localização, preço e características
- 🤖 **Assistente IA** - Chatbot para suporte aos usuários
- 📱 **Design Responsivo** - Funciona em desktop e mobile

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool rápida
- **Tailwind CSS** - Estilização
- **React Router** - Navegação
- **Axios** - Requisições HTTP
- **Framer Motion** - Animações
- **React Icons** - Ícones

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/startedu-frontend.git
cd startedu-frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o projeto:

```bash
npm run dev
```

4. Acesse: [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy no GitHub Pages

### Deploy Manual

```bash
npm run deploy
```

### Deploy Automático

O projeto está configurado com GitHub Actions para deploy automático a cada commit na branch `main`.

## 🔧 Scripts Disponíveis

```bash
npm run dev       # Executa em modo desenvolvimento
npm run build     # Compila para produção
npm run preview   # Visualiza o build localmente
npm run deploy    # Faz deploy no GitHub Pages
npm run lint      # Verifica problemas no código
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── services/      # Serviços de API
├── styles/        # Estilos globais
├── hooks/         # Hooks customizados
├── assets/        # Imagens e recursos
└── images/        # Imagens do projeto
```

## 🔗 Integração com Backend

Este frontend se conecta com:

- **Backend Spring Boot** - API REST em Java
- **Assistente IA** - FastAPI com LangChain

Para desenvolvimento local, certifique-se de que os serviços backend estejam rodando:

- Backend: `http://localhost:8080`
- IA: `http://localhost:8000`

## 📱 Páginas Disponíveis

- `/` - Página inicial
- `/login` - Login de usuários
- `/cadastro` - Cadastro de novos usuários
- `/aluno` - Perfil do aluno logado
- `/cadastro-imovel` - Cadastro de imóveis
- `/imovel/:id` - Detalhes do imóvel

## 🎨 Design System

O projeto utiliza Tailwind CSS com:

- **Cores principais:** Azul (#3B82F6) e Cinza
- **Tipografia:** Font system padrão
- **Componentes:** Botões, cards, formulários padronizados
- **Responsividade:** Mobile-first approach

## 🐛 Problemas Conhecidos

- [ ] Integração com backend em produção
- [ ] Otimização de imagens
- [ ] Testes unitários

## 📝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Desenvolvedores

- **Ryan** - Desenvolvedor Full Stack
- **IFSP** - Instituição de Ensino

## 📞 Contato

Para dúvidas ou sugestões:

- Email: seu-email@exemplo.com
- GitHub: [@seu-usuario](https://github.com/seu-usuario)

---

**🎓 Projeto desenvolvido como parte dos estudos no IFSP**
