# Sistema de Cobrança de Atendimentos

Sistema para gerenciar cobranças de atendimentos técnicos.

## Arquitetura

- **Backend**: Express.js + TypeScript + MVC
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Banco de Dados**: SQL Server

## Estrutura do Projeto

```
├── backend/          # API Express
│   ├── src/
│   │   ├── models/      # Lógica de acesso ao banco
│   │   ├── controllers/ # Controladores das rotas
│   │   ├── routes/      # Definição de rotas
│   │   ├── services/    # Serviços (email, etc)
│   │   └── config/      # Configurações (DB)
│   └── package.json
│
└── frontend/         # React App
    ├── src/
    │   ├── components/  # Componentes React
    │   ├── pages/       # Páginas da aplicação
    │   ├── hooks/       # Custom hooks
    │   ├── services/    # Chamadas à API
    │   └── types/       # TypeScript types
    └── package.json
```

## Instalação

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente no .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Configuração

### Variáveis de Ambiente - Backend

Edite `backend/.env`:

```env
PORT=3001

# Autenticação
AUTH_USERNAME=admin
AUTH_PASSWORD=sua_senha

# SQL Server
DB_SERVER=localhost
DB_DATABASE=seu_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_PORT=1433

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
EMAIL_FROM=noreply@empresa.com
```

## Uso

1. **Inicie o backend** (porta 3001)
2. **Inicie o frontend** (porta 5173)
3. **Acesse** http://localhost:5173
4. **Login**: use as credenciais configuradas no .env

## Funcionalidades

- ✅ Autenticação de usuários
- ✅ Listagem de cobranças com filtros
- ✅ Criação de nova cobrança
- ✅ Visualização detalhada de cobranças
- ✅ Envio de emails de cobrança
- ✅ Interface responsiva

## Desenvolvimento

### Estrutura de Rotas

**Frontend:**
- `/login` - Página de login
- `/cobrancas` - Listagem de cobranças
- `/nova-cobranca` - Criação de cobrança
- `/nova-cobranca/confirmar` - Confirmação antes de criar

**Backend API:**
- `POST /api/auth/login` - Autenticação
- `GET /api/clientes` - Listar clientes
- `GET /api/cobrancas` - Listar cobranças
- `POST /api/cobrancas` - Criar cobrança
- `POST /api/cobrancas/:id/enviar-email` - Enviar email

## Build para Produção

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Os arquivos estarão em frontend/dist
```

## Tecnologias

### Backend
- Express.js
- TypeScript
- MSSQL
- Nodemailer

### Frontend
- React 19
- Vite
- TypeScript
- Tailwind CSS
- Shadcn/UI
- React Router
- Zustand
- Lucide Icons
