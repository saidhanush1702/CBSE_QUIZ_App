// Main Layout with Sidebar and Navbar
import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import {
    HiOutlineHome,
    HiOutlineAcademicCap,
    HiOutlineClipboardDocumentList,
    HiOutlineUsers,
    HiOutlineBookOpen,
    HiOutlineClock,
    HiOutlineUser,
    HiOutlineCog6Tooth,
    HiOutlineArrowRightOnRectangle,
    HiOutlineBars3,
    HiOutlineXMark,
    HiOutlinePlusCircle,
    HiOutlineDocumentText
} from 'react-icons/hi2'

const NavItem = ({ to, icon: Icon, children, onClick }) => {
    if (onClick) {
        return (
            <button
                onClick={onClick}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all w-full text-left"
            >
                <Icon className="w-5 h-5" />
                <span>{children}</span>
            </button>
        )
    }

    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'text-white bg-gradient-to-r from-indigo-600/50 to-purple-600/50 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`
            }
        >
            <Icon className="w-5 h-5" />
            <span>{children}</span>
        </NavLink>
    )
}

export default function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user, profile, logout } = useAuthStore()
    const navigate = useNavigate()

    // Check role from profile OR user metadata
    const userRole = profile?.role || user?.user_metadata?.role || 'student'
    const isTeacher = userRole === 'teacher' || userRole === 'admin'

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 lg:translate-x-0 lg:relative lg:flex lg:flex-col h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{ height: '100vh' }}
            >
                {/* Logo - Fixed at top */}
                <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800 flex-shrink-0">
                    <HiOutlineAcademicCap className="w-8 h-8 text-indigo-500" />
                    <span className="text-xl font-bold gradient-text">QuizMaster</span>
                </div>

                {/* Navigation - Scrollable middle section */}
                <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                    <nav className="p-4 space-y-1">
                        <NavItem to="/" icon={HiOutlineHome}>Dashboard</NavItem>
                        <NavItem to="/quizzes" icon={HiOutlineClipboardDocumentList}>Browse Quizzes</NavItem>
                        <NavItem to="/history" icon={HiOutlineClock}>My History</NavItem>
                        <NavItem to="/revision" icon={HiOutlineBookOpen}>Revision</NavItem>

                        <div className="pt-4 pb-2">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">
                                Create
                            </div>
                        </div>
                        <NavItem to="/create-quiz" icon={HiOutlinePlusCircle}>Create Quiz</NavItem>

                        <div className="pt-4 pb-2">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">
                                Multiplayer
                            </div>
                        </div>
                        <NavItem to="/multiplayer/create" icon={HiOutlineUsers}>Create Lobby</NavItem>
                        <NavItem to="/multiplayer/join" icon={HiOutlineUsers}>Join Game</NavItem>

                        {isTeacher && (
                            <>
                                <div className="pt-4 pb-2">
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">
                                        Teacher
                                    </div>
                                </div>
                                <NavItem to="/teacher" icon={HiOutlineDocumentText}>Teacher Dashboard</NavItem>
                                <NavItem to="/questions" icon={HiOutlineBookOpen}>Question Bank</NavItem>
                            </>
                        )}
                    </nav>
                </div>

                {/* User section - Fixed at bottom */}
                <div className="flex-shrink-0 p-4 border-t border-slate-800 bg-slate-900">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {profile?.name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">
                                {profile?.name || user?.email}
                            </div>
                            <div className="text-xs text-slate-500 capitalize">
                                {userRole}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <NavItem to="/profile" icon={HiOutlineUser}>Profile</NavItem>
                        <NavItem icon={HiOutlineArrowRightOnRectangle} onClick={handleLogout}>
                            Logout
                        </NavItem>
                    </div>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile header */}
                <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-slate-400 hover:text-white"
                    >
                        <HiOutlineBars3 className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <HiOutlineAcademicCap className="w-6 h-6 text-indigo-500" />
                        <span className="font-bold gradient-text">QuizMaster</span>
                    </div>
                    <div className="w-10" />
                </header>

                {/* Page content - Scrollable */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-slate-950">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
