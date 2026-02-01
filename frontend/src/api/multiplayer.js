// Multiplayer API service
import api from './axios'

export const multiplayerApi = {
    // Create lobby
    createLobby: async (quizId) => {
        const response = await api.post('/multiplayer/create', { quiz_id: quizId })
        return response.data
    },

    // Join lobby
    joinLobby: async (joinCode) => {
        const response = await api.post('/multiplayer/join', { join_code: joinCode })
        return response.data
    },

    // Get lobby details
    getLobby: async (sessionId) => {
        const response = await api.get(`/multiplayer/${sessionId}`)
        return response.data
    },

    // Start session (host only)
    startSession: async (sessionId) => {
        const response = await api.post(`/multiplayer/${sessionId}/start`)
        return response.data
    },

    // Submit answers
    submitAnswers: async (sessionId, answers) => {
        const response = await api.post(`/multiplayer/${sessionId}/submit`, { answers })
        return response.data
    },

    // End session (host only)
    endSession: async (sessionId) => {
        const response = await api.post(`/multiplayer/${sessionId}/end`)
        return response.data
    }
}

export default multiplayerApi
