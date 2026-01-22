# Guia de Deploy - Sistema de Cobrança de Atendimentos

## 🚀 Deploy em Produção

### Opção 1: Vercel (Recomendado)

A Vercel é a plataforma oficial do Next.js e oferece deploy gratuito para projetos.

#### Passo a Passo:

1. **Criar conta na Vercel**
   - Acesse https://vercel.com
   - Faça login com GitHub

2. **Importar projeto**
   ```bash
   # Via CLI (instalar primeiro)
   npm i -g vercel
   vercel login
   vercel
   ```

   Ou pelo dashboard:
   - New Project → Import Git Repository
   - Selecione o repositório `Cobranca-atendimentos`

3. **Configurar variáveis de ambiente**
   
   No dashboard da Vercel, adicione:
   ```
   NEXT_PUBLIC_API_URL=https://seu-dominio.vercel.app
   ```

4. **Deploy automático**
   - Cada push na branch `main` faz deploy automático
   - Branches de desenvolvimento geram preview URLs

#### Domínio Customizado

```bash
# Via CLI
vercel domains add seu-dominio.com.br

# Ou no dashboard: Settings → Domains
```

### Opção 2: Docker + VPS

Para deploy em servidor próprio (Digital Ocean, AWS EC2, etc):

#### 1. Criar Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Dependências
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://seu-dominio.com.br
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

#### 3. Configuração Nginx

```nginx
# nginx.conf
events {
  worker_connections 1024;
}

http {
  upstream nextjs {
    server app:3000;
  }

  server {
    listen 80;
    server_name seu-dominio.com.br;

    location / {
      return 301 https://$server_name$request_uri;
    }
  }

  server {
    listen 443 ssl http2;
    server_name seu-dominio.com.br;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
      proxy_pass http://nextjs;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }
  }
}
```

#### 4. Deploy

```bash
# Build e iniciar
docker-compose up -d --build

# Ver logs
docker-compose logs -f app

# Parar
docker-compose down
```

### Opção 3: Netlify

Similar à Vercel, com algumas diferenças:

1. Conecte seu repositório GitHub
2. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Deploy automático em cada commit

### Opção 4: AWS Amplify

Para empresas que já usam AWS:

1. Acesse AWS Amplify Console
2. Conecte o repositório
3. Configure variáveis de ambiente
4. Deploy automático

## 🔐 Variáveis de Ambiente

### Desenvolvimento (`.env.local`)

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Database (quando integrar)
DB_SERVER=localhost
DB_NAME=SO_Atendimentos
DB_USER=sa
DB_PASSWORD=sua_senha_aqui

# Auth (quando implementar)
NEXTAUTH_SECRET=gere_uma_chave_segura_aqui
NEXTAUTH_URL=http://localhost:3000

# Email (quando implementar)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_app

# Upload
UPLOAD_DIR=/var/uploads
MAX_FILE_SIZE=10485760

# Sentry (opcional)
NEXT_PUBLIC_SENTRY_DSN=sua_dsn_aqui
```

### Produção

Configure as mesmas variáveis no painel da plataforma escolhida, com valores de produção.

## 📊 Monitoramento

### Vercel Analytics

Já incluso gratuitamente:
- Web Vitals
- Tempo de carregamento
- Origem de tráfego

### Adicionar Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Google Analytics

```typescript
// src/app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## 🔄 CI/CD

### GitHub Actions (exemplo completo)

```yaml
# .github/workflows/main.yml
name: Deploy

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Test
        run: npm test
        
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 🗄️ Backup

### Backup Automático (se usar VPS)

```bash
# Script de backup
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup banco de dados
pg_dump -U usuario -d database > $BACKUP_DIR/db_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/uploads

# Manter apenas últimos 30 dias
find $BACKUP_DIR -mtime +30 -delete

# Enviar para S3 (opcional)
aws s3 cp $BACKUP_DIR s3://bucket-backups/ --recursive
```

```bash
# Adicionar ao cron
crontab -e

# Backup diário às 3h da manhã
0 3 * * * /path/to/backup.sh
```

## 📈 Performance

### Otimizações Aplicadas

✅ **Image Optimization**: Next.js otimiza imagens automaticamente
✅ **Code Splitting**: Chunks automáticos por rota
✅ **Tree Shaking**: Remove código não utilizado
✅ **Compression**: Gzip/Brotli no build

### Melhorias Futuras

- [ ] CDN para assets estáticos
- [ ] Redis para cache de API
- [ ] Service Worker para offline
- [ ] Lazy loading de componentes pesados

## 🔒 Segurança em Produção

### Checklist Pré-Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Secrets não commitados no Git
- [ ] HTTPS configurado
- [ ] CORS configurado corretamente
- [ ] Rate limiting implementado
- [ ] Headers de segurança configurados
- [ ] Validação de inputs em todas as rotas
- [ ] SQL injection protection (prepared statements)
- [ ] XSS protection habilitado

### Headers de Segurança

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

## 📞 Suporte Pós-Deploy

### Logs

```bash
# Vercel
vercel logs [deployment-url]

# Docker
docker-compose logs -f app

# PM2 (Node.js)
pm2 logs
```

### Rollback

```bash
# Vercel
vercel rollback [deployment-url]

# Docker
docker-compose down
git checkout [commit-anterior]
docker-compose up -d --build
```

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] Testes passando localmente
- [ ] Build de produção sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] SSL/HTTPS configurado
- [ ] Domínio apontando corretamente
- [ ] Monitoramento ativo (Sentry, Analytics)
- [ ] Backup configurado
- [ ] Documentação atualizada
- [ ] Credenciais de acesso documentadas
- [ ] Time treinado no uso do sistema

## 🎯 Próximos Passos

Após deploy inicial:

1. Monitorar logs por 24-48h
2. Coletar feedback dos usuários
3. Ajustar performance conforme necessário
4. Planejar próximas features (ver MELHORIAS.MD)

---

**Equipe SO Automação**
