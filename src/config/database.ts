import sql from 'mssql'

interface DbConfig {
  server: string
  database: string
  user: string
  password: string
  port?: number
  options: {
    encrypt: boolean
    trustServerCertificate: boolean
    enableArithAbort: boolean
    connectionTimeout?: number
    requestTimeout?: number
  }
}

class SqlServerConnection {
  private static instance: SqlServerConnection
  private pool: sql.ConnectionPool | null = null
  private config: DbConfig

  private constructor() {
    this.config = {
      server: process.env.DB_SERVER || '',
      database: process.env.DB_DATABASE || '',
      user: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true,
        connectionTimeout: process.env.DB_CONNECTION_TIMEOUT
          ? parseInt(process.env.DB_CONNECTION_TIMEOUT)
          : 15000,
        requestTimeout: process.env.DB_REQUEST_TIMEOUT
          ? parseInt(process.env.DB_REQUEST_TIMEOUT)
          : 15000,
      },
    }
  }

  public static getInstance(): SqlServerConnection {
    if (!SqlServerConnection.instance) {
      SqlServerConnection.instance = new SqlServerConnection()
    }
    return SqlServerConnection.instance
  }

  public async connect(): Promise<sql.ConnectionPool> {
    if (this.pool?.connected) {
      return this.pool
    }

    try {
      this.pool = await new sql.ConnectionPool(this.config).connect()
      console.log('✅ Conexão com SQL Server estabelecida')

      this.pool.on('error', (err) => {
        console.error('❌ Erro no pool de conexões SQL Server:', err)
      })

      return this.pool
    } catch (error) {
      console.error('❌ Erro ao conectar ao SQL Server:', error)
      throw error
    }
  }

  public async query<T = any>(queryString: string, params?: any): Promise<T[]> {
    const pool = await this.connect()

    try {
      const request = pool.request()

      if (params) {
        Object.keys(params).forEach((key) => {
          request.input(key, params[key])
        })
      }

      const result = await request.query(queryString)
      return result.recordset as T[]
    } catch (error) {
      console.error('Erro ao executar query:', error)
      throw error
    }
  }

  public async execute(
    queryString: string,
    params?: any
  ): Promise<sql.IResult<any>> {
    const pool = await this.connect()

    try {
      const request = pool.request()

      if (params) {
        Object.keys(params).forEach((key) => {
          request.input(key, params[key])
        })
      }

      return await request.query(queryString)
    } catch (error) {
      console.error('Erro ao executar comando:', error)
      throw error
    }
  }

  public async transaction<T>(
    callback: (transaction: sql.Transaction) => Promise<T>
  ): Promise<T> {
    const pool = await this.connect()
    const transaction = new sql.Transaction(pool)

    try {
      await transaction.begin()
      const result = await callback(transaction)
      await transaction.commit()
      return result
    } catch (error) {
      try {
        await transaction.rollback()
      } catch (rollbackError) {
        console.error('Erro ao reverter transação:', rollbackError)
      }
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    if (this.pool?.connected) {
      await this.pool.close()
      this.pool = null
      console.log('Conexão com SQL Server fechada')
    }
  }
}

export const db = SqlServerConnection.getInstance()
export { sql }
