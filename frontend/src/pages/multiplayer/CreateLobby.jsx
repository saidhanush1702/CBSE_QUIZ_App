// Create Lobby Page (Teacher)
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import quizApi from '../../api/quizzes'
import multiplayerApi from '../../api/multiplayer'
import useAuthStore from '../../store/authStore'
import {
    HiOutlineArrowLeft,
    HiOutlineUsers
} from 'react-icons/hi2'

export default function CreateLobby() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [quizzes, setQuizzes] = useState([])
    const [selectedQuiz, setSelectedQuiz] = useState('')
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const { data } = await quizApi.getAll({ mode: 'multi' })
                setQuizzes(data || [])
            } catch (error) {
                console.error('Failed to fetch quizzes:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchQuizzes()
    }, [])

    const handleCreate = async () => {
        if (!selectedQuiz) return
        try {
            setCreating(true)
            const { data } = await multiplayerApi.createLobby(selectedQuiz)
            navigate(`/multiplayer/lobby/${data.id}`)
        } catch (error) {
            console.error('Failed to create lobby:', error)
            alert('Failed to create lobby')
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white">
                    <HiOutlineArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">Create Lobby</h1>
                    <p className="text-slate-400">Host a multiplayer quiz session</p>
                </div>
            </div>

            <div className="card space-y-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <HiOutlineUsers className="w-8 h-8 text-white" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Select a Quiz
                    </label>
                    {loading ? (
                        <div className="h-12 bg-slate-800 rounded animate-pulse"></div>
                    ) : quizzes.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">
                            No multiplayer quizzes available. Create one first!
                        </p>
                    ) : (
                        <select
                            value={selectedQuiz}
                            onChange={(e) => setSelectedQuiz(e.target.value)}
                            className="input"
                        >
                            <option value="">Choose a quiz...</option>
                            {quizzes.map(q => (
                                <option key={q.id} value={q.id}>{q.title}</option>
                            ))}
                        </select>
                    )}
                </div>

                <button
                    onClick={handleCreate}
                    disabled={!selectedQuiz || creating}
                    className="btn-primary w-full"
                >
                    {creating ? 'Creating...' : 'Create Lobby'}
                </button>
            </div>
        </div>
    )
}
