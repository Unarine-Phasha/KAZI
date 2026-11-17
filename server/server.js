
const express = require('express')
const cors = require('cors')
require('dotenv').config()
console.log('JWT secret loaded:', !!process.env.JWT_SECRET)
const jobsRoute = require('./routes/jobs')
const authRoute = require('./routes/auth')
const profileRoute = require('./routes/profile')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use('/api/jobs', jobsRoute)
app.use('/api/auth', authRoute)
app.use('/api/profile', profileRoute)

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the KAZI API!')
})

// API health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'KAZI backend is running successfully.'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`KAZI server is running at http://localhost:${PORT}`)
})
