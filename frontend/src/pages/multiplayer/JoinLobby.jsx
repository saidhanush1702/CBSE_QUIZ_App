// Join Lobby Page
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import multiplayerApi from '../../api/multiplayer'
import useSocketStore from '../../store/socketStore'
import useAuthStore from '../../store/authStore'
import {
    HiOutlineUsers,
    HiOutlineArrowRight
} from 'react-icons/hi2'

export default function JoinLobby() {
    const navigate = useNavigate()
    const { user, profile } = useAuthStore()
    const { connect, joinSession } = useSocketStore()
    const [code, setCode] = useState('')
    const [joining, setJoining] = useState(false)
    const [error, setError] = useState('')

    const handleJoin = async (e) => {
        e.preventDefault()
        if (!code.trim()) return

        try {
            setJoining(true)
            setError('')

            // Join via API
            const { data } = await multiplayerApi.joinLobby(code.toUpperCase())

            // Connect socket and join session
            connect()
            joinSession(data.id, {
                id: user.id,
                name: profile?.name || user.email,
                avatar_url: profile?.avatar_url
            })

            navigate(`/multiplayer/lobby/${data.id}`)
        } catch (error) {
            console.error('Join error:', error)
            setError('Invalid code or lobby not found')
        } finally {
            setJoining(false)
        }
    }

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Join Game</h1>
                <p className="text-slate-400">Enter the lobby code to join a multiplayer quiz</p>
            </div>

            <div className="card">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <HiOutlineUsers className="w-8 h-8 text-white" />
                </div>

                <form onSubmit={handleJoin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Lobby Code
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            className="input text-center text-2xl tracking-widest font-mono uppercase"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={code.length < 6 || joining}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {joining ? (
                            'Joining...'
                        ) : (
                            <>
                                Join Game
                                <HiOutlineArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
