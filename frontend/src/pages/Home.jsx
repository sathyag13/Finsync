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

      {/* 1. HERO SECTION: Clean, Calm, Spacious & Customer-Centric */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(49, 46, 129, 0.9) 45%, rgba(67, 56, 202, 0.85) 100%)',
          color: '#ffffff',
          padding: '80px 24px 90px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.85fr)', gap: 56, alignItems: 'center' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 99,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                marginBottom: 24,
                border: '1px solid rgba(255, 255, 255, 0.25)'
              }}
            >
              <Sparkles size={14} color="#f59e0b" />
              <span>PERSONAL BANKING DESIGNED AROUND YOU</span>
            </div>

            <h1 style={{ fontSize: '3.2rem', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-1px' }}>
              Simple, transparent banking with zero hidden fees.
            </h1>

            <p style={{ fontSize: '1.18rem', opacity: 0.92, lineHeight: 1.65, marginBottom: 36, maxWidth: 580 }}>
              Whether you are growing your savings, sending money to family, or tracking monthly expenses, FinSync gives you the tools, security, and clarity to stay ahead.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Link
                to={user ? "/dashboard" : "/register"}
                className="btn btn-primary"
                style={{
                  padding: '16px 36px',
                  fontSize: '1.02rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  borderRadius: 10,
                  boxShadow: '0 8px 24px rgba(99,102,241,0.45)'
                }}
              >
                <span>{user ? "Open Customer Dashboard" : "Open Digital Account"}</span>
                <ArrowRight size={18} />
              </Link>

              <button
                type="button"
                onClick={() => handleOpenCalc('EMI')}
                style={{
                  padding: '16px 26px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease'
                }}
              >
                <Calculator size={18} />
                <span>Calculate Loans & Returns</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 40, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '0.88rem', opacity: 0.9 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="#34d399" /> RBI Authorized & Insured
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="#34d399" /> 2-Minute Digital KYC
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="#34d399" /> 256-Bit Bank Encryption
              </span>
            </div>
          </div>

          {/* 3D Virtual Debit Card Visual */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 430 }}>
              <DebitCard
                account={{ accountNumber: 'FS8829401920', accountType: 'SAVINGS', balance: 520000 }}
                userName={user?.fullName || 'FINSYNC MEMBER'}
                index={0}
              />
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

      {/* Enterprise Security Banner */}
      <section style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #3730a3 100%)', color: '#ffffff', padding: '70px 24px', margin: '56px 0 0 0', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 99, background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.76rem', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12, border: '1px solid rgba(16, 185, 129, 0.35)' }}>
              FINSYNC BANK PROTECTION
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.5px' }}>
              Enterprise Security Built In
            </h2>
            <p style={{ fontSize: '1.05rem', opacity: 0.9, lineHeight: 1.6, marginBottom: 28, maxWidth: 540 }}>
              Stateless JWT authentication, BCrypt password hashing, 256-bit SSL transport, and ACID transactional safety.
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
            <div style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)', borderRadius: 24, padding: '36px 32px', border: '1.5px solid rgba(255,255,255,0.18)', textAlign: 'center', maxWidth: 400, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <ShieldCheck size={36} color="#818cf8" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: 8, color: '#ffffff' }}>Ready to experience FinSync Bank?</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', marginBottom: 24, lineHeight: 1.5 }}>
                Open an account in 60 seconds with zero paperwork.
              </p>
              <Link
                to="/register"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px 0',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                Create Digital Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Calculators Modal */}
      <CalculatorsModal isOpen={calcOpen} onClose={() => setCalcOpen(false)} initialTab={calcTab} />
    </div>
  )
}
