import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectToDatabase } from './config/db.js'
import apiRouter from './routes/index.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import uploadRouter from './routes/upload.js'

dotenv.config()

const app = express()

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://portfolio-backend-4h8x.onrender.com',
  'https://portfolio-g2wj.onrender.com',
  'https://your-portfolio-domain.vercel.app', // Will be updated after Vercel deployment
]

// Add environment-specific origins
if (process.env.CORS_ORIGIN) {
  const envOrigins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  allowedOrigins.push(...envOrigins)
}

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Check exact matches first
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true)
    }
    
    // Check for Vercel domains (wildcard matching)
    if (origin && origin.endsWith('.vercel.app')) {
      return callback(null, true)
    }
    
    // Allow localhost with any port in development
    if (process.env.NODE_ENV !== 'production' && origin && origin.startsWith('http://localhost:')) {
      return callback(null, true)
    }
    
    // Allow 127.0.0.1 with any port in development
    if (process.env.NODE_ENV !== 'production' && origin && origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true)
    }
    
    console.log('CORS blocked origin:', origin)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/api', apiRouter)
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/upload', uploadRouter)

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'))

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[API ERROR]', err)
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  res.status(status).json({ error: message })
})

const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio'

if (!process.env.MONGODB_URI) {
  console.warn('[WARN] MONGODB_URI not set. Falling back to local: mongodb://127.0.0.1:27017/portfolio')
}

async function startServerWithDbRetry() {
  const retryDelayMs = Number(process.env.DB_RETRY_DELAY_MS || 5000)
  // Infinite retry with backoff-style constant delay
  // Keeps the process alive while Atlas/firewall issues are resolved (e.g., IP whitelist)
  // so the app doesn't crash-loop.
  // A health endpoint remains available immediately.
  // When the DB connects, the API starts listening.
  // If you prefer finite retries, set DB_MAX_RETRIES.
  const maxRetries = process.env.DB_MAX_RETRIES ? Number(process.env.DB_MAX_RETRIES) : Infinity

  let attempt = 0
  // Health probe available even before DB connection
  app.get('/health', (req, res) => {
    res.json({ ok: true, db: attempt > 0 ? 'connecting' : 'pending' })
  })

  // Start HTTP server immediately so health checks and static responses work
  const server = app.listen(PORT, () => {
    console.log(`API starting on http://localhost:${PORT}`)
  })

  while (attempt < maxRetries) {
    try {
      attempt += 1
      console.log(`[DB] Connecting (attempt ${attempt})...`)
      await connectToDatabase(MONGODB_URI)
      console.log('[DB] Connected')
      console.log(`API running on http://localhost:${PORT}`)
      return
    } catch (err) {
      console.error(`[DB] Connection attempt ${attempt} failed:`, err?.message || err)
      if (attempt >= maxRetries) {
        console.error('[DB] Max retries reached. Leaving server running without DB connection.')
        return
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs))
    }
  }
}

startServerWithDbRetry()

process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason)
})

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err)
})


