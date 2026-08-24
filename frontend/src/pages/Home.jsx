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
    { title: 'Savings Vault APY', rate: '5.50% p.a.', note: 'Daily interest payout', badge: 'Popular', color: '#059669', pastelBg: '#ecfdf5', pastelBorder: '#a7f3d0' },
    { title: 'Fixed Deposit (FD)', rate: '7.50% p.a.', note: 'Guaranteed returns', badge: 'High Yield', color: '#d97706', pastelBg: '#fffbeb', pastelBorder: '#fde68a' },
    { title: 'Home Loans', rate: '8.35% p.a.', note: 'Lowest EMIs & zero fees', badge: 'Competitive', color: '#0284c7', pastelBg: '#f0f9ff', pastelBorder: '#bae6fd' },
    { title: 'Personal Loans', rate: '10.49% p.a.', note: 'Instant digital sanction', badge: 'Instant', color: '#7c3aed', pastelBg: '#f5f3ff', pastelBorder: '#ddd6fe' }
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
      bgGradient: 'linear-gradient(145deg, #ecfdf5 0%, #f0fdf4 60%, #ffffff 100%)',
      iconBg: '#ffffff',
      borderColor: '#a7f3d0',
      shadowColor: 'rgba(16, 185, 129, 0.14)',
      link: '/register'
    },
    {
      id: 'savings',
      category: 'savings',
      title: 'High-Yield Savings Vault',
      subtitle: 'Earn up to 5.50% APY compounded daily with milestone tracking and celebration rewards.',
      icon: PiggyBank,
      tag: '5.50% APY',
      color: '#ea580c',
      bgGradient: 'linear-gradient(145deg, #fff7ed 0%, #ffedd5 60%, #ffffff 100%)',
      iconBg: '#ffffff',
      borderColor: '#fed7aa',
      shadowColor: 'rgba(234, 88, 12, 0.14)',
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
      bgGradient: 'linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 60%, #ffffff 100%)',
      iconBg: '#ffffff',
      borderColor: '#bae6fd',
      shadowColor: 'rgba(2, 132, 199, 0.14)',
      link: '/accounts'
    },
    {
      id: 'transfers',
      category: 'transfers',
      title: 'Atomic P2P Money Transfer',
      subtitle: 'Double-entry ACID banking transfers with printable receipts and instant QR payments.',
      icon: Send,
      tag: 'Instant 24/7',
      color: '#7c3aed',
      bgGradient: 'linear-gradient(145deg, #f5f3ff 0%, #ede9fe 60%, #ffffff 100%)',
      iconBg: '#ffffff',
      borderColor: '#ddd6fe',
      shadowColor: 'rgba(124, 58, 237, 0.14)',
      link: '/transfer'
    },
    {
      id: 'budgeting',
      category: 'tools',
      title: 'Expense & Budget Analytics',
      subtitle: 'Automatic categorization for dining, bills, shopping, and transit with monthly budget health bars.',
      icon: PieChart,
      tag: 'Smart Insights',
      color: '#db2777',
      bgGradient: 'linear-gradient(145deg, #fdf2f8 0%, #fce7f3 60%, #ffffff 100%)',
      iconBg: '#ffffff',
      borderColor: '#fbcfe8',
      shadowColor: 'rgba(219, 39, 119, 0.14)',
      link: '/expenses'
    },
    {
      id: 'calculators',
      category: 'tools',
      title: 'Financial Planning Calculators',
      subtitle: 'Accurate loan EMI estimators, SIP wealth projections, and compound interest calculators.',
      icon: Calculator,
      tag: 'Free Tools',
      color: '#d97706',
      bgGradient: 'linear-gradient(145deg, #fffbeb 0%, #fef3c7 60%, #ffffff 100%)',
      iconBg: '#ffffff',
      borderColor: '#fde68a',
      shadowColor: 'rgba(217, 119, 6, 0.14)',
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
      {/* 1. CINEMATIC VIDEO-MOTION HERO BANNER (Light Airy Canvas with Pastel Blends) */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 630,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #f1f5f9',
          overflow: 'hidden',
          background: '#ffffff'
        }}
      >
        {/* Continuous cinematic video camera motion background */}
        <div className="hero-video-bg" />

        {/* Ambient subtle pastel glows */}
        <div
          style={{
            position: 'absolute',
            top: '-5%',
            left: '10%',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167, 243, 208, 0.25) 0%, rgba(167, 243, 208, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '35%',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(221, 214, 254, 0.2) 0%, rgba(221, 214, 254, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Crisp luminous light gradient overlay to ensure dark navy text is 100% sharp on the left while mascot is fully visible on the right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.94) 42%, rgba(255, 255, 255, 0.35) 68%, rgba(255, 255, 255, 0.0) 88%)',
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
                fontSize: '0.84rem',
                fontWeight: 800,
                color: '#065f46',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '6px 14px',
                borderRadius: 99,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 18,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Sparkles size={15} color="#059669" />
              <span>BANKING REIMAGINED FOR YOU</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              style={{
                fontSize: '3.8rem',
                fontWeight: 900,
                lineHeight: 1.1,
                color: '#0f172a',
                marginBottom: 28,
                letterSpacing: '-1.5px'
              }}
            >
              We were built to help you thrive.
            </motion.h1>

            {/* Quick Action Navigation Pills (Pastel themed elegant action pills) */}
            <motion.div variants={itemVariants} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 34 }}>
              {[
                { label: 'Grow my savings', link: '/savings', bg: '#ecfdf5', border: '#a7f3d0', color: '#065f46' },
                { label: 'Explore home loans', action: () => handleOpenCalc('EMI'), bg: '#f0f9ff', border: '#bae6fd', color: '#0369a1' },
                { label: 'Everyday accounts', link: user ? "/dashboard" : "/register", bg: '#ecfdf5', border: '#a7f3d0', color: '#065f46' },
                { label: 'Virtual debit cards', link: '/accounts', bg: '#f0f9ff', border: '#bae6fd', color: '#0369a1' },
                { label: 'Calculate returns', action: () => handleOpenCalc('SIP'), bg: '#fffbeb', border: '#fef3c7', color: '#92400e' },
                { label: 'Business banking', link: '/register', bg: '#f5f3ff', border: '#ddd6fe', color: '#5b21b6' },
                { label: 'Budget analytics', link: '/expenses', bg: '#fdf2f8', border: '#fbcfe8', color: '#9d174d' }
              ].map((pill, i) => {
                const pillStyle = {
                  padding: '11px 20px',
                  borderRadius: 10,
                  background: pill.bg,
                  border: `1.5px solid ${pill.border}`,
                  color: pill.color,
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                  transition: 'all 0.18s ease',
                  cursor: 'pointer'
                }

                if (pill.action) {
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={pill.action}
                      style={{ ...pillStyle, border: `1.5px solid ${pill.border}` }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                      <span>{pill.label}</span>
                    </button>
                  )
                }

                return (
                  <Link
                    key={i}
                    to={pill.link}
                    style={pillStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <span>{pill.label}</span>
                  </Link>
                )
              })}
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: 24, paddingTop: 20, borderTop: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>
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

      {/* 2. TRANSPARENT RATES & VALUE TICKER (Pastel Accented Clean Cards) */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ background: '#fafaf9', borderBottom: '1px solid #f1f5f9', padding: '36px 24px' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', boxShadow: '0 0 6px #a7f3d0' }} />
              <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Live Transparent Banking Rates
              </span>
            </div>
            <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
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
                whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)', transition: { duration: 0.2 } }}
                style={{
                  padding: '22px 24px',
                  borderRadius: 16,
                  background: '#ffffff',
                  border: '1.5px solid #f1f5f9',
                  borderTop: `4px solid ${item.pastelBorder}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#0f172a', marginTop: 4, letterSpacing: '-0.5px' }}>{item.rate}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>{item.note}</div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: 99,
                    background: item.pastelBg,
                    color: item.color,
                    border: `1px solid ${item.pastelBorder}`
                  }}
                >
                  {item.badge}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 3. PERSONAL BANKING PRODUCT SUITE (Vibrant Pastel Colored Cards) */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ maxWidth: 1200, margin: '80px auto 88px auto', padding: '0 24px', width: '100%', boxSizing: 'border-box' }}
      >
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 60px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 16px', borderRadius: 99, background: '#ede9fe', color: '#6b21a8', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14, border: '1.5px solid #ddd6fe', boxShadow: '0 2px 8px rgba(124, 58, 237, 0.08)' }}>
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
                whileHover={{ y: -6, boxShadow: `0 20px 36px ${p.shadowColor}`, borderColor: p.color, transition: { duration: 0.2 } }}
                style={{
                  padding: '36px 32px',
                  borderRadius: 22,
                  background: p.bgGradient,
                  border: `1.8px solid ${p.borderColor}`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  position: 'relative',
                  boxShadow: `0 8px 24px -4px ${p.shadowColor}`
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
                        border: `1.5px solid ${p.borderColor}`,
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)'
                      }}
                    >
                      <Icon size={26} />
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '5px 12px',
                        borderRadius: 99,
                        background: '#ffffff',
                        color: p.color,
                        border: `1.5px solid ${p.borderColor}`,
                        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
                      }}
                    >
                      {p.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                    {p.subtitle}
                  </p>
                </div>

                <div style={{ marginTop: 28, paddingTop: 18, borderTop: `1.5px solid ${p.borderColor}50`, display: 'flex', alignItems: 'center', gap: 6, color: p.color, fontWeight: 800, fontSize: '0.92rem' }}>
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

      {/* 4. LIFE MOMENTS & FINANCIAL GUIDES (Airy Editorial Pastel Cards) */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ background: '#fafaf9', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '88px 24px' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0369a1', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '4px 12px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Life Stages & Financial Guidance
              </span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', margin: '12px 0 0 0', letterSpacing: '-0.6px' }}>
                Practical tools for what matters most
              </h2>
            </div>
            <Link to="/register" style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0284c7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>View all guides & articles</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 24 }}>
            {[
              {
                category: 'Home Ownership',
                color: '#059669',
                pastelBg: '#ecfdf5',
                borderColor: '#a7f3d0',
                title: 'Buying your first home with confidence',
                desc: 'Learn how to budget for your deposit, calculate monthly EMIs at 8.35% p.a., and get pre-approved digitally.',
                actionText: 'Calculate Home Loan EMI',
                action: () => handleOpenCalc('EMI')
              },
              {
                category: 'Wealth Building',
                color: '#7c3aed',
                pastelBg: '#f5f3ff',
                borderColor: '#ddd6fe',
                title: 'Growing an emergency fund & savings habit',
                desc: 'Discover how daily compounding at 5.50% APY and automated vault deposits turn spare change into financial security.',
                actionText: 'Try SIP Wealth Planner',
                action: () => handleOpenCalc('SIP')
              },
              {
                category: 'Daily Money',
                color: '#ea580c',
                pastelBg: '#fff7ed',
                borderColor: '#fed7aa',
                title: 'Managing monthly budgets effortlessly',
                desc: 'Categorize spending automatically by dining, bills, and transit with visual progress health bars.',
                actionText: 'Start Budgeting Free',
                link: '/register'
              },
              {
                category: 'Security & Fraud',
                color: '#0284c7',
                pastelBg: '#f0f9ff',
                borderColor: '#bae6fd',
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
                whileHover={{ y: -6, boxShadow: `0 16px 28px rgba(15, 23, 42, 0.05)`, transition: { duration: 0.2 } }}
                style={{ padding: 30, borderRadius: 18, background: '#ffffff', border: '1.5px solid #f1f5f9', borderTop: `4px solid ${guide.borderColor}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.02)' }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: guide.color, background: guide.pastelBg, display: 'inline-block', padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>{guide.category}</div>
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

      {/* 5. ENTERPRISE SECURITY & DIGITAL ONBOARDING BANNER (Subtle Mint-Lavender Light Pastel Showcase) */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 50%, #f5f3ff 100%)', color: '#0f172a', padding: '88px 24px', borderTop: '1.5px solid #d1fae5' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 99, background: '#ffffff', color: '#065f46', fontSize: '0.78rem', fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 16, border: '1px solid #a7f3d0', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
              FINSYNC BANK PROTECTION
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.6px', color: '#0f172a' }}>
              Your money is safe, secure, and always accessible.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.65, marginBottom: 32, maxWidth: 540 }}>
              Backed by stateless JWT authentication, BCrypt password hashing, 256-bit SSL encryption, and DICGC deposit insurance up to ₹5,00,000.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                'BCrypt Password Hash',
                'Stateless JWT Tokens',
                'Double-Entry Ledger',
                'DICGC Insured ₹5 Lakhs'
              ].map((txt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>
                  <CheckCircle2 size={20} color="#059669" /> {txt}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{ background: '#ffffff', borderRadius: 24, padding: '40px 32px', border: '1.5px solid #d1fae5', textAlign: 'center', maxWidth: 420, width: '100%', boxShadow: '0 16px 36px rgba(15, 23, 42, 0.06)' }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 16, background: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <ShieldCheck size={36} color="#059669" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 8, color: '#0f172a' }}>Ready to experience FinSync Bank?</h3>
              <p style={{ fontSize: '0.92rem', color: '#64748b', marginBottom: 24, lineHeight: 1.5 }}>
                Open an everyday or savings account in 2 minutes with instant digital KYC.
              </p>
              <Link
                to={user ? "/dashboard" : "/register"}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px 0',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  textDecoration: 'none',
                  borderRadius: 12,
                  background: '#ecfdf5',
                  border: '1.5px solid #a7f3d0',
                  color: '#065f46',
                  boxShadow: '0 4px 12px rgba(167, 243, 208, 0.5)',
                  transition: 'all 0.18s ease'
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
