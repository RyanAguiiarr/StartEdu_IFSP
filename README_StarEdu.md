
# 🎓 StartEdu - Sistema de Acomodações Estudantis

Plataforma web completa para facilitar o encontro entre estudantes e acomodações próximas de instituições de ensino, com foco em experiência do usuário e inteligência artificial integrada. Projeto desenvolvido no **Instituto Federal de São Paulo (IFSP)**.

---

## 📋 Sobre o Projeto

O **StartEdu** surgiu como uma solução acadêmica voltada para estudantes universitários que buscam acomodações acessíveis e seguras. O sistema conta com:

- Interface moderna e responsiva
- Assistente de IA para recomendações inteligentes
- Painéis dedicados para estudantes, proprietários e administradores
- Upload seguro de imagens e autenticação via JWT

---

## ✨ Funcionalidades

### 👨‍🎓 Para Estudantes
- 🏠 **Busca de Imóveis:** Filtros por localização, preço e características
- 📋 **Perfil Personalizado:** Preferências e dados atualizados
- ❤️ **Sistema de Interesse:** Envio rápido de solicitações
- 🔒 **Login Seguro:** JWT + validação robusta
- 🤖 **Assistente IA:** Recomendações e dúvidas em tempo real

### 🏘️ Para Proprietários
- 📝 **Cadastro de Imóveis:** Descrição completa + upload de fotos
- 📊 **Gestão de Interesses:** Visualização dos interessados
- 🖼️ **Upload de Imagens:** Sistema validado e seguro

### ⚙️ Sistema Administrativo
- 👥 **Gestão de Usuários:** Administração de contas
- 🏢 **Gerenciamento de Imóveis:** Aprovação e moderação
- 📈 **Relatórios:** Estatísticas de uso da plataforma

---

## 🛠️ Stack Tecnológica

### 🔧 Backend
- Java 21 + Spring Boot 3.4.4
- Spring Security + JWT
- Spring Data JPA
- MySQL
- Bean Validation
- Swagger (Springdoc OpenAPI)

### 💻 Frontend
- React 19 + TypeScript
- Vite + React Router DOM
- Axios, Framer Motion, CSS Modules
- Radix UI + React Icons

### 🤖 Assistente IA
- FastAPI (Python 3.12)
- LangChain + OpenAI API
- MySQL Connector
- Python-dotenv

---

## 🚀 Como Executar o Projeto

### ✅ Pré-requisitos
- Node.js 18+
- Java 21
- Maven 3.6+
- MySQL 8.0+
- Python 3.12+

---

### 📦 Passo a Passo

#### 1. Banco de Dados
```sql
CREATE DATABASE startedu;
```
> Configure as credenciais no `application.properties`

#### 2. Backend (Spring Boot)
```bash
cd StartEdu
mvn clean install
mvn spring-boot:run
# http://localhost:8080
```

#### 3. Frontend (React)
```bash
cd startedu-frontend
npm install
npm run dev
# http://localhost:5173
```

#### 4. IA Assistant (Python)
```bash
cd ia-assistente
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
# http://localhost:8001
```

---

## 📁 Estrutura de Pastas

```bash
StartEdu_IFSP/
├── StartEdu/                # Backend (Spring Boot)
│   ├── controller/
│   ├── service/
│   ├── model/
│   ├── repository/
│   ├── dto/
│   └── config/
├── startedu-frontend/       # Frontend (React)
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── hooks/
├── ia-assistente/           # Assistente de IA
│   ├── main.py
│   ├── langchain_agent.py
│   ├── database.py
│   └── requirements.txt
└── uploads/                 # Imagens de imóveis
```

---

## 📚 Documentação da API

Acesse via Swagger:

- Desenvolvimento: [`http://localhost:8080/swagger-ui.html`](http://localhost:8080/swagger-ui.html)

### 🔑 Endpoints Principais

#### Autenticação
```http
POST /auth/login         # Login
POST /auth/register      # Registro
PUT  /auth               # Atualizar dados
```

#### Imóveis
```http
GET    /imovel                     # Listar todos
POST   /imovel                     # Criar novo
GET    /imovel/imoveis/{id}       # Buscar por ID
GET    /imovel/{nome}             # Buscar por nome
GET    /imovel/images/{filename}  # Imagem
```

#### Alunos
```http
GET  /aluno?email={email}  # Buscar aluno
POST /aluno                # Criar aluno
PUT  /aluno                # Atualizar
```

#### Interesses
```http
POST /interesse  # Manifestar interesse
GET  /interesse  # Listar todos
```

---

## 🎨 Interface e UX

- 💻 **Design Responsivo:** Desktop, tablet e mobile
- 🎨 **Tema Moderno:** Gradientes roxos e animações
- 🧠 **Acessibilidade:** Radix UI e navegação por teclado
- 🌀 **Feedback Visual:** Estados de loading e mensagens amigáveis

---

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Bean Validation + validação no frontend
- ✅ CORS configurado corretamente
- ✅ Hash de senhas com BCrypt
- ✅ Upload com validação de tipo e tamanho

---

## 🤝 Contribuindo

1. Faça um Fork 🚀  
2. Crie sua branch: `git checkout -b feature/MinhaFeature`  
3. Commit suas alterações: `git commit -m 'Add MinhaFeature'`  
4. Push na sua branch: `git push origin feature/MinhaFeature`  
5. Crie um Pull Request ✨

---

## 📄 Licença

Distribuído sob a Licença MIT. Veja `LICENSE` para mais detalhes.

---

## 👥 Equipe

| Nome  | Função |
|-------|--------|
| Ryan Cantareli de Aguiar | Desenvolvedor Full Stack |

📍 Projeto acadêmico desenvolvido no **IFSP - Instituto Federal de São Paulo**

---

## 📞 Contato

📬 Email: ryan.c.aguiiarr@gmail.com  
🔗 LinkedIn: [linkedin.com/in/ryanaguiar2006](https://www.linkedin.com/in/ryanaguiar2006)

---

> ⭐ **Se gostou do projeto, deixe uma estrela no repositório!**  
> 💬 *Feedbacks e sugestões são sempre bem-vindos!*
