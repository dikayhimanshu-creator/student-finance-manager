import API from './axios.js'

export const setBudget = (data) => API.post('/api/budget', data)
export const getBudget = () => API.get('/api/budget')