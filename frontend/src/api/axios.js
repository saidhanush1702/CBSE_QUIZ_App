// Axios instance with auth interceptor
import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor - add auth token
api.interceptors.request.use(
    async (config) => {
        const token = await useAuthStore.getState().getAccessToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            // Token might have been refreshed by Supabase, retry
            const token = await useAuthStore.getState().getAccessToken()
            if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`
                return api(originalRequest)
            }

            // If still no token, logout
            useAuthStore.getState().logout()
        }

        return Promise.reject(error)
    }
)

export default api
