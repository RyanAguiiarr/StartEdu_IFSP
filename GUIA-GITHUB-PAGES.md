# 📚 Guia Completo: Como Publicar o StartEdu no GitHub Pages

## 🎯 O que é GitHub Pages?

GitHub Pages é um serviço **gratuito** do GitHub que permite hospedar sites estáticos diretamente do seu repositório. É perfeito para projetos como o StartEdu (frontend React) e permite que outras pessoas acessem seu projeto online!

**Vantagens:**

- ✅ **Totalmente gratuito**
- ✅ **Fácil de configurar**
- ✅ **Atualização automática** quando você faz mudanças
- ✅ **Domínio próprio** (seu-usuario.github.io/nome-projeto)

---

## 🛠️ Passo 1: Preparar o Projeto para o Deploy

### 1.1 - Configurar o Vite para GitHub Pages

Primeiro, vamos configurar o Vite para funcionar corretamente no GitHub Pages:

**Abra o arquivo `vite.config.ts` e adicione a configuração `base`:**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/startedu-frontend/", // 👈 ADICIONE ESTA LINHA
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase",
      scopeBehaviour: "local",
    },
  },
  server: {
    host: true,
    allowedHosts: true,
    port: 3000,
  },
});
```

> ⚠️ **Importante:** Substitua `startedu-frontend` pelo nome exato que você dará ao seu repositório no GitHub!

### 1.2 - Adicionar Scripts de Deploy

**Abra o arquivo `package.json` e adicione estes scripts:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist",
    "predeploy": "npm run build"
  }
}
```

### 1.3 - Instalar o gh-pages

Abra o terminal no VS Code (`Ctrl + '`) e execute:

```bash
npm install --save-dev gh-pages
```

---

## 🌐 Passo 2: Configurar o GitHub

### 2.1 - Criar Conta no GitHub (se não tiver)

1. Acesse [github.com](https://github.com)
2. Clique em **"Sign up"**
3. Crie sua conta com email e senha
4. Confirme seu email

### 2.2 - Instalar Git (se não tiver)

1. Baixe o Git em [git-scm.com](https://git-scm.com)
2. Instale com as configurações padrão
3. Abra o terminal e configure:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seuemail@exemplo.com"
```

### 2.3 - Criar Repositório no GitHub

1. **Entre no GitHub** e clique no botão **"+"** no canto superior direito
2. Clique em **"New repository"**
3. **Nome:** `startedu-frontend` (ou o nome que preferir)
4. **Descrição:** "Sistema de acomodações estudantis - Frontend React"
5. Marque **"Public"** (para usar GitHub Pages gratuito)
6. **NÃO** marque "Add a README file" (já temos um)
7. Clique em **"Create repository"**

---

## 📤 Passo 3: Enviar o Código para o GitHub

### 3.1 - Inicializar Git no Projeto

No terminal do VS Code, navegue até a pasta do frontend:

```bash
cd "c:\Users\ryanz\OneDrive\Documentos\ESTUDOS\Projetos\StartEdu_IFSP\startedu-frontend"
```

Inicialize o Git:

```bash
git init
git add .
git commit -m "Primeiro commit: projeto StartEdu frontend"
```

### 3.2 - Conectar com o GitHub

Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub:

```bash
git remote add origin https://github.com/SEU-USUARIO/startedu-frontend.git
git branch -M main
git push -u origin main
```

> 📝 **Dica:** O GitHub pode pedir seu usuário e senha. Use um **Personal Access Token** se solicitado.

---

## 🚀 Passo 4: Ativar o GitHub Pages

### 4.1 - Fazer o Deploy Inicial

No terminal, execute:

```bash
npm run deploy
```

Este comando irá:

1. Compilar seu projeto React
2. Criar a pasta `dist` com os arquivos otimizados
3. Fazer upload para uma branch especial `gh-pages`

### 4.2 - Configurar GitHub Pages

1. **Vá ao seu repositório** no GitHub
2. Clique na aba **"Settings"**
3. Role para baixo até **"Pages"** no menu lateral
4. Em **"Source"**, selecione **"Deploy from a branch"**
5. Escolha a branch **"gh-pages"**
6. Pasta: **"/ (root)"**
7. Clique em **"Save"**

### 4.3 - Acessar seu Site

Aguarde alguns minutos e seu site estará disponível em:

```
https://SEU-USUARIO.github.io/startedu-frontend/
```

---

## 🔄 Passo 5: Atualizações Futuras

### Como Atualizar o Site

Sempre que fizer mudanças no código:

1. **Salve as alterações**
2. **Faça commit no Git:**
   ```bash
   git add .
   git commit -m "Descrição da mudança"
   git push
   ```
3. **Faça o deploy:**
   ```bash
   npm run deploy
   ```

### Automatização com GitHub Actions (Opcional)

Para deploy automático a cada commit, crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 🛠️ Possíveis Problemas e Soluções

### ❌ Erro: "Page Not Found"

**Solução:** Verifique se o `base` no `vite.config.ts` está correto.

### ❌ Erro: "White Page"

**Solução:** Abra o Console do navegador (F12) e verifique se há erros de recursos não encontrados.

### ❌ Erro: "Permission denied"

**Solução:** Configure um Personal Access Token no GitHub.

### ❌ Assets não carregam

**Solução:** Certifique-se que todas as imagens e arquivos estão na pasta `public/` ou importados corretamente.

---

## 🔗 Integrando com Backend

Como seu frontend se conecta com APIs (backend Spring Boot e IA FastAPI), você precisará:

### Para Desenvolvimento Local:

- Manter as URLs das APIs como `http://localhost:8080` e `http://localhost:8000`

### Para Produção:

- Configurar variáveis de ambiente ou
- Fazer deploy do backend em serviços como Railway, Heroku, ou Render
- Atualizar as URLs da API no código

**Exemplo de configuração por ambiente:**

```typescript
// src/config/api.ts
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://sua-api-producao.com"
    : "http://localhost:8080";

export { API_BASE_URL };
```

---

## 📱 Resultado Final

Após seguir todos os passos, você terá:

✅ **Site funcionando** em `https://seu-usuario.github.io/startedu-frontend/`
✅ **Deploy automático** sempre que fizer mudanças
✅ **Portfólio online** para mostrar seu projeto
✅ **Experiência real** com deploy de aplicações

---

## 📞 Precisa de Ajuda?

Se encontrar algum problema durante o processo:

1. **Verifique os logs** no terminal para mensagens de erro
2. **Consulte o Console** do navegador (F12) para erros
3. **Verifique as configurações** do GitHub Pages
4. **Teste localmente** com `npm run preview` antes do deploy

**Documentações úteis:**

- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [gh-pages package](https://www.npmjs.com/package/gh-pages)

---

**🎉 Parabéns! Seu projeto StartEdu estará online e acessível para todo mundo!**
