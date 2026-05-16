/**
 * @fileoverview Axios instance with JWT interceptors
 * Automatically attaches access token and handles 401 refresh flow
 */
import axios from 'axios'
import { useAuthStore } from '../store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/v1`
    : '/api/v1',
  withCredentials: true, // send HttpOnly cookies (refresh token)
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

/** ─── REQUEST INTERCEPTOR ─────────────────────────────────── */
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/** ─── RESPONSE INTERCEPTOR (refresh token retry) ─────────── */
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve(token)
  )
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry && !original.url.includes('/auth/')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          '/api/v1/auth/refresh-token',
          {},
          { withCredentials: true }
        )
        const newToken = data.accessToken
        useAuthStore.getState().setAuth(data.user, newToken)
        processQueue(null, newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api

/* ─── API SERVICE FUNCTIONS ──────────────────────────────── */

/** Auth */
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resendOTP: (email) => api.post('/auth/resend-otp', { email }),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (email, otp, password) =>
    api.post('/auth/reset-password', { email, otp, password }),
}

/** User */
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getStats: () => api.get('/user/stats'),
}

/** Tasks */
export const tasksAPI = {
  getToday: () => api.get('/tasks/today'),
  getByDay: (day) => api.get(`/tasks/${day}`),
  completeTask: (day, data = {}) => api.post(`/tasks/${day}/complete`, data),
}

/** Progress */
export const progressAPI = {
  getCalendar: () => api.get('/progress/calendar'),
  getStreak: () => api.get('/progress/streak'),
}

/** Badges */
export const badgesAPI = {
  getAll: () => api.get('/badges'),
  getUnlocked: () => api.get('/badges/unlocked'),
}

/** Leaderboard */
export const leaderboardAPI = {
  get: (type = 'streak', period = 'alltime') =>
    api.get(`/leaderboard?type=${type}&period=${period}`),
}

/** Impact */
export const impactAPI = {
  getSummary: () => api.get('/impact/summary'),
  getReport: () => api.get('/impact/report'),
}
