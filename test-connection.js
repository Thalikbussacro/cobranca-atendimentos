const sql = require('mssql')

const config = {
  server: 'THALIKPC\\SQLEXPRESS22',
  database: 'BancoThalik',
  user: 'sa',
  password: '1',
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