/**
 * @fileoverview User Profile page – view/edit profile, avatar selection
 */
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { userAPI } from '../services/api'
import { useAuthStore } from '../store'
import { PRESET_AVATARS, formatDate } from '../utils/helpers'
import { Card, SkeletonCard, Button, Modal } from '../components/ui'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [editing, setEditing] = useState(false)
  const [avatarModal, setAvatarModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ username: '', bio: '', location: '', avatar: '' })

  useEffect(() => {
    if (user) {
      setForm({ username: user.username || '', bio: user.bio || '', location: user.location || '', avatar: user.avatar || '🌱' })
    }
    userAPI.getStats().then(({ data }) => setStats(data)).catch(() => {})
  }, [user])

  const handleSave = async () => {
    if (!form.username.trim()) return toast.error('Username cannot be empty')
    setSaving(true)
    try {
      const { data } = await userAPI.updateProfile(form)
      updateUser(data.user)
      setEditing(false)
      toast.success('Profile updated! 🌿')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Profile</h1>

      {/* Profile card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setAvatarModal(true)}
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl cursor-pointer border-2 hover:border-green-400 transition-all"
              style={{ background: 'linear-gradient(135deg,#95D5B2,#52B788)', borderColor: 'var(--color-border)' }}
              title="Click to change avatar"
            >
              {form.avatar}
            </motion.div>
            <button
              onClick={() => setAvatarModal(true)}
              className="text-xs font-medium hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              Change avatar
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 w-full">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: 'var(--color-text)' }}>Username</label>
                  <input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border text-sm outline-none"
                    style={{ background:'var(--color-card)', borderColor:'var(--color-border)', color:'var(--color-text)' }} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: 'var(--color-text)' }}>Bio</label>
                  <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                    rows={3} placeholder="Tell the world about your eco journey…"
                    className="w-full px-4 py-2 rounded-xl border text-sm outline-none resize-none"
                    style={{ background:'var(--color-card)', borderColor:'var(--color-border)', color:'var(--color-text)' }} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: 'var(--color-text)' }}>Location (optional)</label>
                  <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                    placeholder="City, Country"
                    className="w-full px-4 py-2 rounded-xl border text-sm outline-none"
                    style={{ background:'var(--color-card)', borderColor:'var(--color-border)', color:'var(--color-text)' }} />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSave} loading={saving} size="sm">Save Changes</Button>
                  <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{user?.username}</h2>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{user?.email}</p>
                    {user?.location && (
                      <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>📍 {user.location}</p>
                    )}
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                      Member since {formatDate(user?.joinDate || user?.createdAt)}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>✏️ Edit</Button>
                </div>
                {user?.bio && (
                  <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{user.bio}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon:'🔥', label:'Current Streak', value:`${stats.currentStreak}d` },
            { icon:'⚡', label:'Longest Streak', value:`${stats.longestStreak}d` },
            { icon:'🌿', label:'Eco Score', value:stats.ecoScore },
            { icon:'🏅', label:'Badges', value:stats.badgeCount },
          ].map(({ icon, label, value }) => (
            <Card key={label} className="text-center p-4">
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-xl font-bold" style={{ color:'var(--color-primary)' }}>{value}</p>
              <p className="text-xs mt-1" style={{ color:'var(--color-text-muted)' }}>{label}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Avatar selection modal */}
      <Modal isOpen={avatarModal} onClose={() => setAvatarModal(false)} title="Choose Avatar">
        <div className="grid grid-cols-4 gap-3">
          {PRESET_AVATARS.map(({ id, emoji, label }) => (
            <button
              key={id}
              onClick={() => { setForm(p => ({ ...p, avatar: emoji })); setAvatarModal(false) }}
              className={`p-4 rounded-xl text-3xl transition-all hover:scale-110 border-2 ${
                form.avatar === emoji ? 'border-green-500 bg-green-50' : 'border-transparent'
              }`}
              title={label}
            >
              {emoji}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
