# Sistema de Cobrança de Atendimentos

Sistema simplificado para gestão e envio de cobranças de atendimentos técnicos da Empresa Genérica.

Desenvolvido com Next.js 15, TypeScript e Shadcn/UI.

## Funcionalidades

- **Autenticação simples** - Login com código de acesso e senha via .env
- **Visualização de cobranças** - Listagem de todas as cobranças ativas
- **Criação de cobranças** - Formulário para criar novas cobranças com preview
- **Visualização de atendimentos** - Detalhes dos atendimentos incluídos em cada cobrança
- **Envio de e-mails via SMTP** - Envio individual ou em lote com barra de progresso
- **Templates HTML personalizados** - E-mails formatados com detalhes dos atendimentos
- **Validação de múltiplos e-mails** - Suporte para envio para vários destinatários
- **Status simplificado** - E-mail Enviado / Não Enviado
- **Filtros avançados** - Busca por cliente/período e filtro por status
- **Cancelamento de envios** - Possibilidade de parar envio em lote

## Stack Tecnológico

- **Next.js 15** (App Router) - Framework React
- **TypeScript 5.7** - Linguagem tipada
- **Shadcn/UI** (Radix UI + Tailwind CSS) - Design System
- **Zustand** - Gerenciamento de estado global
- **Lucide React** - Biblioteca de ícones
- **SQL Server** - Banco de dados relacional
- **mssql** - Driver Node.js para SQL Server
- **Nodemailer** - Envio de e-mails via SMTP

## Pré-requisitos

- Node.js 18+ instalado
- SQL Server (Express ou superior) instalado e configurado
- Banco de dados com as tabelas necessárias (veja seção "Estrutura do Banco de Dados")
- **Conta SMTP configurada** (Gmail, Outlook, ou servidor SMTP próprio) para envio de e-mails

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Editar .env com suas configurações
# (Veja seção "Configuração" abaixo)

# Rodar em modo desenvolvimento
npm run dev
```

O sistema estará disponível em [http://localhost:3000](http://localhost:3000)

## Como Usar

### 1. Primeiro Acesso
1. Acesse [http://localhost:3000](http://localhost:3000)
2. Faça login com as credenciais definidas no `.env` (padrão: `admin` / `admin123`)

### 2. Criando uma Cobrança
1. Na página principal, clique em **"Nova Cobrança"**
2. Selecione o **cliente**, **preço/hora** e **período**
3. Clique em **"Buscar Atendimentos"** para visualizar os atendimentos do período
4. Revise os atendimentos e o **valor total**
5. Clique em **"Criar Cobrança"** para confirmar

### 3. Enviando E-mails
**Envio Individual:**
1. Na tabela de cobranças, clique no ícone de **envelope** da cobrança desejada
2. Confirme o envio no modal

**Envio em Lote:**
1. Marque as cobranças desejadas usando os checkboxes
2. Clique em **"Enviar E-mails Selecionados"** na toolbar
3. Acompanhe o progresso na barra exibida
4. Você pode cancelar o envio a qualquer momento

### 4. Filtrando Cobranças
- Use o campo de **busca** para filtrar por nome do cliente
- Filtre por **status** (Enviado/Não Enviado/Todos)
- Selecione o **período** para filtrar por data

## Configuração

Crie um arquivo `.env` na raiz do projeto (ou copie de `.env.example`) e configure as seguintes variáveis:

### Autenticação
```env
AUTH_USERNAME=admin
AUTH_PASSWORD=admin123
```

### Banco de Dados SQL Server
```env
DB_SERVER=seu_ip\sua_instancia
DB_DATABASE=seu_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
DB_CONNECTION_TIMEOUT=15000
DB_REQUEST_TIMEOUT=15000
```

### SMTP (Obrigatório - Para envio de e-mails)
```env
SMTP_HOST=seu_host_smtp
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email@email.com
SMTP_PASSWORD=sua_senha_de_app_16_caracteres
SMTP_FROM_EMAIL=seu_email@email.com
SMTP_FROM_NAME=Empresa Genérica - Sistema de Cobranças
```

**Nota:** Para Gmail, use uma [senha de app](https://support.google.com/accounts/answer/185833) de 16 caracteres ao invés da senha normal.

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
Armazena os dados dos clientes.

```sql
CREATE TABLE Cad_Cliente (
  CodCliente INT PRIMARY KEY,
  Descricao VARCHAR(255) NOT NULL,
  CNPJ VARCHAR(20),
  EMail VARCHAR(MAX),  -- Pode conter múltiplos emails separados por vírgula ou ponto-e-vírgula
  Telefone VARCHAR(20)
)
```

### Opr_Atendimento
Armazena os atendimentos técnicos realizados.

```sql
CREATE TABLE Opr_Atendimento (
  CodAtendimento INT PRIMARY KEY,
  CodCliente INT NOT NULL,
  DataHoraInicial DATETIME NOT NULL,
  DataHoraFinal DATETIME NOT NULL,
  Problema VARCHAR(MAX),
  Solucao VARCHAR(MAX),
  Solicitante VARCHAR(100),
  CobrarAtendimento VARCHAR(3) DEFAULT 'NAO',  -- 'SIM' ou 'NAO'
  FOREIGN KEY (CodCliente) REFERENCES Cad_Cliente(CodCliente)
)
```

### Cad_Cobranca
Armazena as cobranças geradas a partir dos atendimentos.

```sql
CREATE TABLE Cad_Cobranca (
  CodCobranca INT PRIMARY KEY,
  CodCliente INT NOT NULL,
  PrecoHora MONEY NOT NULL,
  DataHoraInicial DATETIME NOT NULL,
  DataHoraFinal DATETIME NOT NULL,
  EmailEnviado BIT DEFAULT 0,
  FOREIGN KEY (CodCliente) REFERENCES Cad_Cliente(CodCliente)
)
```

### Cad_Cobranca_Item
Relaciona cobranças com seus atendimentos.

```sql
CREATE TABLE Cad_Cobranca_Item (
  CodCobranca INT NOT NULL,
  CodAtendimento INT NOT NULL,
  PRIMARY KEY (CodCobranca, CodAtendimento),
  FOREIGN KEY (CodCobranca) REFERENCES Cad_Cobranca(CodCobranca),
  FOREIGN KEY (CodAtendimento) REFERENCES Opr_Atendimento(CodAtendimento)
)
```

**Nota:** Ao criar uma cobrança, o sistema automaticamente vincula os atendimentos do período onde `CobrarAtendimento = 'SIM'` e que ainda não estão em nenhuma outra cobrança.

### Índices Recomendados
```sql
-- Índices para Cad_Cobranca
CREATE INDEX IX_Cad_Cobranca_EmailEnviado ON Cad_Cobranca(EmailEnviado)
CREATE INDEX IX_Cad_Cobranca_DataHoraFinal ON Cad_Cobranca(DataHoraFinal)
CREATE INDEX IX_Cad_Cobranca_CodCliente ON Cad_Cobranca(CodCliente)

-- Índices para Opr_Atendimento
CREATE INDEX IX_Opr_Atendimento_CodCliente ON Opr_Atendimento(CodCliente)
CREATE INDEX IX_Opr_Atendimento_DataHora ON Opr_Atendimento(DataHoraInicial, DataHoraFinal)
CREATE INDEX IX_Opr_Atendimento_CobrarAtendimento ON Opr_Atendimento(CobrarAtendimento)

-- Índices para Cad_Cobranca_Item
CREATE INDEX IX_Cad_Cobranca_Item_CodCobranca ON Cad_Cobranca_Item(CodCobranca)
CREATE INDEX IX_Cad_Cobranca_Item_CodAtendimento ON Cad_Cobranca_Item(CodAtendimento)
```

## Estrutura do Projeto

O projeto segue arquitetura em camadas com Domain-Driven Design (DDD):

```
src/
├── app/                          # Páginas e rotas (Next.js App Router)
│   ├── (dashboard)/             # Grupo de rotas autenticadas
│   │   ├── cobrancas/           # Página principal (listagem)
│   │   └── nova-cobranca/       # Criação de cobranças
│   │       └── confirmar/       # Confirmação antes de criar
│   ├── api/                     # API Routes (Backend)
│   │   ├── auth/login/          # Autenticação
│   │   ├── clientes/            # CRUD de clientes
│   │   └── cobrancas/           # CRUD e envio de e-mails
│   ├── login/                   # Página de login
│   └── layout.tsx               # Layout raiz
│
├── components/                  # Componentes React
│   ├── ui/                      # Design System (Shadcn/UI)
│   ├── layout/                  # Layout (Header, Brand, AlertBar)
│   ├── cobrancas/              # Componentes de cobranças
│   │   ├── CobrancaTable.tsx   # Tabela principal
│   │   ├── CobrancaDetails.tsx # Modal de detalhes
│   │   ├── Toolbar.tsx         # Filtros e ações
│   │   └── StatusBadge.tsx     # Badge de status
│   └── shared/                  # Componentes compartilhados
│
├── hooks/                       # React Custom Hooks
│   ├── useAuth.ts              # Autenticação (Zustand)
│   └── useCobrancas.ts         # Estado de cobranças
│
├── domain/                      # Camada de Domínio (DDD)
│   ├── entities/               # Entidades de negócio
│   │   ├── Cliente.ts
│   │   ├── Cobranca.ts
│   │   ├── Atendimento.ts
│   │   └── User.ts
│   └── repositories/           # Interfaces de repositórios
│       ├── IClienteRepository.ts
│       ├── ICobrancaRepository.ts
│       └── IAtendimentoRepository.ts
│
├── application/                # Camada de Aplicação
│   ├── use-cases/             # Casos de uso
│   │   ├── CreateCobrancaUseCase.ts
│   │   └── GetCobrancasUseCase.ts
│   └── services/              # Serviços de negócio
│       └── CobrancaService.ts
│
└── infrastructure/            # Camada de Infraestrutura
    ├── database/             # Conexão com banco
    │   ├── sqlServerConnection.ts
    │   └── types.ts
    ├── repositories/         # Implementações SQL
    │   ├── ClienteRepositorySQL.ts
    │   ├── CobrancaRepositorySQL.ts
    │   └── AtendimentoRepositorySQL.ts
    └── services/             # Serviços externos
        ├── EmailService.ts         # SMTP real + Mock
        ├── emailValidator.ts       # Validação de e-mails
        └── emailTemplate.ts        # Templates HTML
```

### Padrões Utilizados

- **DDD (Domain-Driven Design)** - Separação clara entre domínio, aplicação e infraestrutura
- **Repository Pattern** - Abstração de acesso a dados
- **Dependency Injection** - Injeção de dependências via construtores
- **Service Layer** - Lógica de negócio em serviços dedicados

## APIs Disponíveis

### Autenticação
- `POST /api/auth/login` - Realiza login com username/password

### Clientes
- `GET /api/clientes` - Lista todos os clientes
- `GET /api/clientes/[id]` - Busca cliente por ID

**Nota:** Não há CRUD completo de clientes. Os clientes devem ser gerenciados diretamente no banco de dados.

### Cobranças
- `GET /api/cobrancas` - Lista cobranças com filtros (busca, status, período)
- `GET /api/cobrancas/[id]` - Busca cobrança por ID com itens detalhados
- `GET /api/cobrancas/preview` - Preview dos atendimentos antes de criar cobrança
- `POST /api/cobrancas` - Cria nova cobrança vinculando atendimentos do período
- `POST /api/cobrancas/[id]/enviar-email` - Envia e-mail de cobrança via SMTP

**Nota:** Cobranças não podem ser editadas ou removidas após criação. Atendimentos são gerenciados diretamente no banco de dados (`Opr_Atendimento`).

## Envio de E-mails

O sistema possui envio real de e-mails via SMTP com as seguintes características:

### Como Funciona

1. **Configuração SMTP** - Configure as variáveis de ambiente (veja seção Configuração)
2. **Validação de E-mails** - O sistema valida e parse múltiplos e-mails do cliente
3. **Templates HTML** - E-mails são enviados com formatação HTML profissional
4. **Envio Individual ou em Lote** - Envie um ou vários e-mails de uma vez
5. **Barra de Progresso** - Acompanhe o progresso do envio em lote
6. **Cancelamento** - Possibilidade de cancelar envio em lote a qualquer momento

### Formato do E-mail

O e-mail enviado contém:
- Período de cobrança
- Lista detalhada de atendimentos (data, descrição, tempo gasto)
- Total de horas
- Valor do preço/hora
- Valor total da cobrança

### Múltiplos Destinatários

O campo `Email` na tabela `Cad_Cliente` aceita múltiplos formatos:
- `email1@example.com`
- `email1@example.com, email2@example.com`
- `email1@example.com; email2@example.com`

## Logs e Debugging

O sistema possui logs configuráveis. Ajuste no `.env`:

```env
LOG_LEVEL=info          # error, warn, info, debug
LOG_SQL_QUERIES=false   # true para ver queries SQL (apenas dev)
```

Logs de envio de e-mail incluem:
- Cobrança ID e cliente
- E-mails parseados e validados
- MessageID e status de envio
- Accepted/Rejected recipients

## Segurança

- ✅ Queries parametrizadas para prevenir SQL Injection
- ✅ Arquivo `.env` não versionado no Git
- ✅ Pool de conexões para melhor performance
- ✅ Tratamento de erros em todas as camadas
- ✅ Validação de e-mails antes do envio

## Troubleshooting

### Erro ao conectar no banco de dados
- Verifique se o SQL Server está rodando
- Confirme as credenciais no `.env` (DB_SERVER, DB_DATABASE, DB_USER, DB_PASSWORD)
- Teste a conexão: `sqlcmd -S localhost\SQLEXPRESS22 -U sa -P sua_senha`

### Erro ao enviar e-mails
- **"Variáveis SMTP não configuradas"**: Configure SMTP_HOST e SMTP_USER no `.env`
- **"Nenhum email válido encontrado"**: Verifique o campo Email do cliente no banco
- **Erro de autenticação Gmail**: Use uma [senha de app](https://support.google.com/accounts/answer/185833), não a senha normal
- **Timeout SMTP**: Verifique firewall e porta (587 ou 465)

### E-mails não chegam
- Verifique a pasta de **spam/lixo eletrônico**
- Confirme que os e-mails no cadastro do cliente estão corretos
- Veja os logs do console para MessageID e status de envio

### Página em branco após login
- Abra o console do navegador (F12) para ver erros
- Verifique se o backend está rodando (`npm run dev`)
- Confirme que as variáveis de ambiente estão corretas

## Próximos Passos

1. **Melhorias no Sistema de E-mails**
   - Retry automático em caso de falha no envio
   - Queue de e-mails para melhor controle
   - Histórico de e-mails enviados

2. **Funcionalidades Adicionais**
   - Upload de anexos para cobranças
   - Geração de PDF dos atendimentos
   - Edição de cobranças existentes
   - Relatórios customizados (gráficos e exportação)
   - Dashboard com métricas e indicadores
   - Sistema de notificações in-app

3. **Melhorias Técnicas**
   - Implementar autenticação JWT mais robusta
   - Sistema de roles e permissões
   - Testes automatizados (unit + integration)
   - Cache de queries frequentes

## Licença

Propriedade da Empresa Genérica - Todos os direitos reservados.
