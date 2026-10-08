# Instalação Rápida — Reino OIDC v2 (v2.0.1-free)

## 1. Download (GitHub — oficial)
- **Release:** https://github.com/chmulato/caracore-oidc-releases/releases/tag/v2.0.1-free
- **Executável:** https://github.com/chmulato/caracore-oidc-releases/releases/download/v2.0.1-free/ReinoOIDC-v2.exe
- **Checksum SHA-256:** https://github.com/chmulato/caracore-oidc-releases/releases/download/v2.0.1-free/checksum.sha256
- **Todas as releases:** https://github.com/chmulato/caracore-oidc-releases/releases

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
- Edição Free: história, academia, glossário, mapas e os baralhos gratuitos do Super Trunfo
- As três Eras para estudo pessoal, sem chave de ativação
- O módulo pago não faz parte desta versão
- Build autocontido (sem dependência de CDN em runtime)

**Versão:** 2.0.1-free (v2.0.1-free) · **Canal:** v2 · Cara Core Informática
