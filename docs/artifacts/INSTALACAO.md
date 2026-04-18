# Reino OIDC - Instalacao (Windows)

Arquivos desta entrega:
- ReinoOIDC.exe
- checksum.sha256
- checksum.md5
- INSTALACAO.md (este arquivo)

## Validacao de integridade

No PowerShell, na pasta de artefatos:

```powershell
Get-FileHash -Path .\ReinoOIDC.exe -Algorithm SHA256
Get-FileHash -Path .\ReinoOIDC.exe -Algorithm MD5
```

Compare os valores com os arquivos `checksum.sha256` e `checksum.md5`.

## Requisitos

- Windows 10 ou superior (64 bits)
- 250 MB de espaco livre
- Conexao com internet: nao necessaria

## Execucao

1. Execute `ReinoOIDC.exe` em duplo clique.
2. Conclua o assistente de instalacao.
3. Abra o atalho criado no Desktop para iniciar o aplicativo.

## Versao FREE

Esta e a versao FREE (Licenca MIT). A versao premium "O Trono da Identidade" (R$ 29,90) esta disponivel em ../upgrade-trono.html.

## Desinstalacao

Painel de Controle > Programas > Programas e Recursos > desinstalar Reino OIDC.

## Canal oficial

- Pagina de download: ../download.html
- Upgrade: ../upgrade-trono.html
- Suporte / loja: https://oidc.caracore.com.br/

---

> Versao: v1.0.0
> Cara Core Informatica — https://oidc.caracore.com.br/
