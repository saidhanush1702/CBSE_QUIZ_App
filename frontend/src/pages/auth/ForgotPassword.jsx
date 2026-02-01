// Forgot Password Page
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { HiOutlineEnvelope, HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi2'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const { resetPassword, loading, error, clearError } = useAuthStore()

    const handleSubmit = async (e) => {
        e.preventDefault()
        clearError()

        const result = await resetPassword(email)
        if (result.success) {
            setSubmitted(true)
        }
    }

    if (submitted) {
        return (
            <div className="card text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <HiOutlineCheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
                <p className="text-slate-400 mb-8">
                    We've sent password reset instructions to <span className="text-white">{email}</span>
                </p>
                <Link to="/login" className="btn-secondary inline-flex items-center gap-2">
                    <HiOutlineArrowLeft className="w-5 h-5" />
                    Back to Login
                </Link>
            </div>
        )
    }

    return (
        <div className="card">
            <Link
                to="/login"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6"
            >
                <HiOutlineArrowLeft className="w-5 h-5" />
                Back to login
            </Link>

            <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
            <p className="text-slate-400 mb-8">
                No worries! Enter your email and we'll send you reset instructions.
            </p>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="input pl-12"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending...
                        </>
                    ) : (
                        'Send Reset Link'
                    )}
                </button>
            </form>
        </div>
    )
}
