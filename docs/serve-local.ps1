# Servidor local para testar a loja (evita erros de file:// no navegador).
$port = 8765
Set-Location $PSScriptRoot
Write-Host "Reino OIDC — loja local em http://127.0.0.1:$port/index.html"
Write-Host "Pare com Ctrl+C."
python -m http.server $port
