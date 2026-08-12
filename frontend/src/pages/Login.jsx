import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { Zap, ShieldCheck, ArrowRight, Sparkles, Lock, Mail } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      await login(email.trim(), password)
      addToast('Login successful! Welcome back.', 'success')
      navigate('/dashboard')
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed. Please check credentials.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* Hero Left Side */}
      <div className="auth-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="sidebar-logo-icon" style={{ width: 44, height: 44 }}>
            <Zap size={26} color="white" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: -0.5 }}>FinSync</span>
        </div>

        <div style={{ maxWidth: 480 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc', fontSize: '0.82rem', fontWeight: 600, marginBottom: 20 }}>
            <Sparkles size={15} />
            <span>Next-Generation Banking Platform</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 20 }}>
            Smart Wealth Management Built for Speed.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 32 }}>
            Manage multiple currency accounts, track expenses in real time, and reach your financial goals with intelligent automated vaults.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#e2e8f0', fontSize: '0.95rem' }}>
              <ShieldCheck size={20} color="#10b981" />
              <span>Bank-grade AES-256 JWT Encryption</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#e2e8f0', fontSize: '0.95rem' }}>
              <ShieldCheck size={20} color="#10b981" />
              <span>Instant P2P & Internal Account Transfers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#e2e8f0', fontSize: '0.95rem' }}>
              <ShieldCheck size={20} color="#10b981" />
              <span>Automated Savings Milestones & Budget Rules</span>
            </div>
          </div>
        </div>

        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} FinSync Inc. All rights reserved.
        </div>
      </div>

      {/* Auth Form Right Side */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 6 }}>Welcome back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Enter your credentials to access your banking dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@domain.com"
                  required
                  style={{ paddingLeft: 42 }}
                />
                <Mail size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-dim)' }} />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{ paddingLeft: 42 }}
                />
                <Lock size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-dim)' }} />
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 16 }}>
              {loading ? 'Authenticating…' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p style={{ marginTop: 24, textWrap: 'nowrap', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
