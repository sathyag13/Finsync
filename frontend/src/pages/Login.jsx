import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { Building2, ArrowRight, Lock, Mail, Eye, EyeOff, CheckCircle2, ShieldCheck, User } from 'lucide-react'

export default function Login() {
  const [searchParams] = useSearchParams()
  const initialIsAdmin = searchParams.get('mode') === 'admin'
  const [isAdminMode, setIsAdminMode] = useState(initialIsAdmin)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate email format strictly
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      addToast('Please enter a valid email address format (e.g. user@domain.com).', 'error')
      return
    }

    setLoading(true)
    try {
      const data = await login(email.trim(), password)
      addToast(`Authentication successful! Welcome, ${data.fullName || 'User'}.`, 'success')
      if (data.role === 'ADMIN') {
        navigate('/admin')
      } else if (data.role === 'ANALYST') {
        navigate('/analyst')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Authentication failed. Please check your credentials.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 1050, margin: '40px auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'stretch' }}>
      {/* FinSync Violet Security Sidebar */}
      <div style={{ background: 'linear-gradient(135deg, #4338ca 0%, #312e81 100%)', borderRadius: 20, padding: 40, color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 12px 36px rgba(99,102,241,0.25)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ffffff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
              <Building2 size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#ffffff' }}>FINSYNC BANK</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#a7f3d0', letterSpacing: 1.2, textTransform: 'uppercase' }}>ALWAYS WITH YOU</div>
            </div>
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.25, marginBottom: 16, color: '#ffffff' }}>
            NetBanking Gateway Portal
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 32, color: 'rgba(255,255,255,0.9)' }}>
            Access multi-currency accounts, instant P2P money transfers, 5.5% APY savings vaults, and virtual debit card controls securely.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
              <CheckCircle2 size={20} color="#a7f3d0" />
              <span>Stateless JWT & BCrypt Encryption</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
              <CheckCircle2 size={20} color="#a7f3d0" />
              <span>ACID Double-Entry Ledger Bookkeeping</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
              <CheckCircle2 size={20} color="#a7f3d0" />
              <span>Instant Digital Receipts & Balance Toggles</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 20 }}>
          <strong>Security Advisory:</strong> FinSync Bank never requests your password or OTP over email/SMS.
        </div>
      </div>

      {/* Auth Form Container */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 20, padding: 40, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Mode Selector Pills */}
        <div style={{ display: 'flex', gap: 8, padding: 4, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 24 }}>
          <button
            type="button"
            onClick={() => setIsAdminMode(false)}
            style={{
              flex: 1,
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: !isAdminMode ? 'linear-gradient(135deg, #6366f1, #4338ca)' : 'transparent',
              color: !isAdminMode ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <User size={15} /> Client NetBanking
          </button>

          <button
            type="button"
            onClick={() => setIsAdminMode(true)}
            style={{
              flex: 1,
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: isAdminMode ? 'linear-gradient(135deg, #6366f1, #4338ca)' : 'transparent',
              color: isAdminMode ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <ShieldCheck size={15} /> Admin Portal
          </button>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 6 }}>
            {isAdminMode ? 'Admin Security Portal' : 'NetBanking Sign In'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 600 }}>
            {isAdminMode ? 'Authenticate with administrative credentials to access system RBAC & analytics.' : 'Enter your registered email and NetBanking password.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>Registered Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@domain.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem'
                }}
              />
              <Mail size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--primary)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>NetBanking Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem'
                }}
              />
              <Lock size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--primary)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 14, top: 14, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontWeight: 800,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
              cursor: 'pointer'
            }}
          >
            <span>{loading ? 'Authenticating…' : 'Sign In to NetBanking'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          New to FinSync Bank?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>
            Open Account Online
          </Link>
        </p>
      </div>
    </div>
  )
}
