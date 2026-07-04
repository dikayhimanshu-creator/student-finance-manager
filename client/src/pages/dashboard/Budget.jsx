import { useEffect, useState } from 'react'
import { getBudget, setBudget } from '../../api/budget'
import { formatCurrency } from '../../utils/formatCurrency'
import Layout from '../../components/Layout'
import toast from 'react-hot-toast'

const Budget = () => {
  const [budget, setBudgetData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    monthlyBudget: '',
    savingsGoal: '',
    targetDate: ''
  })

  const fetchBudget = async () => {
    try {
      const res = await getBudget()
      if (res.data) {
        setBudgetData(res.data)
        setFormData({
          monthlyBudget: res.data.monthlyBudget || '',
          savingsGoal: res.data.savingsGoal || '',
          targetDate: res.data.targetDate
            ? new Date(res.data.targetDate).toISOString().split('T')[0]
            : ''
        })
      }
    } catch (error) {
      toast.error('Failed to load budget')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBudget()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await setBudget(formData)
      setBudgetData(res.data.budget)
      toast.success('Budget updated successfully!')
    } catch (error) {
      toast.error('Failed to update budget')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Budget & Savings</h1>
          <p className="text-gray-500 text-sm">Set your monthly budget and savings goal</p>
        </div>

        {/* Budget Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {budget ? 'Update Budget' : 'Set Budget'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Budget (₹)
              </label>
              <input
                type="number"
                name="monthlyBudget"
                value={formData.monthlyBudget}
                onChange={handleChange}
                placeholder="e.g. 10000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Savings Goal (₹)
              </label>
              <input
                type="number"
                name="savingsGoal"
                value={formData.savingsGoal}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Date
              </label>
              <input
                type="date"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Budget'}
              </button>
            </div>
          </form>
        </div>

        {/* Budget Display */}
        {budget && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monthly Budget Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Budget</h2>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(budget.monthlyBudget)}
              </p>
              <p className="text-gray-500 text-sm mt-1">per month</p>
            </div>

            {/* Savings Goal Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Savings Goal</h2>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(budget.savingsGoal || 0)}
              </p>
              {budget.targetDate && (
                <p className="text-gray-500 text-sm mt-1">
                  Target: {new Date(budget.targetDate).toLocaleDateString('en-IN')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !budget && (
          <div className="bg-yellow-50 rounded-2xl p-6 text-center">
            <p className="text-yellow-700 font-medium">No budget set yet.</p>
            <p className="text-yellow-600 text-sm mt-1">
              Fill the form above to set your monthly budget.
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Budget