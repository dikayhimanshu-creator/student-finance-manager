import API from './axios.js'

export const getDashboardSummary = () => API.get('/api/dashboard')