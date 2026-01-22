# Quick Start

## Executar o Projeto

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Executar produção
npm start
```

## Acessar o Sistema

Abra o navegador em: http://localhost:3000

## Credenciais

### Administrador
- **Usuário:** `admin`
- **Senha:** qualquer
- **Acesso:** Dashboard completo com todas as funcionalidades

### Cliente
- **Usuário:** `cliente1`
- **Senha:** qualquer
- **Acesso:** Portal do cliente (visualização simplificada)

## Fluxo de Teste

### Como Administrador

1. Faça login com `admin` / qualquer senha
2. Visualize o dashboard com KPIs
3. Navegue pelas cobranças
4. Clique em "Detalhes" para expandir uma cobrança
5. Teste "Falar com atendente" para abrir o chat
6. Acesse "Nova Cobrança" no menu lateral
7. Preencha o formulário (ou use "Preencher exemplo")
8. Clique em "Visualizar como Cliente" no header
9. Veja como seus clientes visualizam o sistema
10. Clique em "Voltar ao Admin" para retornar

### Como Cliente

1. Faça login com `cliente1` / qualquer senha
2. Visualize suas cobranças
3. Expanda detalhes de uma cobrança
4. Teste os botões de download e suporte

## Estrutura de Navegação

### Admin
- `/cobrancas` - Lista de cobranças
- `/nova-cobranca` - Criar cobrança
- `/relatorios` - Relatórios

### Cliente
- `/portal` - Portal do cliente

## Dados Mockados

O sistema contém 6 cobranças simuladas:

1. Cooperativa Alfa - Em aberto
2. AgroFábrica Delta - Aguardando NF
3. Indústria Soja Brasil - Enviada
4. Fazenda Horizonte - Paga
5. Cooperativa Alfa - Contestada
6. AgroFábrica Delta - Cancelada

5 clientes mockados disponíveis para seleção em "Nova Cobrança".

## Recursos Principais

- Busca em tempo real
- Filtro por status
- Accordion expansível
- Chat interno
- Modais informativos
- Design responsivo
- Persistência de sessão

## Troubleshooting

### Porta já em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Ou use outra porta
npm run dev -- -p 3001
```

### Limpar cache
```bash
rm -rf .next
npm run build
```

### Reinstalar dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

## Arquivos Importantes

- `ARCHITECTURE.md` - Documentação da arquitetura
- `DEPLOY.md` - Guia de deploy
- `MELHORIAS.MD` - Roadmap para produção
- `CHANGELOG.md` - Histórico de alterações

---

**Pronto para uso e demonstração!**
