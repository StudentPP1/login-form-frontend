import Axios from 'axios'

const httpClient = Axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 
  headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  withXSRFToken: true,
})

export default httpClient