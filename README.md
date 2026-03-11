# Sistema de Cobranca de Atendimentos

Sistema para gerenciar cobrancas de atendimentos tecnicos.

## Tecnologias

- Backend: Express.js (JavaScript)
- Frontend: React 19 + Vite 7
- UI: Tailwind CSS 3 + Radix UI
- Database: SQL Server
- Deploy: Monolito (backend serve frontend estatico)

## Estrutura

```
├── server/                # Backend (JavaScript)
│   ├── server.js          # Express app + auth + error handler
│   ├── db/
│   │   ├── connection.js  # Singleton de conexao mssql
│   │   └── queries.js     # Todas as queries
│   ├── email/
│   │   └── mailer.js      # Envio de email via nodemailer
│   ├── routes/
│   │   ├── clientes.js
│   │   └── cobrancas.js
│   └── package.json
│
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # TabelaCobrancas, TabelaClientes, FiltrosPeriodo, ui/, layout/
│   │   ├── hooks/         # useAuth (zustand), useCobrancas
│   │   ├── pages/         # LoginPage, CobrancasPage, ClientesPage
│   │   ├── services/      # api.js (chamadas HTTP)
│   │   └── lib/           # utils.js
│   ├── package.json
│   └── vite.config.js
│
└── package.json           # Scripts de orquestracao (concurrently)
```

## Setup

```bash
# instalar deps (raiz + server + client)
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# configurar .env na pasta server/
cp .env.example server/.env
```

Variaveis necessarias no `.env`:

```env
PORT=3001
AUTH_USERNAME=admin
AUTH_PASSWORD=senha

DB_SERVER=localhost
DB_DATABASE=nome_banco
DB_USER=usuario
DB_PASSWORD=senha
DB_PORT=1433

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email@gmail.com
SMTP_PASS=senha_app
EMAIL_FROM=noreply@empresa.com
```

## Desenvolvimento

```bash
npm run dev
```

Abre:
- Frontend: `http://localhost:5173` (com HMR)
- Backend: `http://localhost:3001` (API)

## Producao

```bash
npm run build  # builda o frontend
npm start      # roda o servidor em localhost:3001
```

## Scripts

| Comando | Acao |
|---------|------|
| `npm run dev` | Dev mode (backend + frontend simultaneos) |
| `npm run dev:server` | Apenas backend (node --watch) |
| `npm run dev:client` | Apenas frontend (vite) |
| `npm run build` | Build do frontend |
| `npm start` | Producao |

## API

| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/api/auth/login` | Login |
| GET | `/api/clientes` | Lista clientes |
| GET | `/api/cobrancas` | Lista cobrancas (filtros: search, status, inicio, fim) |
| GET | `/api/cobrancas/preview` | Preview de atendimentos por cliente/periodo |
| POST | `/api/cobrancas/gerar` | Gera cobrancas (body: clienteIds, inicio, fim, precoHora) |
| POST | `/api/cobrancas/enviar/:id` | Envia email de uma cobranca |
| POST | `/api/cobrancas/enviar-todas` | Envia email de todas as cobrancas pendentes |

## Features

- Autenticacao simples (usuario/senha via .env)
- Geracao de cobrancas por periodo com preview
- Filtros (busca, status, periodo)
- Envio de emails individual e em lote
- Paginas de clientes e cobrancas
- Interface responsiva

## Stack Completa

**Backend:**
- Express 4, MSSQL, Nodemailer, CORS, dotenv

**Frontend:**
- React 19, Vite 7, Tailwind CSS 3, Radix UI, React Router 7, Zustand 5, Lucide Icons

**Dev:**
- Nodemon, Concurrently

## Licenca

ISC
