import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'

import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import vaultRoutes from './routes/vaultRoutes.js'
import generateRoutes from './routes/generateRoutes.js' 

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch((err) => console.log('MongoDB Connection Error:', err))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/vault', vaultRoutes)
app.use('/api/generate', generateRoutes) 


app.get('/', (req, res) => {
  res.send('ContextCV API is running...')
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})