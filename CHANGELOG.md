# Changelog — Reino OIDC (reino-oidc-releases)

Repositório público de gestão de releases e conteúdo do **Reino OIDC** (Reino da Identidade Federada): material educacional sobre OAuth 2.1 e OpenID Connect, com foco em **jovens altruistas que almejam ser Desenvolvedoras de Software (feminino)** e no mundo da **Segurança** (Google, Microsoft, Big Tech).

- **Formato:** [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).
- **Versionamento:** [Semantic Versioning](https://semver.org/lang/pt-BR/) para releases do portal e do instalador desktop.
- **Categorias:** [Web/Conteúdo] | [App Desktop] | [Legal/DPO] | [DevOps/Automação].

Cada versão inclui uma nota de **Impacto** para o público-alvo e para segurança e identidade federada.

---

## [2.0.0-RC1] — 2026-05-16

### Impacto

| Público | Efeito |
|--------|--------|
| **Estudantes e devs em formação** | Nova linha v2 com imersão local, explorador de ilustrações em página dedicada e pacote desktop `ReinoOIDC-v2.exe`. |
| **Operação / loja** | Download e checksums alinhados ao canal v2; legado `ReinoOIDC.exe` permanece no histórico de tags anteriores. |

### [App Desktop]

#### Adicionado
- **ReinoOIDC-v2.exe** — build autocontido do canal v2 (`apps/v2/site`).
- Checksums SHA-256 e MD5 por release.

### [Web/Conteúdo]

#### Alterado
- Página de download apontando para `ReinoOIDC-v2.exe` e versão **v2.0.0-RC1**.

---

## [1.0.0] — 2025-02-05

### Impacto

| Público | Efeito |
|--------|--------|
| **Jovens altruistas (feminino) que almejam ser Desenvolvedoras de Software** | Acesso ao portal estático do Reino OIDC (história, personagens, Academia, glossário, mapas) e ao instalador Windows (ReinoOIDC.exe) para estudo offline; conteúdo alinhado a Security e identidade federada. |
| **Segurança e identidade federada** | Vitrine e releases no repositório público; integridade via checksums; documentação de workspace e público-alvo ([WORKSPACE.md](WORKSPACE.md), [PUBLICO_ALVO.md](PUBLICO_ALVO.md)). |

### [Web/Conteúdo]

#### Adicionado
- Estrutura inicial do repositório público **[reino-oidc-releases](https://github.com/chmulato/reino-oidc-releases)**, seguindo o modelo do ETE-releases.
- Portal estático do Reino OIDC em `docs/` (história em três partes, personagens, Academia com flashcards, glossário dual, mapas técnicos).
- README com foco em jovens programadoras e segurança digital (OIDC, Google, Microsoft).

### [App Desktop]

#### Adicionado
- Suporte a releases do **ReinoOIDC.exe** via GitHub Releases (script de delivery no workspace privado; token: TOKEN_DELIVERY_REINO_OIDC_TO_REALEASES).

### [DevOps/Automação]

#### Adicionado
- Integração com o portfólio da Cara Core Informática e delivery centralizado em `delivery/oidc`.
- Documentação de delivery (DELIVERY.md no workspace) e script de sincronização para `delivery/oidc` e `docs/`.

### Notas

- O código-fonte e o desenvolvimento do Reino OIDC permanecem no repositório privado (reino_oidc). Este repositório contém apenas o conteúdo público para GitHub Pages e gestão futura de features.
- Para novas features, consulte **PUBLICO_ALVO.md** e o **CHANGELOG.md** do workspace; use os prompts em **prompt_reino_oidc.txt** (workspace) para evolução alinhada ao público.

---

[2.0.0-RC1]: https://github.com/chmulato/caracore-oidc-releases/releases/tag/v2.0.0-RC1
[1.0.0]: https://github.com/chmulato/caracore-oidc-releases/releases/tag/v1.0.0
