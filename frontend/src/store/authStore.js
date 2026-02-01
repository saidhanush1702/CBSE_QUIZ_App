// Auth Store using Zustand
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            profile: null,
            session: null,
            loading: true,
            error: null,

            // Initialize auth state from Supabase
            initialize: async () => {
                try {
                    set({ loading: true, error: null })

                    const { data: { session }, error } = await supabase.auth.getSession()

                    if (error) throw error

                    if (session?.user) {
                        set({
                            user: session.user,
                            session,
                            loading: false
                        })
                        // Fetch user profile
                        await get().fetchProfile(session.user.id)
                    } else {
                        set({ user: null, session: null, profile: null, loading: false })
                    }
                } catch (error) {
                    console.error('Auth initialization error:', error)
                    set({ error: error.message, loading: false })
                }
            },

            // Fetch user profile from backend
            fetchProfile: async (userId) => {
                try {
                    const { data: { session } } = await supabase.auth.getSession()
                    if (!session) return

                    // First, set profile from user metadata as fallback
                    const userMetadata = session.user.user_metadata
                    const fallbackProfile = {
                        id: session.user.id,
                        email: session.user.email,
                        name: userMetadata?.name || session.user.email?.split('@')[0],
                        role: userMetadata?.role || 'student',
                        avatar_url: userMetadata?.avatar_url
                    }
                    set({ profile: fallbackProfile })

                    // Try to fetch from backend API
                    try {
                        const response = await fetch(`/api/users/${userId}`, {
                            headers: {
                                'Authorization': `Bearer ${session.access_token}`
                            }
                        })

                        if (response.ok) {
                            const { data } = await response.json()
                            // Merge backend data with fallback, preferring backend data
                            set({ profile: { ...fallbackProfile, ...data } })
                        }
                    } catch (apiError) {
                        console.log('Backend API not available, using Supabase user metadata')
                    }
                } catch (error) {
                    console.error('Profile fetch error:', error)
                }
            },

            // Login with email and password
            login: async (email, password) => {
                try {
                    set({ loading: true, error: null })

                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    })

                    if (error) throw error

                    set({
                        user: data.user,
                        session: data.session,
                        loading: false
                    })

                    // Fetch profile after login
                    await get().fetchProfile(data.user.id)

                    return { success: true }
                } catch (error) {
                    set({ error: error.message, loading: false })
                    return { success: false, error: error.message }
                }
            },

            // Register new user
            register: async (email, password, name, role = 'student') => {
                try {
                    set({ loading: true, error: null })

                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                name,
                                role
                            }
                        }
                    })

                    if (error) throw error

                    set({
                        user: data.user,
                        session: data.session,
                        loading: false
                    })

                    return { success: true, needsConfirmation: !data.session }
                } catch (error) {
                    set({ error: error.message, loading: false })
                    return { success: false, error: error.message }
                }
            },

            // Logout
            logout: async () => {
                try {
                    set({ loading: true })
                    await supabase.auth.signOut()
                    set({ user: null, session: null, profile: null, loading: false })
                } catch (error) {
                    console.error('Logout error:', error)
                    set({ loading: false })
                }
            },

            // Reset password
            resetPassword: async (email) => {
                try {
                    set({ loading: true, error: null })

                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: `${window.location.origin}/reset-password`
                    })

                    if (error) throw error

                    set({ loading: false })
                    return { success: true }
                } catch (error) {
                    set({ error: error.message, loading: false })
                    return { success: false, error: error.message }
                }
            },

            // Clear error
            clearError: () => set({ error: null }),

            // Get access token
            getAccessToken: async () => {
                const { data: { session } } = await supabase.auth.getSession()
                return session?.access_token || null
            },

            // Alias for initialize (used by App.jsx)
            checkAuth: async () => {
                return get().initialize()
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                profile: state.profile
            })
        }
    )
)

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
    const store = useAuthStore.getState()

    if (event === 'SIGNED_IN' && session) {
        store.initialize()
    } else if (event === 'SIGNED_OUT') {
        useAuthStore.setState({ user: null, session: null, profile: null })
    } else if (event === 'TOKEN_REFRESHED' && session) {
        useAuthStore.setState({ session })
    }
})

export default useAuthStore
