// Revision Page - Review wrong answers
import { useEffect, useState } from 'react'
import useAuthStore from '../../store/authStore'
import quizApi from '../../api/quizzes'
import {
    HiOutlineBookOpen,
    HiOutlineLightBulb,
    HiOutlineChevronDown,
    HiOutlineChevronUp
} from 'react-icons/hi2'

export default function Revision() {
    const { user } = useAuthStore()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedItems, setExpandedItems] = useState({})

    useEffect(() => {
        const fetchRevision = async () => {
            try {
                const { data } = await quizApi.getRevision(user.id)
                setItems(data || [])
            } catch (error) {
                console.error('Failed to fetch revision:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user?.id) {
            fetchRevision()
        }
    }, [user?.id])

    const toggleItem = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Revision</h1>
                <p className="text-slate-400 mt-1">Review questions you got wrong or skipped</p>
            </div>

            {items.length === 0 ? (
                <div className="card text-center py-16">
                    <HiOutlineBookOpen className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No items to review</h3>
                    <p className="text-slate-400">Complete some quizzes to see revision items here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <div
                            key={`${item.quiz_id}-${item.question_id}`}
                            className="card"
                        >
                            <button
                                onClick={() => toggleItem(idx)}
                                className="w-full flex items-start justify-between text-left"
                            >
                                <div className="flex-1">
                                    <span className="badge-primary text-xs mb-2">Question {idx + 1}</span>
                                    <h3 className="text-white font-medium">{item.question}</h3>
                                </div>
                                {expandedItems[idx] ? (
                                    <HiOutlineChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                ) : (
                                    <HiOutlineChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                )}
                            </button>

                            {expandedItems[idx] && (
                                <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                                    <div className="flex items-start gap-2">
                                        <span className="text-red-400 text-sm font-medium min-w-[100px]">Your Answer:</span>
                                        <span className="text-slate-300">{item.user_answer || 'Not answered'}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-400 text-sm font-medium min-w-[100px]">Correct:</span>
                                        <span className="text-slate-300">{item.correct_answer}</span>
                                    </div>
                                    {item.explanation && (
                                        <div className="mt-4 p-4 bg-slate-800/50 rounded-xl">
                                            <div className="flex items-center gap-2 text-amber-400 mb-2">
                                                <HiOutlineLightBulb className="w-5 h-5" />
                                                <span className="font-medium text-sm">Explanation</span>
                                            </div>
                                            <p className="text-slate-300 text-sm">{item.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
