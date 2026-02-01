// Router configuration with protected routes
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import useAuthStore from './store/authStore'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// Dashboard Pages
import Home from './pages/dashboard/Home'
import Profile from './pages/dashboard/Profile'

// Quiz Pages
import QuizList from './pages/quiz/QuizList'
import QuizDetail from './pages/quiz/QuizDetail'
import QuizPlay from './pages/quiz/QuizPlay'
import QuizResult from './pages/quiz/QuizResult'
import Revision from './pages/quiz/Revision'
import History from './pages/quiz/History'

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import CreateQuiz from './pages/teacher/CreateQuiz'
import QuestionBank from './pages/teacher/QuestionBank'

// Multiplayer Pages
import CreateLobby from './pages/multiplayer/CreateLobby'
import JoinLobby from './pages/multiplayer/JoinLobby'
import Lobby from './pages/multiplayer/Lobby'
import MultiplayerGame from './pages/multiplayer/MultiplayerGame'

// Protected Route Component
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, profile, loading } = useAuthStore()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(profile?.role)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

// Public Route (redirect to home if logged in)
const PublicRoute = () => {
    const { user, loading } = useAuthStore()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        )
    }

    if (user) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

// Teacher Route
const TeacherRoute = () => {
    const { user, profile, loading } = useAuthStore()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Check role from profile OR user metadata
    const userRole = profile?.role || user?.user_metadata?.role || 'student'
    if (!['teacher', 'admin'].includes(userRole)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default function AppRouter() {
    return (
        <Routes>
            {/* Public routes (auth pages) */}
            <Route element={<PublicRoute />}>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>
            </Route>

            {/* Protected routes (all authenticated users) */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    {/* Dashboard */}
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* Quizzes */}
                    <Route path="/quizzes" element={<QuizList />} />
                    <Route path="/quizzes/:id" element={<QuizDetail />} />
                    <Route path="/quizzes/:id/play" element={<QuizPlay />} />
                    <Route path="/quizzes/:id/result" element={<QuizResult />} />
                    <Route path="/revision" element={<Revision />} />
                    <Route path="/history" element={<History />} />

                    {/* Create - Available to all users */}
                    <Route path="/create-quiz" element={<CreateQuiz />} />

                    {/* Multiplayer - Available to all users */}
                    <Route path="/multiplayer/create" element={<CreateLobby />} />
                    <Route path="/multiplayer/join" element={<JoinLobby />} />
                    <Route path="/multiplayer/lobby/:sessionId" element={<Lobby />} />
                    <Route path="/multiplayer/game/:sessionId" element={<MultiplayerGame />} />
                </Route>
            </Route>

            {/* Teacher-only routes */}
            <Route element={<TeacherRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/teacher" element={<TeacherDashboard />} />
                    <Route path="/questions" element={<QuestionBank />} />
                </Route>
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
