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
