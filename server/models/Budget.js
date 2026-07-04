import mongoose from 'mongoose'

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  monthlyBudget: {
    type: Number,
    required: true,
    min: [1, 'Budget must be greater than 0']
  },
  savingsGoal: {
    type: Number,
    default: 0
  },
  targetDate: {
    type: Date,
    default: null
  }
}, { timestamps: true })

export default mongoose.model('Budget', budgetSchema)