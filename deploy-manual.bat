@echo off
echo 🚀 Fazendo deploy do StartEdu Frontend...

echo 📦 Fazendo build do projeto...
cd startedu-frontend
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Erro no build!
    pause
    exit /b 1
)

echo 📁 Criando pasta temporaria...
cd ..
if exist temp-deploy rmdir /s /q temp-deploy
mkdir temp-deploy
cd temp-deploy

echo 🌐 Clonando branch gh-pages...
git clone -b gh-pages https://github.com/RyanAguiiarr/StartEdu_IFSP.git . 2>nul
if %errorlevel% neq 0 (
    echo 📝 Criando branch gh-pages...
    git clone https://github.com/RyanAguiiarr/StartEdu_IFSP.git .
    git checkout --orphan gh-pages
    git rm -rf .
)

echo 🗑️ Limpando arquivos antigos...
for /f "delims=" %%i in ('dir /b /a-d 2^>nul') do del "%%i" 2>nul
for /f "delims=" %%i in ('dir /b /ad 2^>nul ^| findstr /v "^\.git$"') do rmdir /s /q "%%i" 2>nul

echo 📋 Copiando novos arquivos...
xcopy /e /y ..\startedu-frontend\dist\* .

echo 📄 Criando arquivo .nojekyll...
echo. > .nojekyll

echo 💾 Fazendo commit...
git add .
git commit -m "Deploy frontend - %date% %time%"

echo 🚀 Fazendo push...
git push origin gh-pages

echo ✅ Deploy concluído!
echo 🌐 Seu site estará disponível em: https://ryanaguiiarr.github.io/StartEdu_IFSP/

cd ..
rmdir /s /q temp-deploy

echo 🎉 Processo finalizado com sucesso!
pause
