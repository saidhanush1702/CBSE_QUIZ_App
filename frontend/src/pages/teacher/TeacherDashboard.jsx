// Teacher Dashboard
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import quizApi from '../../api/quizzes'
import {
    HiOutlinePlusCircle,
    HiOutlineClipboardDocumentList,
    HiOutlineBookOpen,
    HiOutlineUsers,
    HiOutlineChartBar,
    HiOutlineArrowTrendingUp
} from 'react-icons/hi2'

const ActionCard = ({ to, icon: Icon, title, description, color }) => (
    <Link to={to} className="card-hover flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
    </Link>
)

export default function TeacherDashboard() {
    const { user } = useAuthStore()
    const [myQuizzes, setMyQuizzes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMyQuizzes = async () => {
            try {
                const { data } = await quizApi.getAll({ created_by: user.id })
                setMyQuizzes(data || [])
            } catch (error) {
                console.error('Failed to fetch quizzes:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user?.id) {
            fetchMyQuizzes()
        }
    }, [user?.id])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
                <p className="text-slate-400 mt-1">Manage your quizzes and questions</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ActionCard
                    to="/teacher/create-quiz"
                    icon={HiOutlinePlusCircle}
                    title="Create Quiz"
                    description="Build a new quiz"
                    color="bg-gradient-to-br from-indigo-500 to-purple-500"
                />
                <ActionCard
                    to="/teacher/questions"
                    icon={HiOutlineBookOpen}
                    title="Question Bank"
                    description="Manage questions"
                    color="bg-gradient-to-br from-emerald-500 to-teal-500"
                />
                <ActionCard
                    to="/multiplayer/create"
                    icon={HiOutlineUsers}
                    title="Create Lobby"
                    description="Start multiplayer"
                    color="bg-gradient-to-br from-amber-500 to-orange-500"
                />
                <ActionCard
                    to="/quizzes"
                    icon={HiOutlineClipboardDocumentList}
                    title="All Quizzes"
                    description="Browse quizzes"
                    color="bg-gradient-to-br from-pink-500 to-rose-500"
                />
            </div>

            {/* My Quizzes */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">My Quizzes</h2>
                    <Link
                        to="/teacher/create-quiz"
                        className="btn-primary text-sm flex items-center gap-2"
                    >
                        <HiOutlinePlusCircle className="w-4 h-4" />
                        New Quiz
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-5 bg-slate-700 rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : myQuizzes.length === 0 ? (
                    <div className="card text-center py-12">
                        <HiOutlineClipboardDocumentList className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400 mb-4">You haven't created any quizzes yet</p>
                        <Link to="/teacher/create-quiz" className="btn-primary">
                            Create Your First Quiz
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myQuizzes.slice(0, 6).map(quiz => (
                            <Link
                                key={quiz.id}
                                to={`/quizzes/${quiz.id}`}
                                className="card-hover"
                            >
                                <h3 className="font-semibold text-white mb-2">{quiz.title}</h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="badge-primary text-xs">{quiz.mode}</span>
                                    <span className="badge-success text-xs">{quiz.method}</span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Created {new Date(quiz.created_at).toLocaleDateString()}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
