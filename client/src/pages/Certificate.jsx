/**
 * @fileoverview Certificate of Completion — EcoStreak 100-Day Challenge
 * Premium, print-ready certificate with nature-journal aesthetic.
 * Accessible at /certificate (protected route).
 */
import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store'
import { userAPI } from '../services/api'

const SEAL_RINGS = [
  { r: 52, stroke: '#4A7C2F', width: 2.5, dash: '6 3' },
  { r: 44, stroke: '#8DB87A', width: 1.5, dash: '0' },
  { r: 38, stroke: '#4A7C2F', width: 1,   dash: '3 2' },
]

function OrnamentalSeal() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
      {/* Radiating lines */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24
        const rad   = (angle * Math.PI) / 180
        return (
          <line
            key={i}
            x1={60 + Math.cos(rad) * 36}
            y1={60 + Math.sin(rad) * 36}
            x2={60 + Math.cos(rad) * 54}
            y2={60 + Math.sin(rad) * 54}
            stroke="#8DB87A"
            strokeWidth="1"
            opacity="0.7"
          />
        )
      })}
      {/* Concentric rings */}
      {SEAL_RINGS.map(({ r, stroke, width, dash }, i) => (
        <circle
          key={i}
          cx="60" cy="60" r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={width}
          strokeDasharray={dash}
        />
      ))}
      {/* Inner fill */}
      <circle cx="60" cy="60" r="33" fill="#4A7C2F" opacity="0.08" />
      {/* Leaf icon */}
      <text x="60" y="68" textAnchor="middle" fontSize="28" dominantBaseline="middle">🌿</text>
    </svg>
  )
}

function CornerOrnament({ position }) {
  const transforms = {
    tl: '',
    tr: 'scale(-1,1) translate(-120,0)',
    bl: 'scale(1,-1) translate(0,-120)',
    br: 'scale(-1,-1) translate(-120,-120)',
  }
  return (
    <svg
      width="120" height="120" viewBox="0 0 120 120"
      style={{ position: 'absolute', ...positionStyles[position] }}
      aria-hidden="true"
    >
      <g transform={transforms[position]}>
        <path d="M8 8 L8 55" stroke="#4A7C2F" strokeWidth="1.5" fill="none" />
        <path d="M8 8 L55 8" stroke="#4A7C2F" strokeWidth="1.5" fill="none" />
        <path d="M16 16 L16 45" stroke="#8DB87A" strokeWidth="0.8" fill="none" opacity="0.6" />
        <path d="M16 16 L45 16" stroke="#8DB87A" strokeWidth="0.8" fill="none" opacity="0.6" />
        <circle cx="8" cy="8" r="3" fill="#4A7C2F" />
        <circle cx="8" cy="8" r="1.5" fill="#8DB87A" />
        {/* Small leaf flourish */}
        <path
          d="M22 22 Q35 14 42 28 Q28 30 22 22Z"
          fill="#4A7C2F" opacity="0.25"
        />
        <path
          d="M22 22 Q35 22 42 28"
          fill="none" stroke="#4A7C2F" strokeWidth="0.8" opacity="0.5"
        />
      </g>
    </svg>
  )
}

const positionStyles = {
  tl: { top: 0, left: 0 },
  tr: { top: 0, right: 0 },
  bl: { bottom: 0, left: 0 },
  br: { bottom: 0, right: 0 },
}

function BorderPattern() {
  return (
    <svg
      width="100%" height="100%"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="dot-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1" fill="#4A7C2F" opacity="0.15" />
        </pattern>
      </defs>
      {/* Outer border */}
      <rect x="16" y="16" width="calc(100%-32)" height="calc(100%-32)"
        fill="none" stroke="#4A7C2F" strokeWidth="1.5" rx="4" />
      {/* Inner border */}
      <rect x="26" y="26" width="calc(100%-52)" height="calc(100%-52)"
        fill="none" stroke="#8DB87A" strokeWidth="0.8" strokeDasharray="4 3" rx="2" />
    </svg>
  )
}

// ── Locked gate shown to users who haven't finished yet ─────────────────────
function LockedCertificate({ completedDays }) {
  const remaining = 100 - (completedDays ?? 0)
  const pct = Math.min(100, Math.round(((completedDays ?? 0) / 100) * 100))
  const circumference = 2 * Math.PI * 54

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-5xl mx-auto"
    >
      {/* Page title */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
        >
          🏆 Certificate of Completion
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          Complete all 100 days to unlock your certificate
        </p>
      </div>

      {/* Locked certificate preview */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(160deg, #FDFAF4 0%, #F5F0E4 50%, #EEE8D5 100%)',
          borderRadius: '4px',
          padding: '64px 72px',
          overflow: 'hidden',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          filter: 'blur(2px) grayscale(0.4)',
          userSelect: 'none',
          pointerEvents: 'none',
          opacity: 0.55,
        }}
        aria-hidden="true"
      >
        {/* Corner ornaments (decorative preview) */}
        <CornerOrnament position="tl" />
        <CornerOrnament position="tr" />
        <CornerOrnament position="bl" />
        <CornerOrnament position="br" />
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '11px', letterSpacing: '0.35em', color: '#5A6B4A', textTransform: 'uppercase', marginBottom: '12px' }}>
          Certificate of Completion
        </div>
        <div style={{ fontFamily: "'Cinzel', 'Lora', serif", fontSize: '38px', fontWeight: 700, color: '#2D5016', marginBottom: '16px' }}>
          This certifies that
        </div>
        <div style={{ fontFamily: "'Lora', serif", fontSize: '48px', fontWeight: 600, fontStyle: 'italic', color: '#1A3A0A', marginBottom: '16px' }}>
          ████████████
        </div>
        <div style={{ fontFamily: "'Lora', serif", fontSize: '15px', color: '#4A5A3A', maxWidth: '480px' }}>
          has successfully completed the EcoStreak 100-Day Sustainability Challenge…
        </div>
      </div>

      {/* Overlay lock card */}
      <div style={{
        position: 'relative',
        marginTop: '-280px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '32px',
      }}>
        {/* Progress ring */}
        <div style={{ position: 'relative', width: '140px', height: '140px' }}>
          <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true">
            <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(74,124,47,0.15)" strokeWidth="8" />
            <circle
              cx="70" cy="70" r="54"
              fill="none"
              stroke="#4A7C2F"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (pct / 100) * circumference}
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '28px' }}>🔒</span>
            <span style={{
              fontFamily: "'Cinzel', serif", fontSize: '18px', fontWeight: 700,
              color: 'var(--green-deep)', lineHeight: 1,
            }}>{pct}%</span>
          </div>
        </div>

        {/* Lock message */}
        <div
          className="eco-card"
          style={{ padding: '28px 36px', maxWidth: '420px', textAlign: 'center' }}
        >
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
          >
            Keep going, you're almost there!
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            You've completed <strong style={{ color: 'var(--green-mid)' }}>{completedDays ?? 0} of 100 days</strong>.
            {' '}Complete the remaining <strong style={{ color: 'var(--green-mid)' }}>{remaining} day{remaining !== 1 ? 's' : ''}</strong> to unlock your official Certificate of Completion.
          </p>
          <div className="progress-bar-track mb-5">
            <div
              className="progress-bar-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <Link to="/tasks" className="btn-primary text-sm px-6 py-3 inline-flex">
            🌿 Go to Today's Task
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function Certificate() {
  const user       = useAuthStore((s) => s.user)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const certRef    = useRef(null)

  useEffect(() => {
    userAPI.getStats()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handlePrint = () => window.print()

  const issuedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  // Show locked state while loading or if < 100 days done (unless they are a demo user)
  const isDemo = user?.email?.endsWith('@ecostreak.app')
  if (!loading && !isDemo && (stats?.completedDays ?? 0) < 100) {
    return <LockedCertificate completedDays={stats?.completedDays ?? 0} />
  }

  return (
    <>
      {/* ── Print styles injected into head ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap');

        @media print {
          body * { visibility: hidden !important; }
          #certificate-root,
          #certificate-root * { visibility: visible !important; }
          #certificate-root {
            position: fixed !important;
            inset: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #FDFAF4 !important;
          }
          #cert-actions { display: none !important; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Action bar ── */}
        <motion.div
          id="cert-actions"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-3"
        >
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
            >
              🏆 Certificate of Completion
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Your 100-day EcoStreak challenge achievement
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard" className="btn-secondary text-sm px-4 py-2">
              ← Dashboard
            </Link>
            <button
              id="btn-print-cert"
              onClick={handlePrint}
              className="btn-primary text-sm px-5 py-2"
            >
              🖨️ Print / Save PDF
            </button>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════
            CERTIFICATE BODY
        ══════════════════════════════════════════════ */}
        <motion.div
          id="certificate-root"
          ref={certRef}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'relative',
            background: 'linear-gradient(160deg, #FDFAF4 0%, #F5F0E4 50%, #EEE8D5 100%)',
            borderRadius: '4px',
            boxShadow: '0 20px 60px rgba(45,80,22,0.18), 0 4px 20px rgba(45,80,22,0.10)',
            padding: '64px 72px',
            overflow: 'hidden',
            minHeight: '680px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Corner ornaments */}
          <CornerOrnament position="tl" />
          <CornerOrnament position="tr" />
          <CornerOrnament position="bl" />
          <CornerOrnament position="br" />

          {/* Subtle dot-grid watermark */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, #4A7C2F 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.05,
          }} />

          {/* Decorative top border line */}
          <div style={{
            position: 'absolute', top: '40px', left: '48px', right: '48px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #4A7C2F 20%, #8DB87A 50%, #4A7C2F 80%, transparent)',
          }} />
          <div style={{
            position: 'absolute', top: '44px', left: '64px', right: '64px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #C8DDE8 30%, #8DB87A 50%, #C8DDE8 70%, transparent)',
            opacity: 0.6,
          }} />

          {/* Decorative bottom border line */}
          <div style={{
            position: 'absolute', bottom: '40px', left: '48px', right: '48px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #4A7C2F 20%, #8DB87A 50%, #4A7C2F 80%, transparent)',
          }} />
          <div style={{
            position: 'absolute', bottom: '44px', left: '64px', right: '64px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #C8DDE8 30%, #8DB87A 50%, #C8DDE8 70%, transparent)',
            opacity: 0.6,
          }} />

          {/* ── Issuer logo row ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
            <span style={{ fontSize: '28px' }}>🌱</span>
            <span style={{
              fontFamily: "'Cinzel', 'Lora', serif",
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#2D5016',
              textTransform: 'uppercase',
            }}>
              EcoStreak
            </span>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px',
              color: '#5A6B4A',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              borderLeft: '1px solid #8DB87A',
              paddingLeft: '10px',
              marginLeft: '4px',
            }}>
              100-Day Sustainability Challenge
            </span>
          </div>

          {/* ── Headline ── */}
          <p style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '11px',
            letterSpacing: '0.35em',
            color: '#5A6B4A',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            Certificate of Completion
          </p>

          <h2 style={{
            fontFamily: "'Cinzel', 'Lora', serif",
            fontSize: 'clamp(30px, 5vw, 46px)',
            fontWeight: 700,
            color: '#2D5016',
            lineHeight: 1.15,
            marginBottom: '8px',
            letterSpacing: '-0.01em',
          }}>
            This certifies that
          </h2>

          {/* ── Recipient name ── */}
          <div style={{ margin: '18px 0 16px', position: 'relative' }}>
            <div style={{
              position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)',
              width: '88%', height: '2px',
              background: 'linear-gradient(90deg, transparent, #4A7C2F 20%, #8DB87A 50%, #4A7C2F 80%, transparent)',
            }} />
            <p style={{
              fontFamily: "'Lora', serif",
              fontSize: 'clamp(32px, 6vw, 54px)',
              fontWeight: 600,
              fontStyle: 'italic',
              color: '#1A3A0A',
              lineHeight: 1.1,
              letterSpacing: '0.01em',
              paddingBottom: '12px',
            }}>
              {user?.username || 'Eco Champion'}
            </p>
          </div>

          {/* ── Body copy ── */}
          <p style={{
            fontFamily: "'Lora', serif",
            fontSize: '15px',
            color: '#4A5A3A',
            lineHeight: 1.85,
            maxWidth: '580px',
            margin: '20px 0 32px',
          }}>
            has successfully completed the{' '}
            <strong style={{ color: '#2D5016' }}>EcoStreak 100-Day Sustainability Challenge</strong>,
            demonstrating consistent dedication to environmental responsibility,
            mindful living, and the preservation of our natural world.
          </p>

          {/* ── Seal + stats row ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '48px',
            margin: '0 0 36px',
            flexWrap: 'wrap',
          }}>
            {/* Left stat */}
            <div style={{ textAlign: 'center', minWidth: '90px' }}>
              <p style={{
                fontFamily: "'Cinzel', serif", fontSize: '30px', fontWeight: 700,
                color: '#2D5016', lineHeight: 1,
              }}>100</p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '10px',
                color: '#5A6B4A', letterSpacing: '0.18em', textTransform: 'uppercase',
                marginTop: '4px',
              }}>Days Completed</p>
            </div>

            <OrnamentalSeal />

            {/* Right stat */}
            <div style={{ textAlign: 'center', minWidth: '90px' }}>
              <p style={{
                fontFamily: "'Cinzel', serif", fontSize: '30px', fontWeight: 700,
                color: '#2D5016', lineHeight: 1,
              }}>
                {loading ? '—' : (stats?.ecoScore ?? user?.ecoScore ?? 0)}
              </p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '10px',
                color: '#5A6B4A', letterSpacing: '0.18em', textTransform: 'uppercase',
                marginTop: '4px',
              }}>Eco Score</p>
            </div>
          </div>

          {/* ── Impact summary strip ── */}
          {stats && (
            <div style={{
              display: 'flex',
              gap: '0',
              borderTop: '1px solid rgba(74,124,47,0.20)',
              borderBottom: '1px solid rgba(74,124,47,0.20)',
              padding: '18px 0',
              margin: '0 0 36px',
              width: '100%',
              maxWidth: '540px',
              justifyContent: 'space-around',
            }}>
              {[
                { value: `${stats.totalWaterSaved ?? 0}L`,                              label: 'Water Saved',    icon: '💧' },
                { value: `${((stats.totalCO2Reduced ?? 0) / 1000).toFixed(1)}kg`,       label: 'CO₂ Reduced',   icon: '🌿' },
                { value: `${stats.totalPlasticAvoided ?? 0}g`,                          label: 'Plastic Saved', icon: '♻️' },
              ].map(({ value, label, icon }) => (
                <div key={label} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{icon}</div>
                  <p style={{
                    fontFamily: "'Cinzel', serif", fontSize: '16px', fontWeight: 600,
                    color: '#2D5016', lineHeight: 1,
                  }}>{value}</p>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: '9px',
                    color: '#5A6B4A', letterSpacing: '0.15em', textTransform: 'uppercase',
                    marginTop: '3px',
                  }}>{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Signatures row ── */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '560px',
            gap: '32px',
          }}>
            {/* Date issued */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                borderBottom: '1.5px solid #4A7C2F',
                paddingBottom: '8px',
                marginBottom: '6px',
              }}>
                <p style={{
                  fontFamily: "'Lora', serif", fontSize: '13px',
                  fontStyle: 'italic', color: '#2D5016', fontWeight: 600,
                }}>
                  {issuedDate}
                </p>
              </div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '9px',
                color: '#5A6B4A', letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>Date Issued</p>
            </div>

            {/* EcoStreak signature */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                borderBottom: '1.5px solid #4A7C2F',
                paddingBottom: '8px',
                marginBottom: '6px',
              }}>
                <p style={{
                  fontFamily: "'Cinzel', serif", fontSize: '15px',
                  color: '#2D5016', fontWeight: 700, letterSpacing: '0.05em',
                }}>
                  EcoStreak
                </p>
              </div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '9px',
                color: '#5A6B4A', letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>Authorized by</p>
            </div>

            {/* Challenge ref */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                borderBottom: '1.5px solid #4A7C2F',
                paddingBottom: '8px',
                marginBottom: '6px',
              }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
                  color: '#2D5016', fontWeight: 600, letterSpacing: '0.08em',
                }}>
                  ECO-100-{new Date().getFullYear()}
                </p>
              </div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '9px',
                color: '#5A6B4A', letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>Certificate ID</p>
            </div>
          </div>

          {/* ── Footer tagline ── */}
          <p style={{
            fontFamily: "'Lora', serif",
            fontStyle: 'italic',
            fontSize: '11px',
            color: '#8DB87A',
            marginTop: '36px',
            letterSpacing: '0.06em',
          }}>
            "Every small act of sustainability plants the seed of a better world."
          </p>
        </motion.div>

        {/* ── Share prompt ── */}
        <motion.p
          id="cert-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          🖨️ Use <strong>Print → Save as PDF</strong> to download your certificate.
        </motion.p>
      </div>
    </>
  )
}
