import Budget from '../models/Budget.js'

// Set or Update Budget
export const setBudget = async (req, res) => {
  try {
    const { monthlyBudget, savingsGoal, targetDate } = req.body
    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id },
      { monthlyBudget, savingsGoal, targetDate },
      { new: true, upsert: true }
    )
    res.status(200).json({ message: 'Budget updated successfully', budget })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get Budget
export const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ user: req.user._id })
    res.status(200).json(budget)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}