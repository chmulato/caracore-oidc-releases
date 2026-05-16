# Artefatos na loja (git)

Esta pasta **não** versiona `.exe`. Binários Windows vão apenas para [GitHub Releases](https://github.com/chmulato/caracore-oidc-releases/releases).

| Arquivo | No git | Onde obter |
|---------|--------|------------|
| `ReinoOIDC-v2.exe` | Não | Release `v2.0.0-RC1` no GitHub |
| `checksum.sha256`, `checksum.md5` | Sim | Aqui + mesma release no GitHub |
| `INSTALACAO.md`, `VERSION`, `CHANNEL` | Sim | Aqui |

Publicação: `python scripts/publish_store_from_dist.py --channel v2` no repo **caracore-oidc** (copia checksums; não copia exe).
