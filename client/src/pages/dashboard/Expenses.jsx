import { useEffect, useState } from 'react'
import { getExpenses, addExpense, deleteExpense } from '../../api/expense'
import { formatCurrency } from '../../utils/formatCurrency'
import Layout from '../../components/Layout'
import toast from 'react-hot-toast'

const CATEGORIES = ['Food', 'Travel', 'Books', 'College Fees', 'Stationery', 'Entertainment', 'Shopping', 'Mobile Recharge', 'Subscriptions', 'Other']

const Expenses = () => {
  const [expenseList, setExpenseList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchExpenses = async () => {
    try {
      const res = await getExpenses()
      setExpenseList(res.data)
    } catch (error) {
      toast.error('Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addExpense(formData)
      toast.success('Expense added successfully!')
      setFormData({ amount: '', category: 'Food', date: '', notes: '' })
      setShowForm(false)
      fetchExpenses()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add expense')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return
    try {
      await deleteExpense(id)
      toast.success('Expense deleted')
      fetchExpenses()
    } catch (error) {
      toast.error('Failed to delete expense')
    }
  }

  const totalExpenses = expenseList.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
            <p className="text-gray-500 text-sm">Track all your spending</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : '+ Add Expense'}
          </button>
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any notes"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Total Expenses Card */}
        <div className="bg-red-50 rounded-2xl p-4 flex justify-between items-center">
          <p className="text-red-700 font-medium">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">All Expense Records</h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : expenseList.length === 0 ? (
            <p className="text-gray-400 text-sm">No expenses recorded yet. Add your first one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Notes</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {expenseList.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-700">{item.category}</td>
                      <td className="py-3 text-red-500 font-semibold">-{formatCurrency(item.amount)}</td>
                      <td className="py-3 text-gray-500">{new Date(item.date).toLocaleDateString('en-IN')}</td>
                      <td className="py-3 text-gray-400">{item.notes || '—'}</td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Expenses