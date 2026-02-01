// Quiz Result Page
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import quizApi from '../../api/quizzes'
import {
    HiOutlineTrophy,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineArrowPath,
    HiOutlineHome,
    HiOutlineBookOpen
} from 'react-icons/hi2'

export default function QuizResult() {
    const { id } = useParams()
    const { user } = useAuthStore()
    const [result, setResult] = useState(null)
    const [quiz, setQuiz] = useState(null)
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const [resultRes, quizRes, questionsRes] = await Promise.all([
                    quizApi.getResult(id, user.id),
                    quizApi.getById(id),
                    quizApi.getQuestions(id)
                ])
                setResult(resultRes.data)
                setQuiz(quizRes.data)
                setQuestions(questionsRes.data || [])
            } catch (error) {
                console.error('Failed to fetch result:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user?.id) {
            fetchResult()
        }
    }, [id, user?.id])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="spinner"></div>
            </div>
        )
    }

    if (!result) {
        return (
            <div className="text-center py-16">
                <h2 className="text-xl font-semibold text-white mb-4">Result not found</h2>
                <Link to="/quizzes" className="btn-primary">Back to Quizzes</Link>
            </div>
        )
    }

    const percentage = result.total_marks > 0
        ? Math.round((result.score / result.total_marks) * 100)
        : 0

    const getGrade = () => {
        if (percentage >= 90) return { grade: 'A+', color: 'text-emerald-400', message: 'Excellent!' }
        if (percentage >= 80) return { grade: 'A', color: 'text-green-400', message: 'Great job!' }
        if (percentage >= 70) return { grade: 'B', color: 'text-blue-400', message: 'Good work!' }
        if (percentage >= 60) return { grade: 'C', color: 'text-yellow-400', message: 'Keep practicing!' }
        if (percentage >= 50) return { grade: 'D', color: 'text-orange-400', message: 'Needs improvement' }
        return { grade: 'F', color: 'text-red-400', message: 'Keep trying!' }
    }

    const gradeInfo = getGrade()
    const correctCount = questions.filter(q => result.answers?.[q.id] === q.correct_answer).length
    const incorrectCount = questions.length - correctCount

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Score Card */}
            <div className="card text-center relative overflow-hidden">
                <div className="absolute inset-0 gradient-bg opacity-10"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                        <HiOutlineTrophy className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-2">{quiz?.title}</h1>
                    <p className="text-slate-400">Quiz Completed!</p>

                    <div className="mt-8 mb-6">
                        <div className={`text-7xl font-bold ${gradeInfo.color}`}>
                            {gradeInfo.grade}
                        </div>
                        <p className="text-slate-400 mt-2">{gradeInfo.message}</p>
                    </div>

                    <div className="flex justify-center gap-8">
                        <div>
                            <div className="text-3xl font-bold text-white">{result.score}</div>
                            <div className="text-sm text-slate-400">Score</div>
                        </div>
                        <div className="w-px bg-slate-700"></div>
                        <div>
                            <div className="text-3xl font-bold text-white">{result.total_marks}</div>
                            <div className="text-sm text-slate-400">Total</div>
                        </div>
                        <div className="w-px bg-slate-700"></div>
                        <div>
                            <div className="text-3xl font-bold text-white">{percentage}%</div>
                            <div className="text-sm text-slate-400">Accuracy</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="card flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <HiOutlineCheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{correctCount}</div>
                        <div className="text-sm text-slate-400">Correct</div>
                    </div>
                </div>
                <div className="card flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                        <HiOutlineXCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{incorrectCount}</div>
                        <div className="text-sm text-slate-400">Incorrect</div>
                    </div>
                </div>
            </div>

            {/* Answer Review */}
            <div className="card">
                <h2 className="text-lg font-semibold text-white mb-4">Answer Review</h2>
                <div className="space-y-4">
                    {questions.map((question, idx) => {
                        const userAnswer = result.answers?.[question.id]
                        const isCorrect = userAnswer === question.correct_answer

                        return (
                            <div
                                key={question.id}
                                className={`p-4 rounded-xl border ${isCorrect
                                        ? 'border-green-500/30 bg-green-500/5'
                                        : 'border-red-500/30 bg-red-500/5'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                                        }`}>
                                        {isCorrect ? (
                                            <HiOutlineCheckCircle className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <HiOutlineXCircle className="w-5 h-5 text-red-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium mb-2">
                                            {idx + 1}. {question.question}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <span className="text-slate-400">
                                                Your answer:{' '}
                                                <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                                                    {userAnswer
                                                        ? question.options?.[userAnswer] || userAnswer
                                                        : 'Not answered'
                                                    }
                                                </span>
                                            </span>
                                            {!isCorrect && (
                                                <span className="text-slate-400">
                                                    Correct:{' '}
                                                    <span className="text-green-400">
                                                        {question.options?.[question.correct_answer] || question.correct_answer}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                        {question.explanation && !isCorrect && (
                                            <p className="mt-2 text-sm text-slate-400 bg-slate-800/50 p-2 rounded">
                                                {question.explanation}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
                <Link to="/" className="btn-secondary flex-1 flex items-center justify-center gap-2">
                    <HiOutlineHome className="w-5 h-5" />
                    Go Home
                </Link>
                <Link to="/revision" className="btn-secondary flex-1 flex items-center justify-center gap-2">
                    <HiOutlineBookOpen className="w-5 h-5" />
                    Revision
                </Link>
                <Link to="/quizzes" className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <HiOutlineArrowPath className="w-5 h-5" />
                    More Quizzes
                </Link>
            </div>
        </div>
    )
}
