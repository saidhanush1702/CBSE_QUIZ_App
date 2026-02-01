// Quiz Detail Page
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import quizApi from '../../api/quizzes'
import {
    HiOutlineClock,
    HiOutlineClipboardDocumentList,
    HiOutlinePlayCircle,
    HiOutlineArrowLeft,
    HiOutlineUsers,
    HiOutlineAcademicCap,
    HiOutlineCheckCircle
} from 'react-icons/hi2'

export default function QuizDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [quiz, setQuiz] = useState(null)
    const [questions, setQuestions] = useState([])
    const [attempt, setAttempt] = useState(null)
    const [loading, setLoading] = useState(true)
    const [starting, setStarting] = useState(false)

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const [quizRes, questionsRes] = await Promise.all([
                    quizApi.getById(id),
                    quizApi.getQuestions(id)
                ])
                setQuiz(quizRes.data)
                setQuestions(questionsRes.data || [])

                // Check for existing attempt
                if (user?.id) {
                    try {
                        const resultRes = await quizApi.getResult(id, user.id)
                        if (resultRes.data) {
                            setAttempt(resultRes.data)
                        }
                    } catch (e) {
                        // No attempt found, that's fine
                    }
                }
            } catch (error) {
                console.error('Failed to fetch quiz:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchQuiz()
    }, [id, user?.id])

    const handleStartQuiz = async () => {
        try {
            setStarting(true)
            await quizApi.start(id)
            navigate(`/quizzes/${id}/play`)
        } catch (error) {
            console.error('Failed to start quiz:', error)
            setStarting(false)
        }
    }

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="card animate-pulse">
                    <div className="h-8 bg-slate-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2 mb-8"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-slate-700 rounded w-full"></div>
                        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                        <div className="h-4 bg-slate-700 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!quiz) {
        return (
            <div className="text-center py-16">
                <h2 className="text-xl font-semibold text-white mb-4">Quiz not found</h2>
                <Link to="/quizzes" className="btn-primary">Back to Quizzes</Link>
            </div>
        )
    }

    const isCompleted = attempt?.status === 'completed'

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Back Button */}
            <Link
                to="/quizzes"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white"
            >
                <HiOutlineArrowLeft className="w-5 h-5" />
                Back to quizzes
            </Link>

            {/* Quiz Header */}
            <div className="card">
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`badge ${quiz.mode === 'multi' ? 'badge-warning' : 'badge-primary'}`}>
                        {quiz.mode === 'multi' ? (
                            <><HiOutlineUsers className="w-3 h-3 mr-1" /> Multiplayer</>
                        ) : 'Individual'}
                    </span>
                    <span className="badge-success">
                        {quiz.method === 'test' ? 'Test' : 'Revision'}
                    </span>
                    {quiz.subject && (
                        <span className="badge bg-slate-700 text-slate-300 border-slate-600">
                            {quiz.subject}
                        </span>
                    )}
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">{quiz.title}</h1>

                {/* Quiz Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700">
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/20 flex items-center justify-center mb-2">
                            <HiOutlineClipboardDocumentList className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div className="text-xl font-bold text-white">{questions.length}</div>
                        <div className="text-sm text-slate-400">Questions</div>
                    </div>

                    {quiz.duration && (
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/20 flex items-center justify-center mb-2">
                                <HiOutlineClock className="w-6 h-6 text-amber-400" />
                            </div>
                            <div className="text-xl font-bold text-white">{quiz.duration}</div>
                            <div className="text-sm text-slate-400">Minutes</div>
                        </div>
                    )}

                    {quiz.max_marks && (
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/20 flex items-center justify-center mb-2">
                                <HiOutlineAcademicCap className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div className="text-xl font-bold text-white">{quiz.max_marks}</div>
                            <div className="text-sm text-slate-400">Total Marks</div>
                        </div>
                    )}

                    {quiz.timer_per_question && (
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/20 flex items-center justify-center mb-2">
                                <HiOutlineClock className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="text-xl font-bold text-white">{quiz.timer_per_question}s</div>
                            <div className="text-sm text-slate-400">Per Question</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Attempt Status */}
            {attempt && (
                <div className={`card ${isCompleted ? 'border-green-500/30' : 'border-amber-500/30'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCompleted ? 'bg-green-500/20' : 'bg-amber-500/20'
                            }`}>
                            {isCompleted ? (
                                <HiOutlineCheckCircle className="w-6 h-6 text-green-400" />
                            ) : (
                                <HiOutlineClock className="w-6 h-6 text-amber-400" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-white">
                                {isCompleted ? 'Quiz Completed' : 'Quiz In Progress'}
                            </h3>
                            <p className="text-sm text-slate-400">
                                {isCompleted
                                    ? `Score: ${attempt.score}/${attempt.total_marks}`
                                    : 'You have an ongoing attempt'
                                }
                            </p>
                        </div>
                        {isCompleted ? (
                            <Link to={`/quizzes/${id}/result`} className="btn-primary">
                                View Result
                            </Link>
                        ) : (
                            <button onClick={handleStartQuiz} className="btn-primary">
                                Continue
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Start Button */}
            {!isCompleted && (
                <button
                    onClick={handleStartQuiz}
                    disabled={starting}
                    className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                >
                    {starting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Starting...
                        </>
                    ) : (
                        <>
                            <HiOutlinePlayCircle className="w-6 h-6" />
                            {attempt ? 'Resume Quiz' : 'Start Quiz'}
                        </>
                    )}
                </button>
            )}

            {/* Instructions */}
            <div className="card">
                <h3 className="font-semibold text-white mb-4">Instructions</h3>
                <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-400 mt-1">•</span>
                        Read each question carefully before answering.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-400 mt-1">•</span>
                        {quiz.timer_per_question
                            ? `You have ${quiz.timer_per_question} seconds per question.`
                            : quiz.duration
                                ? `Total time: ${quiz.duration} minutes.`
                                : 'There is no time limit for this quiz.'
                        }
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-400 mt-1">•</span>
                        You can navigate between questions using the navigation panel.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-400 mt-1">•</span>
                        Click "Submit" when you're done to see your results.
                    </li>
                </ul>
            </div>
        </div>
    )
}
