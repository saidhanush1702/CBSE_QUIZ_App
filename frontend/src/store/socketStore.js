// Socket store for multiplayer real-time features
import { create } from 'zustand'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

const useSocketStore = create((set, get) => ({
    socket: null,
    connected: false,
    currentSession: null,
    players: [],
    gameStarted: false,
    gameEnded: false,
    leaderboard: [],

    // Connect to socket server
    connect: () => {
        const { socket } = get()
        if (socket?.connected) return

        const newSocket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            autoConnect: true
        })

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id)
            set({ connected: true })
        })

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected')
            set({ connected: false })
        })

        // Lobby updates
        newSocket.on('lobby_update', ({ session_id, players }) => {
            set({ players })
        })

        // Session started
        newSocket.on('session_started', ({ session_id }) => {
            set({ gameStarted: true })
        })

        // Player submitted
        newSocket.on('player_submitted', ({ session_id, user_id, result }) => {
            console.log('Player submitted:', user_id)
        })

        // Session ended
        newSocket.on('session_ended', ({ session_id, leaderboard }) => {
            set({ gameEnded: true, leaderboard })
        })

        // Error handling
        newSocket.on('error', ({ message }) => {
            console.error('Socket error:', message)
        })

        set({ socket: newSocket })
    },

    // Disconnect from socket
    disconnect: () => {
        const { socket } = get()
        if (socket) {
            socket.disconnect()
            set({ socket: null, connected: false })
        }
    },

    // Join a multiplayer session
    joinSession: (sessionId, user) => {
        const { socket } = get()
        if (socket?.connected) {
            socket.emit('join_session', { session_id: sessionId, user })
            set({ currentSession: sessionId })
        }
    },

    // Leave session
    leaveSession: (sessionId, userId) => {
        const { socket } = get()
        if (socket?.connected) {
            socket.emit('leave_session', { session_id: sessionId, user_id: userId })
            set({ currentSession: null, players: [], gameStarted: false, gameEnded: false })
        }
    },

    // Submit answers via socket
    submitAnswers: (sessionId, userId, answers) => {
        const { socket } = get()
        if (socket?.connected) {
            socket.emit('submit_answers', { session_id: sessionId, user_id: userId, answers })
        }
    },

    // Reset game state
    resetGame: () => {
        set({
            currentSession: null,
            players: [],
            gameStarted: false,
            gameEnded: false,
            leaderboard: []
        })
    }
}))

export default useSocketStore
