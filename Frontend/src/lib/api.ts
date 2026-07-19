import axios from "axios"

// Point this at your Spring Boot API gateway.
// You can override it at build/runtime via VITE_API_BASE_URL.
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api-gateway-zg6e.onrender.com"

export const TOKEN_KEY = "assesspro_token"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-logout on 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default api
