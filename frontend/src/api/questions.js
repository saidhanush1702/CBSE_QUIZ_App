// Questions API service
import api from './axios'

export const questionApi = {
    // Get all questions
    getAll: async (params = {}) => {
        const response = await api.get('/questions', { params })
        return response.data
    },

    // Get question by ID
    getById: async (id) => {
        const response = await api.get(`/questions/${id}`)
        return response.data
    },

    // Create question
    create: async (questionData) => {
        const response = await api.post('/questions', questionData)
        return response.data
    },

    // Update question
    update: async (id, updates) => {
        const response = await api.patch(`/questions/${id}`, updates)
        return response.data
    },

    // Delete question (soft delete)
    delete: async (id) => {
        const response = await api.delete(`/questions/${id}`)
        return response.data
    }
}

export default questionApi
