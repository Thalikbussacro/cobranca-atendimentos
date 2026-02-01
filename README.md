# Sistema de Cobrança de Atendimentos

Sistema simplificado para gestão e envio de cobranças de atendimentos técnicos da SO Automação.

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

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Rodar em modo desenvolvimento
npm run dev
```

O sistema estará disponível em [http://localhost:3000](http://localhost:3000)

## Configuração

Edite o arquivo `.env` para configurar as credenciais de login:

```env
AUTH_USERNAME=admin
AUTH_PASSWORD=admin123
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
├── application/          # Casos de uso e serviços
└── infrastructure/       # Repositórios e dados mock
```

## Dados Mock

O sistema utiliza dados mockados para desenvolvimento. Os dados incluem:
- 5 clientes fictícios
- 9 cobranças de exemplo
- Status variados (e-mail enviado/não enviado)

## Próximos Passos

1. **Integração com Backend Real**
   - Conectar com banco de dados
   - Implementar API real de envio de e-mails

2. **Funcionalidades Adicionais**
   - Upload de documentos
   - Geração de PDF de atendimentos
   - Relatórios customizados

## Licença

Propriedade da SO Automação - Todos os direitos reservados.
