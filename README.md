# Sistema de Cobranca de Atendimentos

Sistema para gerenciar cobrancas de atendimentos tecnicos.

## Tecnologias

- Backend: Express.js (JavaScript)
- Frontend: React 19 + Vite 7
- UI: Tailwind CSS 3 + shadcn/ui
- Database: SQL Server

## Estrutura

```
├── server/                # Backend (JavaScript)
│   ├── server.js          # Express app + auth + error handler
│   ├── .env               # Variaveis de ambiente (nao versionado)
│   ├── .env.example       # Exemplo de configuracao
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
└── client/                # Frontend (React + Vite)
    ├── src/
    │   ├── components/    # TabelaCobrancas, TabelaClientes, FiltrosPeriodo, ui/, layout/
    │   ├── hooks/         # useAuth (zustand), useCobrancas
    │   ├── pages/         # LoginPage, CobrancasPage, ClientesPage
    │   ├── services/      # api.js (chamadas HTTP)
    │   └── lib/           # utils.js
    ├── package.json
    └── vite.config.js
```

## Setup

```bash
# instalar dependencias
cd server && npm install
cd ../client && npm install

# configurar variaveis de ambiente
cp server/.env.example server/.env
# editar server/.env com os valores corretos
```

Variaveis necessarias no `server/.env`:

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

Abrir dois terminais:

```bash
# terminal 1 - backend
cd server && npm run dev

# terminal 2 - frontend
cd client && npm run dev
```

Abre:

- Frontend: `http://localhost:5173` (com HMR)
- Backend: `http://localhost:3001` (API)

## Producao

```bash
# buildar o frontend
cd client && npm run build

# rodar o servidor (serve tambem os arquivos estaticos do client/dist)
cd server && npm start
```

## Scripts

| Comando                        | Acao                          |
| ------------------------------ | ----------------------------- |
| `cd server && npm run dev`     | Backend com hot reload        |
| `cd client && npm run dev`     | Frontend com HMR              |
| `cd client && npm run build`   | Build do frontend             |
| `cd server && npm start`       | Producao                      |

## API

| Metodo | Rota                          | Descricao                                                 |
| ------ | ----------------------------- | --------------------------------------------------------- |
| POST   | `/api/auth/login`             | Login                                                     |
| GET    | `/api/clientes`               | Lista clientes                                            |
| GET    | `/api/cobrancas`              | Lista cobrancas (filtros: search, status, inicio, fim)    |
| GET    | `/api/cobrancas/preview`      | Preview de atendimentos por cliente/periodo               |
| POST   | `/api/cobrancas/gerar`        | Gera cobrancas (body: clienteIds, inicio, fim, precoHora) |
| POST   | `/api/cobrancas/enviar/:id`   | Envia email de uma cobranca                               |
| POST   | `/api/cobrancas/enviar-todas` | Envia email de todas as cobrancas pendentes               |

## Features

- Autenticacao simples (usuario/senha via .env)
- Geracao de cobrancas por periodo com preview
- Filtros (busca, status, periodo)
- Envio de emails individual e em lote
- Paginas de clientes e cobrancas
- Interface responsiva

## Stack Completa

**Backend:**

- Express 4, MSSQL, Nodemailer, CORS, dotenv, nodemon

**Frontend:**

- React 19, Vite 7, Tailwind CSS 3, shadcn/ui (Radix UI), React Router 7, Zustand 5, Lucide Icons

## Licenca

ISC
