// Quiz store for managing quiz state
import { create } from 'zustand'
import quizApi from '../api/quizzes'

const useQuizStore = create((set, get) => ({
    quizzes: [],
    currentQuiz: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    attempt: null,
    loading: false,
    error: null,
    timeRemaining: null,

    // Fetch all quizzes
    fetchQuizzes: async (params = {}) => {
        try {
            set({ loading: true, error: null })
            const { data } = await quizApi.getAll(params)
            set({ quizzes: data, loading: false })
        } catch (error) {
            set({ error: error.message, loading: false })
        }
    },

    // Fetch single quiz with questions
    fetchQuiz: async (quizId) => {
        try {
            set({ loading: true, error: null })
            const [quizRes, questionsRes] = await Promise.all([
                quizApi.getById(quizId),
                quizApi.getQuestions(quizId)
            ])
            set({
                currentQuiz: quizRes.data,
                questions: questionsRes.data,
                loading: false
            })
        } catch (error) {
            set({ error: error.message, loading: false })
        }
    },

    // Start quiz attempt
    startQuiz: async (quizId) => {
        try {
            set({ loading: true, error: null })
            const { data } = await quizApi.start(quizId)
            set({
                attempt: data,
                answers: data.answers || {},
                currentQuestionIndex: 0,
                loading: false
            })
            return data
        } catch (error) {
            set({ error: error.message, loading: false })
            throw error
        }
    },

    // Save answer locally and to server
    saveAnswer: async (quizId, questionId, answer) => {
        try {
            const newAnswers = { ...get().answers, [questionId]: answer }
            set({ answers: newAnswers })
            await quizApi.saveAnswer(quizId, questionId, answer)
        } catch (error) {
            console.error('Save answer error:', error)
        }
    },

    // Submit quiz
    submitQuiz: async (quizId) => {
        try {
            set({ loading: true, error: null })
            const { data } = await quizApi.submit(quizId)
            set({ attempt: data, loading: false })
            return data
        } catch (error) {
            set({ error: error.message, loading: false })
            throw error
        }
    },

    // Navigate questions
    nextQuestion: () => {
        const { currentQuestionIndex, questions } = get()
        if (currentQuestionIndex < questions.length - 1) {
            set({ currentQuestionIndex: currentQuestionIndex + 1 })
        }
    },

    prevQuestion: () => {
        const { currentQuestionIndex } = get()
        if (currentQuestionIndex > 0) {
            set({ currentQuestionIndex: currentQuestionIndex - 1 })
        }
    },

    goToQuestion: (index) => {
        const { questions } = get()
        if (index >= 0 && index < questions.length) {
            set({ currentQuestionIndex: index })
        }
    },

    // Set timer
    setTimeRemaining: (time) => set({ timeRemaining: time }),

    // Reset quiz state
    resetQuiz: () => set({
        currentQuiz: null,
        questions: [],
        currentQuestionIndex: 0,
        answers: {},
        attempt: null,
        timeRemaining: null,
        error: null
    }),

    // Clear error
    clearError: () => set({ error: null })
}))

export default useQuizStore
