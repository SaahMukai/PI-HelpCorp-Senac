# HelpCorp - PoC frontend

PoC responsiva da HelpCorp, plataforma de gestão de chamados internos corporativos desenvolvida no Projeto Integrador do SENAC.

## Requisitos

- Node.js 18+
- npm 9+

## Executar localmente

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Vite. A aplicação inicia com o perfil demo de solicitante. Use o seletor no canto superior direito para alternar para o perfil de atendente.

## Scripts

- `npm run dev`: inicia o servidor de desenvolvimento.
- `npm run build`: executa a verificação TypeScript e gera a build de produção.
- `npm run test`: executa os testes da camada de dados mockada.
- `npm run preview`: serve a build de produção localmente.

## Rotas da PoC

- `/chamados`: lista e filtra os chamados do solicitante.
- `/chamados/novo`: abre um novo chamado.
- `/chamados/:id`: exibe status, SLA e histórico.
- `/atendimento`: exibe a fila operacional do atendente.
- `/atendimento/chamados/:id`: permite atualizar status e adicionar comentários.

## Configuração da API

Por padrão, a aplicação usa `localStorage` como mock persistente para permitir o fluxo completo sem backend.

Copie `.env.example` para `.env.local` e altere as variáveis quando a API estiver disponível:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_USE_MOCK=false
```

### Contrato REST esperado

| Método | Endpoint | Uso |
| --- | --- | --- |
| `GET` | `/api/tickets` | Lista chamados. Aceita `scope`, `status`, `priority`, `categoryId` e `search`. |
| `GET` | `/api/tickets/:id` | Retorna um chamado completo. |
| `POST` | `/api/tickets` | Cria um chamado. |
| `PATCH` | `/api/tickets/:id` | Atualiza `status`, `priority` ou `assigneeId`. |
| `GET` | `/api/categories` | Lista categorias disponíveis. |
| `POST` | `/api/tickets/:id/comments` | Adiciona uma interação ao histórico. |

As respostas devem seguir os tipos em `src/types.ts`, incluindo `timeline`, `attachments`, `requester`, `assignee`, `category`, `slaDueAt` e os identificadores do chamado.

Para o passo a passo de criação do backend, consulte [API.md](API.md).

## Escopo

Esta primeira PoC não implementa login, SSO, 2FA, IA, notificações push ou armazenamento real de anexos. Esses itens permanecem como evolução prevista no material teórico.
