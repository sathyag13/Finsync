import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import CalculatorsModal from '../components/CalculatorsModal.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import {
  ShieldCheck,
  Sparkles,
  CreditCard,
  Send,
  PieChart,
  PiggyBank,
  ChevronRight,
  Calculator,
  CheckCircle2,
  Wallet
} from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [calcOpen, setCalcOpen] = useState(false)
  const [calcTab, setCalcTab] = useState('EMI')

  const handleOpenCalc = (tab) => {
    setCalcTab(tab)
    setCalcOpen(true)
  }

  const rates = [
    { title: 'Savings Vault APY', rate: '5.50% p.a.', note: 'Daily interest payout', badge: 'Popular', color: '#059669', glow: 'rgba(16, 185, 129, 0.15)' },
    { title: 'Fixed Deposit (FD)', rate: '7.50% p.a.', note: 'Guaranteed returns', badge: 'High Yield', color: '#d97706', glow: 'rgba(245, 158, 11, 0.15)' },
    { title: 'Home Loans', rate: '8.35% p.a.', note: 'Lowest EMIs & zero fees', badge: 'Competitive', color: '#4f46e5', glow: 'rgba(99, 102, 241, 0.15)' },
    { title: 'Personal Loans', rate: '10.49% p.a.', note: 'Instant digital sanction', badge: 'Instant', color: '#7c3aed', glow: 'rgba(168, 85, 247, 0.15)' }
  ]

  const bankingProducts = [
    {
      id: 'everyday',
      category: 'accounts',
      title: 'Everyday NetBanking Account',
      subtitle: 'Zero maintenance balance, instant peer-to-peer transfers, and live ledger reconciliation.',
      icon: Wallet,
      tag: 'Zero Fees',
      color: '#059669',
      bgGlow: 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)',
      borderColor: '#bbf7d0',
      badgeClass: 'badge badge-emerald',
      link: '/register'
    },
    {
      id: 'savings',
      category: 'savings',
      title: 'High-Yield Savings Vault',
      subtitle: 'Earn up to 5.50% APY compounded daily with milestone tracking and celebration rewards.',
      icon: PiggyBank,
      tag: '5.50% APY',
      color: '#d97706',
      bgGlow: 'linear-gradient(145deg, #ffffff 0%, #fffbeb 100%)',
      borderColor: '#fde68a',
      badgeClass: 'badge badge-amber',
      link: '/savings'
    },
    {
      id: 'cards',
      category: 'cards',
      title: 'Virtual Debit Cards',
      subtitle: 'Next-gen virtual cards with gold EMV chip, eye privacy balance toggle, and instant freeze.',
      icon: CreditCard,
      tag: 'Zero Liability',
      color: '#0284c7',
      bgGlow: 'linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)',
      borderColor: '#bae6fd',
      badgeClass: 'badge badge-cyan',
      link: '/accounts'
    },
    {
      id: 'transfers',
      category: 'transfers',
      title: 'Atomic P2P Money Transfer',
      subtitle: 'Double-entry ACID banking transfers with printable receipts and instant QR payments.',
      icon: Send,
      tag: 'Instant 24/7',
      color: '#4f46e5',
      bgGlow: 'linear-gradient(145deg, #ffffff 0%, #eef2ff 100%)',
      borderColor: '#c7d2fe',
      badgeClass: 'badge badge-indigo',
      link: '/transfer'
    },
    {
      id: 'budgeting',
      category: 'tools',
      title: 'Expense & Budget Analytics',
      subtitle: 'Automatic categorization for dining, bills, shopping, and transit with monthly budget health bars.',
      icon: PieChart,
      tag: 'Smart Insights',
      color: '#e11d48',
      bgGlow: 'linear-gradient(145deg, #ffffff 0%, #fff1f2 100%)',
      borderColor: '#fecdd3',
      badgeClass: 'badge badge-rose',
      link: '/expenses'
    },
    {
      id: 'calculators',
      category: 'tools',
      title: 'Financial Planning Calculators',
      subtitle: 'Accurate loan EMI estimators, SIP wealth projections, and compound interest calculators.',
      icon: Calculator,
      tag: 'Free Tools',
      color: '#7c3aed',
      bgGlow: 'linear-gradient(145deg, #ffffff 0%, #faf5ff 100%)',
      borderColor: '#e9d5ff',
      badgeClass: 'badge badge-purple',
      onClick: () => handleOpenCalc('EMI')
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. CINEMATIC VIDEO-MOTION HERO BANNER (Light Airy Canvas) */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 620,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          overflow: 'hidden',
          background: '#ffffff'
        }}
      >
        {/* Continuous cinematic video camera motion background */}
        <div className="hero-video-bg" />

        {/* Crisp luminous light gradient overlay to ensure text is 100% sharp on the left while mascot is fully visible on the right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.94) 40%, rgba(255, 255, 255, 0.3) 68%, rgba(255, 255, 255, 0.0) 88%)',
            zIndex: 1
          }}
        />

        {/* Hero Content Container with Staggered Entrance */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '76px 24px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ maxWidth: 660 }}>
            <motion.div
              variants={itemVariants}
              style={{
                fontSize: '0.86rem',
                fontWeight: 900,
                color: '#059669',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 16,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Sparkles size={16} color="#d97706" />
              <span>BANKING WANTS THE STATUS QUO</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              style={{
                fontSize: '3.9rem',
                fontWeight: 900,
                lineHeight: 1.08,
                color: '#0f172a',
                marginBottom: 28,
                letterSpacing: '-1.8px'
              }}
            >
              We were built to help you thrive.
            </motion.h1>

            {/* Quick Action Navigation Pills (Vibrant green buttons) */}
            <motion.div variants={itemVariants} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
              <Link
                to="/savings"
                style={{
                  padding: '13px 24px',
                  borderRadius: 8,
                  background: '#10b981',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Grow my savings</span>
              </Link>

              <button
                type="button"
                onClick={() => handleOpenCalc('EMI')}
                style={{
                  padding: '13px 24px',
                  borderRadius: 8,
                  background: '#10b981',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.98rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Explore home loans</span>
              </button>

              <Link
                to={user ? "/dashboard" : "/register"}
                style={{
                  padding: '13px 24px',
                  borderRadius: 8,
                  background: '#10b981',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Everyday accounts</span>
              </Link>

              <Link
                to="/accounts"
                style={{
                  padding: '13px 24px',
                  borderRadius: 8,
                  background: '#10b981',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Virtual debit cards</span>
              </Link>

              <button
                type="button"
                onClick={() => handleOpenCalc('SIP')}
                style={{
                  padding: '13px 24px',
                  borderRadius: 8,
                  background: '#10b981',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.98rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Calculate returns</span>
              </button>

              <Link
                to="/register"
                style={{
                  padding: '13px 24px',
                  borderRadius: 8,
                  background: '#10b981',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Business banking</span>
              </Link>

              <Link
                to="/expenses"
                style={{
                  padding: '13px 24px',
                  borderRadius: 8,
                  background: '#10b981',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Budget analytics</span>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: 24, paddingTop: 18, borderTop: '1px solid #e2e8f0', fontSize: '0.92rem', color: '#334155', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="#059669" /> RBI Authorized & Scheduled Bank
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="#059669" /> 2-Minute Digital KYC
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="#059669" /> DICGC Insured ₹5 Lakhs
              </span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 2. TRANSPARENT RATES & VALUE TICKER (Light Modern Card Design) */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '36px 24px' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', boxShadow: '0 0 8px #059669' }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Live Transparent Banking Rates
              </span>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
              Updated for August 2026 • 100% No Hidden Fees
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {rates.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileHover={{ y: -5, boxShadow: `0 14px 28px rgba(0,0,0,0.08)`, transition: { duration: 0.2 } }}
                style={{
                  padding: '22px 24px',
                  borderRadius: 16,
                  background: '#ffffff',
                  border: `1.5px solid #e2e8f0`,
                  borderTop: `4px solid ${item.color}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: item.color, marginTop: 4, letterSpacing: '-0.5px' }}>{item.rate}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>{item.note}</div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: 99,
                    background: item.glow,
                    color: item.color,
                    border: `1px solid ${item.color}35`
                  }}
                >
                  {item.badge}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 3. PERSONAL BANKING PRODUCT SUITE (Clean, Airy Light Theme Cards) */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ maxWidth: 1200, margin: '80px auto 88px auto', padding: '0 24px', width: '100%', boxSizing: 'border-box' }}
      >
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 60px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 99, background: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14, border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            FINSYNC PRODUCT SUITE
          </div>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.8px' }}>
            Everything you need for everyday banking
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.08rem', marginTop: 12, lineHeight: 1.6 }}>
            Smart accounts, automated savings vaults, virtual EMV debit cards, and instant peer transfers tailored to your life.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
          {bankingProducts.map((p, idx) => {
            const Icon = p.icon
            const CardContent = (
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6, boxShadow: `0 20px 35px -10px rgba(0,0,0,0.12)`, borderColor: p.color, transition: { duration: 0.2 } }}
                style={{
                  padding: '36px 32px',
                  borderRadius: 20,
                  background: p.bgGlow,
                  border: `1.5px solid ${p.borderColor}`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  position: 'relative',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: '#ffffff',
                        color: p.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px rgba(0,0,0,0.06)`,
                        border: `1px solid ${p.borderColor}`
                      }}
                    >
                      <Icon size={26} />
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 99,
                        background: '#ffffff',
                        color: p.color,
                        border: `1px solid ${p.borderColor}`,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                      }}
                    >
                      {p.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                    {p.subtitle}
                  </p>
                </div>

                <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 6, color: p.color, fontWeight: 800, fontSize: '0.92rem' }}>
                  <span>Explore Feature</span>
                  <ChevronRight size={16} />
                </div>
              </motion.div>
            )

            if (p.onClick) {
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={p.onClick}
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', display: 'block', width: '100%' }}
                >
                  {CardContent}
                </button>
              )
            }

            return (
              <Link key={p.id} to={p.link} style={{ textDecoration: 'none', display: 'block' }}>
                {CardContent}
              </Link>
            )
          })}
        </div>
      </motion.section>

      {/* 4. LIFE MOMENTS & FINANCIAL GUIDES (Light, Clean Editorial Cards) */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '88px 24px' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Life Stages & Financial Guidance
              </span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', margin: '8px 0 0 0', letterSpacing: '-0.6px' }}>
                Practical tools for what matters most
              </h2>
            </div>
            <Link to="/register" style={{ fontSize: '0.94rem', fontWeight: 800, color: '#059669', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>View all guides & articles</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 24 }}>
            {[
              {
                category: 'Home Ownership',
                color: '#059669',
                bgGradient: '#ffffff',
                borderColor: '#e2e8f0',
                title: 'Buying your first home with confidence',
                desc: 'Learn how to budget for your deposit, calculate monthly EMIs at 8.35% p.a., and get pre-approved digitally.',
                actionText: 'Calculate Home Loan EMI',
                action: () => handleOpenCalc('EMI')
              },
              {
                category: 'Wealth Building',
                color: '#4f46e5',
                bgGradient: '#ffffff',
                borderColor: '#e2e8f0',
                title: 'Growing an emergency fund & savings habit',
                desc: 'Discover how daily compounding at 5.50% APY and automated vault deposits turn spare change into financial security.',
                actionText: 'Try SIP Wealth Planner',
                action: () => handleOpenCalc('SIP')
              },
              {
                category: 'Daily Money',
                color: '#d97706',
                bgGradient: '#ffffff',
                borderColor: '#e2e8f0',
                title: 'Managing monthly budgets effortlessly',
                desc: 'Categorize spending automatically by dining, bills, and transit with visual progress health bars.',
                actionText: 'Start Budgeting Free',
                link: '/register'
              },
              {
                category: 'Security & Fraud',
                color: '#0284c7',
                bgGradient: '#ffffff',
                borderColor: '#e2e8f0',
                title: 'Banking safely in a digital world',
                desc: 'Tips on spotting phishing, enabling instant card lock, and taking advantage of 256-bit AES encryption.',
                actionText: 'Read Security Guide',
                link: '/register'
              }
            ].map((guide, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6, borderColor: guide.color, boxShadow: `0 18px 30px rgba(0,0,0,0.08)`, transition: { duration: 0.2 } }}
                style={{ padding: 30, borderRadius: 18, background: '#ffffff', border: `1.5px solid ${guide.borderColor}`, borderTop: `4px solid ${guide.color}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: guide.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>{guide.category}</div>
                  <h3 style={{ fontSize: '1.22rem', fontWeight: 800, color: '#0f172a', marginBottom: 10, lineHeight: 1.35 }}>
                    {guide.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.65 }}>
                    {guide.desc}
                  </p>
                </div>
                {guide.action ? (
                  <button
                    type="button"
                    onClick={guide.action}
                    style={{ background: 'none', border: 'none', padding: 0, marginTop: 24, color: guide.color, fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <span>{guide.actionText}</span>
                    <ChevronRight size={15} />
                  </button>
                ) : (
                  <Link
                    to={guide.link}
                    style={{ marginTop: 24, color: guide.color, fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <span>{guide.actionText}</span>
                    <ChevronRight size={15} />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 5. ENTERPRISE SECURITY & DIGITAL ONBOARDING BANNER (Luxury Navy & Emerald Container) */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 50%, #1e1b4b 100%)', color: '#ffffff', padding: '88px 24px', borderTop: '1px solid rgba(16, 185, 129, 0.25)' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 99, background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.78rem', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16, border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              FINSYNC BANK PROTECTION
            </div>
            <h2 style={{ fontSize: '2.6rem', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.6px' }}>
              Your money is safe, secure, and always accessible.
            </h2>
            <p style={{ fontSize: '1.08rem', opacity: 0.9, lineHeight: 1.65, marginBottom: 32, maxWidth: 540 }}>
              Backed by stateless JWT authentication, BCrypt password hashing, 256-bit SSL encryption, and DICGC deposit insurance up to ₹5,00,000.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                'BCrypt Password Hash',
                'Stateless JWT Tokens',
                'Double-Entry Ledger',
                'DICGC Insured ₹5 Lakhs'
              ].map((txt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', fontWeight: 700 }}>
                  <CheckCircle2 size={20} color="#34d399" /> {txt}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', borderRadius: 24, padding: '40px 32px', border: '1.5px solid rgba(52, 211, 153, 0.35)', textAlign: 'center', maxWidth: 420, width: '100%', boxShadow: '0 20px 48px rgba(0,0,0,0.5)' }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <ShieldCheck size={36} color="#34d399" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 8, color: '#ffffff' }}>Ready to experience FinSync Bank?</h3>
              <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.75)', marginBottom: 24, lineHeight: 1.5 }}>
                Open an everyday or savings account in 2 minutes with instant digital KYC.
              </p>
              <Link
                to={user ? "/dashboard" : "/register"}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '15px 0',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                {user ? "Go to My Dashboard" : "Open Digital Account Now"}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Financial Calculators Modal */}
      <CalculatorsModal isOpen={calcOpen} onClose={() => setCalcOpen(false)} initialTab={calcTab} />
    </div>
  )
}
