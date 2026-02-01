/**
 * Script Simples de Diagnóstico SQL Server
 * Execute: node test-sql-simple.js
 */

const sql = require('mssql')

// CONFIGURE AQUI - Use suas credenciais do .env.local
const CONFIGS = [
  {
    name: '1. THALIKPC\\SQLEXPRESS22 SEM porta',
    server: 'THALIKPC\\SQLEXPRESS22',
    database: 'BancoThalik',
    user: 'sa',
    password: '1', // ALTERE para sua senha
    port: undefined, // Sem porta - usa SQL Browser
  },
  {
    name: '2. localhost COM porta 1433',
    server: 'localhost',
    database: 'BancoThalik',
    user: 'sa',
    password: '1', // ALTERE para sua senha
    port: 1433,
  },
  {
    name: '3. 127.0.0.1 COM porta 1433',
    server: '127.0.0.1',
    database: 'BancoThalik',
    user: 'sa',
    password: '1', // ALTERE para sua senha
    port: 1433,
  },
  {
    name: '4. THALIKPC\\SQLEXPRESS22 COM porta 1433',
    server: 'THALIKPC\\SQLEXPRESS22',
    database: 'BancoThalik',
    user: 'sa',
    password: '1', // ALTERE para sua senha
    port: 1433,
  },
]

async function testConfig(configData) {
  const config = {
    server: configData.server,
    database: configData.database,
    user: configData.user,
    password: configData.password,
    ...(configData.port && { port: configData.port }),
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      connectTimeout: 10000,
    }
  }

  console.log('\n' + '='.repeat(70))
  console.log(`Testando: ${configData.name}`)
  console.log('='.repeat(70))
  console.log(`Server: ${configData.server}`)
  console.log(`Database: ${configData.database}`)
  console.log(`Port: ${configData.port || 'padrão (usa SQL Browser)'}`)

  try {
    console.log('\n⏳ Conectando...')
    const pool = await sql.connect(config)

    console.log('✅ CONEXÃO BEM-SUCEDIDA!')

    const result = await pool.request().query('SELECT @@VERSION as version')
    console.log('\n📊 SQL Server Versão:', result.recordset[0].version.split('\n')[0])

    // Verificar tabelas
    const tables = await pool.request().query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      AND TABLE_NAME IN ('Cad_Cliente', 'Opr_Atendimento', 'Cad_Cobranca', 'Cad_Cobranca_Item')
    `)

    console.log('\n📋 Tabelas do sistema encontradas:')
    if (tables.recordset.length > 0) {
      tables.recordset.forEach(t => console.log(`  ✓ ${t.TABLE_NAME}`))
    } else {
      console.log('  ⚠️  Nenhuma tabela encontrada')
    }

    await pool.close()

    console.log('\n🎉 ESTA CONFIGURAÇÃO FUNCIONA!')
    console.log('\n📝 Use no seu .env.local:')
    console.log(`DB_SERVER=${configData.server}`)
    console.log(`DB_DATABASE=${configData.database}`)
    console.log(`DB_USER=${configData.user}`)
    console.log(`DB_PASSWORD=${configData.password}`)
    if (configData.port) {
      console.log(`DB_PORT=${configData.port}`)
    } else {
      console.log('# DB_PORT= (não especificar porta)')
    }

    return true

  } catch (err) {
    console.error('\n❌ FALHOU')
    console.error(`Erro: ${err.message}`)
    console.error(`Código: ${err.code || 'N/A'}`)

    if (err.code === 'ETIMEOUT') {
      console.log('\n💡 Possíveis causas do TIMEOUT:')
      console.log('  1. TCP/IP não está habilitado no SQL Server')
      console.log('  2. SQL Server Browser não está rodando')
      console.log('  3. Firewall bloqueando a conexão')
      console.log('  4. Porta incorreta ou não configurada')
    }

    return false
  }
}

async function runDiagnostic() {
  console.log('🔍 DIAGNÓSTICO DE CONEXÃO SQL SERVER\n')

  let successCount = 0

  for (const config of CONFIGS) {
    const success = await testConfig(config)
    if (success) successCount++

    // Aguardar 2 segundos entre testes
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  console.log('\n' + '='.repeat(70))
  console.log('📊 RESUMO')
  console.log('='.repeat(70))
  console.log(`Configurações testadas: ${CONFIGS.length}`)
  console.log(`Bem-sucedidas: ${successCount}`)
  console.log(`Com falha: ${CONFIGS.length - successCount}`)

  if (successCount === 0) {
    console.log('\n❌ NENHUMA CONFIGURAÇÃO FUNCIONOU\n')
    console.log('📖 PRÓXIMOS PASSOS OBRIGATÓRIOS:\n')
    console.log('1️⃣  Abrir SQL Server Configuration Manager')
    console.log('   • Pressione Win+R e digite: SQLServerManager15.msc')
    console.log('')
    console.log('2️⃣  Habilitar TCP/IP')
    console.log('   • SQL Server Network Configuration > Protocols for SQLEXPRESS22')
    console.log('   • Botão direito em TCP/IP > Enable')
    console.log('')
    console.log('3️⃣  Configurar Porta')
    console.log('   • Botão direito em TCP/IP > Properties > IP Addresses')
    console.log('   • Role até IPALL')
    console.log('   • TCP Port: 1433')
    console.log('   • TCP Dynamic Ports: (deixar vazio)')
    console.log('')
    console.log('4️⃣  Iniciar SQL Server Browser')
    console.log('   • Pressione Win+R e digite: services.msc')
    console.log('   • Procure "SQL Server Browser"')
    console.log('   • Botão direito > Properties')
    console.log('   • Tipo de inicialização: Automático')
    console.log('   • Clicar em Iniciar')
    console.log('')
    console.log('5️⃣  Reiniciar SQL Server')
    console.log('   • No Configuration Manager: SQL Server Services')
    console.log('   • Botão direito em SQL Server (SQLEXPRESS22) > Restart')
    console.log('')
    console.log('6️⃣  Configurar Firewall (PowerShell como Admin)')
    console.log('   • New-NetFirewallRule -DisplayName "SQL Server" -Direction Inbound -Protocol TCP -LocalPort 1433 -Action Allow')
    console.log('   • New-NetFirewallRule -DisplayName "SQL Server Browser" -Direction Inbound -Protocol UDP -LocalPort 1434 -Action Allow')
    console.log('')
    console.log('Após realizar estes passos, execute este script novamente.')
  }
}

runDiagnostic().catch(err => {
  console.error('Erro fatal:', err)
  process.exit(1)
})
