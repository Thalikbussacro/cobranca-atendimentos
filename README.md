# Sistema de Cobrança de Atendimentos

Sistema para gestão e cobrança de atendimentos técnicos da SO Automação.

Desenvolvido com Next.js 15, TypeScript, HeroUI e Clean Architecture.

## Stack Tecnológico

- Next.js 15 (App Router)
- TypeScript 5.7
- HeroUI (Sistema de componentes)
- Tailwind CSS
- Zustand (Estado global)
- Lucide React (Ícones)

## Funcionalidades

### Painel Administrativo

- Autenticação com controle de acesso
- Dashboard com KPIs (Em aberto, Aguardando NF, Enviadas, Pagas)
- Listagem de cobranças com busca e filtros
- Detalhamento de atendimentos por cobrança
- Ações: Editar, Gerar PDF, Anexar NF, Enviar, Marcar como pago
- Chat interno entre operador e atendente
- Formulário de nova cobrança com seleção de clientes
- Relatórios customizados
- Visualização como cliente

### Portal do Cliente

- Login dedicado para clientes
- Visualização das cobranças do cliente
- Download de documentos (NF e relatórios)
- Comunicação com suporte
- Interface simplificada e objetiva

## Design

### Identidade Visual SO Automação

- Cor primária: `#007BBE`
- Cor secundária: `#005E92`
- Design flat (sem sombras)
- Bordas: 1px sólidas
- Raio de borda: 8-12px
- Tipografia: System fonts

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

O sistema estará disponível em [http://localhost:3000](http://localhost:3000)

## Credenciais de Teste

**Administrador:**
- Usuário: `admin`
- Senha: qualquer

**Cliente:**
- Usuário: `cliente1`
- Senha: qualquer

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas e rotas (App Router)
│   ├── (dashboard)/       # Grupo de rotas autenticadas
│   │   ├── cobrancas/     # Página principal
│   │   ├── nova-cobranca/ # Criação de cobranças
│   │   └── relatorios/    # Relatórios
│   ├── api/               # API Routes (Backend mock)
│   ├── login/             # Página de login
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Button, Badge, Modal...)
│   ├── layout/           # Layout (Sidebar, Header, Brand)
│   ├── cobrancas/        # Componentes específicos de cobranças
│   ├── modals/           # Modais (Chat, Versão, Ação)
│   └── shared/           # Componentes compartilhados
├── hooks/                # Custom hooks
│   ├── useAuth.ts        # Hook de autenticação
│   ├── useCobrancas.ts   # Hook de cobranças
│   └── useToast.ts       # Hook de notificações
├── lib/                  # Utilitários
│   ├── mock-data.ts      # Dados mockados
│   └── utils.ts          # Funções auxiliares
├── types/                # Tipos TypeScript
│   ├── cobranca.ts       # Tipos de cobrança
│   ├── user.ts           # Tipos de usuário
│   └── chat.ts           # Tipos de chat
└── constants/            # Constantes
    └── status.ts         # Labels de status
```

## 🔄 Fluxo de Dados

### Estado Local (MVP)
- **Autenticação**: Zustand + localStorage
- **Cobranças**: React hooks + API Routes mock
- **Chat**: Estado local por modal

### API Routes Mock
- `/api/auth/login` - Autenticação
- `/api/cobrancas` - CRUD de cobranças
- `/api/cobrancas/[id]` - Detalhes de uma cobrança
- `/api/chat` - Mensagens do chat interno

## 🚧 Próximos Passos

### Integração com Backend Real

1. **Banco de Dados**
   - Conectar com SQL Server legado
   - Criar queries para buscar atendimentos
   - Implementar transações para vincular atendimentos às cobranças

2. **Autenticação Real**
   - Implementar JWT
   - Middleware de autenticação
   - Refresh tokens

3. **Funcionalidades**
   - Upload de arquivos (PDF de NF)
   - Geração automática de PDF de atendimentos
   - Envio automático de e-mails
   - WebSocket para chat em tempo real
   - Notificações push

4. **Deploy**
   - Configurar CI/CD
   - Deploy na Vercel ou servidor próprio
   - Variáveis de ambiente
   - Monitoring e logs

## 📝 Notas Técnicas

### Por que Next.js App Router?
- SSR e SSG nativos
- Roteamento baseado em arquivos
- API Routes integradas
- Otimizações automáticas

### Por que Zustand?
- Leve e simples
- Sem boilerplate
- Persistência fácil com middleware
- TypeScript first-class

### Por que Tailwind CSS?
- Desenvolvimento rápido
- Design system consistente
- Bundle size otimizado
- Fácil customização

## 🤝 Contribuindo

Este é um projeto interno da SO Automação. Para contribuir:

1. Crie uma branch a partir de `main`
2. Faça suas alterações
3. Teste localmente
4. Abra um Pull Request

## 📄 Licença

Propriedade da SO Automação - Todos os direitos reservados.

## 📞 Contato

Para dúvidas sobre o sistema, entre em contato com a equipe de desenvolvimento da SO Automação.