import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
})

// adding an interceptor so we don't have to manually attach the token everywhere
api.interceptors.request.use((config) => {
  const userString = localStorage.getItem('user')
  
  if (userString) {
    const user = JSON.parse(userString) // parse it back to an object
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
  }
  
  return config
}, (error) => {
  return Promise.reject(error)
})

export default api