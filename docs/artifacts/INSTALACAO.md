# Instalação Rápida — Reino OIDC v2 (v2.0.1-free)

## 1. Download (GitHub — oficial)
- **Release:** https://github.com/chmulato/caracore-oidc-releases/releases/tag/v2.0.1-free
- **Executável:** https://github.com/chmulato/caracore-oidc-releases/releases/download/v2.0.1-free/ReinoOIDC-v2.exe
- **Checksum SHA-256:** https://github.com/chmulato/caracore-oidc-releases/releases/download/v2.0.1-free/checksum.sha256

Portal: https://oidc.caracore.com.br/download.html

## 2. Verificar integridade (SHA-256)
No PowerShell, na pasta do arquivo:

```powershell
Get-FileHash -Path .\ReinoOIDC-v2.exe -Algorithm SHA256
```

Compare o hash com o valor em **checksum.sha256**.

## 3. Executar
Duplo clique em **ReinoOIDC-v2.exe**. O aplicativo abre em modo local (sem login) com o material educacional OAuth 2.1 e OpenID Connect. O Windows pode mostrar o editor como desconhecido: esta edição Free não traz certificado digital. Confira o arquivo pelo SHA-256 antes de abrir.

## 4. Conteúdo desta versão
- Edição Free 2.0.1: história, academia, glossário, mapas e dois baralhos gratuitos do Super Trunfo (9 + 5 cartas)
- As três Eras para estudo pessoal
- A edição paga está em desenvolvimento e não faz parte desta versão
- Requisitos: Windows 10/11 64 bits com Microsoft Edge WebView2 Runtime
- Build autocontido (sem dependência de CDN em runtime)

**Edição Free, versão 2.0.1** · tag v2.0.1-free · **Canal:** v2 · Cara Core Informática · arquivo ReinoOIDC-v2.exe · 18.157.874 bytes
