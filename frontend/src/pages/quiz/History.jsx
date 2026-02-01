// History Page - View all attempts
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import quizApi from '../../api/quizzes'
import {
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlinePlayCircle,
    HiOutlineClipboardDocumentList
} from 'react-icons/hi2'

export default function History() {
    const { user } = useAuthStore()
    const [attempts, setAttempts] = useState([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('all')

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await quizApi.getUserAttempts(user.id)
                setAttempts(data || [])
            } catch (error) {
                console.error('Failed to fetch history:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user?.id) {
            fetchHistory()
        }
    }, [user?.id])

    const filteredAttempts = attempts.filter(a => {
        if (tab === 'completed') return a.status === 'completed'
        if (tab === 'in_progress') return a.status === 'in_progress'
        return true
    })

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">My History</h1>
                <p className="text-slate-400 mt-1">View all your quiz attempts</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                {[
                    { key: 'all', label: 'All' },
                    { key: 'completed', label: 'Completed' },
                    { key: 'in_progress', label: 'In Progress' }
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Attempts List */}
            {filteredAttempts.length === 0 ? (
                <div className="card text-center py-16">
                    <HiOutlineClipboardDocumentList className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No attempts found</h3>
                    <p className="text-slate-400 mb-6">Start taking quizzes to see your history</p>
                    <Link to="/quizzes" className="btn-primary">Browse Quizzes</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAttempts.map(attempt => (
                        <Link
                            key={attempt.id}
                            to={attempt.status === 'completed'
                                ? `/quizzes/${attempt.quiz_id}/result`
                                : `/quizzes/${attempt.quiz_id}`
                            }
                            className="card-hover flex items-center gap-4"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${attempt.status === 'completed'
                                    ? 'bg-green-500/20'
                                    : 'bg-amber-500/20'
                                }`}>
                                {attempt.status === 'completed' ? (
                                    <HiOutlineCheckCircle className="w-6 h-6 text-green-400" />
                                ) : (
                                    <HiOutlinePlayCircle className="w-6 h-6 text-amber-400" />
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold text-white">
                                    {attempt.quizzes?.title || 'Unknown Quiz'}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                                    <span>{attempt.quizzes?.subject || 'General'}</span>
                                    <span className="flex items-center gap-1">
                                        <HiOutlineClock className="w-4 h-4" />
                                        {formatDate(attempt.started_at)}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                {attempt.status === 'completed' ? (
                                    <>
                                        <div className="text-lg font-bold text-white">
                                            {attempt.score}/{attempt.total_marks}
                                        </div>
                                        <div className="text-sm text-slate-400">
                                            {attempt.total_marks > 0
                                                ? Math.round((attempt.score / attempt.total_marks) * 100)
                                                : 0
                                            }%
                                        </div>
                                    </>
                                ) : (
                                    <span className="badge-warning">In Progress</span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
