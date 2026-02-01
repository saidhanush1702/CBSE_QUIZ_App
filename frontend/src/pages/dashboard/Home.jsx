// Home Dashboard Page
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import quizApi from '../../api/quizzes'
import {
    HiOutlinePlayCircle,
    HiOutlineClipboardDocumentCheck,
    HiOutlineBookOpen,
    HiOutlineTrophy,
    HiOutlineArrowRight,
    HiOutlineUsers,
    HiOutlineClock,
    HiOutlineSparkles
} from 'react-icons/hi2'

const StatCard = ({ icon: Icon, label, value, color, to }) => (
    <Link
        to={to}
        className="card-hover flex items-center gap-4"
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm text-slate-400">{label}</div>
        </div>
    </Link>
)

const QuizCard = ({ quiz }) => (
    <Link
        to={`/quizzes/${quiz.id}`}
        className="card-hover group"
    >
        <div className="flex items-start justify-between mb-4">
            <div>
                <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {quiz.title}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                    {quiz.subject || 'General'}
                </p>
            </div>
            <span className={`badge ${quiz.mode === 'multi' ? 'badge-warning' : 'badge-primary'}`}>
                {quiz.mode === 'multi' ? 'Multiplayer' : 'Individual'}
            </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-500">
            {quiz.duration && (
                <span className="flex items-center gap-1">
                    <HiOutlineClock className="w-4 h-4" />
                    {quiz.duration} min
                </span>
            )}
            <span className="flex items-center gap-1">
                <HiOutlineClipboardDocumentCheck className="w-4 h-4" />
                {quiz.method === 'test' ? 'Test' : 'Revision'}
            </span>
        </div>
    </Link>
)

export default function Home() {
    const { user, profile } = useAuthStore()
    const [stats, setStats] = useState({ completed: 0, inProgress: 0, accuracy: 0 })
    const [latestQuizzes, setLatestQuizzes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch latest quizzes
                const quizzesRes = await quizApi.getLatest(6)
                setLatestQuizzes(quizzesRes.data || [])

                // Fetch user stats
                if (user?.id) {
                    const attemptsRes = await quizApi.getUserAttempts(user.id)
                    const attempts = attemptsRes.data || []

                    const completed = attempts.filter(a => a.status === 'completed').length
                    const inProgress = attempts.filter(a => a.status === 'in_progress').length
                    const totalScore = attempts.reduce((acc, a) => acc + (a.score || 0), 0)
                    const totalMarks = attempts.reduce((acc, a) => acc + (a.total_marks || 0), 0)
                    const accuracy = totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0

                    setStats({ completed, inProgress, accuracy })
                }
            } catch (error) {
                console.error('Failed to fetch data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user?.id])

    const greeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good Morning'
        if (hour < 17) return 'Good Afternoon'
        return 'Good Evening'
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-2xl gradient-bg p-8">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                        <HiOutlineSparkles className="w-4 h-4" />
                        {greeting()}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {profile?.name || user?.email?.split('@')[0]}!
                    </h1>
                    <p className="text-white/80 max-w-md">
                        Ready to continue your learning journey? Pick up where you left off or try something new.
                    </p>

                    <div className="flex gap-4 mt-6">
                        <Link to="/quizzes" className="btn bg-white/20 text-white hover:bg-white/30 backdrop-blur">
                            <HiOutlinePlayCircle className="w-5 h-5 mr-2" />
                            Start a Quiz
                        </Link>
                        <Link to="/multiplayer/join" className="btn bg-white/10 text-white hover:bg-white/20 backdrop-blur border border-white/20">
                            <HiOutlineUsers className="w-5 h-5 mr-2" />
                            Join Multiplayer
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    icon={HiOutlineClipboardDocumentCheck}
                    label="Quizzes Completed"
                    value={stats.completed}
                    color="bg-gradient-to-br from-indigo-500 to-purple-500"
                    to="/history"
                />
                <StatCard
                    icon={HiOutlineBookOpen}
                    label="In Progress"
                    value={stats.inProgress}
                    color="bg-gradient-to-br from-amber-500 to-orange-500"
                    to="/history"
                />
                <StatCard
                    icon={HiOutlineTrophy}
                    label="Accuracy"
                    value={`${stats.accuracy}%`}
                    color="bg-gradient-to-br from-emerald-500 to-teal-500"
                    to="/revision"
                />
            </div>

            {/* Latest Quizzes */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Latest Quizzes</h2>
                    <Link
                        to="/quizzes"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm"
                    >
                        View All
                        <HiOutlineArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-5 bg-slate-700 rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
                                <div className="h-3 bg-slate-700 rounded w-1/3"></div>
                            </div>
                        ))}
                    </div>
                ) : latestQuizzes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {latestQuizzes.map(quiz => (
                            <QuizCard key={quiz.id} quiz={quiz} />
                        ))}
                    </div>
                ) : (
                    <div className="card text-center py-12">
                        <HiOutlineClipboardDocumentCheck className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400">No quizzes available yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}
