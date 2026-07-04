import { useEffect, useState } from 'react'
import { getDashboardSummary } from '../../api/dashboard'
import { formatCurrency } from '../../utils/formatCurrency'
import Layout from '../../components/Layout'
import SummaryCard from '../../components/SummaryCard'
import { MdAttachMoney, MdMoneyOff, MdAccountBalance, MdSavings } from 'react-icons/md'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getDashboardSummary()
        setSummary(res.data)
      } catch (error) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </Layout>
    )
  }

  const budgetUsedPercent = summary?.monthlyBudget
    ? Math.min((summary.totalExpenses / summary.monthlyBudget) * 100, 100).toFixed(0)
    : 0

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">Here's your financial overview</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Current Balance"
            amount={formatCurrency(summary?.balance || 0)}
            icon="💰"
            color="bg-blue-50"
          />
          <SummaryCard
            title="Total Income"
            amount={formatCurrency(summary?.totalIncome || 0)}
            icon="📈"
            color="bg-green-50"
          />
          <SummaryCard
            title="Total Expenses"
            amount={formatCurrency(summary?.totalExpenses || 0)}
            icon="📉"
            color="bg-red-50"
          />
          <SummaryCard
            title="Savings Goal"
            amount={formatCurrency(summary?.savingsGoal || 0)}
            icon="🎯"
            color="bg-yellow-50"
          />
        </div>

        {/* Budget Progress */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Budget</h2>
          {summary?.monthlyBudget > 0 ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Used: {formatCurrency(summary.totalExpenses)}</span>
                <span>Budget: {formatCurrency(summary.monthlyBudget)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    budgetUsedPercent > 80 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${budgetUsedPercent}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">{budgetUsedPercent}% of budget used</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No budget set yet. Go to Budget page to set one.</p>
          )}
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Expenses</h2>
          {summary?.recentExpenses?.length > 0 ? (
            <div className="space-y-3">
              {summary.recentExpenses.map((expense) => (
                <div key={expense._id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-700">{expense.category}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(expense.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <p className="font-semibold text-red-500">
                    -{formatCurrency(expense.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No expenses recorded yet.</p>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard