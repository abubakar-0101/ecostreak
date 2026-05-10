/**
 * @fileoverview User Profile page – earthy nature aesthetic
 * Lora headings, leaf-shadow avatar, DM Sans form fields, earthy stat tiles
 */
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { userAPI } from '../services/api'
import { useAuthStore } from '../store'
import { PRESET_AVATARS, formatDate } from '../utils/helpers'
import { Card, Button, Modal } from '../components/ui'

const inputStyle = {
  background:   'var(--color-card)',
  borderColor:  'var(--color-border)',
  color:        'var(--color-text)',
  fontFamily:   "'DM Sans', sans-serif",
  borderRadius: '12px',
  border:       '1.5px solid var(--color-border)',
  outline:      'none',
  width:        '100%',
  padding:      '10px 16px',
  fontSize:     '14px',
  transition:   'border-color 0.3s ease',
}

const REVEAL = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [stats,       setStats]       = useState(null)
  const [editing,     setEditing]     = useState(false)
  const [avatarModal, setAvatarModal] = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [form,        setForm]        = useState({ username: '', bio: '', location: '', avatar: '' })

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
    <div className="space-y-7 max-w-3xl mx-auto">
      {/* Header */}
      <motion.h1
        variants={REVEAL} initial="hidden" animate="show"
        className="text-3xl font-bold"
        style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
      >
        Profile
      </motion.h1>

      {/* Profile card */}
      <motion.div
        variants={REVEAL} initial="hidden" animate="show"
        transition={{ delay: 0.08 }}
      >
        <Card>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.04, transition: { duration: 0.3 } }}
                onClick={() => setAvatarModal(true)}
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl cursor-pointer transition-all duration-300"
                style={{
                  background:  'var(--leaf-shadow)',
                  border:      '2px solid var(--green-light)',
                }}
                title="Click to change avatar"
                aria-label="Change avatar"
              >
                {form.avatar}
              </motion.div>
              <button
                onClick={() => setAvatarModal(true)}
                className="text-xs font-medium hover:underline transition-all"
                style={{ color: 'var(--green-mid)', fontFamily: "'DM Sans', sans-serif" }}
              >
                Change avatar
              </button>
            </div>

            {/* Info / Edit form */}
            <div className="flex-1 w-full">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--color-text)', fontFamily: "'DM Sans', sans-serif" }}>
                      Username
                    </label>
                    <input
                      value={form.username}
                      onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--green-mid)'}
                      onBlur={e  => e.currentTarget.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--color-text)', fontFamily: "'DM Sans', sans-serif" }}>
                      Bio
                    </label>
                    <textarea
                      value={form.bio}
                      onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                      rows={3}
                      placeholder="Tell the world about your eco journey…"
                      style={{ ...inputStyle, resize: 'none', fontFamily: "'Lora', serif", fontStyle: 'italic', lineHeight: '1.6' }}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--green-mid)'}
                      onBlur={e  => e.currentTarget.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--color-text)', fontFamily: "'DM Sans', sans-serif" }}>
                      Location (optional)
                    </label>
                    <input
                      value={form.location}
                      onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                      placeholder="City, Country"
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--green-mid)'}
                      onBlur={e  => e.currentTarget.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
                  <div className="flex gap-3 pt-1">
                    <Button onClick={handleSave} loading={saving} size="sm">Save Changes</Button>
                    <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h2
                        className="text-2xl font-bold"
                        style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
                      >
                        {user?.username}
                      </h2>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{user?.email}</p>
                      {user?.location && (
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                          📍 {user.location}
                        </p>
                      )}
                      <p className="text-xs mt-1.5" style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        Member since {formatDate(user?.joinDate || user?.createdAt)}
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                      ✏️ Edit
                    </Button>
                  </div>
                  {user?.bio && (
                    <p
                      className="mt-4 text-sm leading-relaxed"
                      style={{
                        color:       'var(--bark)',
                        fontFamily:  "'Lora', serif",
                        fontStyle:   'italic',
                      }}
                    >
                      "{user.bio}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats grid */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: 'easeOut' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: '🍃', label: 'Current Streak', value: `${stats.currentStreak}d`, color: 'var(--green-mid)' },
            { icon: '🌿', label: 'Longest Streak',  value: `${stats.longestStreak}d`,  color: 'var(--green-deep)' },
            { icon: '🌍', label: 'Eco Score',       value: stats.ecoScore,             color: 'var(--bark)' },
            { icon: '🏅', label: 'Badges',          value: stats.badgeCount,           color: 'var(--color-gold)' },
          ].map(({ icon, label, value, color }) => (
            <Card key={label} className="text-center py-5 px-3">
              <div className="text-2xl mb-1.5" aria-hidden="true">{icon}</div>
              <p
                className="text-xl font-bold"
                style={{ color, fontFamily: "'Lora', serif" }}
              >
                {value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Avatar selection modal */}
      <Modal isOpen={avatarModal} onClose={() => setAvatarModal(false)} title="Choose Avatar">
        <div className="grid grid-cols-4 gap-3">
          {PRESET_AVATARS.map(({ id, emoji, label }) => (
            <button
              key={id}
              onClick={() => { setForm(p => ({ ...p, avatar: emoji })); setAvatarModal(false) }}
              className="p-4 rounded-xl text-3xl transition-all duration-300"
              style={{
                border:      form.avatar === emoji ? '2px solid var(--green-mid)' : '2px solid transparent',
                background:  form.avatar === emoji ? 'var(--leaf-shadow)'         : 'transparent',
                transform:   form.avatar === emoji ? 'scale(1.08)'                : 'scale(1)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--leaf-shadow)'}
              onMouseLeave={e => e.currentTarget.style.background = form.avatar === emoji ? 'var(--leaf-shadow)' : 'transparent'}
              title={label}
              aria-label={label}
            >
              {emoji}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
