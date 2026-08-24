import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PublicNavbar from '../components/PublicNavbar.jsx'
import PublicFooter from '../components/PublicFooter.jsx'
import CalculatorsModal from '../components/CalculatorsModal.jsx'
import DebitCard from '../components/DebitCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CreditCard,
  Send,
  Building2,
  PieChart,
  PiggyBank,
  Percent,
  ChevronRight,
  Calculator,
  CheckCircle2,
  Lock,
  Smartphone,
  Wallet,
  TrendingUp,
  HelpCircle,
  Clock
} from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [calcOpen, setCalcOpen] = useState(false)
  const [calcTab, setCalcTab] = useState('EMI')
  const [activeCategory, setActiveCategory] = useState('all')

  const handleOpenCalc = (tab) => {
    setCalcTab(tab)
    setCalcOpen(true)
  }

  const rates = [
    { title: 'Savings Vault APY', rate: '5.50% p.a.', note: 'Daily interest payout', badge: 'Popular' },
    { title: 'Fixed Deposit (FD)', rate: '7.50% p.a.', note: 'Guaranteed returns', badge: 'High Yield' },
    { title: 'Home Loans', rate: '8.35% p.a.', note: 'Lowest EMIs & zero processing fee', badge: 'Competitive' },
    { title: 'Personal Loans', rate: '10.49% p.a.', note: 'Instant digital sanction', badge: 'Instant' }
  ]

  const bankingProducts = [
    {
      id: 'everyday',
      category: 'accounts',
      title: 'Everyday NetBanking Account',
      subtitle: 'Zero maintenance balance, instant peer-to-peer transfers, and instant ledger reconciliation.',
      icon: Wallet,
      tag: 'Zero Fees',
      color: 'var(--primary)',
      link: '/register'
    },
    {
      id: 'savings',
      category: 'savings',
      title: 'High-Yield Savings Vault',
      subtitle: 'Earn up to 5.50% APY compounded daily with milestone tracking and celebration rewards.',
      icon: PiggyBank,
      tag: '5.50% APY',
      color: 'var(--accent-emerald)',
      link: '/savings'
    },
    {
      id: 'cards',
      category: 'cards',
      title: 'Virtual Debit Cards',
      subtitle: 'Next-gen virtual debit cards with gold EMV chip, eye privacy balance toggle, and instant freeze.',
      icon: CreditCard,
      tag: 'Zero Contactless Liability',
      color: 'var(--accent-cyan)',
      link: '/accounts'
    },
    {
      id: 'transfers',
      category: 'transfers',
      title: 'Atomic P2P Money Transfer',
      subtitle: 'Double-entry ACID banking transfers with printable receipts and instant QR code payments.',
      icon: Send,
      tag: 'Instant 24/7',
      color: 'var(--accent-purple)',
      link: '/transfer'
    },
    {
      id: 'budgeting',
      category: 'tools',
      title: 'Expense & Budget Analytics',
      subtitle: 'Automatic categorization for dining, shopping, bills, and transit with monthly budget health bars.',
      icon: PieChart,
      tag: 'Smart Insights',
      color: 'var(--accent-amber)',
      link: '/expenses'
    },
    {
      id: 'calculators',
      category: 'tools',
      title: 'Interactive Financial Calculators',
      subtitle: 'Accurate loan EMI estimators, SIP wealth projections, and compound interest calculators.',
      icon: Calculator,
      tag: 'Free Tools',
      color: 'var(--primary)',
      onClick: () => handleOpenCalc('EMI')
    }
  ]

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />

      {/* 1. FULL-BLEED PANORAMIC HERO: Edge-to-edge photo background with overlaid text & action pills */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 580,
          backgroundImage: 'url("/hero-mascot.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          overflow: 'hidden'
        }}
      >
        {/* Soft dark-to-transparent gradient overlay to ensure text is 100% crisp & readable on the left */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(11, 9, 20, 0.94) 0%, rgba(15, 23, 42, 0.85) 42%, rgba(15, 23, 42, 0.35) 70%, rgba(15, 23, 42, 0.1) 100%)',
            zIndex: 1
          }}
        />

        {/* Hero Content Container */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '70px 24px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ maxWidth: 660 }}>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 900,
                color: '#34d399',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 16,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              <Sparkles size={16} color="#f59e0b" />
              <span>BANKING WANTS THE STATUS QUO</span>
            </div>

            <h1
              style={{
                fontSize: '3.8rem',
                fontWeight: 900,
                lineHeight: 1.08,
                color: '#ffffff',
                marginBottom: 28,
                letterSpacing: '-1.5px',
                textShadow: '0 3px 12px rgba(0,0,0,0.6)'
              }}
            >
              We were built to help you thrive.
            </h1>

            {/* Quick Action Navigation Pills (Green buttons directly like the reference) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
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
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '0.9rem', color: '#ffffff', opacity: 0.95 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="#34d399" /> RBI Authorized & Scheduled Bank
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="#34d399" /> 2-Minute Digital KYC
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="#34d399" /> DICGC Insured ₹5 Lakhs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRANSPARENT RATES & VALUE TICKER */}
      <section style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Transparent Competitive Rates
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Rates updated for August 2026 • No hidden service charges
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {rates.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '16px 20px',
                  borderRadius: 12,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)', marginTop: 4 }}>{item.rate}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.note}</div>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '10px', padding: '3px 8px' }}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PERSONAL BANKING PRODUCT SUITE */}
      <section style={{ maxWidth: 1200, margin: '64px auto 72px auto', padding: '0 24px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px auto' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>
            Everything you need for everyday banking
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', marginTop: 10, lineHeight: 1.6 }}>
            Smart accounts, intuitive budgeting, fast peer transfers, and goal-driven savings in one seamless experience.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {bankingProducts.map((p) => {
            const Icon = p.icon
            const CardContent = (
              <div
                style={{
                  padding: '32px 28px',
                  borderRadius: 16,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  transition: 'all 0.25s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 12,
                        background: `rgba(99, 102, 241, 0.12)`,
                        color: p.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <span className="badge badge-indigo" style={{ fontSize: '11px', fontWeight: 700 }}>
                      {p.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    {p.subtitle}
                  </p>
                </div>

                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem' }}>
                  <span>Explore Feature</span>
                  <ChevronRight size={16} />
                </div>
              </div>
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
      </section>

      {/* 4. LIFE MOMENTS & FINANCIAL GUIDES (Inspired by modern personal banking) */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Life Stages & Financial Guidance
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', margin: '8px 0 0 0', letterSpacing: '-0.5px' }}>
                Practical tools for what matters most
              </h2>
            </div>
            <Link to="/register" style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>View all guides & articles</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 24 }}>
            <div style={{ padding: 28, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Home Ownership</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 10 }}>
                  Buying your first home with confidence
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Learn how to budget for your deposit, calculate monthly EMIs at 8.35% p.a., and get pre-approved digitally.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenCalc('EMI')}
                style={{ background: 'none', border: 'none', padding: 0, marginTop: 20, color: 'var(--primary)', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span>Calculate Home Loan EMI</span>
                <ChevronRight size={15} />
              </button>
            </div>

            <div style={{ padding: 28, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Wealth Building</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 10 }}>
                  Growing an emergency fund & savings habit
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Discover how daily compounding at 5.50% APY and automated vault deposits turn spare change into financial security.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenCalc('SIP')}
                style={{ background: 'none', border: 'none', padding: 0, marginTop: 20, color: 'var(--primary)', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span>Try SIP Wealth Planner</span>
                <ChevronRight size={15} />
              </button>
            </div>

            <div style={{ padding: 28, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Daily Money</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 10 }}>
                  Managing monthly budgets effortlessly
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Categorize spending automatically by dining, bills, and transit with visual progress health bars.
                </p>
              </div>
              <Link
                to="/register"
                style={{ marginTop: 20, color: 'var(--primary)', fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span>Start Budgeting Free</span>
                <ChevronRight size={15} />
              </Link>
            </div>

            <div style={{ padding: 28, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Security & Fraud</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 10 }}>
                  Banking safely in a digital world
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Tips on spotting phishing, enabling instant card lock, and taking advantage of 256-bit AES encryption.
                </p>
              </div>
              <Link
                to="/register"
                style={{ marginTop: 20, color: 'var(--primary)', fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span>Read Security Guide</span>
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ENTERPRISE SECURITY & DIGITAL ONBOARDING BANNER */}
      <section style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #3730a3 100%)', color: '#ffffff', padding: '72px 24px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 99, background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.76rem', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16, border: '1px solid rgba(16, 185, 129, 0.35)' }}>
              FINSYNC BANK PROTECTION
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.5px' }}>
              Your money is safe, secure, and always accessible.
            </h2>
            <p style={{ fontSize: '1.08rem', opacity: 0.9, lineHeight: 1.65, marginBottom: 32, maxWidth: 540 }}>
              Backed by stateless JWT authentication, BCrypt password hashing, 256-bit SSL encryption, and DICGC deposit insurance up to ₹5,00,000.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', fontWeight: 700 }}>
                <CheckCircle2 size={20} color="#34d399" /> BCrypt Password Hash
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', fontWeight: 700 }}>
                <CheckCircle2 size={20} color="#34d399" /> Stateless JWT Tokens
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', fontWeight: 700 }}>
                <CheckCircle2 size={20} color="#34d399" /> Double-Entry Ledger
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', fontWeight: 700 }}>
                <CheckCircle2 size={20} color="#34d399" /> DICGC Insured ₹5 Lakhs
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)', borderRadius: 24, padding: '40px 32px', border: '1.5px solid rgba(255,255,255,0.18)', textAlign: 'center', maxWidth: 420, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <ShieldCheck size={36} color="#818cf8" />
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
            </div>
          </div>
        </div>
      </section>

      {/* 6. PUBLIC FOOTER */}
      <PublicFooter />

      {/* Financial Calculators Modal */}
      <CalculatorsModal isOpen={calcOpen} onClose={() => setCalcOpen(false)} initialTab={calcTab} />
    </div>
  )
}
