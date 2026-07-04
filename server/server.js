import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import incomeRoutes from './routes/incomeRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import budgetRoutes from './routes/budgetRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/income', incomeRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/budget', budgetRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/analytics', analyticsRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'Student Finance Manager API is running',
    status: 'success'
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})