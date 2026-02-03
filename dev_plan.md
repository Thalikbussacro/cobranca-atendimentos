# Plano de Desenvolvimento - Migração para SQL Server

## Resumo de Tecnologias

### Tecnologias Já em Uso (Dependências Atuais)
- **Next.js 15.1.6** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript 5.7.3** - Tipagem estática
- **Zustand 5.0.10** - Gerenciamento de estado
- **Shadcn/UI** (Radix UI + Tailwind) - Componentes UI
- **Tailwind CSS 3.4.17** - Framework CSS

### Tecnologias a Serem Adicionadas
- **mssql** - Driver SQL Server para Node.js (deve ser instalado)

### Tecnologias Nativas do Next.js (Já Disponíveis)
- **Variáveis de ambiente** (.env) - Suporte nativo do Next.js
- **API Routes** - Rotas de API do Next.js

### Futuras Implementações
- **SMTP** - Para envio de e-mails (configuração preparada nas variáveis de ambiente)

---

## Fase 1: Configuração Inicial

### 1.1 Instalação de Dependências
**Objetivo**: Instalar o driver SQL Server para Node.js

**Ações**:
```bash
npm install mssql
npm install --save-dev @types/mssql
```

**Arquivos Afetados**:
- `package.json`
- `package-lock.json`

---

### 1.2 Configuração de Variáveis de Ambiente
**Objetivo**: Definir variáveis de ambiente para conexão com banco de dados e futuro SMTP

**Ações**:
1. Criar arquivo `.env.example` com todas as variáveis necessárias
2. Usuário deve copiar para `.env` e preencher com valores reais
3. Adicionar `.env` ao `.gitignore` se ainda não estiver

**Variáveis Necessárias**:
- **Banco de Dados**:
  - `DB_SERVER` - Servidor SQL Server (THALIKPC\SQLEXPRESS22)
  - `DB_DATABASE` - Nome do banco (BancoThalik)
  - `DB_USER` - Usuário SQL (sa)
  - `DB_PASSWORD` - Senha
  - `DB_ENCRYPT` - Configuração de criptografia
  - `DB_TRUST_SERVER_CERTIFICATE` - Confiança no certificado

- **SMTP (Futuro)**:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASSWORD`
  - `SMTP_FROM_EMAIL`
  - `SMTP_FROM_NAME`

**Arquivos Criados**:
- `.env.example` (versionado)
- `.env` (não versionado, usuário cria manualmente)

**Arquivos Verificados**:
- `.gitignore` (garantir que `.env` está listado)

---

## Fase 2: Camada de Banco de Dados

### 2.1 Criação do Database Service
**Objetivo**: Criar serviço centralizado para gerenciar conexões com SQL Server

**Ações**:
1. Criar pasta `src/infrastructure/database/`
2. Criar arquivo `sqlServerConnection.ts` com:
   - Pool de conexões configurável
   - Funções de conexão/desconexão
   - Tratamento de erros
   - Retry logic para conexões
   - Type-safe query functions

**Arquivos Criados**:
- `src/infrastructure/database/sqlServerConnection.ts`

**Responsabilidades do Service**:
- Gerenciar pool de conexões
- Executar queries com parâmetros
- Fazer log de erros de conexão
- Reconexão automática

---

### 2.2 Criação de Tipos do Banco de Dados
**Objetivo**: Mapear tipos do SQL Server para TypeScript

**Ações**:
1. Criar arquivo `src/infrastructure/database/types.ts`
2. Definir interfaces que representam as tabelas:
   - `DbCliente` (Cad_Cliente)
   - `DbCobranca` (Cad_Cobranca)
   - `DbCobrancaItem` (Cad_Cobranca_Item)
   - `DbAtendimento` (Opr_Atendimento)

**Arquivos Criados**:
- `src/infrastructure/database/types.ts`

**Mapeamento**:
- SQL Server `INT` → TypeScript `number`
- SQL Server `VARCHAR/VARCHAR(MAX)` → TypeScript `string`
- SQL Server `DATETIME` → TypeScript `Date`
- SQL Server `MONEY` → TypeScript `number`
- SQL Server `BIT` → TypeScript `boolean`

---

## Fase 3: Implementação de Repositórios Reais

### 3.1 Cliente Repository
**Objetivo**: Implementar `IClienteRepository` com SQL Server

**Ações**:
1. Criar `src/infrastructure/repositories/ClienteRepositorySQL.ts`
2. Implementar todos os métodos da interface `IClienteRepository`:
   - `findAll()` - SELECT de todos os clientes
   - `findById(id)` - SELECT por CodCliente
   - `create(data)` - INSERT novo cliente
   - `update(id, data)` - UPDATE cliente existente
   - `delete(id)` - DELETE cliente

**Queries SQL**:
```sql
-- findAll
SELECT CodCliente as id, Descricao as nome, CNPJ as cnpj,
       Email as email, Telefone as telefone
FROM Cad_Cliente
ORDER BY Descricao

-- findById
SELECT CodCliente as id, Descricao as nome, CNPJ as cnpj,
       Email as email, Telefone as telefone
FROM Cad_Cliente
WHERE CodCliente = @id
```

**Arquivos Criados**:
- `src/infrastructure/repositories/ClienteRepositorySQL.ts`

**Mapeamento Domínio ↔ Banco**:
- `Cliente.id` ↔ `Cad_Cliente.CodCliente`
- `Cliente.nome` ↔ `Cad_Cliente.Descricao`
- `Cliente.cnpj` ↔ `Cad_Cliente.CNPJ`
- `Cliente.email` ↔ `Cad_Cliente.Email` (separado por ;)
- `Cliente.emails` ↔ `Cad_Cliente.Email` (mesmo campo)
- `Cliente.telefone` ↔ `Cad_Cliente.Telefone`

---

### 3.2 Atendimento Repository (Novo)
**Objetivo**: Criar repositório para gerenciar atendimentos (não existia na versão mock)

**Ações**:
1. Criar interface `src/domain/repositories/IAtendimentoRepository.ts`
2. Criar `src/infrastructure/repositories/AtendimentoRepositorySQL.ts`
3. Implementar métodos:
   - `findByClienteAndPeriodo(clienteId, dataInicio, dataFim)` - Buscar atendimentos por cliente e período
   - `findByCobranca(cobrancaId)` - Buscar atendimentos de uma cobrança específica
   - `findNaoCobrados(clienteId?)` - Buscar atendimentos ainda não incluídos em cobranças

**Queries SQL Principais**:
```sql
-- Buscar atendimentos não cobrados de um cliente em um período
SELECT
  a.CodAtendimento,
  a.CodCliente,
  a.DataHoraInicio,
  a.DataHoraFim,
  a.Problema,
  a.Solucao,
  a.Solicitante,
  a.CobrarAtendimento
FROM Opr_Atendimento a
WHERE a.CodCliente = @clienteId
  AND a.DataHoraInicio >= @dataInicio
  AND a.DataHoraFim <= @dataFim
  AND a.CobrarAtendimento = 'Sim'
  AND NOT EXISTS (
    SELECT 1 FROM Cad_Cobranca_Item ci
    WHERE ci.CodAtendimento = a.CodAtendimento
  )
ORDER BY a.DataHoraInicio DESC

-- Buscar atendimentos de uma cobrança
SELECT
  a.CodAtendimento,
  a.CodCliente,
  a.DataHoraInicio,
  a.DataHoraFim,
  a.Problema,
  a.Solucao,
  a.Solicitante
FROM Opr_Atendimento a
INNER JOIN Cad_Cobranca_Item ci ON ci.CodAtendimento = a.CodAtendimento
WHERE ci.CodCobranca = @cobrancaId
ORDER BY a.DataHoraInicio
```

**Arquivos Criados**:
- `src/domain/repositories/IAtendimentoRepository.ts`
- `src/infrastructure/repositories/AtendimentoRepositorySQL.ts`

**Lógica de Negócio**:
- Só incluir atendimentos com `CobrarAtendimento = 'Sim'`
- Calcular duração: `DataHoraFim - DataHoraInicio`
- Formatar para "XXh XXm"

---

### 3.3 Cobrança Repository
**Objetivo**: Implementar `ICobrancaRepository` com SQL Server

**Ações**:
1. Criar `src/infrastructure/repositories/CobrancaRepositorySQL.ts`
2. Implementar métodos complexos com JOINs:
   - `findAll(filters)` - SELECT com filtros (search, status, periodo)
   - `findById(id)` - SELECT com JOIN para buscar atendimentos
   - `create(data)` - INSERT cobrança + INSERT itens (transação)
   - `update(id, data)` - UPDATE cobrança
   - `delete(id)` - DELETE cobrança + itens (transação)
   - `markEmailSent(id)` - UPDATE EmailEnviado = 1

**Queries SQL Principais**:
```sql
-- findAll com agregações
SELECT
  c.CodCobranca as id,
  c.CodCliente as clienteId,
  cl.Descricao as cliente,
  cl.CNPJ as clienteCnpj,
  cl.Email as clienteEmails,
  c.PrecoHora as precoHora,
  c.DataHoraInicial,
  c.DataHoraFinal,
  c.EmailEnviado as emailEnviado,
  COUNT(ci.CodAtendimento) as totalAtendimentos,
  SUM(DATEDIFF(MINUTE, a.DataHoraInicio, a.DataHoraFim)) as totalMinutos
FROM Cad_Cobranca c
INNER JOIN Cad_Cliente cl ON cl.CodCliente = c.CodCliente
LEFT JOIN Cad_Cobranca_Item ci ON ci.CodCobranca = c.CodCobranca
LEFT JOIN Opr_Atendimento a ON a.CodAtendimento = ci.CodAtendimento
WHERE 1=1
  -- Filtros dinâmicos aplicados aqui
GROUP BY
  c.CodCobranca, c.CodCliente, cl.Descricao, cl.CNPJ, cl.Email,
  c.PrecoHora, c.DataHoraInicial, c.DataHoraFinal, c.EmailEnviado
ORDER BY c.DataHoraFinal DESC

-- create (transação)
BEGIN TRANSACTION
  -- Buscar próximo CodCobranca
  DECLARE @novoCodigo INT
  SELECT @novoCodigo = ISNULL(MAX(CodCobranca), 0) + 1 FROM Cad_Cobranca

  -- Inserir cobrança
  INSERT INTO Cad_Cobranca (CodCobranca, CodCliente, PrecoHora, DataHoraInicial, DataHoraFinal, EmailEnviado)
  VALUES (@novoCodigo, @clienteId, @precoHora, @dataInicio, @dataFim, 0)

  -- Inserir itens (atendimentos não cobrados do período)
  INSERT INTO Cad_Cobranca_Item (CodCobranca, CodAtendimento)
  SELECT @novoCodigo, a.CodAtendimento
  FROM Opr_Atendimento a
  WHERE a.CodCliente = @clienteId
    AND a.DataHoraInicio >= @dataInicio
    AND a.DataHoraFim <= @dataFim
    AND a.CobrarAtendimento = 'Sim'
    AND NOT EXISTS (
      SELECT 1 FROM Cad_Cobranca_Item ci2
      WHERE ci2.CodAtendimento = a.CodAtendimento
    )
COMMIT TRANSACTION
```

**Arquivos Criados**:
- `src/infrastructure/repositories/CobrancaRepositorySQL.ts`

**Funções Auxiliares Necessárias**:
- `minutosParaHoras(minutos: number): string` - Converte minutos totais para "XXh XXm"
- `formatarPeriodo(dataInicio: Date, dataFim: Date): string` - Formata como "DD/MM/YYYY - DD/MM/YYYY"
- `mapCobrancaFromDb(row): Cobranca` - Mapeia resultado SQL para entidade domínio

**Lógica de Filtros**:
- **search**: `WHERE cl.Descricao LIKE @search OR cl.CNPJ LIKE @search`
- **status**:
  - `'pendente'`: `c.EmailEnviado = 0`
  - `'enviado'`: `c.EmailEnviado = 1`
- **periodo**: Filtrar por `c.DataHoraFinal` dentro do range calculado

---

## Fase 4: Atualização das API Routes

### 4.1 Atualizar API de Clientes
**Objetivo**: Modificar rotas de API para usar repositório SQL

**Ações**:
1. Modificar `src/app/api/clientes/route.ts`
2. Substituir importação do mock por `ClienteRepositorySQL`
3. Adicionar tratamento de erros SQL
4. Adicionar validações

**Arquivo Modificado**:
- `src/app/api/clientes/route.ts`

**Mudanças**:
```typescript
// Remover
import { ClienteRepositoryMock } from '@/infrastructure/repositories/ClienteRepositoryMock'

// Adicionar
import { ClienteRepositorySQL } from '@/infrastructure/repositories/ClienteRepositorySQL'

// Usar diretamente
const repository = new ClienteRepositorySQL()
```

**Tratamento de Erros**:
- Erro de conexão → 500 Internal Server Error
- Cliente não encontrado → 404 Not Found
- Dados inválidos → 400 Bad Request
- Constraint violation → 409 Conflict

---

### 4.2 Atualizar API de Cobranças
**Objetivo**: Modificar rotas de API para usar repositório SQL

**Ações**:
1. Modificar `src/app/api/cobrancas/route.ts`
2. Modificar `src/app/api/cobrancas/[id]/route.ts`
3. Substituir importação do mock por `CobrancaRepositorySQL`
4. Implementar lógica de criação de cobranças:
   - Buscar atendimentos não cobrados no período
   - Calcular totais
   - Criar cobrança com itens em transação

**Arquivos Modificados**:
- `src/app/api/cobrancas/route.ts`
- `src/app/api/cobrancas/[id]/route.ts`

**Mudanças**:
```typescript
// Remover
import { CobrancaRepositoryMock } from '@/infrastructure/repositories/CobrancaRepositoryMock'

// Adicionar
import { CobrancaRepositorySQL } from '@/infrastructure/repositories/CobrancaRepositorySQL'

// Usar diretamente
const repository = new CobrancaRepositorySQL()
```

**Lógica Especial - POST /api/cobrancas**:
```typescript
// Quando clienteId = 'todos'
// 1. Buscar todos os clientes
// 2. Para cada cliente:
//    a. Buscar atendimentos não cobrados no período
//    b. Se houver atendimentos, criar cobrança
// 3. Retornar array de cobranças criadas

// Quando clienteId = número específico
// 1. Buscar atendimentos não cobrados do cliente no período
// 2. Se não houver atendimentos, retornar erro 400
// 3. Criar cobrança com os atendimentos
// 4. Retornar cobrança criada
```

---

### 4.3 Criar API de Envio de E-mail (Preparação)
**Objetivo**: Criar endpoint para marcar e-mail como enviado (implementação real do SMTP fica para futuro)

**Ações**:
1. Criar `src/app/api/cobrancas/[id]/enviar-email/route.ts`
2. Por enquanto, apenas atualizar flag `EmailEnviado = true`
3. Preparar estrutura para futuro envio SMTP

**Arquivo Criado**:
- `src/app/api/cobrancas/[id]/enviar-email/route.ts`

**Implementação Atual** (Simulada):
```typescript
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const repository = new CobrancaRepositorySQL()
  await repository.markEmailSent(parseInt(params.id))

  // TODO: Implementar envio real via SMTP
  // const emailService = new EmailService()
  // await emailService.enviarCobranca(cobranca)

  return Response.json({ success: true })
}
```

**Preparação para SMTP Futuro**:
- Criar `src/infrastructure/services/EmailService.ts` (stub)
- Definir interface `IEmailService`
- Método `enviarCobranca(cobranca: Cobranca): Promise<void>`

---

## Fase 5: Testes e Validação

### 5.1 Testes de Conexão
**Objetivo**: Garantir que conexão com banco funciona

**Ações**:
1. Criar script de teste de conexão
2. Testar pool de conexões
3. Validar credenciais
4. Testar queries básicas

**Arquivo Criado** (Opcional):
- `src/infrastructure/database/__tests__/connection.test.ts`

**Testes Manuais**:
```bash
# 1. Verificar se .env está configurado
# 2. Iniciar aplicação
npm run dev

# 3. Acessar API de health check (criar endpoint)
curl http://localhost:3000/api/health
```

---

### 5.2 Testes de Repositórios
**Objetivo**: Validar que repositórios funcionam corretamente

**Testes Manuais**:
1. **Clientes**:
   - GET /api/clientes → Deve retornar clientes do banco
   - GET /api/clientes/1 → Deve retornar cliente específico
   - POST /api/clientes → Criar novo cliente
   - PUT /api/clientes/1 → Atualizar cliente
   - DELETE /api/clientes/1 → Deletar cliente

2. **Cobranças**:
   - GET /api/cobrancas → Listar cobranças
   - GET /api/cobrancas?status=pendente → Filtrar por status
   - GET /api/cobrancas?periodo=mes-atual → Filtrar por período
   - POST /api/cobrancas → Criar nova cobrança
   - GET /api/cobrancas/1 → Ver detalhes com atendimentos

3. **Envio de E-mail**:
   - POST /api/cobrancas/1/enviar-email → Marcar como enviado

---

### 5.3 Testes de UI
**Objetivo**: Validar que interface funciona com dados reais

**Fluxo de Teste**:
1. Login → Deve autenticar
2. Dashboard → Deve carregar
3. Página Cobranças:
   - Deve listar cobranças do banco
   - Filtros devem funcionar
   - Expandir linha deve mostrar atendimentos
   - Botão "Enviar E-mail" deve atualizar status
4. Nova Cobrança:
   - Selecionar cliente
   - Escolher período
   - Definir preço/hora
   - Gerar cobrança
   - Verificar no banco se foi criada

---

## Fase 6: Limpeza e Otimizações

### 6.1 Remover Código Mock
**Objetivo**: Deletar completamente os arquivos mock após migração para SQL

**Ações**:
1. Deletar arquivos mock (não serão mais utilizados):
   - `src/infrastructure/data/mock-clientes.ts`
   - `src/infrastructure/data/mock-cobrancas.ts`
   - `src/infrastructure/repositories/ClienteRepositoryMock.ts`
   - `src/infrastructure/repositories/CobrancaRepositoryMock.ts`

2. Remover pasta `src/infrastructure/data/` se estiver vazia

**Arquivos Deletados**:
- Todos os arquivos mock mencionados acima

---

### 6.2 Otimizações de Performance
**Objetivo**: Garantir queries eficientes

**Ações**:
1. **Índices no Banco**:
   - Verificar se há índices em colunas frequentemente filtradas
   - Criar índices se necessário:
     ```sql
     CREATE INDEX IX_Cad_Cobranca_EmailEnviado ON Cad_Cobranca(EmailEnviado)
     CREATE INDEX IX_Cad_Cobranca_DataHoraFinal ON Cad_Cobranca(DataHoraFinal)
     CREATE INDEX IX_Opr_Atendimento_CodCliente ON Opr_Atendimento(CodCliente)
     CREATE INDEX IX_Opr_Atendimento_DataHora ON Opr_Atendimento(DataHoraInicio, DataHoraFim)
     ```

2. **Paginação**:
   - Implementar paginação em `findAll()` se houver muitos registros
   - Usar `OFFSET` e `FETCH NEXT` do SQL Server

3. **Caching**:
   - Considerar cache de clientes (raramente mudam)
   - Cache de cobranças por período

---

### 6.3 Logging e Monitoramento
**Objetivo**: Adicionar logs para debugging e monitoramento

**Ações**:
1. Adicionar logs em:
   - Conexões de banco (sucesso/erro)
   - Queries executadas (em desenvolvimento)
   - Erros de API
   - Transações (início/commit/rollback)

2. Criar arquivo de log ou usar console com níveis:
   - `ERROR`: Erros críticos
   - `WARN`: Avisos
   - `INFO`: Informações gerais
   - `DEBUG`: Debugging (apenas em dev)

---

## Fase 7: Documentação

### 7.1 Documentar API
**Objetivo**: Documentar endpoints disponíveis

**Ações**:
1. Criar arquivo `API.md` com:
   - Lista de endpoints
   - Parâmetros
   - Exemplos de request/response
   - Códigos de erro

---

### 7.2 Documentar Setup
**Objetivo**: Documentar processo de setup para novos desenvolvedores

**Ações**:
1. Atualizar `README.md` com:
   - Requisitos (SQL Server, Node.js)
   - Passos de instalação
   - Configuração do `.env`
   - Como rodar o projeto
   - Como rodar scripts SQL de setup

---

## Checklist Final de Implementação

- [ ] **Fase 1**: Instalar dependências e configurar .env
- [ ] **Fase 2**: Criar database service e tipos
- [ ] **Fase 3**: Implementar repositórios SQL
  - [ ] ClienteRepositorySQL
  - [ ] AtendimentoRepositorySQL (novo)
  - [ ] CobrancaRepositorySQL
- [ ] **Fase 4**: Atualizar API routes
  - [ ] /api/clientes
  - [ ] /api/cobrancas
  - [ ] /api/cobrancas/[id]/enviar-email
- [ ] **Fase 5**: Testes e validação
  - [ ] Teste de conexão
  - [ ] Testes de API
  - [ ] Testes de UI
- [ ] **Fase 6**: Limpeza e otimizações
  - [ ] Deletar arquivos mock
  - [ ] Criar índices
  - [ ] Adicionar logs
- [ ] **Fase 7**: Documentação
  - [ ] API.md
  - [ ] README.md atualizado

---

## Notas Importantes

### Transações
Usar transações SQL Server para operações que envolvem múltiplas tabelas:
- Criação de cobrança (Cad_Cobranca + Cad_Cobranca_Item)
- Exclusão de cobrança (remover itens primeiro)

### Tratamento de Erros SQL Server
Erros comuns e como tratá-los:
- **Connection timeout**: Aumentar timeout ou verificar conexão de rede
- **Invalid credentials**: Verificar usuário/senha no .env
- **Constraint violation**: Retornar erro 409 com mensagem clara
- **Deadlock**: Implementar retry logic

### Segurança
- **SQL Injection**: SEMPRE usar parameterized queries
- **Senhas**: Nunca versionar `.env`
- **Conexão**: Usar `encrypt: true` em produção

### Performance
- Usar `connection pooling` (configurado no sqlServerConnection.ts)
- Evitar `SELECT *`, sempre especificar colunas
- Usar índices em colunas de filtro/join
- Considerar paginação para listas grandes

---

## Ordem Recomendada de Implementação

1. **Fase 1** → Configuração e setup (crítico)
2. **Fase 2** → Database layer (base para tudo)
3. **Fase 3.1** → ClienteRepository (mais simples, para testar conexão)
4. **Fase 4.1** → API Clientes (validar que está funcionando)
5. **Teste** → Validar clientes pela UI
6. **Fase 3.2** → AtendimentoRepository
7. **Fase 3.3** → CobrancaRepository (mais complexo)
8. **Fase 4.2** → API Cobranças
9. **Teste** → Validar cobranças pela UI
10. **Fase 4.3** → API Envio de E-mail
11. **Fases 5-7** → Testes, limpeza, otimizações e documentação

---

## Estimativa de Complexidade por Fase

| Fase | Complexidade | Tempo Estimado |
|------|--------------|----------------|
| Fase 1 | Baixa | 30min |
| Fase 2 | Média | 1-2h |
| Fase 3.1 | Média | 1-2h |
| Fase 3.2 | Média | 2-3h |
| Fase 3.3 | Alta | 3-4h |
| Fase 4 | Média | 2-3h |
| Fase 5 | Média | 2-3h |
| Fase 6 | Baixa | 1-2h |
| Fase 7 | Baixa | 1-2h |

**Total Estimado**: 12-19 horas de desenvolvimento

---

## Próximos Passos

Após revisar este plano:
1. Confirmar tecnologias e abordagem
2. Adicionar/remover fases conforme necessário
3. Começar implementação pela **Fase 1**
