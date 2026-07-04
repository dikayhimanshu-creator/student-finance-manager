import mongoose from 'mongoose'

const incomeSchema = new mongoose.Schema({
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
  source: {
    type: String,
    required: [true, 'Source is required'],
    enum: ['Pocket Money', 'Scholarship', 'Internship', 'Freelancing', 'Part-time Job', 'Parents', 'Other']
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

export default mongoose.model('Income', incomeSchema)