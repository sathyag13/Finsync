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
  const { login, logout } = useAuth()
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

      // Strict Portal Role Clearance Guard
      if (isAdminMode && data.role !== 'ADMIN') {
        logout()
        addToast('Access Denied: This portal is for Administrators only. Please sign in via the Client Portal.', 'error')
        return
      }

      if (!isAdminMode && data.role === 'ADMIN') {
        logout()
        addToast('Access Denied: Administrative accounts must sign in via the Admin Security Portal.', 'error')
        return
      }

      addToast(`Authentication successful! Welcome, ${data.fullName || 'User'}.`, 'success')
      if (data.role === 'ADMIN') {
        navigate('/admin')
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
    <div style={{ width: '100%', maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 16px 40px rgba(0,0,0,0.15)' }}>
      {/* Left Side: Theme 1 - Deep Midnight Violet Banking Showcase */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)', padding: '48px 40px', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '4px solid #f59e0b', position: 'relative' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 18px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: 30, color: '#ffffff', backdropFilter: 'blur(10px)', width: 'fit-content', marginBottom: 28 }}>
            <Building2 size={22} color="#a7f3d0" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>FinSync NetBanking Portal</span>
          </div>

          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, lineHeight: 1.25, color: '#ffffff', marginBottom: 20, letterSpacing: '-0.6px', textAlign: 'left' }}>
            Secure Access to Your Digital Banking Vault
          </h1>

          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.92)', marginBottom: 36, fontWeight: 500, textAlign: 'justify' }}>
            Manage multi-currency accounts, execute instant zero-fee transfers, monitor vault savings goals, and control virtual debit cards with bank-grade security.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.25)', color: '#a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={20} />
              </div>
              <span>Stateless JWT Session Tokens & BCrypt Encryption</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.25)', color: '#a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={20} />
              </div>
              <span>ACID Double-Entry Ledger & Real-Time Balance Updates</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.25)', color: '#a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={20} />
              </div>
              <span>Instant Digital Receipts & Virtual Debit Card Controls</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.2)', fontWeight: 600, textAlign: 'justify', width: '100%' }}>
          <strong>Security Notice:</strong> FinSync Bank will never ask for your confidential password or OTP.
        </div>
      </div>

      {/* Right Side: Theme 2 - Clean Form Theme (Centered in Right Half) */}
      <div style={{ background: 'var(--bg-secondary)', padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {/* Mode Selector Tabs */}
          <div style={{ display: 'flex', gap: 12, borderBottom: '2px solid var(--border-color)', marginBottom: 32, paddingBottom: 4, width: '100%', justifyContent: 'flex-start' }}>
            <button
              type="button"
              onClick={() => {
                if (isAdminMode) {
                  setIsAdminMode(false)
                  setEmail('')
                  setPassword('')
                }
              }}
              style={{
                padding: '12px 20px 12px 0',
                border: 'none',
                borderBottom: !isAdminMode ? '3px solid var(--primary)' : '3px solid transparent',
                marginBottom: -6,
                background: 'transparent',
                fontSize: '1.05rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: !isAdminMode ? 'var(--primary)' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              <User size={20} /> Client Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                if (!isAdminMode) {
                  setIsAdminMode(true)
                  setEmail('')
                  setPassword('')
                }
              }}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderBottom: isAdminMode ? '3px solid var(--primary)' : '3px solid transparent',
                marginBottom: -6,
                background: 'transparent',
                fontSize: '1.05rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: isAdminMode ? 'var(--primary)' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              <ShieldCheck size={20} /> Admin Portal
            </button>
          </div>

          <div style={{ marginBottom: 28, textAlign: 'left', width: '100%' }}>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 8, textAlign: 'left' }}>
              {isAdminMode ? 'Admin Security Portal' : 'NetBanking Sign In'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', fontWeight: 600, textAlign: 'justify' }}>
              {isAdminMode ? 'Authenticate with administrative credentials to access system RBAC & analytics.' : 'Enter your registered email and password to log in.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div className="form-group" style={{ marginBottom: 24, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.98rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)', textAlign: 'left' }}>Registered Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@domain.com"
                  required
                  style={{
                    width: '100%',
                    padding: '15px 20px 15px 50px',
                    borderRadius: 12,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '1.05rem',
                    outline: 'none'
                  }}
                />
                <Mail size={22} style={{ position: 'absolute', left: 16, top: 15, color: 'var(--primary)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 28, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.98rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)', textAlign: 'left' }}>NetBanking Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '15px 50px 15px 50px',
                    borderRadius: 12,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '1.05rem',
                    outline: 'none'
                  }}
                />
                <Lock size={22} style={{ position: 'absolute', left: 16, top: 15, color: 'var(--primary)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 16, top: 15, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                fontWeight: 800,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
                cursor: 'pointer'
              }}
            >
              <span>{loading ? 'Authenticating…' : 'Sign In to NetBanking'}</span>
              <ArrowRight size={22} />
            </button>
          </form>

          <p style={{ marginTop: 28, textAlign: 'center', fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600, width: '100%' }}>
            New to FinSync Bank?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>
              Open Account Online
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}



