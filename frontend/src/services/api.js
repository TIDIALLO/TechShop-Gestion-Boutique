import axios from "axios"

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"

const api = axios.create({
  baseURL: `${BASE}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
})

// Injection du token JWT
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("access_token")
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Refresh token automatique
api.interceptors.response.use(
  res => res,
  async err => {
    const orig = err.config
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true
      const refresh = localStorage.getItem("refresh_token")
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE}/api/auth/refresh/`, { refresh })
          localStorage.setItem("access_token", data.access)
          orig.headers.Authorization = `Bearer ${data.access}`
          return api(orig)
        } catch {
          localStorage.clear()
          window.location.href = "/login"
        }
      }
    }
    return Promise.reject(err)
  }
)

export default api

