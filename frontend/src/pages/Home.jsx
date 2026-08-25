import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import CalculatorsModal from '../components/CalculatorsModal.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
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
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const navigate = useNavigate()
  const [calcOpen, setCalcOpen] = useState(false)
  const [calcTab, setCalcTab] = useState('EMI')

  const handleOpenCalc = (tab) => {
    setCalcTab(tab)
    setCalcOpen(true)
  }

  const rates = [
    { title: 'Savings Vault APY', rate: '5.50% p.a.', note: 'Daily interest payout', badge: 'Popular', color: '#0E7F5A', pastelBg: isDark ? 'rgba(18, 168, 120, 0.15)' : '#EAF9F3', pastelBorder: isDark ? 'rgba(18, 168, 120, 0.35)' : '#C6F0DF' },
    { title: 'Fixed Deposit (FD)', rate: '7.50% p.a.', note: 'Guaranteed returns', badge: 'High Yield', color: '#D97706', pastelBg: isDark ? 'rgba(217, 119, 6, 0.15)' : '#FFF8E8', pastelBorder: isDark ? 'rgba(217, 119, 6, 0.35)' : '#FEE6B6' },
    { title: 'Recurring Deposit (RD)', rate: '7.10% p.a.', note: 'Flexible monthly lock', badge: 'Smart Lock', color: '#0284C7', pastelBg: isDark ? 'rgba(2, 132, 199, 0.15)' : '#EAF5FF', pastelBorder: isDark ? 'rgba(2, 132, 199, 0.35)' : '#BAE0FD' },
    { title: 'Personal Accounts', rate: '0.00% Fees', note: 'Zero maintenance charges', badge: 'Zero Fees', color: '#7C3AED', pastelBg: isDark ? 'rgba(124, 58, 237, 0.15)' : '#F2EEFF', pastelBorder: isDark ? 'rgba(124, 58, 237, 0.35)' : '#DDD6FE' }
  ]

  const bankingProducts = [
    {
      id: 'everyday',
      category: 'accounts',
      title: 'Everyday NetBanking Account',
      subtitle: 'Zero maintenance balance, instant peer-to-peer transfers, and live ledger reconciliation.',
      icon: Wallet,
      tag: 'Zero Fees',
      color: '#0E7F5A',
      bgGradient: isDark ? '#121214' : 'linear-gradient(145deg, #EAF9F3 0%, #F4F9FF 60%, #FFFFFF 100%)',
      borderColor: isDark ? '#27272a' : '#C6F0DF',
      shadowColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(18, 168, 120, 0.12)',
      link: '/register'
    },
    {
      id: 'savings',
      category: 'savings',
      title: 'High-Yield Savings Vault',
      subtitle: 'Earn up to 5.50% APY compounded daily with milestone tracking and celebration rewards.',
      icon: PiggyBank,
      tag: '5.50% APY',
      color: '#D97706',
      bgGradient: isDark ? '#121214' : 'linear-gradient(145deg, #FFF8E8 0%, #FFFDF7 60%, #FFFFFF 100%)',
      borderColor: isDark ? '#27272a' : '#FEE6B6',
      shadowColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(217, 119, 6, 0.12)',
      link: '/savings'
    },
    {
      id: 'cards',
      category: 'cards',
      title: 'Virtual EMV Debit Card',
      subtitle: 'Next-gen virtual cards with gold EMV chip, eye privacy balance toggle, and instant freeze.',
      icon: CreditCard,
      tag: 'Zero Liability',
      color: '#0284C7',
      bgGradient: isDark ? '#121214' : 'linear-gradient(145deg, #EAF5FF 0%, #F4F9FF 60%, #FFFFFF 100%)',
      borderColor: isDark ? '#27272a' : '#BAE0FD',
      shadowColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(2, 132, 199, 0.12)',
      link: '/accounts'
    },
    {
      id: 'transfers',
      category: 'transfers',
      title: 'Atomic P2P Money Transfer',
      subtitle: 'Double-entry ACID banking transfers with printable receipts and instant QR payments.',
      icon: Send,
      tag: 'Instant 24/7',
      color: '#7C3AED',
      bgGradient: isDark ? '#121214' : 'linear-gradient(145deg, #F2EEFF 0%, #FAF8FF 60%, #FFFFFF 100%)',
      borderColor: isDark ? '#27272a' : '#DDD6FE',
      shadowColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(124, 58, 237, 0.12)',
      link: '/transfer'
    },
    {
      id: 'budgeting',
      category: 'tools',
      title: 'Expense & Budget Analytics',
      subtitle: 'Automatic categorization for dining, bills, shopping, and transit with monthly budget health bars.',
      icon: PieChart,
      tag: 'Smart Insights',
      color: '#DB2777',
      bgGradient: isDark ? '#121214' : 'linear-gradient(145deg, #FFF0F4 0%, #FFF7F9 60%, #FFFFFF 100%)',
      borderColor: isDark ? '#27272a' : '#FBCFE8',
      shadowColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(219, 39, 119, 0.12)',
      link: '/expenses'
    },
    {
      id: 'calculators',
      category: 'tools',
      title: 'Financial Planning Calculators',
      subtitle: 'Accurate SIP wealth projections, retirement targets, and compound interest calculators.',
      icon: Calculator,
      tag: 'Free Tools',
      color: '#D97706',
      bgGradient: isDark ? '#121214' : 'linear-gradient(145deg, #FFF8E8 0%, #FFFDF7 60%, #FFFFFF 100%)',
      borderColor: isDark ? '#27272a' : '#FEE6B6',
      shadowColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(217, 119, 6, 0.12)',
      onClick: () => handleOpenCalc('SIP')
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
    <div style={{ background: isDark ? '#000000' : '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: isDark ? '#FFFFFF' : '#111827', transition: 'background-color 0.25s ease, color 0.25s ease' }}>
      {/* 1. CINEMATIC VIDEO-MOTION HERO BANNER */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 630,
          display: 'flex',
          alignItems: 'center',
          borderBottom: isDark ? '1px solid #27272a' : '1px solid #E5E7EB',
          overflow: 'hidden',
          background: isDark ? '#09090b' : '#F4F9FF',
          transition: 'background 0.25s ease'
        }}
      >
        {/* Continuous cinematic video camera motion background */}
        <div className="hero-video-bg" style={{ filter: isDark ? 'brightness(0.7) contrast(1.1)' : 'none' }} />

        {/* Ambient subtle glows */}
        <div
          style={{
            position: 'absolute',
            top: '-5%',
            left: '5%',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background: isDark ? 'radial-gradient(circle, rgba(18, 168, 120, 0.15) 0%, rgba(0, 0, 0, 0) 70%)' : 'radial-gradient(circle, rgba(234, 249, 243, 0.55) 0%, rgba(234, 249, 243, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Gradient overlay on the left text area */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isDark
              ? 'linear-gradient(to right, #09090b 0%, rgba(9, 9, 11, 0.95) 36%, rgba(9, 9, 11, 0.35) 50%, rgba(9, 9, 11, 0.0) 62%)'
              : 'linear-gradient(to right, rgba(244, 249, 255, 0.98) 0%, rgba(244, 249, 255, 0.92) 36%, rgba(244, 249, 255, 0.35) 50%, rgba(244, 249, 255, 0.0) 62%)',
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
                color: isDark ? '#34D399' : '#0E7F5A',
                background: isDark ? 'rgba(18, 168, 120, 0.15)' : '#EAF9F3',
                border: isDark ? '1px solid rgba(18, 168, 120, 0.35)' : '1px solid #C6F0DF',
                padding: '6px 14px',
                borderRadius: 99,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 18,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backdropFilter: 'blur(8px)'
              }}
            >
              <Sparkles size={15} color={isDark ? "#34D399" : "#12A878"} />
              <span>BANKING REIMAGINED FOR YOU</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              style={{
                fontSize: '3.8rem',
                fontWeight: 900,
                lineHeight: 1.1,
                color: isDark ? '#FFFFFF' : '#111827',
                marginBottom: 20,
                letterSpacing: '-1.5px'
              }}
            >
              We were built to help you thrive.
            </motion.h1>

            {/* Editorial Information & Banking Value Proposition */}
            <motion.p
              variants={itemVariants}
              style={{
                fontSize: '1.24rem',
                fontWeight: 500,
                lineHeight: 1.7,
                color: isDark ? '#D4D4D8' : '#374151',
                marginBottom: 32,
                maxWidth: 620,
                letterSpacing: '-0.2px'
              }}
            >
              Experience next-generation digital banking with high-yield savings vaults, instant atomic P2P transfers, zero-liability virtual EMV cards, and automated expense insights designed to build your financial future.
            </motion.p>

            {/* Seamless Transparent Information Highlights (Pure Text Format) */}
            <motion.div
              variants={itemVariants}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 32,
                marginBottom: 36,
                flexWrap: 'wrap'
              }}
            >
              <div>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: isDark ? '#34D399' : '#0E7F5A', letterSpacing: '-0.8px', lineHeight: 1 }}>
                  5.50% <span style={{ fontSize: '1rem', fontWeight: 700, color: isDark ? '#34D399' : '#0E7F5A' }}>APY</span>
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#111827', marginTop: 6 }}>
                  High-Yield Vaults
                </div>
                <div style={{ fontSize: '0.82rem', color: isDark ? '#A1A1AA' : '#6B7280', marginTop: 2, fontWeight: 500 }}>
                  Daily interest compounding
                </div>
              </div>

              <div style={{ width: '1px', height: '56px', background: isDark ? '#27272a' : '#E5E7EB' }} />

              <div>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: isDark ? '#38BDF8' : '#0369A1', letterSpacing: '-0.8px', lineHeight: 1 }}>
                  ₹0 <span style={{ fontSize: '1rem', fontWeight: 700, color: isDark ? '#38BDF8' : '#0369A1' }}>Fees</span>
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#111827', marginTop: 6 }}>
                  Everyday Accounts
                </div>
                <div style={{ fontSize: '0.82rem', color: isDark ? '#A1A1AA' : '#6B7280', marginTop: 2, fontWeight: 500 }}>
                  Zero balance maintenance
                </div>
              </div>

              <div style={{ width: '1px', height: '56px', background: isDark ? '#27272a' : '#E5E7EB' }} />

              <div>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: isDark ? '#A78BFA' : '#5B21B6', letterSpacing: '-0.8px', lineHeight: 1 }}>
                  24/7 <span style={{ fontSize: '1rem', fontWeight: 700, color: isDark ? '#A78BFA' : '#5B21B6' }}>Instant</span>
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#111827', marginTop: 6 }}>
                  Atomic P2P Pay
                </div>
                <div style={{ fontSize: '0.82rem', color: isDark ? '#A1A1AA' : '#6B7280', marginTop: 2, fontWeight: 500 }}>
                  Zero latency transfers
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: 24, paddingTop: 20, borderTop: isDark ? '1px solid #27272a' : '1px solid #E5E7EB', fontSize: '0.9rem', color: isDark ? '#A1A1AA' : '#4B5563', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="#12A878" /> RBI Authorized & Scheduled Bank
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="#12A878" /> 2-Minute Digital KYC
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="#12A878" /> DICGC Insured ₹5 Lakhs
              </span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 2. TRANSPARENT RATES & VALUE TICKER */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ background: isDark ? '#09090b' : '#F4F9FF', borderBottom: isDark ? '1px solid #27272a' : '1px solid #E5E7EB', padding: '36px 24px' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#12A878', boxShadow: '0 0 6px #12A878' }} />
              <span style={{ fontSize: '0.86rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#111827', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Live Transparent Banking Rates
              </span>
            </div>
            <span style={{ fontSize: '0.84rem', color: isDark ? '#A1A1AA' : '#6B7280' }}>
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
                whileHover={{ y: -4, boxShadow: isDark ? '0 12px 28px rgba(0, 0, 0, 0.8)' : '0 12px 24px rgba(17, 24, 39, 0.06)', transition: { duration: 0.2 } }}
                style={{
                  padding: '22px 24px',
                  borderRadius: 16,
                  background: isDark ? '#121214' : '#FFFFFF',
                  border: isDark ? '1px solid #27272a' : '1.5px solid #E5E7EB',
                  borderTop: `4px solid ${item.color}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.5)' : '0 4px 16px rgba(17, 24, 39, 0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.86rem', color: isDark ? '#A1A1AA' : '#6B7280', fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: '1.55rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#111827', marginTop: 4, letterSpacing: '-0.5px' }}>{item.rate}</div>
                  <div style={{ fontSize: '0.78rem', color: isDark ? '#71717A' : '#9CA3AF', marginTop: 2 }}>{item.note}</div>
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

      {/* 3. PERSONAL BANKING PRODUCT SUITE */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ maxWidth: 1200, margin: '80px auto 88px auto', padding: '0 24px', width: '100%', boxSizing: 'border-box' }}
      >
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 60px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 16px', borderRadius: 99, background: isDark ? 'rgba(2, 132, 199, 0.15)' : '#EAF5FF', color: isDark ? '#38BDF8' : '#0369A1', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14, border: isDark ? '1px solid rgba(2, 132, 199, 0.35)' : '1.5px solid #BAE0FD' }}>
            FINSYNC PRODUCT SUITE
          </div>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#111827', margin: 0, letterSpacing: '-0.8px' }}>
            Everything you need for everyday banking
          </h2>
          <p style={{ color: isDark ? '#A1A1AA' : '#4B5563', fontSize: '1.08rem', marginTop: 12, lineHeight: 1.6 }}>
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
                whileHover={{ y: -6, boxShadow: isDark ? '0 20px 36px rgba(0, 0, 0, 0.9)' : `0 20px 36px ${p.shadowColor}`, borderColor: p.color, transition: { duration: 0.2 } }}
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
                        background: isDark ? '#1c1c1f' : '#FFFFFF',
                        color: p.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1.5px solid ${p.borderColor}`,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
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
                        background: isDark ? '#1c1c1f' : '#FFFFFF',
                        color: p.color,
                        border: `1.5px solid ${p.borderColor}`,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                      }}
                    >
                      {p.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#111827', marginBottom: 10 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.94rem', color: isDark ? '#A1A1AA' : '#4B5563', lineHeight: 1.65, margin: 0 }}>
                    {p.subtitle}
                  </p>
                </div>

                <div style={{ marginTop: 28, paddingTop: 18, borderTop: isDark ? '1px solid #27272a' : `1.5px solid ${p.borderColor}50`, display: 'flex', alignItems: 'center', gap: 6, color: p.color, fontWeight: 800, fontSize: '0.92rem' }}>
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

      {/* 4. LIFE MOMENTS & FINANCIAL GUIDES */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ background: isDark ? '#09090b' : '#F4F9FF', borderTop: isDark ? '1px solid #27272a' : '1px solid #E5E7EB', borderBottom: isDark ? '1px solid #27272a' : '1px solid #E5E7EB', padding: '88px 24px' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: isDark ? '#38BDF8' : '#0369A1', background: isDark ? 'rgba(2, 132, 199, 0.15)' : '#EAF5FF', border: isDark ? '1px solid rgba(2, 132, 199, 0.35)' : '1px solid #BAE0FD', padding: '4px 12px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Life Stages & Financial Guidance
              </span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#111827', margin: '12px 0 0 0', letterSpacing: '-0.6px' }}>
                Practical tools for what matters most
              </h2>
            </div>
            <Link to="/register" style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0FA878', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>View all guides & articles</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 24 }}>
            {[
              {
                category: 'Cards & Payments',
                color: '#0E7F5A',
                pastelBg: isDark ? 'rgba(18, 168, 120, 0.15)' : '#EAF9F3',
                borderColor: isDark ? '#27272a' : '#C6F0DF',
                title: 'Virtual EMV debit cards & instant lock',
                desc: 'Generate secure virtual debit cards with instant freeze capabilities, customizable spending limits, and zero liability.',
                actionText: 'Explore Virtual Cards',
                link: '/register'
              },
              {
                category: 'Wealth Building',
                color: '#7C3AED',
                pastelBg: isDark ? 'rgba(124, 58, 237, 0.15)' : '#F2EEFF',
                borderColor: isDark ? '#27272a' : '#DDD6FE',
                title: 'Growing an emergency fund & savings habit',
                desc: 'Discover how daily compounding at 5.50% APY and automated vault deposits turn spare change into financial security.',
                actionText: 'Try SIP Wealth Planner',
                action: () => handleOpenCalc('SIP')
              },
              {
                category: 'Daily Money',
                color: '#D97706',
                pastelBg: isDark ? 'rgba(217, 119, 6, 0.15)' : '#FFF8E8',
                borderColor: isDark ? '#27272a' : '#FEE6B6',
                title: 'Managing monthly budgets effortlessly',
                desc: 'Categorize spending automatically by dining, bills, and transit with visual progress health bars.',
                actionText: 'Start Budgeting Free',
                link: '/register'
              },
              {
                category: 'Security & Fraud',
                color: '#0284C7',
                pastelBg: isDark ? 'rgba(2, 132, 199, 0.15)' : '#EAF5FF',
                borderColor: isDark ? '#27272a' : '#BAE0FD',
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
                whileHover={{ y: -6, boxShadow: isDark ? '0 16px 28px rgba(0, 0, 0, 0.8)' : `0 16px 28px rgba(17, 24, 39, 0.05)`, transition: { duration: 0.2 } }}
                style={{ padding: 30, borderRadius: 18, background: isDark ? '#121214' : '#FFFFFF', border: isDark ? '1px solid #27272a' : '1.5px solid #E5E7EB', borderTop: `4px solid ${guide.color}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.5)' : '0 4px 16px rgba(17, 24, 39, 0.02)' }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: guide.color, background: guide.pastelBg, display: 'inline-block', padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>{guide.category}</div>
                  <h3 style={{ fontSize: '1.22rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#111827', marginBottom: 10, lineHeight: 1.35 }}>
                    {guide.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: isDark ? '#A1A1AA' : '#4B5563', lineHeight: 1.65 }}>
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

      {/* 5. ENTERPRISE SECURITY & DIGITAL ONBOARDING BANNER */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #09090b 0%, #141416 50%, #000000 100%)'
            : 'linear-gradient(135deg, #0F766E 0%, #065F46 40%, #0369A1 100%)',
          color: '#FFFFFF',
          padding: '88px 24px',
          borderTop: isDark ? '1px solid #27272a' : '1.5px solid rgba(255, 255, 255, 0.15)',
          boxShadow: 'inset 0 4px 20px rgba(0, 0, 0, 0.12)'
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 99, background: 'rgba(255, 255, 255, 0.12)', color: '#A7F3D0', fontSize: '0.8rem', fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 16, border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)' }}>
              FINSYNC BANK PROTECTION
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.6px', color: '#FFFFFF', lineHeight: 1.2 }}>
              Your money is safe, secure, and always accessible.
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.88)', lineHeight: 1.65, marginBottom: 32, maxWidth: 540 }}>
              Backed by stateless JWT authentication, BCrypt password hashing, 256-bit SSL encryption, and DICGC deposit insurance up to ₹5,00,000.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                'BCrypt Password Hash',
                'Stateless JWT Tokens',
                'Double-Entry Ledger',
                'DICGC Insured ₹5 Lakhs'
              ].map((txt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF' }}>
                  <CheckCircle2 size={20} color="#6EE7B7" /> {txt}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{ background: isDark ? '#141416' : '#FFFFFF', borderRadius: 24, padding: '40px 32px', border: isDark ? '1px solid #27272a' : '1.5px solid rgba(255, 255, 255, 0.3)', textAlign: 'center', maxWidth: 420, width: '100%', boxShadow: '0 20px 48px rgba(0, 0, 0, 0.35)' }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 16, background: isDark ? 'rgba(18, 168, 120, 0.15)' : '#EAF9F3', border: isDark ? '1px solid rgba(18, 168, 120, 0.35)' : '1px solid #C6F0DF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <ShieldCheck size={36} color="#12A878" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 8, color: isDark ? '#FFFFFF' : '#111827' }}>Ready to experience FinSync Bank?</h3>
              <p style={{ fontSize: '0.92rem', color: isDark ? '#A1A1AA' : '#4B5563', marginBottom: 24, lineHeight: 1.5 }}>
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
                  background: '#0FA878',
                  border: 'none',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(15, 168, 120, 0.35)',
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
