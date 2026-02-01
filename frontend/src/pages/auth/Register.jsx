// Register Page
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import {
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiOutlineUser,
    HiOutlineEye,
    HiOutlineEyeSlash,
    HiOutlineAcademicCap,
    HiOutlineBriefcase
} from 'react-icons/hi2'

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    })
    const [showPassword, setShowPassword] = useState(false)
    const [formError, setFormError] = useState('')
    const { register, loading, error, clearError } = useAuthStore()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setFormError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        clearError()
        setFormError('')

        if (formData.password !== formData.confirmPassword) {
            setFormError('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            setFormError('Password must be at least 6 characters')
            return
        }

        const result = await register(formData.email, formData.password, formData.name, formData.role)

        if (result.success) {
            if (result.needsConfirmation) {
                // Show confirmation message
                setFormError('Please check your email to confirm your account')
            } else {
                navigate('/')
            }
        }
    }

    return (
        <div className="card">
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-slate-400 mb-8">Join QuizMaster to start learning</p>

            {(error || formError) && (
                <div className={`mb-6 p-4 rounded-xl text-sm ${formError.includes('check your email')
                        ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}>
                    {error || formError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Role Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                        I am a
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'student' })}
                            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.role === 'student'
                                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            <HiOutlineAcademicCap className="w-5 h-5" />
                            <span className="font-medium">Student</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'teacher' })}
                            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.role === 'teacher'
                                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            <HiOutlineBriefcase className="w-5 h-5" />
                            <span className="font-medium">Teacher</span>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="input pl-12"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="input pl-12"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="input pl-12 pr-12"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                            {showPassword ? (
                                <HiOutlineEyeSlash className="w-5 h-5" />
                            ) : (
                                <HiOutlineEye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
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
                            Creating account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            <p className="mt-8 text-center text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                    Sign in
                </Link>
            </p>
        </div>
    )
}
