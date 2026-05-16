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
  { icon: '📊', title: 'Impact Report',     desc: 'A beautiful 100-day summary of your environmental contribution.' },
]

const STATS = [
  { value: '12,400+', label: 'Active Challengers' },
  { value: '2.1M L',  label: 'Water Saved' },
  { value: '340 kg',  label: 'CO₂ Reduced' },
  { value: '89 kg',   label: 'Plastic Avoided' },
]

const HOW = [
  { step: '01', icon: '📝', title: 'Sign Up Free',       desc: 'Create your account and start Day 1 of your 100-day eco challenge immediately.' },
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
              🌱 100-Day Sustainability Challenge
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
            🌿 Start Your 100-Day Challenge
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-10 px-6 border-t text-center text-sm"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-5">
          {/* Brand */}
          <p className="font-medium" style={{ color: 'var(--green-deep)', fontFamily: "'Lora', serif", fontSize: '1rem' }}>
            🍃 EcoStreak – Built for the planet
          </p>

          {/* Social & Contact links */}
          <div className="flex flex-wrap justify-center gap-6">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/abubakar._.62?igsh=cWw3a2ozYzhwMm9r"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors duration-300"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--green-mid)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              Instagram
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/923047773289"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors duration-300"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--green-mid)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              WhatsApp
            </a>

            {/* Email Support */}
            <a
              href="mailto:ecostreaksupport@gmail.com"
              className="inline-flex items-center gap-1.5 transition-colors duration-300"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--green-mid)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Help &amp; Support
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs" style={{ color: 'var(--color-text-muted)', opacity: 0.7 }}>
            © {new Date().getFullYear()} EcoStreak. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
