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

A HelpCorp é uma plataforma de gestão de chamados internos corporativos criada para centralizar solicitações entre colaboradores e áreas como TI, RH, Financeiro, Administrativo e Facilities. A proposta é substituir canais dispersos, como e-mails e mensagens, por um fluxo único, rastreável e organizado, permitindo abrir, acompanhar, priorizar e atualizar chamados com mais transparência e eficiência.

---

## 🏗️ Arquitetura da solução

A PoC utiliza uma arquitetura web em camadas, separando interface,
processamento da aplicação e persistência dos dados.

```mermaid
flowchart LR

    U["👤 Usuário<br>Solicitante"]
    A["🧑‍💻 Atendente<br>Gestor"]

    WEB["🌐 Navegador Web"]

    FRONT["🖥️ Frontend<br>Interface da HelpCorp"]

    API["⚙️ Backend<br>API REST"]

    DB[("🗄️ Banco de Dados<br>Usuários · Categorias · Chamados")]

    U --> WEB
    A --> WEB
    WEB --> FRONT
    FRONT -->|HTTP / JSON| API
    API -->|Consultas e persistência| DB
    DB --> API
    API --> FRONT
```

### Fluxo principal

```mermaid
sequenceDiagram
    actor Usuario
    participant Frontend
    participant Backend
    participant Banco
    actor Atendente

    Usuario->>Frontend: Abre um chamado
    Frontend->>Backend: POST /chamados
    Backend->>Banco: Salva chamado
    Banco-->>Backend: Chamado registrado
    Backend-->>Frontend: Confirmação

    Atendente->>Frontend: Visualiza chamados
    Frontend->>Backend: GET /chamados
    Backend->>Banco: Consulta chamados
    Banco-->>Backend: Dados
    Backend-->>Frontend: Lista de chamados

    Atendente->>Frontend: Atualiza status
    Frontend->>Backend: PUT /chamados/{id}/status
    Backend->>Banco: Atualiza chamado
```
