/**
 * @fileoverview Landing Page – nature-journal aesthetic
 * No glassmorphism, no neon glows. Warm cream background, Lora headings,
 * earthy feature cards, DM Sans body, gentle scroll reveals.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const FEATURES = [
  { icon: '📅', title: '30 Daily Tasks',    desc: 'One simple eco-action per day, carefully curated for real, measurable impact.' },
  { icon: '🍃', title: 'Leaf Streak',       desc: 'Build momentum with daily streaks. Miss a day? Nature always gives you another chance.' },
  { icon: '🏅', title: 'Earn Badges',       desc: 'Unlock achievements as you hit milestones on your green journey.' },
  { icon: '🌍', title: 'Real Impact',       desc: 'Track water saved, CO₂ reduced, and plastic avoided in honest numbers.' },
  { icon: '🏆', title: 'Leaderboard',       desc: 'Compete with eco warriors worldwide — top the global rankings.' },
  { icon: '📊', title: 'Impact Report',     desc: 'A beautiful 30-day summary of your environmental contribution.' },
]

const STATS = [
  { value: '12,400+', label: 'Active Challengers' },
  { value: '2.1M L',  label: 'Water Saved' },
  { value: '340 kg',  label: 'CO₂ Reduced' },
  { value: '89 kg',   label: 'Plastic Avoided' },
]

const HOW = [
  { step: '01', icon: '📝', title: 'Sign Up Free',       desc: 'Create your account and start Day 1 of your 30-day eco challenge immediately.' },
  { step: '02', icon: '✅', title: 'Complete Daily Task', desc: 'Each day unlocks a new eco task. Complete it to build your streak.' },
  { step: '03', icon: '🌍', title: 'Track Real Impact',  desc: 'See how much water, CO₂, and plastic your habits save.' },
]

// Gentle scroll-reveal
const revealVariant = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.10 } } }

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>

      {/* ── NAVBAR — solid cream, earthy border (no glassmorphism) ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background:   'var(--color-card)',
          borderColor:  'var(--color-border)',
          boxShadow:    'var(--shadow-sm)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Swaying leaf logo */}
            <span
              className="text-xl"
              style={{ display: 'inline-block', animation: 'leafSway 3s ease-in-out infinite' }}
              aria-hidden="true"
            >
              🍃
            </span>
            <span
              className="font-bold text-lg"
              style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
            >
              EcoStreak
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--leaf-shadow)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Sign In
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-5">
              Join Free →
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        {/* Subtle organic background blobs — very faint, warm toned */}
        <div
          className="absolute top-24 left-1/4 w-80 h-80 rounded-full opacity-[0.06] blur-3xl pointer-events-none"
          style={{ background: 'var(--green-mid)' }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-[0.05] blur-3xl pointer-events-none"
          style={{ background: 'var(--bark)' }}
          aria-hidden="true"
        />

        <motion.div
          variants={stagger} initial="hidden" animate="show"
          className="max-w-4xl mx-auto relative"
        >
          {/* Badge */}
          <motion.div variants={revealVariant} className="inline-flex items-center gap-2 mb-7">
            <span
              className="px-4 py-1.5 rounded-full text-sm font-medium border"
              style={{
                borderColor: 'var(--green-light)',
                color:        'var(--green-deep)',
                background:   'var(--leaf-shadow)',
                fontFamily:   "'DM Sans', sans-serif",
              }}
            >
              🌱 30-Day Sustainability Challenge
            </span>
          </motion.div>

          {/* Main headline — Lora serif, large */}
          <motion.h1
            variants={revealVariant}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
          >
            Build Habits That<br />
            <span
              style={{
                background: `linear-gradient(135deg, var(--green-deep), var(--green-mid))`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Heal the Planet
            </span>
          </motion.h1>

          <motion.p
            variants={revealVariant}
            className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Join thousands of eco warriors completing one small green action every day.
            Track your real environmental impact, earn badges, and climb the global rankings.
          </motion.p>

          <motion.div
            variants={revealVariant}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register" className="btn-primary text-base py-4 px-8">
              🌿 Start Your Challenge — It's Free
            </Link>
            <Link to="/login" className="btn-secondary text-base py-4 px-8">
              Sign In
            </Link>
          </motion.div>

          {/* Hero icon strip — earthy cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-16 flex justify-center gap-4 flex-wrap"
            aria-hidden="true"
          >
            {['🌱', '💧', '♻️', '🌍', '🍃'].map((item, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl eco-card"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS STRIP — warm card bg ── */}
      <section
        className="py-12 border-y"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.10, duration: 0.55, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: "'Lora', serif", color: 'var(--green-mid)' }}
              >
                {value}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
            >
              Everything you need to go green
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              A gamified platform designed to make sustainability easy, meaningful, and rewarding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc }, i) => (
              <motion.div
                key={i}
                className="eco-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.09, duration: 0.55, ease: 'easeOut' }}
                viewport={{ once: true }}
              >
                <div className="text-3xl mb-4" aria-hidden="true">{icon}</div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6" style={{ background: 'var(--color-card)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-14"
            style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
          >
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {HOW.map(({ step, icon, title, desc }, i) => (
              <motion.div
                key={i}
                className="relative flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: 'easeOut' }}
                viewport={{ once: true }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: 'var(--leaf-shadow)', border: '1.5px solid var(--green-light)' }}
                  aria-hidden="true"
                >
                  {icon}
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--green-light)', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Step {step}
                </span>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, var(--green-mid), transparent)' }}
          aria-hidden="true"
        />
        <div className="max-w-2xl mx-auto relative">
          <div className="text-5xl mb-5 animate-float" aria-hidden="true">🌿</div>
          <h2
            className="text-4xl font-bold mb-5"
            style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
          >
            Ready to make a difference?
          </h2>
          <p className="mb-8 text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Join over 12,000 eco warriors already building greener habits.
            Your journey starts with one small act — today.
          </p>
          <Link to="/register" className="btn-primary text-lg py-5 px-10">
            🌿 Start Your 30-Day Challenge
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-8 px-6 border-t text-center text-sm"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
      >
        <p style={{ fontFamily: "'DM Sans', sans-serif" }}>
          🍃 EcoStreak – Built for the planet · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
