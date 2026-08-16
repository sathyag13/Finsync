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
  CheckCircle2
} from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [calcOpen, setCalcOpen] = useState(false)
  const [calcTab, setCalcTab] = useState('EMI')
  const [activePromo, setActivePromo] = useState(0)

  const handleOpenCalc = (tab) => {
    setCalcTab(tab)
    setCalcOpen(true)
  }

  const promos = [
    {
      title: 'FinSync NetBanking & Digital Savings',
      subtitle: 'Up to 5.50% APY on daily balances, zero opening fees, and instant Virtual Debit Card issuance.',
      badge: 'FINSYNC DIGITAL BANKING',
      bg: 'linear-gradient(135deg, #4338ca 0%, #312e81 100%)',
      ctaText: 'Open Digital Account',
      ctaPath: '/register'
    },
    {
      title: 'FinSync Premium Virtual Debit Cards',
      subtitle: 'ISO 7810 debit cards with gold EMV chip, contactless symbol, and eye balance privacy toggle.',
      badge: 'PREMIUM VIRTUAL CARDS',
      bg: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
      ctaText: 'View Debit Cards',
      ctaPath: '/accounts'
    },
    {
      title: 'Atomic P2P Money Transfer Engine',
      subtitle: '24/7 instant peer transfers backed by Spring Boot ACID transactional ledgers and printable receipts.',
      badge: 'INSTANT SETTLEMENT',
      bg: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
      ctaText: 'Send Money Now',
      ctaPath: '/transfer'
    }
  ]

  const rates = [
    { title: 'Fixed Deposit (FD)', rate: '7.50% p.a.', note: 'Guaranteed Yield' },
    { title: 'Savings Vault APY', rate: '5.50% p.a.', note: 'Daily Payout' },
    { title: 'Home Loan Rate', rate: '8.35% p.a.', note: 'Lowest EMIs' },
    { title: 'Personal Loan', rate: '10.49% p.a.', note: 'Instant Approval' }
  ]

  return (
    <div>
      {/* Hero Promotional Banner */}
      <section style={{ background: promos[activePromo].bg, color: '#ffffff', padding: '60px 24px', transition: 'background 0.5s ease' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 40, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, background: 'rgba(255, 255, 255, 0.18)', backdropFilter: 'blur(8px)', fontSize: '0.78rem', fontWeight: 800, letterSpacing: 1, marginBottom: 20, border: '1px solid rgba(255, 255, 255, 0.25)' }}>
              <Sparkles size={14} color="#f59e0b" />
              <span>{promos[activePromo].badge}</span>
            </div>

            <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.5px' }}>
              {promos[activePromo].title}
            </h1>

            <p style={{ fontSize: '1.15rem', opacity: 0.9, lineHeight: 1.6, marginBottom: 32, maxWidth: 580 }}>
              {promos[activePromo].subtitle}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Link
                to={user ? "/dashboard" : promos[activePromo].ctaPath}
                className="btn btn-primary"
                style={{
                  padding: '14px 32px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 8px 24px rgba(99,102,241,0.4)'
                }}
              >
                <span>{user ? "Go to Dashboard" : promos[activePromo].ctaText}</span>
                <ArrowRight size={18} />
              </Link>

              <button
                onClick={() => handleOpenCalc('FD')}
                style={{
                  padding: '14px 24px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <Calculator size={18} />
                <span>Financial Calculators</span>
              </button>
            </div>

            {/* Slider Dots */}
            <div style={{ display: 'flex', gap: 8, marginTop: 36 }}>
              {promos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePromo(idx)}
                  style={{
                    width: activePromo === idx ? 28 : 10,
                    height: 10,
                    borderRadius: 99,
                    background: activePromo === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Debit Card Showcase */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
              <DebitCard
                account={{ accountNumber: 'FS8829401920', accountType: activePromo === 1 ? 'BUSINESS' : 'SAVINGS', balance: 485000 }}
                userName={user?.fullName || 'VALUED CLIENT'}
                index={activePromo}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Live Rate Ticker */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {rates.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                <Percent size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.title}</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)' }}>{item.rate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Services Grid */}
      <section style={{ maxWidth: 1200, margin: '48px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>
              FinSync NetBanking Capabilities
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 600 }}>
              Select a banking service supported directly by your backend
            </p>
          </div>
          <Link to="/register" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>Get Started</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <Link to="/register" style={{ textDecoration: 'none', padding: 24, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border-color)', transition: 'transform 0.2s, boxShadow 0.2s' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Building2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>Multi-Currency Accounts</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Savings, Current, Business & Investment accounts with zero opening fees.</p>
          </Link>

          <Link to="/transfer" style={{ textDecoration: 'none', padding: 24, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border-color)', transition: 'transform 0.2s, boxShadow 0.2s' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(139, 92, 246, 0.12)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Send size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>Atomic P2P Transfers</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Instant double-entry ledger money transfer with printable digital receipts.</p>
          </Link>

          <Link to="/accounts" style={{ textDecoration: 'none', padding: 24, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border-color)', transition: 'transform 0.2s, boxShadow 0.2s' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <CreditCard size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>ISO 7810 Virtual Cards</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Virtual debit cards in a 3-column row grid with eye balance privacy toggle.</p>
          </Link>

          <Link to="/expenses" style={{ textDecoration: 'none', padding: 24, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border-color)', transition: 'transform 0.2s, boxShadow 0.2s' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <PieChart size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>Expense Tracker</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Categorize spending by Food, Utilities, Housing & Transport with budget bars.</p>
          </Link>

          <Link to="/savings" style={{ textDecoration: 'none', padding: 24, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border-color)', transition: 'transform 0.2s, boxShadow 0.2s' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <PiggyBank size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>Vault Savings Goals</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>5.50% APY savings vaults with target progress & celebration badges 🎉.</p>
          </Link>

          <button onClick={() => handleOpenCalc('SIP')} style={{ textDecoration: 'none', padding: 24, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border-color)', textAlign: 'left', cursor: 'pointer' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(139, 92, 246, 0.12)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Calculator size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>Financial Calculators</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>SIP investment planner, Loan EMI calculator, and Fixed Deposit yield tool.</p>
          </button>
        </div>
      </section>

      {/* Security Banner */}
      <section style={{ background: '#1e1b4b', color: '#ffffff', padding: '60px 24px', margin: '60px 0', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#a7f3d0', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
              FINSYNC BANK PROTECTION
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: 16 }}>
              Enterprise Security Built In
            </h2>
            <p style={{ fontSize: '1rem', opacity: 0.85, lineHeight: 1.6, marginBottom: 24 }}>
              Stateless JWT authentication, BCrypt password hashing, 256-bit SSL transport, and ACID transactional safety.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', fontWeight: 700 }}>
                <CheckCircle2 size={18} color="#a7f3d0" /> BCrypt Password Hash
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', fontWeight: 700 }}>
                <CheckCircle2 size={18} color="#a7f3d0" /> Stateless JWT Tokens
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', fontWeight: 700 }}>
                <CheckCircle2 size={18} color="#a7f3d0" /> Double-Entry Ledger
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', fontWeight: 700 }}>
                <CheckCircle2 size={18} color="#a7f3d0" /> DICGC Insured ₹5 Lakhs
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center', maxWidth: 380, boxShadow: 'var(--shadow-glow)' }}>
              <ShieldCheck size={56} color="#6366f1" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8, color: '#ffffff' }}>Ready to experience FinSync Bank?</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>
                Open an account in 60 seconds with zero paperwork.
              </p>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 0',
                  fontWeight: 800,
                  textDecoration: 'none'
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
