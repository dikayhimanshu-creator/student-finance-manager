import Income from '../models/Income.js'
import Expense from '../models/Expense.js'
import Budget from '../models/Budget.js'

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id

    // Get current month start and end
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Total income this month
    const incomeData = await Income.aggregate([
      { $match: { user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])

    // Total expenses this month
    const expenseData = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])

    // Recent 5 expenses
    const recentExpenses = await Expense.find({ user: userId })
      .sort({ date: -1 })
      .limit(5)

    // Budget
    const budget = await Budget.findOne({ user: userId })

    const totalIncome = incomeData[0]?.total || 0
    const totalExpenses = expenseData[0]?.total || 0
    const balance = totalIncome - totalExpenses

    res.status(200).json({
      totalIncome,
      totalExpenses,
      balance,
      monthlyBudget: budget?.monthlyBudget || 0,
      savingsGoal: budget?.savingsGoal || 0,
      targetDate: budget?.targetDate || null,
      recentExpenses
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}