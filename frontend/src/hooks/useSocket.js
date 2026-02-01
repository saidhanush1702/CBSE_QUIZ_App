// useSocket Hook - Socket.io connection management
import { useEffect } from 'react'
import useSocketStore from '../store/socketStore'
import useAuthStore from '../store/authStore'

export default function useSocket(sessionId = null) {
    const { user, profile } = useAuthStore()
    const {
        socket,
        connected,
        players,
        gameStarted,
        gameEnded,
        leaderboard,
        connect,
        disconnect,
        joinSession,
        leaveSession,
        submitAnswers,
        resetGame
    } = useSocketStore()

    // Auto-connect on mount if not connected
    useEffect(() => {
        if (!connected) {
            connect()
        }

        return () => {
            // Don't disconnect on unmount - let app manage this
        }
    }, [])

    // Join session if sessionId provided
    useEffect(() => {
        if (sessionId && connected && user) {
            joinSession(sessionId, {
                id: user.id,
                name: profile?.name || user.email,
                avatar_url: profile?.avatar_url
            })
        }

        return () => {
            if (sessionId && user) {
                leaveSession(sessionId, user.id)
            }
        }
    }, [sessionId, connected, user?.id])

    const submit = (answers) => {
        if (sessionId && user) {
            submitAnswers(sessionId, user.id, answers)
        }
    }

    return {
        // State
        socket,
        connected,
        players,
        gameStarted,
        gameEnded,
        leaderboard,

        // Actions
        connect,
        disconnect,
        joinSession: (sId, userData) => joinSession(sId, userData),
        leaveSession: (sId, userId) => leaveSession(sId, userId),
        submit,
        resetGame
    }
}
