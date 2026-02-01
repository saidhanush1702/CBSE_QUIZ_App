// Lobby Waiting Room
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import multiplayerApi from '../../api/multiplayer'
import useSocketStore from '../../store/socketStore'
import useAuthStore from '../../store/authStore'
import {
    HiOutlineUsers,
    HiOutlineClipboard,
    HiOutlineCheckCircle,
    HiOutlinePlayCircle
} from 'react-icons/hi2'

export default function Lobby() {
    const { sessionId } = useParams()
    const navigate = useNavigate()
    const { user, profile } = useAuthStore()
    const { connect, joinSession, players, gameStarted, leaveSession } = useSocketStore()
    const [lobby, setLobby] = useState(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [starting, setStarting] = useState(false)

    useEffect(() => {
        const fetchLobby = async () => {
            try {
                const { data } = await multiplayerApi.getLobby(sessionId)
                setLobby(data)

                // Connect and join socket room
                connect()
                joinSession(sessionId, {
                    id: user.id,
                    name: profile?.name || user.email,
                    avatar_url: profile?.avatar_url
                })
            } catch (error) {
                console.error('Failed to fetch lobby:', error)
                navigate('/multiplayer/join')
            } finally {
                setLoading(false)
            }
        }

        fetchLobby()

        return () => {
            leaveSession(sessionId, user?.id)
        }
    }, [sessionId])

    useEffect(() => {
        if (gameStarted) {
            navigate(`/multiplayer/game/${sessionId}`)
        }
    }, [gameStarted, sessionId])

    const copyCode = () => {
        navigator.clipboard.writeText(lobby?.join_code || '')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleStart = async () => {
        try {
            setStarting(true)
            await multiplayerApi.startSession(sessionId)
        } catch (error) {
            console.error('Start error:', error)
            alert('Failed to start session')
        } finally {
            setStarting(false)
        }
    }

    const isHost = lobby?.host_id === user?.id
    const currentPlayers = players.length > 0 ? players : lobby?.players || []

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white">Waiting Room</h1>
                <p className="text-slate-400">Share the code with friends to join</p>
            </div>

            {/* Join Code */}
            <div className="card text-center">
                <p className="text-sm text-slate-400 mb-2">Join Code</p>
                <div className="flex items-center justify-center gap-4">
                    <span className="text-4xl font-bold tracking-widest text-white font-mono">
                        {lobby?.join_code}
                    </span>
                    <button
                        onClick={copyCode}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                    >
                        {copied ? (
                            <HiOutlineCheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                            <HiOutlineClipboard className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Players */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-white flex items-center gap-2">
                        <HiOutlineUsers className="w-5 h-5" />
                        Players ({currentPlayers.length})
                    </h2>
                </div>

                <div className="space-y-3">
                    {currentPlayers.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">Waiting for players...</p>
                    ) : (
                        currentPlayers.map((player, idx) => (
                            <div
                                key={player.id || idx}
                                className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                    {player.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-white">{player.name}</div>
                                    {player.id === lobby?.host_id && (
                                        <span className="text-xs text-amber-400">Host</span>
                                    )}
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Start Button (Host Only) */}
            {isHost && (
                <button
                    onClick={handleStart}
                    disabled={currentPlayers.length < 1 || starting}
                    className="btn-success w-full py-4 text-lg flex items-center justify-center gap-2"
                >
                    {starting ? (
                        'Starting...'
                    ) : (
                        <>
                            <HiOutlinePlayCircle className="w-6 h-6" />
                            Start Game
                        </>
                    )}
                </button>
            )}

            {!isHost && (
                <div className="card text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-slate-400">Waiting for host to start the game...</p>
                </div>
            )}
        </div>
    )
}
