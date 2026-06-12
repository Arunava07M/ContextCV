import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'

// Route Imports
import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import vaultRoutes from './routes/vaultRoutes.js'
import generateRoutes from './routes/generateRoutes.js' // Added for Module 7

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch((err) => console.log('MongoDB Connection Error:', err))

// Mount Routes
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/vault', vaultRoutes)
app.use('/api/generate', generateRoutes) // Mounted the new AI rewriting engine

// Default Ping Route
app.get('/', (req, res) => {
  res.send('ContextCV API is running...')
})

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})