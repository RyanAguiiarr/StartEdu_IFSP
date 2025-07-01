# 🚀 GUIA SUPER SIMPLES - Deploy StartEdu

## 📋 Jeito Mais Fácil (Recomendado!)

### 1️⃣ **Executar o Script Automático**

- Vá na pasta do projeto
- **Clique duas vezes** no arquivo `deploy-facil.bat`
- Siga as instruções na tela

### 2️⃣ **O que o script faz:**

- ✅ Verifica se você tem Node.js, Java e Python
- ✅ Te ajuda a instalar o que estiver faltando
- ✅ Inicia automaticamente:
  - Backend (Spring Boot)
  - Frontend (React)
  - API de IA (Python)

### 3️⃣ **Resultado:**

Sua aplicação ficará disponível em:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **IA**: http://localhost:8000

---

## 🔧 Se quiser fazer manualmente:

### **Opção A: Localmente (Mais Simples)**

#### 1. Abrir 3 terminais (CMD ou PowerShell):

**Terminal 1 - Backend:**

```bash
cd StartEdu
mvn spring-boot:run
```

**Terminal 2 - IA:**

```bash
cd ia-assistente
python main.py
```

**Terminal 3 - Frontend:**

```bash
cd startedu-frontend
npm install
npm run dev
```

### **Opção B: Com Docker (Mais Profissional)**

#### 1. Instalar Docker Desktop:

- Baixar: https://www.docker.com/products/docker-desktop
- Instalar e reiniciar o PC

#### 2. Executar:

```bash
# Clicar duas vezes em:
deploy-docker-easy.bat
```

---

## 🌍 Para Acesso Externo (Opcional)

### **Usar Ngrok (Gratuito):**

1. **Instalar Ngrok:**

   - Ir em: https://ngrok.com/
   - Criar conta gratuita
   - Baixar e instalar

2. **Usar:**

   ```bash
   ngrok http 5173
   ```

3. **Resultado:**
   - Você ganha uma URL pública tipo: https://abc123.ngrok.io
   - Qualquer pessoa pode acessar sua aplicação!

---

## 🆘 Problemas Comuns

### ❌ "Node.js não encontrado"

- Baixar: https://nodejs.org/pt-br/download/
- Instalar e tentar novamente

### ❌ "Java não encontrado"

- Baixar: https://www.oracle.com/java/technologies/downloads/
- Instalar e tentar novamente

### ❌ "Python não encontrado"

- Baixar: https://www.python.org/downloads/
- **Importante:** Marcar "Add to PATH" na instalação

### ❌ "Porta já está em uso"

- Fechar outros programas que usam as portas
- Ou reiniciar o PC

---

## 💡 Dicas

- **Primeira execução demora mais** (baixa dependências)
- **Deixe os terminais abertos** enquanto usa a aplicação
- **Para parar:** Feche as janelas ou pressione Ctrl+C
- **Para updates:** Execute o script novamente

---

## 🎯 Resumo Rápido

1. **Clique em `deploy-facil.bat`**
2. **Siga as instruções**
3. **Acesse http://localhost:5173**
4. **Pronto!** 🎉
