// Quiz API service
import api from './axios'

export const quizApi = {
    // Get all quizzes
    getAll: async (params = {}) => {
        const response = await api.get('/quizzes', { params })
        return response.data
    },

    // Get quiz by ID
    getById: async (id) => {
        const response = await api.get(`/quizzes/${id}`)
        return response.data
    },

    // Get quiz questions
    getQuestions: async (quizId) => {
        const response = await api.get(`/quizzes/${quizId}/questions`)
        return response.data
    },

    // Create quiz
    create: async (quizData) => {
        const response = await api.post('/quizzes', quizData)
        return response.data
    },

    // Update quiz
    update: async (id, updates) => {
        const response = await api.patch(`/quizzes/${id}`, updates)
        return response.data
    },

    // Delete quiz
    delete: async (id) => {
        const response = await api.delete(`/quizzes/${id}`)
        return response.data
    },

    // Filter by mode
    getByMode: async (mode) => {
        const response = await api.get(`/quizzes/filter/mode/${mode}`)
        return response.data
    },

    // Filter by method
    getByMethod: async (method) => {
        const response = await api.get(`/quizzes/filter/method/${method}`)
        return response.data
    },

    // Get latest quizzes
    getLatest: async (limit = 5) => {
        const response = await api.get('/quizzes/latest', { params: { limit } })
        return response.data
    },

    // Start quiz attempt
    start: async (quizId) => {
        const response = await api.post(`/quizzes/${quizId}/start`)
        return response.data
    },

    // Save answer
    saveAnswer: async (quizId, questionId, selectedAnswer) => {
        const response = await api.post(`/quizzes/${quizId}/answer`, {
            question_id: questionId,
            selected_answer: selectedAnswer
        })
        return response.data
    },

    // Submit quiz
    submit: async (quizId) => {
        const response = await api.post(`/quizzes/${quizId}/submit`)
        return response.data
    },

    // Get result
    getResult: async (quizId, userId) => {
        const response = await api.get(`/quizzes/${quizId}/result/${userId}`)
        return response.data
    },

    // Get user attempts
    getUserAttempts: async (userId) => {
        const response = await api.get(`/quizzes/user/${userId}/attempts`)
        return response.data
    },

    // Get completed quizzes
    getCompleted: async (userId) => {
        const response = await api.get(`/quizzes/user/${userId}/completed`)
        return response.data
    },

    // Get revision items
    getRevision: async (userId) => {
        const response = await api.get(`/quizzes/user/${userId}/revision`)
        return response.data
    }
}

export default quizApi
