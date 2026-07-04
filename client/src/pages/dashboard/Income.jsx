import { useEffect, useState } from 'react'
import { getIncome, addIncome, deleteIncome } from '../../api/income'
import { formatCurrency } from '../../utils/formatCurrency'
import Layout from '../../components/Layout'
import toast from 'react-hot-toast'

const SOURCES = ['Pocket Money', 'Scholarship', 'Internship', 'Freelancing', 'Part-time Job', 'Parents', 'Other']

const Income = () => {
  const [incomeList, setIncomeList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    source: 'Pocket Money',
    date: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchIncome = async () => {
    try {
      const res = await getIncome()
      setIncomeList(res.data)
    } catch (error) {
      toast.error('Failed to load income')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncome()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addIncome(formData)
      toast.success('Income added successfully!')
      setFormData({ amount: '', source: 'Pocket Money', date: '', notes: '' })
      setShowForm(false)
      fetchIncome()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add income')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income?')) return
    try {
      await deleteIncome(id)
      toast.success('Income deleted')
      fetchIncome()
    } catch (error) {
      toast.error('Failed to delete income')
    }
  }

  const totalIncome = incomeList.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Income</h1>
            <p className="text-gray-500 text-sm">Track all your income sources</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : '+ Add Income'}
          </button>
        </div>

        {/* Add Income Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Income</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
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
                  {submitting ? 'Saving...' : 'Save Income'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Total Income Card */}
        <div className="bg-green-50 rounded-2xl p-4 flex justify-between items-center">
          <p className="text-green-700 font-medium">Total Income</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
        </div>

        {/* Income Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">All Income Records</h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : incomeList.length === 0 ? (
            <p className="text-gray-400 text-sm">No income records yet. Add your first one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3">Source</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Notes</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {incomeList.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-700">{item.source}</td>
                      <td className="py-3 text-green-600 font-semibold">{formatCurrency(item.amount)}</td>
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

export default Income