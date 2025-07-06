# Script de Deploy para GitHub Pages
Write-Host "🚀 Iniciando deploy do StartEdu Frontend..." -ForegroundColor Green

# Fazer build
Write-Host "📦 Fazendo build do projeto..." -ForegroundColor Yellow
Set-Location "startedu-frontend"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build!" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Voltar para pasta raiz
Set-Location ".."

# Criar pasta temporária
Write-Host "📁 Preparando deploy..." -ForegroundColor Yellow
if (Test-Path "temp-deploy") {
    Remove-Item -Recurse -Force "temp-deploy"
}
New-Item -ItemType Directory -Name "temp-deploy"
Set-Location "temp-deploy"

# Tentar clonar branch gh-pages, se não existir, criar
Write-Host "🌐 Configurando branch gh-pages..." -ForegroundColor Yellow
try {
    git clone -b gh-pages https://github.com/RyanAguiiarr/StartEdu_IFSP.git . 2>$null
    if ($LASTEXITCODE -ne 0) { throw }
} catch {
    Write-Host "📝 Criando nova branch gh-pages..." -ForegroundColor Cyan
    git clone https://github.com/RyanAguiiarr/StartEdu_IFSP.git .
    git checkout --orphan gh-pages
    git rm -rf .
}

# Limpar arquivos antigos (exceto .git)
Write-Host "🗑️ Limpando arquivos antigos..." -ForegroundColor Yellow
Get-ChildItem -Path . -Exclude ".git" | Remove-Item -Recurse -Force

# Copiar novos arquivos
Write-Host "📋 Copiando arquivos do build..." -ForegroundColor Yellow
Copy-Item -Path "..\startedu-frontend\dist\*" -Destination "." -Recurse

# Criar .nojekyll
Write-Host "📄 Criando .nojekyll..." -ForegroundColor Yellow
New-Item -ItemType File -Name ".nojekyll" -Force

# Commit e push
Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
git add .
git commit -m "Deploy frontend - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

Write-Host "🚀 Fazendo push..." -ForegroundColor Yellow
git push origin gh-pages

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host "🌐 Seu site estará disponível em: https://ryanaguiiarr.github.io/StartEdu_IFSP/" -ForegroundColor Cyan
} else {
    Write-Host "❌ Erro no push!" -ForegroundColor Red
}

# Limpar
Set-Location ".."
Remove-Item -Recurse -Force "temp-deploy"

Write-Host "🎉 Processo finalizado!" -ForegroundColor Green
Read-Host "Pressione Enter para sair"
