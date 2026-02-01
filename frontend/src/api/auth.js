// Auth API - Direct auth operations
import { supabase } from '../lib/supabase'

export const authApi = {
    // Check current session
    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        return session
    },

    // Get current user
    getUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    },

    // Sign in with email
    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) throw error
        return data
    },

    // Sign up
    signUp: async (email, password, metadata = {}) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        })
        if (error) throw error
        return data
    },

    // Sign out
    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    // Reset password
    resetPassword: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        })
        if (error) throw error
    },

    // Update password
    updatePassword: async (newPassword) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })
        if (error) throw error
    },

    // Update user metadata
    updateUser: async (data) => {
        const { data: user, error } = await supabase.auth.updateUser({
            data
        })
        if (error) throw error
        return user
    }
}

export default authApi
