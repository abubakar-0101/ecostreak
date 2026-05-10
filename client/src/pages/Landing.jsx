/**
 * @fileoverview Landing Page – public marketing page
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const FEATURES = [
  { icon: '📅', title: '30 Daily Tasks', desc: 'One simple eco-action per day, carefully curated for real impact.' },
  { icon: '🔥', title: 'Streak System', desc: 'Build momentum with daily streaks. Miss a day? Start again stronger.' },
  { icon: '🏅', title: 'Earn Badges', desc: 'Unlock achievements as you hit milestones on your green journey.' },
  { icon: '🌍', title: 'Real Impact', desc: 'Track water saved, CO₂ reduced, and plastic avoided in real numbers.' },
  { icon: '🏆', title: 'Leaderboard', desc: 'Compete with eco warriors worldwide on the global rankings.' },
  { icon: '📊', title: 'Impact Report', desc: 'Get a beautiful 30-day summary of your environmental contribution.' },
]

const STATS = [
  { value: '12,400+', label: 'Active Challengers' },
  { value: '2.1M L', label: 'Water Saved' },
  { value: '340 kg', label: 'CO₂ Reduced' },
  { value: '89 kg', label: 'Plastic Avoided' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0 },
}

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg gradient-text">
            🌿 EcoStreak
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-green-50"
              style={{ color: 'var(--color-text)' }}
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
        {/* Background orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #52B788, transparent)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #95D5B2, transparent)' }} />

        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial="hidden" animate="show" variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border"
            style={{ borderColor: 'var(--color-accent)', color: 'var(--color-primary)', background: 'rgba(149,213,178,0.15)' }}
          >
            🌱 30-Day Sustainability Challenge
          </motion.div>

          <motion.h1
            initial="hidden" animate="show" variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            style={{ color: 'var(--color-text)' }}
          >
            Build Habits That<br />
            <span className="gradient-text">Heal the Planet</span>
          </motion.h1>

          <motion.p
            initial="hidden" animate="show" variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Join thousands of eco warriors completing one small green action every day.
            Track your real environmental impact, earn badges, and climb the global rankings.
          </motion.p>

          <motion.div
            initial="hidden" animate="show" variants={fadeUp}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register" className="btn-primary text-base py-4 px-8">
              🌿 Start Your Challenge — It's Free
            </Link>
            <Link to="/login" className="btn-secondary text-base py-4 px-8">
              Sign In
            </Link>
          </motion.div>

          {/* Hero illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 flex justify-center gap-6 flex-wrap"
          >
            {['🌱→🌿→🌳', '💧', '♻️', '🌍', '🔥30'].map((item, i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl eco-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-12 border-y" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <p className="text-3xl font-bold gradient-text">{value}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Everything you need to go green
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              A gamified platform designed to make sustainability easy, fun, and rewarding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc }, i) => (
              <motion.div
                key={i}
                className="eco-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6" style={{ background: 'var(--color-card)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12" style={{ color: 'var(--color-text)' }}>
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '📝', title: 'Sign Up Free', desc: 'Create your account and start Day 1 of your 30-day eco challenge immediately.' },
              { step: '02', icon: '✅', title: 'Complete Daily Task', desc: 'Each day unlocks a new eco task. Complete it and mark it done to build your streak.' },
              { step: '03', icon: '🌍', title: 'Track Real Impact', desc: 'See how much water, CO₂, and plastic your habits save. Share and inspire others.' },
            ].map(({ step, icon, title, desc }, i) => (
              <motion.div
                key={i}
                className="relative flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: 'linear-gradient(135deg,#2D6A4F,#52B788)', color: 'white' }}
                >
                  {icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-accent)' }}>
                  Step {step}
                </span>
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at center, #52B788, transparent)' }} />
        <div className="max-w-2xl mx-auto relative">
          <div className="text-5xl mb-4 animate-float">🌍</div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Ready to make a difference?
          </h2>
          <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
            Join over 12,000 eco warriors already building greener habits.
            Your journey to becoming an Eco Warrior starts with Day 1.
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
        <p>🌿 EcoStreak – Built for the planet · {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
