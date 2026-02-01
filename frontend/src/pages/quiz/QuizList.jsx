// Quiz List Page - Browse all quizzes
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import quizApi from '../../api/quizzes'
import {
    HiOutlineClock,
    HiOutlineUsers,
    HiOutlineFunnel,
    HiOutlineMagnifyingGlass,
    HiOutlineClipboardDocumentCheck
} from 'react-icons/hi2'

const SUBJECTS = ['All', 'Mathematics', 'Science', 'English', 'Hindi', 'Social Science']
const MODES = [
    { value: '', label: 'All Modes' },
    { value: 'individual', label: 'Individual' },
    { value: 'multi', label: 'Multiplayer' }
]
const METHODS = [
    { value: '', label: 'All Types' },
    { value: 'test', label: 'Test' },
    { value: 'revision', label: 'Revision' }
]

export default function QuizList() {
    const [quizzes, setQuizzes] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState({
        subject: '',
        mode: '',
        method: ''
    })
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true)
                const params = {}
                if (filters.mode) params.mode = filters.mode
                if (filters.subject && filters.subject !== 'All') params.subject = filters.subject

                const { data } = await quizApi.getAll(params)
                setQuizzes(data || [])
            } catch (error) {
                console.error('Failed to fetch quizzes:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchQuizzes()
    }, [filters])

    const filteredQuizzes = quizzes.filter(quiz => {
        if (search && !quiz.title.toLowerCase().includes(search.toLowerCase())) {
            return false
        }
        if (filters.method && quiz.method !== filters.method) {
            return false
        }
        return true
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Browse Quizzes</h1>
                <p className="text-slate-400 mt-1">Find and take quizzes to test your knowledge</p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search quizzes..."
                        className="input pl-12"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-slate-700' : ''}`}
                >
                    <HiOutlineFunnel className="w-5 h-5" />
                    Filters
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="card grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
                        <select
                            value={filters.subject}
                            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                            className="input"
                        >
                            {SUBJECTS.map(s => (
                                <option key={s} value={s === 'All' ? '' : s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Mode</label>
                        <select
                            value={filters.mode}
                            onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
                            className="input"
                        >
                            {MODES.map(m => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
                        <select
                            value={filters.method}
                            onChange={(e) => setFilters({ ...filters, method: e.target.value })}
                            className="input"
                        >
                            {METHODS.map(m => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Quiz Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-5 bg-slate-700 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
                            <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
                            <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            ) : filteredQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredQuizzes.map(quiz => (
                        <Link
                            key={quiz.id}
                            to={`/quizzes/${quiz.id}`}
                            className="card-hover group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                                    {quiz.title}
                                </h3>
                            </div>

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

                            <div className="flex items-center justify-between text-sm text-slate-500">
                                <div className="flex items-center gap-4">
                                    {quiz.duration && (
                                        <span className="flex items-center gap-1">
                                            <HiOutlineClock className="w-4 h-4" />
                                            {quiz.duration} min
                                        </span>
                                    )}
                                    {quiz.max_marks && (
                                        <span>{quiz.max_marks} marks</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-16">
                    <HiOutlineClipboardDocumentCheck className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No quizzes found</h3>
                    <p className="text-slate-400">Try adjusting your filters or search terms</p>
                </div>
            )}
        </div>
    )
}
