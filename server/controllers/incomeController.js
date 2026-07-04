import Income from '../models/Income.js'

// Add Income
export const addIncome = async (req, res) => {
  try {
    const { amount, source, date, notes } = req.body
    const income = await Income.create({
      user: req.user._id,
      amount,
      source,
      date,
      notes
    })
    res.status(201).json({ message: 'Income added successfully', income })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get All Income for logged in user
export const getIncome = async (req, res) => {
  try {
    const income = await Income.find({ user: req.user._id })
      .sort({ date: -1 })
    res.status(200).json(income)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Delete Income
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    })
    if (!income) {
      return res.status(404).json({ message: 'Income not found' })
    }
    res.status(200).json({ message: 'Income deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}