// Auth Layout - for login, register, forgot password pages
import { Outlet } from 'react-router-dom'
import { HiOutlineAcademicCap } from 'react-icons/hi2'

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Decorative elements */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
                    <div className="flex items-center gap-3 mb-8">
                        <HiOutlineAcademicCap className="w-16 h-16 text-white" />
                        <h1 className="text-4xl font-bold text-white">QuizMaster</h1>
                    </div>

                    <h2 className="text-3xl font-semibold text-white text-center mb-4">
                        Learn Smarter, Not Harder
                    </h2>

                    <p className="text-lg text-white/80 text-center max-w-md">
                        Interactive quizzes designed for CBSE students. Practice, compete, and track your progress.
                    </p>

                    <div className="flex gap-6 mt-12">
                        <div className="glass px-6 py-4 rounded-xl text-center">
                            <div className="text-3xl font-bold text-white">500+</div>
                            <div className="text-sm text-white/70">Questions</div>
                        </div>
                        <div className="glass px-6 py-4 rounded-xl text-center">
                            <div className="text-3xl font-bold text-white">50+</div>
                            <div className="text-sm text-white/70">Quizzes</div>
                        </div>
                        <div className="glass px-6 py-4 rounded-xl text-center">
                            <div className="text-3xl font-bold text-white">1000+</div>
                            <div className="text-sm text-white/70">Students</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-900">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <HiOutlineAcademicCap className="w-10 h-10 text-indigo-500" />
                        <h1 className="text-2xl font-bold gradient-text">QuizMaster</h1>
                    </div>

                    <Outlet />
                </div>
            </div>
        </div>
    )
}
