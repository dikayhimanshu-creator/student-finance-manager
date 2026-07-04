import API from './axios.js'

export const addExpense = (data) => API.post('/api/expenses', data)
export const getExpenses = () => API.get('/api/expenses')
export const deleteExpense = (id) => API.delete(`/api/expenses/${id}`)