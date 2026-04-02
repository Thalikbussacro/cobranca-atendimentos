import sql from 'mssql'

let pool = null

function getConfig() {
  return {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
      enableArithAbort: true,
      connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 15000,
      requestTimeout: parseInt(process.env.DB_REQUEST_TIMEOUT) || 15000,
    },
  }
}

async function connect() {
  if (pool?.connected) return pool
  pool = await new sql.ConnectionPool(getConfig()).connect()
  console.log('Conexão com SQL Server estabelecida')
  pool.on('error', (err) => console.error('Erro no pool SQL Server:', err))
  return pool
}

async function buildRequest(params) {
  const p = await connect()
  const request = p.request()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value)
    }
  }
  return request
}

export const db = {
  async query(queryString, params) {
    const request = await buildRequest(params)
    const result = await request.query(queryString)
    return result.recordset
  },

  async execute(queryString, params) {
    const request = await buildRequest(params)
    return request.query(queryString)
  },

  async transaction(callback) {
    const p = await connect()
    const tx = new sql.Transaction(p)
    try {
      await tx.begin()
      const result = await callback(tx)
      await tx.commit()
      return result
    } catch (error) {
      try { await tx.rollback() } catch {}
      throw error
    }
  },
}

export { sql }
