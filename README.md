# Sistema de Cobrança de Atendimentos

Sistema simplificado para gestão e envio de cobranças de atendimentos técnicos da Empresa Genérica.

Desenvolvido com Next.js 15, TypeScript e Shadcn/UI.

## Funcionalidades

- **Autenticação simples** - Login com usuário e senha únicos
- **Visualização de cobranças** - Listagem de todas as cobranças ativas
- **Criação de cobranças** - Formulário para criar novas cobranças
- **Visualização de atendimentos** - Detalhes dos atendimentos incluídos em cada cobrança
- **Envio de e-mails** - Envio individual ou em lote de e-mails de cobrança
- **Status simplificado** - E-mail Enviado / Não Enviado
- **Filtros** - Busca por cliente/período e filtro por status

## Stack Tecnológico

- Next.js 15 (App Router)
- TypeScript 5.7
- Shadcn/UI (Radix UI + Tailwind CSS)
- Zustand (Estado global)
- Lucide React (Ícones)
- SQL Server (Banco de dados)
- mssql (Driver Node.js para SQL Server)

## Pré-requisitos

- Node.js 18+ instalado
- SQL Server (Express ou superior) instalado e configurado
- Banco de dados com as tabelas necessárias (veja seção "Estrutura do Banco de Dados")

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Editar .env.local com suas configurações
# (Veja seção "Configuração" abaixo)

# Rodar em modo desenvolvimento
npm run dev
```

O sistema estará disponível em [http://localhost:3000](http://localhost:3000)

## Configuração

Crie um arquivo `.env.local` na raiz do projeto e configure as seguintes variáveis:

### Autenticação
```env
AUTH_USERNAME=admin
AUTH_PASSWORD=admin123
```

### Banco de Dados SQL Server
```env
DB_SERVER=localhost\SQLEXPRESS22
DB_DATABASE=BancoThalik
DB_USER=sa
DB_PASSWORD=sua_senha_aqui
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
DB_CONNECTION_TIMEOUT=15000
DB_REQUEST_TIMEOUT=15000
```

### SMTP (Opcional - Para envio de e-mails futuro)
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_smtp_password
SMTP_FROM_EMAIL=noreply@soautomacao.com.br
SMTP_FROM_NAME=Empresa Genérica - Sistema de Cobranças
```

### Aplicação
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
LOG_LEVEL=info
LOG_SQL_QUERIES=false
```

## Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas do SQL Server:

### Cad_Cliente
```sql
CREATE TABLE Cad_Cliente (
  CodCliente INT PRIMARY KEY,
  Descricao VARCHAR(255),
  CNPJ VARCHAR(20),
  Email VARCHAR(MAX),
  Telefone VARCHAR(20)
)
```

### Opr_Atendimento
```sql
CREATE TABLE Opr_Atendimento (
  CodAtendimento INT PRIMARY KEY,
  CodCliente INT,
  DataHoraInicio DATETIME,
  DataHoraFim DATETIME,
  Problema VARCHAR(MAX),
  Solucao VARCHAR(MAX),
  Solicitante VARCHAR(100),
  CobrarAtendimento VARCHAR(3) -- 'Sim' ou 'Não'
)
```

### Cad_Cobranca
```sql
CREATE TABLE Cad_Cobranca (
  CodCobranca INT PRIMARY KEY,
  CodCliente INT,
  PrecoHora MONEY,
  DataHoraInicial DATETIME,
  DataHoraFinal DATETIME,
  EmailEnviado BIT DEFAULT 0
)
```

### Cad_Cobranca_Item
```sql
CREATE TABLE Cad_Cobranca_Item (
  CodCobranca INT,
  CodAtendimento INT,
  PRIMARY KEY (CodCobranca, CodAtendimento)
)
```

### Índices Recomendados
```sql
CREATE INDEX IX_Cad_Cobranca_EmailEnviado ON Cad_Cobranca(EmailEnviado)
CREATE INDEX IX_Cad_Cobranca_DataHoraFinal ON Cad_Cobranca(DataHoraFinal)
CREATE INDEX IX_Opr_Atendimento_CodCliente ON Opr_Atendimento(CodCliente)
CREATE INDEX IX_Opr_Atendimento_DataHora ON Opr_Atendimento(DataHoraInicio, DataHoraFim)
```

## Estrutura do Projeto

```
src/
├── app/                    # Páginas e rotas (App Router)
│   ├── (dashboard)/       # Grupo de rotas autenticadas
│   │   ├── cobrancas/     # Página principal
│   │   └── nova-cobranca/ # Criação de cobranças
│   ├── api/               # API Routes (Backend mock)
│   ├── login/             # Página de login
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Shadcn/UI)
│   ├── layout/           # Layout (Sidebar, Header)
│   └── cobrancas/        # Componentes específicos
├── hooks/                # Custom hooks
├── domain/               # Entidades e interfaces
│   ├── entities/         # Entidades de domínio
│   └── repositories/     # Interfaces de repositórios
├── application/          # Casos de uso e serviços
└── infrastructure/       # Implementações de infraestrutura
    ├── database/         # Conexão e tipos do banco
    ├── repositories/     # Repositórios SQL
    └── services/         # Serviços (Email, etc)
```

## APIs Disponíveis

### Clientes
- `GET /api/clientes` - Lista todos os clientes
- `GET /api/clientes/[id]` - Busca cliente por ID
- `POST /api/clientes` - Cria novo cliente
- `PUT /api/clientes/[id]` - Atualiza cliente
- `DELETE /api/clientes/[id]` - Remove cliente

### Cobranças
- `GET /api/cobrancas` - Lista cobranças (com filtros)
- `GET /api/cobrancas/[id]` - Busca cobrança por ID
- `POST /api/cobrancas` - Cria nova cobrança
- `PUT /api/cobrancas/[id]` - Atualiza cobrança
- `DELETE /api/cobrancas/[id]` - Remove cobrança
- `GET /api/cobrancas/preview` - Preview de atendimentos para cobrança
- `POST /api/cobrancas/[id]/enviar-email` - Marca e-mail como enviado

## Logs e Debugging

O sistema possui logs configuráveis. Ajuste no `.env.local`:

```env
LOG_LEVEL=info          # error, warn, info, debug
LOG_SQL_QUERIES=false   # true para ver queries SQL (apenas dev)
```

## Segurança

- ✅ Queries parametrizadas para prevenir SQL Injection
- ✅ Arquivo `.env.local` não versionado no Git
- ✅ Pool de conexões para melhor performance
- ✅ Tratamento de erros em todas as camadas

## Próximos Passos

1. **Envio de E-mails**
   - Implementar envio real via SMTP
   - Template HTML personalizado para cobranças

2. **Funcionalidades Adicionais**
   - Upload de documentos
   - Geração de PDF de atendimentos
   - Relatórios customizados
   - Dashboard com métricas

## Licença

Propriedade da Empresa Genérica - Todos os direitos reservados.
