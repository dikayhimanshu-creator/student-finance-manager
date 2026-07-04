import API from './axios.js'

export const addIncome = (data) => API.post('/api/income', data)
export const getIncome = () => API.get('/api/income')
export const deleteIncome = (id) => API.delete(`/api/income/${id}`)