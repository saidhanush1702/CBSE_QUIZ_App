// Multiplayer Game Page
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import quizApi from '../../api/quizzes'
import multiplayerApi from '../../api/multiplayer'
import useSocketStore from '../../store/socketStore'
import useAuthStore from '../../store/authStore'
import {
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineTrophy
} from 'react-icons/hi2'

export default function MultiplayerGame() {
    const { sessionId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { gameEnded, leaderboard, submitAnswers } = useSocketStore()

    const [lobby, setLobby] = useState(null)
    const [quiz, setQuiz] = useState(null)
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState({})
    const [loading, setLoading] = useState(true)
    const [submitted, setSubmitted] = useState(false)
    const [timeLeft, setTimeLeft] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: lobbyData } = await multiplayerApi.getLobby(sessionId)
                setLobby(lobbyData)

                const [quizRes, questionsRes] = await Promise.all([
                    quizApi.getById(lobbyData.quiz_id),
                    quizApi.getQuestions(lobbyData.quiz_id)
                ])

                setQuiz(quizRes.data)
                setQuestions(questionsRes.data || [])

                if (quizRes.data.duration) {
                    setTimeLeft(quizRes.data.duration * 60)
                }
            } catch (error) {
                console.error('Failed to fetch game data:', error)
                navigate('/multiplayer/join')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [sessionId])

    // Timer
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || submitted) return

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleSubmit()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft, submitted])

    const currentQuestion = questions[currentIndex]

    const handleAnswer = (answer) => {
        if (currentQuestion) {
            setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }))
        }
    }

    const handleSubmit = async () => {
        if (submitted) return
        setSubmitted(true)

        try {
            // Submit via socket
            submitAnswers(sessionId, user.id, answers)
            // Also submit via REST as backup
            await multiplayerApi.submitAnswers(sessionId, answers)
        } catch (error) {
            console.error('Submit error:', error)
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="spinner"></div>
            </div>
        )
    }

    // Show leaderboard when game ends
    if (gameEnded || submitted) {
        return (
            <div className="max-w-lg mx-auto space-y-6">
                <div className="card text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <HiOutlineTrophy className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Game Complete!</h1>
                    <p className="text-slate-400">
                        {gameEnded ? 'Final results are in!' : 'Waiting for others to finish...'}
                    </p>
                </div>

                {leaderboard.length > 0 && (
                    <div className="card">
                        <h2 className="font-semibold text-white mb-4">Leaderboard</h2>
                        <div className="space-y-3">
                            {leaderboard.map((entry, idx) => (
                                <div
                                    key={entry.user_id}
                                    className={`flex items-center gap-3 p-3 rounded-xl ${idx === 0 ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-slate-800/50'
                                        }`}
                                >
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-400'
                                        }`}>
                                        {idx + 1}
                                    </span>
                                    <div className="flex-1">
                                        <div className="font-medium text-white">
                                            {entry.user_id === user.id ? 'You' : `Player ${idx + 1}`}
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold text-white">{entry.score}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button onClick={() => navigate('/')} className="btn-primary w-full">
                    Back to Home
                </button>
            </div>
        )
    }

    const selectedAnswer = answers[currentQuestion?.id]

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="glass-card p-4 mb-6 flex items-center justify-between sticky top-0 z-10">
                <div>
                    <h1 className="font-semibold text-white">{quiz?.title}</h1>
                    <p className="text-sm text-slate-400">
                        Question {currentIndex + 1} of {questions.length}
                    </p>
                </div>
                {timeLeft !== null && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-white'
                        }`}>
                        <HiOutlineClock className="w-5 h-5" />
                        <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                )}
            </div>

            {/* Question */}
            <div className="card mb-6">
                <h2 className="text-lg font-medium text-white mb-6">
                    {currentQuestion?.question}
                </h2>

                {currentQuestion?.options && (
                    <div className="space-y-3">
                        {Object.entries(currentQuestion.options).map(([key, value]) => (
                            <button
                                key={key}
                                onClick={() => handleAnswer(key)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedAnswer === key
                                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                                        : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                                    }`}
                            >
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 text-sm font-bold ${selectedAnswer === key ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'
                                    }`}>
                                    {key.toUpperCase()}
                                </span>
                                {value}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
                <button
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="btn-secondary flex-1"
                >
                    Previous
                </button>

                {currentIndex === questions.length - 1 ? (
                    <button onClick={handleSubmit} className="btn-success flex-1">
                        <HiOutlineCheckCircle className="w-5 h-5 mr-2" />
                        Submit
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                        className="btn-primary flex-1"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    )
}
