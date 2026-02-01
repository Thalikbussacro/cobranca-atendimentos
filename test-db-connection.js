/**
 * Script de Teste de Conexão com SQL Server
 *
 * Execute: node test-db-connection.js
 *
 * Este script testa diferentes configurações de conexão
 * para ajudar a identificar o problema.
 */

const sql = require('mssql')
require('dotenv').config({ path: '.env.local' })

const configs = [
  {
    name: 'Config 1: Usando variáveis .env.local',
    config: {
      server: process.env.DB_SERVER,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true,
      }
    }
  },
  {
    name: 'Config 2: THALIKPC\\SQLEXPRESS22 sem porta',
    config: {
      server: 'THALIKPC\\SQLEXPRESS22',
      database: process.env.DB_DATABASE || 'BancoThalik',
      user: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
      }
    }
  },
  {
    name: 'Config 3: localhost com porta 1433',
    config: {
      server: 'localhost',
      database: process.env.DB_DATABASE || 'BancoThalik',
      user: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD,
      port: 1433,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
      }
    }
  },
  {
    name: 'Config 4: 127.0.0.1 com porta 1433',
    config: {
      server: '127.0.0.1',
      database: process.env.DB_DATABASE || 'BancoThalik',
      user: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD,
      port: 1433,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
      }
    }
  },
  {
    name: 'Config 5: THALIKPC\\SQLEXPRESS22 com porta 1433',
    config: {
      server: 'THALIKPC\\SQLEXPRESS22',
      database: process.env.DB_DATABASE || 'BancoThalik',
      user: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD,
      port: 1433,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
      }
    }
  }
]

async function testConnection(configObj) {
  console.log('\n' + '='.repeat(70))
  console.log(`Testando: ${configObj.name}`)
  console.log('='.repeat(70))

  // Criar uma cópia da config sem a senha para logging
  const safeConfig = JSON.parse(JSON.stringify(configObj.config))
  if (safeConfig.password) {
    safeConfig.password = '***'
  }
  console.log('Configuração:', JSON.stringify(safeConfig, null, 2))

  try {
    console.log('\n⏳ Tentando conectar...')
    const pool = await sql.connect(configObj.config)

    console.log('✅ CONEXÃO BEM-SUCEDIDA!')

    // Testar query simples
    const result = await pool.request().query('SELECT @@VERSION as version, DB_NAME() as database')
    console.log('\n📊 Informações do servidor:')
    console.log('- Versão:', result.recordset[0].version.split('\n')[0])
    console.log('- Banco:', result.recordset[0].database)

    // Testar se as tabelas existem
    const tables = await pool.request().query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      AND TABLE_NAME IN ('Cad_Cliente', 'Opr_Atendimento', 'Cad_Cobranca', 'Cad_Cobranca_Item')
      ORDER BY TABLE_NAME
    `)

    console.log('\n📋 Tabelas encontradas:')
    if (tables.recordset.length > 0) {
      tables.recordset.forEach(t => console.log(`  ✓ ${t.TABLE_NAME}`))
    } else {
      console.log('  ⚠️  Nenhuma tabela do sistema encontrada')
    }

    await pool.close()

    console.log('\n🎉 Esta configuração FUNCIONA! Use-a no seu .env.local')
    return true

  } catch (err) {
    console.error('\n❌ FALHA NA CONEXÃO')
    console.error('Erro:', err.message)
    console.error('Código:', err.code || 'N/A')

    if (err.code === 'ETIMEOUT') {
      console.log('\n💡 Dicas para ETIMEOUT:')
      console.log('  1. Verifique se SQL Server Browser está rodando')
      console.log('  2. Habilite TCP/IP no SQL Server Configuration Manager')
      console.log('  3. Configure porta estática 1433')
      console.log('  4. Adicione regra no Firewall do Windows')
      console.log('  5. Reinicie o serviço SQL Server')
    } else if (err.code === 'ELOGIN') {
      console.log('\n💡 Dicas para ELOGIN:')
      console.log('  1. Verifique usuário e senha')
      console.log('  2. Certifique-se que autenticação mista está habilitada')
      console.log('  3. Verifique se usuário \'sa\' está habilitado')
    } else if (err.message.includes('ENOTFOUND')) {
      console.log('\n💡 Dicas para ENOTFOUND:')
      console.log('  1. Verifique o nome do servidor/instância')
      console.log('  2. Tente usar localhost ou 127.0.0.1')
      console.log('  3. Verifique se a instância está rodando')
    }

    return false
  }
}

async function runAllTests() {
  console.log('🔍 TESTE DE CONEXÃO SQL SERVER')
  console.log('Este script testará diferentes configurações de conexão\n')

  // Verificar se .env.local existe
  const fs = require('fs')
  if (!fs.existsSync('.env.local')) {
    console.error('⚠️  AVISO: Arquivo .env.local não encontrado!')
    console.log('Crie o arquivo .env.local baseado no .env.example\n')
  }

  // Verificar se tem senha configurada
  if (!process.env.DB_PASSWORD) {
    console.error('⚠️  AVISO: DB_PASSWORD não configurada no .env.local!')
    console.log('Configure a senha do SQL Server no arquivo .env.local\n')
  }

  let successCount = 0

  for (const config of configs) {
    const success = await testConnection(config)
    if (success) {
      successCount++
    }

    // Aguardar 1 segundo entre testes
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n' + '='.repeat(70))
  console.log('📊 RESUMO DOS TESTES')
  console.log('='.repeat(70))
  console.log(`Total de configurações testadas: ${configs.length}`)
  console.log(`Conexões bem-sucedidas: ${successCount}`)
  console.log(`Conexões com falha: ${configs.length - successCount}`)

  if (successCount === 0) {
    console.log('\n❌ Nenhuma configuração funcionou!')
    console.log('\n📖 Próximos passos:')
    console.log('1. Leia o arquivo TROUBLESHOOTING_SQL.md')
    console.log('2. Verifique se SQL Server Browser está rodando')
    console.log('3. Habilite TCP/IP no SQL Server Configuration Manager')
    console.log('4. Configure porta estática 1433')
    console.log('5. Adicione regras no Firewall')
  } else {
    console.log('\n✅ Pelo menos uma configuração funcionou!')
    console.log('Use a configuração que funcionou no seu .env.local')
  }

  console.log('\n')
}

// Executar testes
runAllTests().catch(err => {
  console.error('Erro fatal:', err)
  process.exit(1)
})
