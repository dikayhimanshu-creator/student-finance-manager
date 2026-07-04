import Income from '../models/Income.js'
import Expense from '../models/Expense.js'

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id

    // Category wise expenses
    const categoryData = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ])

    // Monthly expenses (last 6 months)
    const monthlyExpenses = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ])

    // Monthly income (last 6 months)
    const monthlyIncome = await Income.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ])

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const formattedMonthlyExpenses = monthlyExpenses.map(item => ({
      month: months[item._id.month - 1],
      amount: item.total
    }))

    const formattedMonthlyIncome = monthlyIncome.map(item => ({
      month: months[item._id.month - 1],
      amount: item.total
    }))

    res.status(200).json({
      categoryData: categoryData.map(item => ({
        name: item._id,
        value: item.total
      })),
      monthlyExpenses: formattedMonthlyExpenses,
      monthlyIncome: formattedMonthlyIncome
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}