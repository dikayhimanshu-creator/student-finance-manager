import Expense from '../models/Expense.js'

// Add Expense
export const addExpense = async (req, res) => {
  try {
    const { amount, category, date, notes } = req.body
    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category,
      date,
      notes
    })
    res.status(201).json({ message: 'Expense added successfully', expense })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get All Expenses for logged in user
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 })
    res.status(200).json(expenses)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Delete Expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    })
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }
    res.status(200).json({ message: 'Expense deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}