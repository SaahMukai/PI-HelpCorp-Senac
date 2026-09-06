<div align="center">

# 🎧 HelpCorp

### Plataforma de Gestão de Chamados Internos Corporativos

**Projeto Integrador — Análise de Soluções Integradas para Organizações**  
Centro Universitário SENAC · 5º semestre · 2026

<br>

<img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-1f6feb?style=for-the-badge">
<img src="https://img.shields.io/badge/Projeto-PoC-0d9488?style=for-the-badge">
<img src="https://img.shields.io/badge/SENAC-Projeto%20Integrador-d97706?style=for-the-badge">
<img src="https://img.shields.io/badge/GitHub-Colaborativo-181717?style=for-the-badge&logo=github">

<br><br>

**Centralizando solicitações. Simplificando o suporte. Melhorando a experiência interna.**

</div>

---

## 📌 Sobre a HelpCorp

A **HelpCorp** é uma plataforma de gestão de chamados internos corporativos criada para centralizar solicitações entre colaboradores e áreas como **TI, RH, Financeiro, Administrativo e Facilities**.

A solução substitui canais dispersos, como e-mails e mensagens, por um fluxo único, rastreável e organizado, permitindo **abrir, acompanhar, priorizar e atualizar chamados** com mais transparência e eficiência.

### O que a solução busca resolver

- Centralizar solicitações internas em um único canal;
- Garantir rastreabilidade dos atendimentos;
- Facilitar o acompanhamento de status e prioridades;
- Apoiar equipes de atendimento na organização das demandas;
- Melhorar a experiência dos colaboradores.

---

## 🏗️ Arquitetura da Solução

A PoC da HelpCorp utiliza uma arquitetura web em camadas, separando a interface, as regras da aplicação e a persistência dos dados.

```mermaid
flowchart LR
    U["👤 Usuário Solicitante"]
    A["🧑‍💻 Atendente / Gestor"]

    F["🖥️ Frontend Web"]
    B["⚙️ Backend / API REST"]
    DB[("🗄️ Banco de Dados")]

    U --> F
    A --> F

    F -->|"HTTP / JSON"| B
    B -->|"Consultas e persistência"| DB
    DB --> B
    B --> F
```
