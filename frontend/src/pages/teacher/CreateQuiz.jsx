// Create Quiz Page
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import quizApi from '../../api/quizzes'
import { questionApi } from '../../api/questions'
import {
    HiOutlineArrowLeft,
    HiOutlinePlusCircle,
    HiOutlineTrash,
    HiOutlineCheckCircle
} from 'react-icons/hi2'

const SUBJECTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Computer Science']

export default function CreateQuiz() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        mode: 'individual',
        method: 'test',
        selection_type: 'manual',
        subject: '',
        duration: 30,
        timer_per_question: null,
        max_marks: 0,
        question_ids: []
    })
    const [questions, setQuestions] = useState([])
    const [loadingQuestions, setLoadingQuestions] = useState(false)

    useEffect(() => {
        if (step === 2) {
            fetchQuestions()
        }
    }, [step])

    const fetchQuestions = async () => {
        try {
            setLoadingQuestions(true)
            const params = formData.subject ? { subject: formData.subject } : {}
            const { data } = await questionApi.getAll(params)
            setQuestions(data || [])
        } catch (error) {
            console.error('Failed to fetch questions:', error)
        } finally {
            setLoadingQuestions(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const toggleQuestion = (qId, marks = 1) => {
        setFormData(prev => {
            const exists = prev.question_ids.includes(qId)
            return {
                ...prev,
                question_ids: exists
                    ? prev.question_ids.filter(id => id !== qId)
                    : [...prev.question_ids, qId],
                max_marks: exists
                    ? prev.max_marks - marks
                    : prev.max_marks + marks
            }
        })
    }

    const handleSubmit = async () => {
        if (!formData.title) return alert('Title is required')
        if (formData.question_ids.length === 0) return alert('Select at least one question')

        try {
            setSaving(true)
            await quizApi.create(formData)
            navigate('/teacher')
        } catch (error) {
            console.error('Failed to create quiz:', error)
            alert('Failed to create quiz')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => step === 1 ? navigate(-1) : setStep(1)}
                    className="p-2 text-slate-400 hover:text-white"
                >
                    <HiOutlineArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">Create Quiz</h1>
                    <p className="text-slate-400">Step {step} of 2</p>
                </div>
            </div>

            {/* Progress */}
            <div className="flex gap-2">
                <div className={`h-1 flex-1 rounded ${step >= 1 ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                <div className={`h-1 flex-1 rounded ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
            </div>

            {step === 1 && (
                <div className="card space-y-6">
                    <h2 className="text-lg font-semibold text-white">Quiz Details</h2>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter quiz title"
                            className="input"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Mode</label>
                            <select
                                name="mode"
                                value={formData.mode}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="individual">Individual</option>
                                <option value="multi">Multiplayer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                            <select
                                name="method"
                                value={formData.method}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="test">Test</option>
                                <option value="revision">Revision</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="">Select subject</option>
                                {SUBJECTS.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Duration (minutes)</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                min="1"
                                className="input"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setStep(2)}
                        disabled={!formData.title}
                        className="btn-primary w-full"
                    >
                        Next: Select Questions
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Select Questions</h2>
                            <span className="badge-primary">
                                {formData.question_ids.length} selected · {formData.max_marks} marks
                            </span>
                        </div>

                        {loadingQuestions ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-slate-800 rounded animate-pulse"></div>
                                ))}
                            </div>
                        ) : questions.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">No questions found</p>
                        ) : (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {questions.map(q => {
                                    const isSelected = formData.question_ids.includes(q.id)
                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => toggleQuestion(q.id, q.max_marks || 1)}
                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                                ? 'border-indigo-500 bg-indigo-500/10'
                                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-indigo-500' : 'bg-slate-700'
                                                    }`}>
                                                    {isSelected && <HiOutlineCheckCircle className="w-4 h-4 text-white" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white text-sm line-clamp-2">{q.question}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className="text-xs text-slate-500">{q.q_type || 'MCQ'}</span>
                                                        <span className="text-xs text-slate-500">{q.max_marks || 1} marks</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                            Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving || formData.question_ids.length === 0}
                            className="btn-primary flex-1"
                        >
                            {saving ? 'Creating...' : 'Create Quiz'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
