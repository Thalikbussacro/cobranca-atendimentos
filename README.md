# Sistema de Cobrança de Atendimentos

Sistema para gerenciar cobranças de atendimentos técnicos.

## Tecnologias

- Backend: Express.js + TypeScript (MVC)
- Frontend: React 19 + Vite + TypeScript
- UI: Tailwind CSS 3 + Shadcn/UI
- Database: SQL Server
- Deploy: Monolito (backend serve frontend estático)

## Estrutura

```
├── src/                # Backend (TypeScript)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── services/
│
├── client/             # Frontend (React + Vite)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── dist/               # Build produção
│   ├── *.js            # Backend compilado
│   └── public/         # Frontend buildado
│
└── package.json        # Scripts e deps backend
```

## Setup

```bash
# backend
npm install

# frontend
cd client && npm install && cd ..

# configurar .env
cp .env.example .env
```

Variáveis necessárias no `.env`:

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

## Produção

```bash
npm run build  # compila tudo
npm start      # roda em localhost:3001
```

## Scripts

| Comando | Ação |
|---------|------|
| `npm run dev` | Dev mode (backend + frontend) |
| `npm run build` | Build completo |
| `npm start` | Produção |

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login |
| GET | `/api/clientes` | Lista clientes |
| GET | `/api/cobrancas` | Lista cobranças |
| POST | `/api/cobrancas` | Cria cobrança |
| POST | `/api/cobrancas/:id/enviar-email` | Envia email |

## Features

- Autenticação
- CRUD de cobranças
- Filtros (busca, status, período)
- Envio de emails
- Interface responsiva

## Stack Completa

**Backend:**
- Express 4, TypeScript 5, MSSQL, Nodemailer, CORS

**Frontend:**
- React 19, Vite 7, TypeScript 5, Tailwind CSS 3, Shadcn/UI, React Router 7, Zustand, Lucide Icons

**Dev:**
- Nodemon, ts-node, Concurrently

## Licença

ISC
