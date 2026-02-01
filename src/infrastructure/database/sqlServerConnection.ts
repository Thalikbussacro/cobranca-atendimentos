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
      this.log('info', 'Conexão com SQL Server estabelecida com sucesso')

      // Configurar event handlers
      this.pool.on('error', (err) => {
        this.log('error', 'Erro no pool de conexões SQL Server', err)
      })

      return this.pool
    } catch (error) {
      this.log('error', 'Erro ao conectar ao SQL Server', error)
      throw error
    }
  }

  public async query<T = any>(queryString: string, params?: any): Promise<T[]> {
    const pool = await this.connect()

    try {
      const request = pool.request()

      // Adicionar parâmetros se houver
      if (params) {
        Object.keys(params).forEach((key) => {
          request.input(key, params[key])
        })
      }

      if (this.shouldLogQueries()) {
        this.log('debug', `Executando query: ${queryString}`, params)
      }

      const result = await request.query(queryString)
      return result.recordset as T[]
    } catch (error) {
      this.log('error', 'Erro ao executar query', { query: queryString, error })
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

      // Adicionar parâmetros se houver
      if (params) {
        Object.keys(params).forEach((key) => {
          request.input(key, params[key])
        })
      }

      if (this.shouldLogQueries()) {
        this.log('debug', `Executando comando: ${queryString}`, params)
      }

      return await request.query(queryString)
    } catch (error) {
      this.log('error', 'Erro ao executar comando', { query: queryString, error })
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
      this.log('debug', 'Transação iniciada')

      const result = await callback(transaction)

      await transaction.commit()
      this.log('debug', 'Transação confirmada')

      return result
    } catch (error) {
      try {
        await transaction.rollback()
        this.log('warn', 'Transação revertida devido a erro')
      } catch (rollbackError) {
        this.log('error', 'Erro ao reverter transação', rollbackError)
      }
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    if (this.pool?.connected) {
      await this.pool.close()
      this.pool = null
      this.log('info', 'Conexão com SQL Server fechada')
    }
  }

  private shouldLogQueries(): boolean {
    return process.env.LOG_SQL_QUERIES === 'true'
  }

  private log(level: 'info' | 'warn' | 'error' | 'debug', message: string, data?: any) {
    const logLevel = process.env.LOG_LEVEL || 'info'
    const levels = { error: 0, warn: 1, info: 2, debug: 3 }

    if (levels[level] <= levels[logLevel as keyof typeof levels]) {
      const timestamp = new Date().toISOString()
      const logMessage = `[${timestamp}] [${level.toUpperCase()}] [SQL Server] ${message}`

      if (data) {
        console.log(logMessage, data)
      } else {
        console.log(logMessage)
      }
    }
  }
}

// Exportar instância singleton
export const db = SqlServerConnection.getInstance()

// Exportar tipos úteis do mssql
export { sql }
