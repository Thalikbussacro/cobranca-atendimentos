# Arquitetura do Sistema

## Clean Architecture + MVC

Este projeto segue princípios de Clean Architecture e MVC, organizando o código em camadas com responsabilidades bem definidas.

## Estrutura de Camadas

```
src/
├── domain/                    # Camada de Domínio (Entidades e Regras de Negócio)
│   ├── entities/             # Entidades do domínio
│   │   ├── Cliente.ts
│   │   ├── Cobranca.ts
│   │   └── User.ts
│   └── repositories/         # Interfaces dos repositórios (abstrações)
│       ├── ICobrancaRepository.ts
│       └── IAuthRepository.ts
│
├── application/              # Camada de Aplicação (Casos de Uso)
│   ├── use-cases/           # Casos de uso (orquestra regras de negócio)
│   │   ├── CreateCobrancaUseCase.ts
│   │   └── GetCobrancasUseCase.ts
│   └── services/            # Serviços de aplicação
│       └── CobrancaService.ts
│
├── infrastructure/           # Camada de Infraestrutura (Implementações)
│   ├── repositories/        # Implementações dos repositórios
│   │   └── CobrancaRepositoryMock.ts
│   └── data/                # Dados mockados (temporário)
│       ├── mock-cobrancas.ts
│       └── mock-clientes.ts
│
├── presentation/            # Camada de Apresentação (UI/Views)
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes base (wrappers HeroUI)
│   │   ├── layout/         # Componentes de layout
│   │   ├── cobrancas/      # Componentes de domínio
│   │   ├── modals/         # Modais
│   │   └── shared/         # Componentes compartilhados
│   ├── hooks/              # React hooks (Controllers)
│   │   ├── useAuth.ts
│   │   └── useCobrancas.ts
│   └── constants/          # Constantes da UI
│       └── status.ts
│
└── app/                     # Next.js App Router (Rotas)
    ├── (dashboard)/        # Rotas administrativas
    ├── (cliente)/          # Rotas do cliente
    ├── api/                # API Routes (Controllers REST)
    └── login/              # Autenticação
```

## Princípios Aplicados

### 1. Separação de Responsabilidades (SRP)

Cada classe/módulo tem uma única responsabilidade:

- **Entities**: Definem a estrutura dos dados
- **Use Cases**: Implementam regras de negócio
- **Repositories**: Abstraem acesso aos dados
- **Components**: Apresentam informação ao usuário
- **Hooks**: Gerenciam estado e comunicação com backend

### 2. Inversão de Dependência (DIP)

As camadas superiores não dependem das inferiores diretamente:

```typescript
// Errado (acoplamento direto)
import { cobrancasMock } from '@/lib/mock-data'

// Correto (dependência de abstração)
import { ICobrancaRepository } from '@/domain/repositories/ICobrancaRepository'
```

### 3. Open/Closed Principle (OCP)

Fácil extensão sem modificação:

```typescript
// Trocar implementação mock por real sem mudar use cases
const repository = new CobrancaRepositorySQL()  // ao invés de Mock
const useCase = new GetCobrancasUseCase(repository)
```

### 4. Clean Code

- Nomes descritivos e significativos
- Funções pequenas e focadas
- Comentários apenas quando necessário
- DRY (Don't Repeat Yourself)
- YAGNI (You Aren't Gonna Need It)

## Fluxo de Dados

### Request Flow (User → Backend)

```
User Interaction (UI)
    ↓
React Hook (Controller)
    ↓
Use Case (Application)
    ↓
Repository Interface (Domain)
    ↓
Repository Implementation (Infrastructure)
    ↓
Data Source (Mock/Database)
```

### Response Flow (Backend → User)

```
Data Source (Mock/Database)
    ↓
Repository Implementation (Infrastructure)
    ↓
Use Case (Application)
    ↓
React Hook (Controller)
    ↓
Component (View)
    ↓
User sees data
```

## Exemplo Prático

### Criar uma Cobrança

**1. Usuário clica no botão "Gerar cobrança"**

```tsx
// src/app/(dashboard)/nova-cobranca/page.tsx
const handleSubmit = async () => {
  await createCobranca(formData)
}
```

**2. Hook chama o serviço**

```typescript
// src/hooks/useCobrancas.ts (será refatorado)
const createCobranca = async (data) => {
  const response = await fetch('/api/cobrancas', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
```

**3. API Route recebe a requisição**

```typescript
// src/app/api/cobrancas/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = await cobrancaService.createCobranca.execute(body)
  return NextResponse.json(result)
}
```

**4. Use Case processa regras de negócio**

```typescript
// src/application/use-cases/CreateCobrancaUseCase.ts
async execute(data: CreateCobrancaDTO) {
  // Validações
  if (!data.cliente) throw new Error('Cliente obrigatório')
  
  // Criar via repository
  return await this.cobrancaRepository.create(data)
}
```

**5. Repository salva os dados**

```typescript
// src/infrastructure/repositories/CobrancaRepositoryMock.ts
async create(data: CreateCobrancaDTO): Promise<Cobranca> {
  const newCobranca = { ...data, id: generateId() }
  this.cobrancas.push(newCobranca)
  return newCobranca
}
```

## Benefícios desta Arquitetura

### 1. Testabilidade
- Use cases podem ser testados isoladamente
- Mocks podem ser injetados facilmente
- Componentes podem usar dados mockados

### 2. Manutenibilidade
- Código organizado e previsível
- Fácil encontrar onde fazer alterações
- Baixo acoplamento entre camadas

### 3. Escalabilidade
- Adicionar novos features é simples
- Trocar implementações é fácil
- Times podem trabalhar em paralelo

### 4. Migração Facilitada

**Do Mock para Produção:**

```typescript
// Antes (Mock)
const repository = new CobrancaRepositoryMock()

// Depois (SQL Server)
const repository = new CobrancaRepositorySQLServer(connectionString)

// Use cases permanecem os mesmos!
```

## Próximos Passos na Arquitetura

### 1. Refatorar Hooks

Mover lógica de negócio dos hooks para use cases:

```typescript
// Antes (lógica no hook)
const [data, setData] = useState([])
useEffect(() => {
  fetch('/api/data').then(r => r.json()).then(setData)
}, [])

// Depois (hook limpo, lógica no use case)
const { data, loading } = useCobrancasViewModel()
```

### 2. Implementar ViewModels

Camada entre hooks e componentes:

```typescript
// src/presentation/view-models/CobrancasViewModel.ts
export class CobrancasViewModel {
  constructor(
    private getCobrancasUseCase: GetCobrancasUseCase
  ) {}

  async load(filters) {
    return await this.getCobrancasUseCase.execute(filters)
  }
}
```

### 3. Adicionar Validators

```typescript
// src/domain/validators/CobrancaValidator.ts
export class CobrancaValidator {
  validate(data: CreateCobrancaDTO): ValidationResult {
    const errors: string[] = []
    
    if (!data.cliente) errors.push('Cliente é obrigatório')
    if (!data.dataInicial) errors.push('Data inicial é obrigatória')
    
    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
```

### 4. Implementar Error Handling

```typescript
// src/domain/errors/DomainError.ts
export class ValidationError extends Error {
  constructor(message: string, public fields: Record<string, string>) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(entity: string, id: number) {
    super(`${entity} with id ${id} not found`)
    this.name = 'NotFoundError'
  }
}
```

## Design Patterns Utilizados

### 1. Repository Pattern
Abstração do acesso aos dados

### 2. Use Case Pattern
Encapsula lógica de negócio

### 3. Dependency Injection
Inversão de controle e baixo acoplamento

### 4. Factory Pattern (futuro)
Para criação de instâncias complexas

### 5. Observer Pattern
React hooks e estado reativo

## Convenções de Código

### Nomenclatura

- **PascalCase**: Classes, Interfaces, Types, Components
- **camelCase**: Funções, variáveis, métodos
- **UPPER_SNAKE_CASE**: Constantes
- **kebab-case**: Nomes de arquivos de página

### Organização de Imports

```typescript
// 1. Bibliotecas externas
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. Domínio
import { Cobranca } from '@/domain/entities/Cobranca'

// 3. Application
import { GetCobrancasUseCase } from '@/application/use-cases/GetCobrancasUseCase'

// 4. Infrastructure
import { CobrancaRepository } from '@/infrastructure/repositories/CobrancaRepository'

// 5. Presentation
import { Button } from '@/components/ui/Button'

// 6. Utilities
import { formatDate } from '@/lib/utils'

// 7. Locais
import { LocalComponent } from './LocalComponent'
```

### Estrutura de Arquivos

```
NomeDoModulo/
├── index.ts              # Public API do módulo
├── NomeDoModulo.ts       # Implementação principal
├── NomeDoModulo.test.ts  # Testes
└── types.ts              # Types locais (se necessário)
```

## Anti-Patterns Evitados

❌ **God Components**: Componentes com muita responsabilidade
❌ **Prop Drilling**: Passar props por muitos níveis
❌ **Business Logic in UI**: Lógica de negócio em componentes
❌ **Tight Coupling**: Acoplamento forte entre módulos
❌ **Magic Numbers**: Valores hardcoded sem constantes
❌ **Comments as Crutches**: Comentários explicando código ruim

## Code Review Checklist

- [ ] Código segue princípios SOLID
- [ ] Sem código duplicado
- [ ] Nomes descritivos e claros
- [ ] Funções pequenas (< 50 linhas)
- [ ] Tipos TypeScript corretos
- [ ] Sem any ou @ts-ignore
- [ ] Tratamento de erros adequado
- [ ] Testes passando (quando implementados)
- [ ] Sem console.log em produção
- [ ] Performance otimizada
