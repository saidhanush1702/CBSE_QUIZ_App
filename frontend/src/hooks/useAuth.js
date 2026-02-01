// useAuth Hook - Convenience hook for auth operations
import useAuthStore from '../store/authStore'

export default function useAuth() {
    const {
        user,
        profile,
        session,
        loading,
        error,
        login,
        register,
        logout,
        resetPassword,
        clearError,
        getAccessToken
    } = useAuthStore()

    const isAuthenticated = !!user
    const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin'
    const isAdmin = profile?.role === 'admin'
    const isStudent = profile?.role === 'student'

    return {
        // State
        user,
        profile,
        session,
        loading,
        error,

        // Computed
        isAuthenticated,
        isTeacher,
        isAdmin,
        isStudent,

        // Actions
        login,
        register,
        logout,
        resetPassword,
        clearError,
        getAccessToken
    }
}
