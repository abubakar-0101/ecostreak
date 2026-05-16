/**
 * @fileoverview Express server entry point
 * Sets up middleware, routes, Socket.io, and cron jobs
 */
require('dotenv').config()
const express    = require('express')
const http       = require('http')
const cors       = require('cors')
const helmet     = require('helmet')
const morgan     = require('morgan')
const cookieParser = require('cookie-parser')
const { Server } = require('socket.io')
const connectDB  = require('./config/db')
const { setupCronJobs } = require('./services/cronJobs')
const errorHandler = require('./middleware/errorHandler')
const rateLimiter  = require('./middleware/rateLimiter')

// ── Route imports ─────────────────────────────────────────
const authRoutes        = require('./routes/auth')
const userRoutes        = require('./routes/user')
const taskRoutes        = require('./routes/tasks')
const progressRoutes    = require('./routes/progress')
const badgeRoutes       = require('./routes/badges')
const leaderboardRoutes = require('./routes/leaderboard')
const impactRoutes      = require('./routes/impact')

const app    = express()
const server = http.createServer(app)

// ── Socket.io ─────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
})

// Make io available to routes/controllers
app.set('io', io)

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`)
  socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`))
})

// ── Connect DB ────────────────────────────────────────────
connectDB()

// ── Middleware ────────────────────────────────────────────
app.use(helmet({ crossOriginEmbedderPolicy: false }))
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
}))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(rateLimiter)

// ── Routes ────────────────────────────────────────────────
app.use('/api/v1/auth',        authRoutes)
app.use('/api/v1/user',        userRoutes)
app.use('/api/v1/tasks',       taskRoutes)
app.use('/api/v1/progress',    progressRoutes)
app.use('/api/v1/badges',      badgeRoutes)
app.use('/api/v1/leaderboard', leaderboardRoutes)
app.use('/api/v1/impact',      impactRoutes)

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }))

// ── Error handler (must be last) ─────────────────────────
app.use(errorHandler)

// ── Cron jobs ─────────────────────────────────────────────
setupCronJobs()

// ── Start server ──────────────────────────────────────────
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🌿 EcoStreak server running on port ${PORT}`)
})

module.exports = { app, io }
