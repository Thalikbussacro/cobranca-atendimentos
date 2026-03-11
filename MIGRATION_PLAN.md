# MIGRATION_PLAN.md

## 1. Resumo do projeto atual

### Estrutura encontrada

**Servidor (`src/`, TypeScript, Express):**
- `server.ts` — bootstrap (dotenv + listen)
- `app.ts` — Express app com CORS, JSON, rotas sob `/api`, SPA fallback
- `config/database.ts` — singleton de conexao SQL Server (mssql) com pool, query, execute, transaction
- `controllers/authController.ts` — login comparando usuario/senha com env vars
- `controllers/clienteController.ts` — getAll e getById delegando para ClienteModel
- `controllers/cobrancaController.ts` — getAll, getById, preview, create, sendEmail
- `models/Cliente.ts` — interface + findAll/findById (queries SQL contra Cad_Cliente)
- `models/Atendimento.ts` — interface + findByClienteAndPeriodo/findByCobranca (queries contra Opr_Atendimento)
- `models/Cobranca.ts` — interface + findAll/findById/create/markEmailSent (queries contra Cad_Cobranca + Cad_Cobranca_Item)
- `routes/` — authRoutes, clienteRoutes, cobrancaRoutes, index (agrupador)
- `middleware/errorHandler.ts` — handler generico de erro (6 linhas uteis)
- `services/emailService.ts` — gerar HTML/texto plano da cobranca + enviar via nodemailer

**Cliente (`client/`, TypeScript, React + Vite):**
- 4 paginas: LoginPage, CobrancasPage, NovaCobrancaPage, ConfirmarCobrancaPage
- 10 componentes UI (shadcn/ui): alert, badge, button, card, dialog, input, label, scroll-area, select, table
- 5 componentes de negocio: CobrancaTable, CobrancaDetails, SortableHeader, StatusBadge, Toolbar
- 3 componentes de layout: Header, Brand, AlertBar
- 1 componente shared: LoadingSpinner
- 2 hooks: useAuth (zustand + persist), useCobrancas (fetch + filtros)
- 3 services: api.ts (fetch wrapper), authService.ts, clienteService.ts, cobrancaService.ts
- 1 type file: user.ts

### Rotas da API existentes

| Metodo | Rota                           | Usado no frontend? | Observacao                                    |
|--------|--------------------------------|---------------------|-----------------------------------------------|
| POST   | /api/auth/login                | Sim (LoginPage)     | Valida contra env vars                        |
| GET    | /api/clientes                  | Sim (NovaCobrancaPage) | Lista todos os clientes                    |
| GET    | /api/clientes/:id              | Nao                 | Usado internamente no preview do controller   |
| GET    | /api/cobrancas                 | Sim (CobrancasPage) | Filtros: search, status                       |
| GET    | /api/cobrancas/preview         | Sim (ConfirmarCobrancaPage) | Preview antes de gerar             |
| GET    | /api/cobrancas/:id             | Nao pelo frontend   | Usado internamente pelo sendEmail             |
| POST   | /api/cobrancas                 | Sim (ConfirmarCobrancaPage) | Cria uma cobranca por vez          |
| POST   | /api/cobrancas/:id/enviar-email| Sim (CobrancasPage) | Envia email de uma cobranca                   |

### Redundancias e problemas

1. **controllers/ + routes/ + models/ = 3 camadas para logica simples.** Cada controller tem 1-2 funcoes curtas que apenas delegam para o model. Pode ser consolidado.
2. **models/ so existem por causa do TypeScript.** Sem TS, as interfaces somem e os models viram puras funcoes de query — melhor como `db/queries.js`.
3. **`getClienteById` nao e usado pelo frontend** (so internamente no preview). O preview pode buscar o cliente diretamente na query SQL.
4. **`dialog.tsx` e `scroll-area.tsx` nao sao usados** por nenhum componente. Podem ser removidos.
5. **Diretivas `'use client'`** em SortableHeader.tsx, StatusBadge.tsx, AlertBar.tsx — resquicio do Next.js, sem efeito no Vite.
6. **`dist/` commitado no git** — build artifacts nao deveriam estar versionados.
7. **Botao "Enviar Todos Pendentes"** existe no UI mas so faz `console.log` — nao ha endpoint correspondente.
8. **`handleCancelarCobranca`** na CobrancasPage so faz `console.log` — funcionalidade nao implementada (e nao esta no escopo alvo).
9. **precoHora hardcoded como 100** na ConfirmarCobrancaPage — sem campo para o usuario definir.
10. **Fluxo de geracao em 2 paginas** (NovaCobranca → Confirmar) pode ser simplificado para um unico fluxo na CobrancasPage com FiltrosPeriodo.
11. **Auth com token fake** — `login(data.user, 'token')` passa string literal 'token', nao ha JWT real.

---

## 2. O que sera removido

### Arquivos do servidor

| Arquivo                        | Justificativa                                                    |
|-------------------------------|------------------------------------------------------------------|
| `src/controllers/` (pasta inteira) | Logica sera consolidada direto nas routes                   |
| `src/models/` (pasta inteira)      | Interfaces TS desnecessarias sem TS; queries vao para db/queries.js |
| `src/middleware/errorHandler.ts`   | 6 linhas de codigo — sera inline no server.js               |
| `src/routes/authRoutes.ts`        | Logica de login vai direto no server.js ou numa rota simples  |
| `src/routes/index.ts`            | Agrupador desnecessario com estrutura flat                    |
| `tsconfig.json` (raiz)           | Sem TypeScript                                                |
| `nodemon.json`                    | Sera substituido por script com --watch do Node ou nodemon direto no package.json |
| `dist/` (pasta inteira)          | Build artifacts — nao deve estar no repositorio               |

### Arquivos do cliente

| Arquivo                                    | Justificativa                                               |
|-------------------------------------------|--------------------------------------------------------------|
| `client/src/types/user.ts`                | Interfaces TS — sem TS nao ha necessidade                    |
| `client/src/components/ui/dialog.tsx`     | Nao e usado por nenhum componente                            |
| `client/src/components/ui/scroll-area.tsx`| Nao e usado por nenhum componente                            |
| `client/tsconfig.json`                    | Sem TypeScript                                               |
| `client/tsconfig.app.json`               | Sem TypeScript                                               |
| `client/tsconfig.node.json`              | Sem TypeScript                                               |
| `client/eslint.config.js`               | Config atual e para TS — precisara ser reescrito se mantido, mas pode ser removido para simplificar |
| `client/src/pages/ConfirmarCobrancaPage.tsx` | Fluxo sera integrado na CobrancasPage                  |

### Dependencias do servidor a remover

- `@types/cors`, `@types/express`, `@types/mssql`, `@types/node`, `@types/nodemailer` — tipos TS
- `typescript`, `ts-node` — compilador TS
- `cpx2`, `cpy-cli` — so serviam para copiar build do frontend para dist/

### Dependencias do cliente a remover

- `@types/node`, `@types/react`, `@types/react-dom` — tipos TS
- `typescript`, `typescript-eslint` — compilador e lint TS
- `eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals` — se decidirmos remover eslint para simplificar

### Rotas da API a remover

| Rota                  | Justificativa                                                  |
|----------------------|----------------------------------------------------------------|
| GET /api/clientes/:id | Nao usado pelo frontend; preview pode fazer JOIN direto na query |
| GET /api/cobrancas/:id | Usado apenas internamente — findById continuara existindo como funcao interna, nao como endpoint |

### Funcionalidades a remover do frontend

- Botao "Cancelar Cobranca" (nao implementado, nao esta no escopo)
- Pagina ConfirmarCobrancaPage (fluxo sera simplificado)
- Pagina NovaCobrancaPage (sera substituida por ClientesPage + FiltrosPeriodo na CobrancasPage)

---

## 3. O que sera consolidado

### Servidor

| Atual                                               | Novo                  | Motivo                                        |
|----------------------------------------------------|-----------------------|-----------------------------------------------|
| `controllers/clienteController.ts` + `models/Cliente.ts` + `routes/clienteRoutes.ts` | `server/routes/clientes.js` | Controller tem 2 funcoes triviais, model so tem queries. Tudo cabe numa rota. |
| `controllers/cobrancaController.ts` + `models/Cobranca.ts` + `models/Atendimento.ts` + `routes/cobrancaRoutes.ts` | `server/routes/cobrancas.js` + `server/db/queries.js` | Queries SQL ficam em queries.js, logica de rota fica em cobrancas.js |
| `controllers/authController.ts` + `routes/authRoutes.ts` + `routes/index.ts` | Inline no `server/server.js` | Login e uma unica funcao de 15 linhas |
| `config/database.ts` | `server/db/connection.js` | Mesmo conteudo, sem tipos TS |
| `services/emailService.ts` | `server/email/mailer.js` | Mesmo conteudo, sem tipos TS |
| `middleware/errorHandler.ts` | Inline no `server/server.js` | 6 linhas de codigo |

### Cliente

| Atual                                                | Novo                        | Motivo                                      |
|-----------------------------------------------------|-----------------------------|---------------------------------------------|
| `NovaCobrancaPage.tsx` + `ConfirmarCobrancaPage.tsx` | Fluxo integrado na `CobrancasPage.jsx` via `FiltrosPeriodo.jsx` | 2 paginas para 1 fluxo simples — selecionar periodo, gerar, confirmar |
| Nao existia                                          | `ClientesPage.jsx` + `TabelaClientes.jsx` | Pagina dedicada de clientes (somente leitura) — nova |
| `CobrancaTable.tsx` + `CobrancaDetails.tsx` + `SortableHeader.tsx` + `StatusBadge.tsx` | `TabelaCobrancas.jsx` | 4 componentes para 1 tabela — pode ser um unico componente (ou manter separados dentro de TabelaCobrancas se ficar grande demais) |
| `Toolbar.tsx`                                        | Absorvido pela `CobrancasPage.jsx` ou `FiltrosPeriodo.jsx` | Toolbar atual mistura filtros + acoes — separar em FiltrosPeriodo (filtros de periodo para gerar) e botoes inline na page |
| `hooks/useAuth.ts` + `hooks/useCobrancas.ts`        | Manter como hooks em arquivos separados, convertidos para JS | Sao uteis e encapsulam logica |
| `services/api.ts` + `authService.ts` + `clienteService.ts` + `cobrancaService.ts` | `services/api.js` (unico arquivo) | 4 arquivos para ~70 linhas de codigo total — consolida em 1 |
| `components/ui/*.tsx` (10 arquivos)                  | Manter os usados, remover dialog e scroll-area | Componentes shadcn sao independentes, nao precisa consolidar |

---

## 4. Mapeamento TS → JS

### Servidor

| Arquivo atual (TS)                    | Arquivo novo (JS)              |
|--------------------------------------|--------------------------------|
| `src/server.ts`                      | `server/server.js`            |
| `src/app.ts`                         | Absorvido no `server/server.js` |
| `src/config/database.ts`            | `server/db/connection.js`     |
| `src/models/Cliente.ts`             | `server/db/queries.js` (parte) |
| `src/models/Atendimento.ts`         | `server/db/queries.js` (parte) |
| `src/models/Cobranca.ts`            | `server/db/queries.js` (parte) |
| `src/controllers/authController.ts` | Inline no `server/server.js`  |
| `src/controllers/clienteController.ts` | `server/routes/clientes.js` |
| `src/controllers/cobrancaController.ts` | `server/routes/cobrancas.js` |
| `src/routes/authRoutes.ts`          | Inline no `server/server.js`  |
| `src/routes/clienteRoutes.ts`       | `server/routes/clientes.js`   |
| `src/routes/cobrancaRoutes.ts`      | `server/routes/cobrancas.js`  |
| `src/routes/index.ts`               | Removido                       |
| `src/middleware/errorHandler.ts`     | Inline no `server/server.js`  |
| `src/services/emailService.ts`      | `server/email/mailer.js`      |

### Cliente

| Arquivo atual (TSX/TS)                              | Arquivo novo (JSX/JS)                     |
|-----------------------------------------------------|-------------------------------------------|
| `client/src/main.tsx`                               | `client/src/main.jsx`                     |
| `client/src/App.tsx`                                | `client/src/App.jsx`                      |
| `client/src/pages/LoginPage.tsx`                    | Manter como pagina se auth for mantido    |
| `client/src/pages/CobrancasPage.tsx`                | `client/src/pages/CobrancasPage.jsx`      |
| `client/src/pages/NovaCobrancaPage.tsx`             | Removido (absorvido)                      |
| `client/src/pages/ConfirmarCobrancaPage.tsx`        | Removido (absorvido)                      |
| (novo)                                               | `client/src/pages/ClientesPage.jsx`       |
| `client/src/components/cobrancas/CobrancaTable.tsx` | `client/src/components/TabelaCobrancas.jsx` |
| `client/src/components/cobrancas/CobrancaDetails.tsx` | Absorvido em TabelaCobrancas.jsx        |
| `client/src/components/cobrancas/SortableHeader.tsx` | Absorvido em TabelaCobrancas.jsx         |
| `client/src/components/cobrancas/StatusBadge.tsx`    | Absorvido em TabelaCobrancas.jsx         |
| `client/src/components/cobrancas/Toolbar.tsx`        | Removido — partes migram para FiltrosPeriodo e CobrancasPage |
| (novo)                                               | `client/src/components/TabelaClientes.jsx` |
| (novo)                                               | `client/src/components/FiltrosPeriodo.jsx` |
| `client/src/components/layout/Header.tsx`            | Manter (converter para .jsx)              |
| `client/src/components/layout/Brand.tsx`             | Manter (converter para .jsx)              |
| `client/src/components/layout/AlertBar.tsx`          | Manter (converter para .jsx)              |
| `client/src/components/shared/LoadingSpinner.tsx`    | Manter (converter para .jsx)              |
| `client/src/components/ui/*.tsx`                     | Converter para .jsx (exceto dialog e scroll-area) |
| `client/src/hooks/useAuth.ts`                        | `client/src/hooks/useAuth.js`             |
| `client/src/hooks/useCobrancas.ts`                   | `client/src/hooks/useCobrancas.js`        |
| `client/src/services/*.ts` (4 arquivos)              | `client/src/services/api.js` (1 arquivo)  |
| `client/src/lib/utils.ts`                            | `client/src/lib/utils.js`                 |
| `client/src/types/user.ts`                           | Removido                                  |
| `client/tailwind.config.ts`                          | `client/tailwind.config.js`               |
| `client/vite.config.ts`                              | `client/vite.config.js`                   |

---

## 5. To-do list ordenada

### Fase 1 — Preparacao

- [ ] 1.1. Criar branch `migration/simplify-to-js`
- [ ] 1.2. Remover `dist/` do git e adicionar ao `.gitignore` (ja esta no gitignore, so precisa remover o que foi commitado)
- [ ] 1.3. Criar estrutura de pastas `server/`, `server/routes/`, `server/db/`, `server/email/`

### Fase 2 — Migrar servidor (TS → JS)

- [ ] 2.1. Criar `server/db/connection.js` — converter database.ts removendo interfaces e tipos
- [ ] 2.2. Criar `server/db/queries.js` — consolidar queries de Cliente.ts, Atendimento.ts e Cobranca.ts sem tipos TS
- [ ] 2.3. Criar `server/email/mailer.js` — converter emailService.ts removendo tipos
- [ ] 2.4. Criar `server/routes/clientes.js` — consolidar clienteRoutes + clienteController (apenas GET /)
- [ ] 2.5. Criar `server/routes/cobrancas.js` — consolidar cobrancaRoutes + cobrancaController, ajustando endpoints:
  - GET `/` → lista cobrancas com filtro por inicio/fim
  - GET `/preview` → preview de atendimentos por cliente/periodo
  - POST `/gerar` → recebe { clienteIds[], inicio, fim, precoHora } e gera todas de uma vez
  - POST `/enviar/:id` → envia email de uma cobranca
  - POST `/enviar-todas` → envia todas pendentes
- [ ] 2.6. Criar `server/server.js` — consolidar server.ts + app.ts + auth inline + error handler inline
- [ ] 2.7. Criar `server/package.json` — dependencias: express, cors, dotenv, mssql, nodemailer + devDeps: nodemon
- [ ] 2.8. Mover `.env.example` para a raiz (ja esta) — validar que DB vars estao completas
- [ ] 2.9. Testar servidor isoladamente (rodar e verificar que responde)

### Fase 3 — Migrar cliente (TS → JS)

- [ ] 3.1. Converter `vite.config.ts` → `vite.config.js` (remover import de tipo)
- [ ] 3.2. Converter `tailwind.config.ts` → `tailwind.config.js` (remover `import type`)
- [ ] 3.3. Converter `postcss.config.js` — ja e JS, manter
- [ ] 3.4. Remover `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` do client
- [ ] 3.5. Converter `src/lib/utils.ts` → `utils.js` (remover ClassValue import)
- [ ] 3.6. Converter componentes UI usados (.tsx → .jsx): alert, badge, button, card, input, label, select, table
- [ ] 3.7. Remover componentes UI nao usados: dialog.tsx, scroll-area.tsx
- [ ] 3.8. Converter componentes de layout (.tsx → .jsx): Header, Brand, AlertBar
- [ ] 3.9. Converter LoadingSpinner.tsx → .jsx
- [ ] 3.10. Consolidar services (4 arquivos .ts) → `services/api.js` (1 arquivo .js)
- [ ] 3.11. Converter `hooks/useAuth.ts` → `useAuth.js` (remover tipos)
- [ ] 3.12. Converter `hooks/useCobrancas.ts` → `useCobrancas.js` (remover tipos)
- [ ] 3.13. Criar `pages/ClientesPage.jsx` — tabela de clientes (somente leitura)
- [ ] 3.14. Criar `components/TabelaClientes.jsx` — componente de tabela de clientes
- [ ] 3.15. Criar `components/FiltrosPeriodo.jsx` — selecao de cliente(s), periodo, e botao gerar
- [ ] 3.16. Refatorar `pages/CobrancasPage.jsx` — integrar FiltrosPeriodo + TabelaCobrancas + enviar-todas
- [ ] 3.17. Criar `components/TabelaCobrancas.jsx` — consolidar CobrancaTable + CobrancaDetails + SortableHeader + StatusBadge
- [ ] 3.18. Converter `pages/LoginPage.tsx` → `LoginPage.jsx`
- [ ] 3.19. Refatorar `App.jsx` — atualizar rotas (remover /nova-cobranca e /confirmar, adicionar /clientes)
- [ ] 3.20. Converter `main.tsx` → `main.jsx`
- [ ] 3.21. Atualizar `index.html` — apontar src para main.jsx
- [ ] 3.22. Atualizar `client/package.json`:
  - Remover todas as dependencias de tipos (@types/*)
  - Remover typescript e typescript-eslint
  - Remover eslint e plugins (opcional, para simplificar)
  - Remover `tsc -b` do script de build

### Fase 4 — Limpeza e ajustes finais

- [ ] 4.1. Remover pastas antigas: `src/` (servidor antigo), `backend/`, `frontend/` (se existirem resquicios)
- [ ] 4.2. Atualizar `package.json` da raiz ou remover (o package.json raiz atual e o do servidor — sera substituido por `server/package.json`)
- [ ] 4.3. Remover `tsconfig.json` da raiz
- [ ] 4.4. Remover `nodemon.json` da raiz
- [ ] 4.5. Atualizar `.gitignore`
- [ ] 4.6. Testar fluxo completo: login → clientes → gerar cobranca → listar → enviar email
- [ ] 4.7. Verificar que `npm run dev` funciona em ambos (client e server)
- [ ] 4.8. Remover `eslint.config.js` do client (se decidirmos simplificar)

---

## 6. Riscos identificados

### Alto risco

1. **Queries SQL com transacao (create cobranca)** — a funcao `CobrancaModel.create` usa `sp_getapplock` e transacoes do mssql. Na conversao para JS, e preciso manter a mesma logica exata de lock + insert + insert itens + release. Erro aqui pode gerar IDs duplicados ou cobrancas sem itens.

2. **POST /cobrancas/gerar com multiplos clientes** — o endpoint atual cria UMA cobranca por chamada. O endpoint alvo recebe `clienteIds[]` e deve criar varias. A logica de loop precisa ser feita no servidor (atualmente e feita no frontend em ConfirmarCobrancaPage). Se uma falhar no meio, as anteriores ja foram commitadas — avaliar se precisa de transacao global.

3. **POST /cobrancas/enviar-todas** — endpoint novo que nao existe. Precisa iterar todas as cobrancas com `emailEnviado = false` e enviar. Se uma falhar, as outras devem continuar ou parar? Definir comportamento.

### Medio risco

4. **Componentes shadcn/ui com forwardRef e TS generics** — a conversao para JSX puro exige remover generics de `React.forwardRef<>` e `React.ComponentPropsWithoutRef<>`. Se feito incorretamente, os componentes podem perder funcionalidade de ref.

5. **Consolidacao de 4 componentes em TabelaCobrancas** — CobrancaTable.tsx tem ~260 linhas, CobrancaDetails.tsx ~160, SortableHeader.tsx ~57, StatusBadge.tsx ~16. Total ~490 linhas. Se consolidar tudo em um arquivo, pode ficar grande demais. Considerar manter CobrancaDetails como sub-componente ou aceitar o arquivo grande por simplicidade.

6. **Zustand useAuth com persist** — funciona sem TS, mas o import de `persist` de `zustand/middleware` precisa ser verificado com a versao atual (v5). A sintaxe pode variar.

### Baixo risco

7. **Remocao do eslint** — sem eslint, erros de sintaxe so serao detectados em runtime ou pelo Vite. Considerar manter uma config minima.

8. **`'use client'` em arquivos** — precisa remover essas diretivas. Nao causam erro no Vite, mas sao lixo.

9. **`@radix-ui/react-dropdown-menu`** esta no package.json do client mas nao e usado em nenhum componente — pode ser removido.

---

## Decisoes alinhadas

1. **Auth (login):** Manter. Usuario e senha definidos no `.env`. Rota POST `/api/auth/login` no servidor, LoginPage no cliente.

2. **precoHora:** Sera parametro no body do POST `/api/cobrancas/gerar` — o frontend deve ter campo para o usuario informar.

3. **Preview antes de gerar:** Manter GET `/api/cobrancas/preview` separado. Fluxo: usuario seleciona periodo → ve preview → confirma → POST `/api/cobrancas/gerar`.

4. **Erro no enviar-todas:** Manter comportamento atual (sem tratamento especial). Se um email falhar, a iteracao para e retorna erro.

5. **Prefixo /api:** Manter. Todas as rotas do servidor ficam sob `/api` para compatibilidade com o proxy do Vite.

### Endpoints finais confirmados

| Metodo | Rota                          | Descricao                                    |
|--------|-------------------------------|----------------------------------------------|
| POST   | /api/auth/login               | Login com usuario/senha do .env              |
| GET    | /api/clientes                 | Listar todos os clientes (somente leitura)   |
| GET    | /api/cobrancas                | Listar cobrancas (filtros: inicio, fim)      |
| GET    | /api/cobrancas/preview        | Preview antes de gerar (clienteId, inicio, fim) |
| POST   | /api/cobrancas/gerar          | Gerar cobrancas { clienteIds[], inicio, fim, precoHora } |
| POST   | /api/cobrancas/enviar/:id     | Enviar email de uma cobranca                 |
| POST   | /api/cobrancas/enviar-todas   | Enviar email de todas as pendentes           |
