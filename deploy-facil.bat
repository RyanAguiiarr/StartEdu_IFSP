@echo off
chcp 65001 >nul
title StartEdu - Deploy Fácil

color 0A
echo.
echo ═══════════════════════════════════════════════════════════
echo              🚀 STARTEDU - DEPLOY AUTOMÁTICO 🚀
echo ═══════════════════════════════════════════════════════════
echo.
echo Este script vai configurar tudo automaticamente para você!
echo.
echo 📋 O que será feito:
echo    ✅ Verificar se você tem as ferramentas necessárias
echo    ✅ Instalar o que estiver faltando
echo    ✅ Configurar sua aplicação
echo    ✅ Deixar tudo funcionando
echo.
echo ⏱️  Tempo estimado: 5-10 minutos
echo.
set /p continuar="Pressione Enter para começar ou 'n' para sair: "

if /i "%continuar%"=="n" exit

echo.
echo 🔍 Verificando ferramentas necessárias...
echo.

REM Verificar Node.js
echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo 📥 Baixando Node.js...
    echo Abra: https://nodejs.org/pt-br/download/
    echo Instale e execute este script novamente.
    pause
    exit
) else (
    echo ✅ Node.js encontrado!
)

REM Verificar Java
echo Verificando Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java não encontrado!
    echo 📥 Baixando Java...
    echo Abra: https://www.oracle.com/java/technologies/downloads/
    echo Instale e execute este script novamente.
    pause
    exit
) else (
    echo ✅ Java encontrado!
)

REM Verificar Python
echo Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado!
    echo 📥 Baixando Python...
    start https://www.python.org/downloads/
    echo Instale e execute este script novamente.
    pause
    exit
) else (
    echo ✅ Python encontrado!
)

echo.
echo 🎉 Todas as ferramentas estão instaladas!
echo.
echo 🚀 Iniciando sua aplicação...
echo.

REM Iniciar Backend
echo 📦 Iniciando Backend (Spring Boot)...
start "Backend StartEdu" cmd /k "cd StartEdu && mvn spring-boot:run"
timeout /t 3

REM Iniciar IA
echo 🤖 Iniciando API de IA...
start "IA StartEdu" cmd /k "cd ia-assistente && python main.py"
timeout /t 3

REM Iniciar Frontend
echo 🎨 Iniciando Frontend (React)...
cd startedu-frontend
start "Frontend StartEdu" cmd /k "npm install && npm run dev"

echo.
echo ✅ Aplicação iniciada com sucesso!
echo.
echo 🌐 Suas URLs:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8080
echo    IA API:   http://localhost:8000
echo.
echo 💡 Dica: Aguarde alguns segundos para tudo carregar!
echo.

REM Perguntar sobre acesso externo
echo 🌍 Deseja acesso externo à sua aplicação?
set /p external="Digite 's' para sim ou Enter para não: "

if /i "%external%"=="s" (
    echo.
    echo 📱 Para acesso externo, você precisa do Ngrok:
    echo.
    echo 1. Acesse: https://ngrok.com/
    echo 2. Crie uma conta gratuita
    echo 3. Baixe e instale o Ngrok
    echo 4. Execute: ngrok http 3000
    echo.
    echo Isso criará uma URL pública para sua aplicação!
)

echo.
echo 🎯 Pronto! Sua aplicação está rodando!
echo.
echo 🔧 Para parar tudo, feche as janelas que abriram.
echo.
pause
