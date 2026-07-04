import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be greater than 0']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food', 'Travel', 'Books', 'College Fees', 'Stationery', 'Entertainment', 'Shopping', 'Mobile Recharge', 'Subscriptions', 'Other']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true })

export default mongoose.model('Expense', expenseSchema)