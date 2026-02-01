# Troubleshooting - Conexão SQL Server

## Problema Atual
```
Failed to connect to THALIKPC\SQLEXPRESS22 in 15000ms
Code: ETIMEOUT
```

O Node.js não consegue conectar ao SQL Server, embora o SSMS funcione localmente.

## Soluções (em ordem de prioridade)

### ✅ Solução 1: Habilitar SQL Server Browser e TCP/IP

#### Passo 1: Verificar e Iniciar o SQL Server Browser Service

1. Pressione `Win + R` e digite: `services.msc`
2. Procure por **SQL Server Browser**
3. Clique com botão direito → **Propriedades**
4. Configure:
   - **Tipo de inicialização**: Automático
   - **Status**: Iniciado
5. Clique em **Aplicar** e **OK**

#### Passo 2: Habilitar TCP/IP no SQL Server Configuration Manager

1. Pressione `Win + R` e digite: `SQLServerManager15.msc` (ou o número da sua versão)
   - SQL Server 2019: `SQLServerManager15.msc`
   - SQL Server 2022: `SQLServerManager16.msc`
2. Expanda **SQL Server Network Configuration**
3. Clique em **Protocols for SQLEXPRESS22**
4. Clique com botão direito em **TCP/IP** → **Habilitar**
5. Clique com botão direito em **TCP/IP** → **Propriedades**
6. Vá na aba **IP Addresses**
7. Role até **IPALL**:
   - **TCP Dynamic Ports**: deixe em branco
   - **TCP Port**: digite `1433`
8. Clique **OK**
9. **Reinicie o serviço SQL Server (SQLEXPRESS22)**:
   - Em **SQL Server Services**
   - Clique com botão direito em **SQL Server (SQLEXPRESS22)** → **Restart**

#### Passo 3: Configurar Firewall do Windows

Execute no PowerShell como Administrador:

```powershell
# Adicionar regra para porta 1433
New-NetFirewallRule -DisplayName "SQL Server" -Direction Inbound -Protocol TCP -LocalPort 1433 -Action Allow

# Adicionar regra para SQL Server Browser (porta 1434 UDP)
New-NetFirewallRule -DisplayName "SQL Server Browser" -Direction Inbound -Protocol UDP -LocalPort 1434 -Action Allow
```

#### Passo 4: Verificar Autenticação do SQL Server

1. Abra SSMS
2. Conecte ao servidor
3. Clique com botão direito no servidor → **Propriedades**
4. Vá em **Security**
5. Certifique-se que **SQL Server and Windows Authentication mode** está selecionado
6. Clique **OK**
7. **Reinicie o serviço SQL Server**

---

### ✅ Solução 2: Usar Porta Dinâmica (se Solução 1 não funcionar)

Se não conseguir configurar porta estática, descubra a porta dinâmica:

1. No SQL Server Configuration Manager:
2. **Protocols for SQLEXPRESS22** → **TCP/IP** → **Propriedades**
3. Vá na aba **IP Addresses** → **IPALL**
4. Anote o número em **TCP Dynamic Ports** (ex: 49152)

Atualize seu `.env.local`:
```env
DB_SERVER=THALIKPC\SQLEXPRESS22
DB_PORT=49152
```

---

### ✅ Solução 3: Usar Named Pipes (alternativa ao TCP/IP)

Se TCP/IP continuar com problemas, use Named Pipes:

**No `.env.local`:**
```env
DB_SERVER=np:\\.\pipe\MSSQL$SQLEXPRESS22\sql\query
# Remova ou comente DB_PORT
# DB_PORT=1433
```

---

### ✅ Solução 4: Testar Conexão com Script

Crie um arquivo de teste `test-connection.js` na raiz do projeto:

```javascript
const sql = require('mssql')

const config = {
  server: 'THALIKPC\\SQLEXPRESS22',
  database: 'BancoThalik',
  user: 'sa',
  password: 'sua_senha_aqui',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  }
}

async function test() {
  try {
    console.log('Tentando conectar...')
    console.log('Configuração:', JSON.stringify(config, null, 2))

    const pool = await sql.connect(config)
    console.log('✅ Conexão bem-sucedida!')

    const result = await pool.request().query('SELECT @@VERSION as version')
    console.log('Versão do SQL Server:', result.recordset[0].version)

    await pool.close()
  } catch (err) {
    console.error('❌ Erro ao conectar:', err)
  }
}

test()
```

Execute:
```bash
node test-connection.js
```

---

## Checklist de Diagnóstico

- [ ] SQL Server Browser Service está rodando?
- [ ] TCP/IP está habilitado no SQL Server Configuration Manager?
- [ ] Porta 1433 está configurada (ou anotou a porta dinâmica)?
- [ ] Firewall permite conexões nas portas 1433 (TCP) e 1434 (UDP)?
- [ ] SQL Server está em modo de autenticação mista?
- [ ] Usuário 'sa' está habilitado e senha está correta?
- [ ] Serviço SQL Server foi reiniciado após mudanças?

---

## Comandos Úteis

### Verificar se SQL Server está escutando na porta
```powershell
netstat -an | findstr "1433"
```

### Verificar serviços SQL Server
```powershell
Get-Service | Where-Object {$_.Name -like "*SQL*"}
```

### Testar conectividade com telnet
```powershell
# Habilitar telnet client (se necessário)
dism /online /Enable-Feature /FeatureName:TelnetClient

# Testar conexão
telnet THALIKPC 1433
```

---

## Configuração Recomendada para `.env.local`

```env
# Opção 1: Porta estática (após configurar)
DB_SERVER=THALIKPC\SQLEXPRESS22
DB_DATABASE=BancoThalik
DB_USER=sa
DB_PASSWORD=sua_senha_aqui
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
DB_CONNECTION_TIMEOUT=30000
DB_REQUEST_TIMEOUT=30000

# Opção 2: Sem porta (usa SQL Server Browser)
DB_SERVER=THALIKPC\SQLEXPRESS22
DB_DATABASE=BancoThalik
DB_USER=sa
DB_PASSWORD=sua_senha_aqui
# DB_PORT=  # Comentar ou remover
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
DB_CONNECTION_TIMEOUT=30000
DB_REQUEST_TIMEOUT=30000

# Opção 3: localhost com porta
DB_SERVER=localhost
DB_DATABASE=BancoThalik
DB_USER=sa
DB_PASSWORD=sua_senha_aqui
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
DB_CONNECTION_TIMEOUT=30000
DB_REQUEST_TIMEOUT=30000
```

---

## Ainda com problemas?

Se nenhuma solução acima funcionar:

1. Verifique se o SQL Server aceita conexões remotas:
   - SSMS → Propriedades do Servidor → Connections
   - Marque "Allow remote connections to this server"

2. Verifique se há antivírus bloqueando

3. Tente usar `127.0.0.1` ou `localhost` ao invés do nome do computador

4. Verifique os logs do SQL Server em:
   ```
   C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS22\MSSQL\Log\ERRORLOG
   ```
