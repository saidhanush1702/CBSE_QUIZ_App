// Question Bank Page
import { useEffect, useState } from 'react'
import { questionApi } from '../../api/questions'
import {
    HiOutlinePlusCircle,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineMagnifyingGlass,
    HiOutlineFunnel
} from 'react-icons/hi2'

const SUBJECTS = ['All', 'Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Computer Science']
const TYPES = ['All', 'mcq', 'true_false', 'fill_blank', 'short']

export default function QuestionBank() {
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState({ subject: '', q_type: '' })
    const [showFilters, setShowFilters] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState(null)

    const fetchQuestions = async () => {
        try {
            setLoading(true)
            const params = {}
            if (filters.subject && filters.subject !== 'All') params.subject = filters.subject
            if (filters.q_type && filters.q_type !== 'All') params.q_type = filters.q_type
            const { data } = await questionApi.getAll(params)
            setQuestions(data || [])
        } catch (error) {
            console.error('Failed to fetch questions:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuestions()
    }, [filters])

    const filteredQuestions = questions.filter(q =>
        q.question.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this question?')) return
        try {
            await questionApi.delete(id)
            setQuestions(prev => prev.filter(q => q.id !== id))
        } catch (error) {
            console.error('Failed to delete:', error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Question Bank</h1>
                    <p className="text-slate-400">Manage your questions</p>
                </div>
                <button
                    onClick={() => { setEditingQuestion(null); setShowModal(true) }}
                    className="btn-primary flex items-center gap-2"
                >
                    <HiOutlinePlusCircle className="w-5 h-5" />
                    Add Question
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search questions..."
                        className="input pl-12"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn-secondary flex items-center gap-2"
                >
                    <HiOutlineFunnel className="w-5 h-5" />
                    Filters
                </button>
            </div>

            {showFilters && (
                <div className="card grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
                        <select
                            value={filters.q_type}
                            onChange={(e) => setFilters({ ...filters, q_type: e.target.value })}
                            className="input"
                        >
                            {TYPES.map(t => (
                                <option key={t} value={t === 'All' ? '' : t}>{t === 'All' ? 'All' : t.replace('_', ' ').toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Questions List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-5 bg-slate-700 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : filteredQuestions.length === 0 ? (
                <div className="card text-center py-16">
                    <p className="text-slate-400">No questions found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredQuestions.map(q => (
                        <div key={q.id} className="card">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-white">{q.question}</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="badge-primary text-xs">{q.q_type || 'MCQ'}</span>
                                        {q.subject && (
                                            <span className="badge bg-slate-700 text-slate-300 border-slate-600 text-xs">
                                                {q.subject}
                                            </span>
                                        )}
                                        <span className="text-xs text-slate-500">{q.max_marks || 1} marks</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => { setEditingQuestion(q); setShowModal(true) }}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                                    >
                                        <HiOutlinePencilSquare className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(q.id)}
                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg"
                                    >
                                        <HiOutlineTrash className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal - simplified for now */}
            {showModal && (
                <QuestionModal
                    question={editingQuestion}
                    onClose={() => setShowModal(false)}
                    onSave={() => {
                        setShowModal(false)
                        fetchQuestions()
                    }}
                />
            )}
        </div>
    )
}

// Question Modal Component
function QuestionModal({ question, onClose, onSave }) {
    const [formData, setFormData] = useState({
        question: question?.question || '',
        q_type: question?.q_type || 'mcq',
        subject: question?.subject || '',
        max_marks: question?.max_marks || 1,
        correct_answer: question?.correct_answer || '',
        options: question?.options || { a: '', b: '', c: '', d: '' }
    })
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSaving(true)
            if (question) {
                await questionApi.update(question.id, formData)
            } else {
                await questionApi.create(formData)
            }
            onSave()
        } catch (error) {
            console.error('Save error:', error)
            alert('Failed to save question')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="card max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-6">
                    {question ? 'Edit Question' : 'Add Question'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Question *</label>
                        <textarea
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            className="input min-h-[100px]"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                            <select
                                value={formData.q_type}
                                onChange={(e) => setFormData({ ...formData, q_type: e.target.value })}
                                className="input"
                            >
                                <option value="mcq">MCQ</option>
                                <option value="true_false">True/False</option>
                                <option value="fill_blank">Fill Blank</option>
                                <option value="short">Short Answer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Marks</label>
                            <input
                                type="number"
                                value={formData.max_marks}
                                onChange={(e) => setFormData({ ...formData, max_marks: parseInt(e.target.value) })}
                                min="1"
                                className="input"
                            />
                        </div>
                    </div>

                    {formData.q_type === 'mcq' && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-300">Options</label>
                            {['a', 'b', 'c', 'd'].map(key => (
                                <div key={key} className="flex items-center gap-2">
                                    <span className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-400">
                                        {key.toUpperCase()}
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.options[key]}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            options: { ...formData.options, [key]: e.target.value }
                                        })}
                                        className="input flex-1"
                                        placeholder={`Option ${key.toUpperCase()}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Correct Answer</label>
                        <input
                            type="text"
                            value={formData.correct_answer}
                            onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                            className="input"
                            placeholder={formData.q_type === 'mcq' ? 'e.g., a' : 'Enter correct answer'}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="btn-primary flex-1">
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
