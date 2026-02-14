import express from 'express'
import cors from 'cors'
import routes from './routes'
import { errorHandler } from './middleware/errorHandler'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use('/api', routes)

// Error handler (deve ser o último middleware)
app.use(errorHandler)

export default app
