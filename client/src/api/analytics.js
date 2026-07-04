import API from './axios.js'

export const getAnalytics = () => API.get('/api/analytics')