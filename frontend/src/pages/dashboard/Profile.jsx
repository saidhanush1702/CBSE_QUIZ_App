// Profile Page
import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import {
    HiOutlineUser,
    HiOutlineEnvelope,
    HiOutlineAcademicCap,
    HiOutlineCamera,
    HiOutlineCheckCircle
} from 'react-icons/hi2'

export default function Profile() {
    const { user, profile } = useAuthStore()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: profile?.name || '',
        avatar_url: profile?.avatar_url || ''
    })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        // TODO: Implement profile update API
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSaving(false)
        setSaved(true)
        setIsEditing(false)
        setTimeout(() => setSaved(false), 3000)
    }

    const getInitials = () => {
        if (profile?.name) {
            return profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        }
        return user?.email?.[0]?.toUpperCase() || '?'
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white">Profile</h1>

            {saved && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 flex items-center gap-2">
                    <HiOutlineCheckCircle className="w-5 h-5" />
                    Profile updated successfully!
                </div>
            )}

            <div className="card">
                {/* Avatar Section */}
                <div className="flex flex-col items-center pb-6 border-b border-slate-700">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white">
                            {profile?.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt="Avatar"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                getInitials()
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <HiOutlineCamera className="w-4 h-4" />
                        </button>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold text-white">
                        {profile?.name || 'User'}
                    </h2>
                    <span className="badge-primary mt-2 capitalize">
                        {profile?.role || 'Student'}
                    </span>
                </div>

                {/* Info Section */}
                <div className="pt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Full Name
                        </label>
                        {isEditing ? (
                            <div className="relative">
                                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input pl-12"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl">
                                <HiOutlineUser className="w-5 h-5 text-slate-500" />
                                <span className="text-white">{profile?.name || 'Not set'}</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Email Address
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl">
                            <HiOutlineEnvelope className="w-5 h-5 text-slate-500" />
                            <span className="text-white">{user?.email}</span>
                            <span className="badge-success ml-auto text-xs">Verified</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Role
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl">
                            <HiOutlineAcademicCap className="w-5 h-5 text-slate-500" />
                            <span className="text-white capitalize">{profile?.role || 'Student'}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Member Since
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl">
                            <span className="text-white">
                                {profile?.created_at
                                    ? new Date(profile.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : 'Unknown'
                                }
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="btn-primary flex-1"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-primary flex-1"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
