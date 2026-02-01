// Quiz Play Page - Take the quiz
import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useQuizStore from '../../store/quizStore'
import {
    HiOutlineClock,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineFlag,
    HiOutlineCheckCircle
} from 'react-icons/hi2'

export default function QuizPlay() {
    const { id } = useParams()
    const navigate = useNavigate()
    const {
        currentQuiz,
        questions,
        currentQuestionIndex,
        answers,
        fetchQuiz,
        startQuiz,
        saveAnswer,
        submitQuiz,
        nextQuestion,
        prevQuestion,
        goToQuestion,
        resetQuiz,
        loading
    } = useQuizStore()

    const [timeLeft, setTimeLeft] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    // Fetch quiz and start attempt
    useEffect(() => {
        const init = async () => {
            await fetchQuiz(id)
            await startQuiz(id)
        }
        init()

        return () => resetQuiz()
    }, [id])

    // Set timer
    useEffect(() => {
        if (currentQuiz?.duration) {
            setTimeLeft(currentQuiz.duration * 60)
        }
    }, [currentQuiz])

    // Timer countdown
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return

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
    }, [timeLeft])

    const currentQuestion = questions[currentQuestionIndex]

    const handleAnswer = useCallback((answer) => {
        if (currentQuestion) {
            saveAnswer(id, currentQuestion.id, answer)
        }
    }, [id, currentQuestion, saveAnswer])

    const handleSubmit = async () => {
        if (submitting) return

        const unanswered = questions.filter(q => !answers[q.id]).length
        if (unanswered > 0) {
            const confirm = window.confirm(
                `You have ${unanswered} unanswered questions. Are you sure you want to submit?`
            )
            if (!confirm) return
        }

        setSubmitting(true)
        try {
            await submitQuiz(id)
            navigate(`/quizzes/${id}/result`)
        } catch (error) {
            console.error('Submit error:', error)
            setSubmitting(false)
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    if (loading || !currentQuestion) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="spinner"></div>
            </div>
        )
    }

    const isAnswered = (qId) => answers[qId] !== undefined
    const selectedAnswer = answers[currentQuestion.id]

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="glass-card p-4 mb-6 flex items-center justify-between sticky top-0 z-10">
                <div>
                    <h1 className="font-semibold text-white truncate max-w-[200px] md:max-w-none">
                        {currentQuiz?.title}
                    </h1>
                    <p className="text-sm text-slate-400">
                        Question {currentQuestionIndex + 1} of {questions.length}
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Question Panel */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Question */}
                    <div className="card">
                        <div className="flex items-start justify-between mb-4">
                            <span className="badge-primary">
                                {currentQuestion.q_type || 'MCQ'}
                            </span>
                            {currentQuestion.max_marks && (
                                <span className="text-sm text-slate-400">
                                    {currentQuestion.max_marks} marks
                                </span>
                            )}
                        </div>

                        <h2 className="text-lg font-medium text-white mb-6">
                            {currentQuestion.question}
                        </h2>

                        {/* Options */}
                        {currentQuestion.options && (
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
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 text-sm font-bold ${selectedAnswer === key
                                                ? 'bg-indigo-500 text-white'
                                                : 'bg-slate-700 text-slate-400'
                                            }`}>
                                            {key.toUpperCase()}
                                        </span>
                                        {value}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* True/False */}
                        {currentQuestion.q_type === 'true_false' && (
                            <div className="grid grid-cols-2 gap-4">
                                {['true', 'false'].map(option => (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswer(option)}
                                        className={`p-4 rounded-xl border-2 text-center font-semibold capitalize transition-all ${selectedAnswer === option
                                                ? 'border-indigo-500 bg-indigo-500/20 text-white'
                                                : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={prevQuestion}
                            disabled={currentQuestionIndex === 0}
                            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
                        >
                            <HiOutlineChevronLeft className="w-5 h-5" />
                            Previous
                        </button>

                        {currentQuestionIndex === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="btn-success flex items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineCheckCircle className="w-5 h-5" />
                                        Submit Quiz
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={nextQuestion}
                                className="btn-primary flex items-center gap-2"
                            >
                                Next
                                <HiOutlineChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Question Navigator */}
                <div className="lg:col-span-1">
                    <div className="card sticky top-24">
                        <h3 className="font-semibold text-white mb-4">Questions</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q, idx) => (
                                <button
                                    key={q.id}
                                    onClick={() => goToQuestion(idx)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${idx === currentQuestionIndex
                                            ? 'bg-indigo-500 text-white'
                                            : isAnswered(q.id)
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-700 space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30"></div>
                                <span className="text-slate-400">Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-slate-800"></div>
                                <span className="text-slate-400">Not Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-indigo-500"></div>
                                <span className="text-slate-400">Current</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="btn-success w-full mt-6"
                        >
                            Submit Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
