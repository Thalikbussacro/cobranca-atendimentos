# Plano de Refatoracao - cobranca-atendimentos-vite

Objetivo: reorganizar o projeto em camadas bem definidas, seguindo o padrao usado no hackaton-plataforma-de-estudos (Routes -> Controllers -> Services -> Repositories -> Models).

---

## Estrutura alvo

### Backend

```
server/
├── server.js                        # setup express, middlewares, monta rotas
├── middleware/
│   └── auth.js                      # extrair auth de server.js
├── routes/
│   ├── cobrancas.js                 # so define endpoints, delega pro controller
│   └── clientes.js                  # idem
├── controllers/
│   ├── cobrancasController.js       # lida com req/res, chama services
│   └── clientesController.js        # idem
├── services/
│   ├── cobrancaService.js           # logica de negocio (preview, geracao, envio)
│   ├── clienteService.js            # logica de clientes
│   └── emailService.js              # orquestra envio de email
├── repositories/
│   ├── cobrancaRepository.js        # queries SQL de cobrancas
│   ├── clienteRepository.js         # queries SQL de clientes
│   └── atendimentoRepository.js     # queries SQL de atendimentos
├── models/
│   ├── Cobranca.js                  # estrutura de dados + factory
│   ├── Cliente.js                   # idem
│   └── Atendimento.js               # idem
├── utils/
│   └── formatters.js                # minutosParaHoras, formatarPeriodo, moeda
├── db/
│   └── connection.js                # singleton de conexao (mantem como esta)
└── email/
    └── mailer.js                    # transporte nodemailer (so envio)
```

### Frontend

```
client/src/
├── services/
│   └── api.js                       # HTTP client (mantem como esta)
├── hooks/
│   ├── useAuth.js                   # mantem
│   ├── useCobrancas.js              # mantem, ajustar se necessario
│   ├── usePreview.js                # extrair logica de preview do FiltrosPeriodo
│   └── useEmailSending.js           # extrair logica de envio do CobrancasPage
├── components/
│   ├── ui/                          # shadcn (mantem)
│   ├── Header.jsx                   # mantem
│   ├── LoadingSpinner.jsx           # mantem
│   ├── StatusBadge.jsx              # extrair de TabelaCobrancas
│   ├── SortableHeader.jsx           # extrair de TabelaCobrancas
│   ├── CobrancaDetails.jsx          # extrair de TabelaCobrancas
│   ├── TabelaCobrancas.jsx          # fica so com a tabela principal
│   ├── TabelaClientes.jsx           # mantem
│   ├── PreviewPanel.jsx             # extrair de FiltrosPeriodo
│   └── FiltrosPeriodo.jsx           # fica so com o formulario
├── utils/
│   ├── formatters.js                # horasParaDecimal, formatacao de datas
│   └── sorting.js                   # sortCobrancas extraido da tabela
├── pages/
│   ├── LoginPage.jsx                # mantem
│   ├── CobrancasPage.jsx            # orquestracao, sem logica de negocio
│   └── ClientesPage.jsx             # mantem
├── App.jsx
└── main.jsx
```

---

## Etapas

### Fase 1 - Backend: extrair camadas de suporte

> Criar a base sem quebrar nada. Arquivos novos, sem alterar os existentes ainda.

- [x] **1.1** Criar `server/utils/formatters.js`
  - Mover `minutosParaHoras()` e `formatarPeriodo()` de `db/queries.js`
  - Mover `formatarMoeda()` e `calcularValorTotal()` de `email/mailer.js`

- [x] **1.2** Criar `server/models/`
  - `Cliente.js` — factory que estrutura um registro de cliente
  - `Atendimento.js` — factory que estrutura um atendimento
  - `Cobranca.js` — factory que estrutura uma cobranca com seus itens

- [x] **1.3** Criar `server/middleware/auth.js`
  - Extrair a logica de `POST /api/auth/login` de `server.js`
  - Manter o endpoint funcionando igual

### Fase 2 - Backend: repository layer

> Isolar todo acesso a banco em repositories.

- [x] **2.1** Criar `server/repositories/clienteRepository.js`
  - Mover `findAllClientes()` e `findClienteById()` de `db/queries.js`
  - Retornar dados crus do banco (sem formatacao)

- [x] **2.2** Criar `server/repositories/atendimentoRepository.js`
  - Mover `findAtendimentosByClienteAndPeriodo()` e `findAtendimentosByCobranca()` de `db/queries.js`

- [x] **2.3** Criar `server/repositories/cobrancaRepository.js`
  - Mover `findAllCobrancas()`, `findCobrancaById()`, `createCobranca()`, `markEmailSent()` de `db/queries.js`
  - Manter logica de transaction e locking em `createCobranca()`

- [x] **2.4** Remover `server/db/queries.js` (agora vazio)

### Fase 3 - Backend: service layer

> Centralizar logica de negocio.

- [x] **3.1** Criar `server/services/clienteService.js`
  - `listarClientes()` — chama repository, aplica model

- [x] **3.2** Criar `server/services/cobrancaService.js`
  - `listarCobrancas(filtros)` — filtragem, enriquecimento com itens, formatacao
  - `gerarPreview(clienteId, dataInicial, dataFinal)` — busca atendimentos, calcula horas
  - `gerarCobrancas(clienteIds, inicio, fim, precoHora)` — orquestra criacao
  - `buscarCobrancaPorId(id)` — busca com itens

- [x] **3.3** Criar `server/services/emailService.js`
  - `enviarCobranca(cobrancaId)` — busca cobranca, valida email, monta corpo, envia
  - `enviarTodasPendentes()` — busca pendentes, envia em lote
  - Usar `email/mailer.js` so como transporte (send)
  - Mover logica de geracao de corpo do email pra ca ou pra um template

### Fase 4 - Backend: controller layer

> Separar HTTP de logica.

- [ ] **4.1** Criar `server/controllers/clientesController.js`
  - `listar(req, res)` — chama service, retorna JSON

- [ ] **4.2** Criar `server/controllers/cobrancasController.js`
  - `listar(req, res)` — extrai query params, chama service
  - `preview(req, res)` — extrai params, chama service
  - `gerar(req, res)` — extrai body, chama service
  - `enviar(req, res)` — extrai id, chama emailService
  - `enviarTodas(req, res)` — chama emailService

- [ ] **4.3** Simplificar `server/routes/cobrancas.js`
  - Remover toda logica, so mapear endpoints para controller
  - Exemplo: `router.get('/', cobrancasController.listar)`

- [ ] **4.4** Simplificar `server/routes/clientes.js`
  - Idem

- [ ] **4.5** Limpar `server/server.js`
  - Remover auth inline, usar middleware
  - Manter so setup e mount de rotas

### Fase 5 - Backend: validacao e testes

- [ ] **5.1** Testar todos os endpoints manualmente (Postman/curl)
  - POST /api/auth/login
  - GET /api/clientes
  - GET /api/cobrancas (com e sem filtros)
  - GET /api/cobrancas/preview
  - POST /api/cobrancas/gerar
  - POST /api/cobrancas/enviar/:id
  - POST /api/cobrancas/enviar-todas

- [ ] **5.2** Verificar que nenhum comportamento mudou (mesmas respostas, mesmos status codes)

---

### Fase 6 - Frontend: extrair utilitarios

- [x] **6.1** Criar `client/src/utils/formatters.js`
  - Extrair `horasParaDecimal()` de `TabelaCobrancas.jsx`
  - Extrair formatacao de datas usada em componentes

- [x] **6.2** Criar `client/src/utils/sorting.js`
  - Extrair `sortCobrancas()` de `TabelaCobrancas.jsx`

### Fase 7 - Frontend: quebrar componentes grandes

- [x] **7.1** Extrair `StatusBadge.jsx` de `TabelaCobrancas.jsx`
  - Componente que renderiza o badge de status (enviado, pendente, sem email)

- [x] **7.2** Extrair `SortableHeader.jsx` de `TabelaCobrancas.jsx`
  - Componente de header clicavel com indicador de direcao

- [x] **7.3** Extrair `CobrancaDetails.jsx` de `TabelaCobrancas.jsx`
  - Painel expansivel com detalhes dos itens da cobranca (~147 linhas)

- [x] **7.4** Simplificar `TabelaCobrancas.jsx`
  - Deve ficar so com a estrutura da tabela, usando os sub-componentes extraidos
  - Alvo: <150 linhas

- [x] **7.5** Extrair `PreviewPanel.jsx` de `FiltrosPeriodo.jsx`
  - Componente que mostra a lista de preview antes de gerar

- [x] **7.6** Simplificar `FiltrosPeriodo.jsx`
  - Deve ficar so com o formulario de entrada
  - Alvo: <120 linhas

### Fase 8 - Frontend: extrair hooks especializados

- [x] **8.1** Criar `hooks/usePreview.js`
  - Estado do preview (dados, loading, erro)
  - Funcao `carregarPreview(clienteId, dataInicial, dataFinal)`
  - Extrair de `FiltrosPeriodo.jsx`

- [x] **8.2** Criar `hooks/useEmailSending.js`
  - Estado de envio (enviando, sucesso, erro)
  - Funcoes `enviar(id)` e `enviarTodas()`
  - Extrair de `CobrancasPage.jsx`

### Fase 9 - Frontend: validacao

- [ ] **9.1** Testar fluxo completo no browser
  - Login
  - Listagem de cobrancas com filtros
  - Preview de geracao
  - Geracao de cobrancas
  - Envio de email individual
  - Envio de todos
  - Pagina de clientes

- [ ] **9.2** Verificar responsividade (mobile/desktop)

---

## Regras durante a refatoracao

1. **Uma fase por vez** — nao pular etapas
2. **Testar apos cada fase** — garantir que nada quebrou
3. **Commits granulares** — um commit por sub-etapa (1.1, 1.2, etc.)
4. **Sem mudanca de comportamento** — refatoracao pura, sem features novas
5. **Manter imports relativos** — nao instalar path aliases novos

## Ordem de prioridade

Backend primeiro (Fases 1-5), depois frontend (Fases 6-9). O backend tem os problemas mais criticos de separacao de responsabilidades.

## Referencia

Padroes baseados no projeto `hackaton-plataforma-de-estudos`:
- Routes -> Controllers -> Services -> Repositories -> Models
- Cada camada so conhece a de baixo
- Controllers nao acessam banco diretamente
- Services nao lidam com req/res
- Repositories nao aplicam regras de negocio
