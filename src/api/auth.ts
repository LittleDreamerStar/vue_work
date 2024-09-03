import axios from 'axios'
import { cookieGet } from '../api/cookie'

axios.interceptors.request.use(
  (config) => {
    const token = cookieGet()
    if (token) {
      config.headers['Authorization'] = `${token}`
    }
    return config
  },
  (error) => {
    console.error(error)
    window.location.href = window.location.href + '404'
    return Promise.reject(error)
  }
)
