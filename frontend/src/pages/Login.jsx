import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { Building2, ArrowRight, Lock, Mail, Eye, EyeOff, CheckCircle2, ShieldCheck, UserCheck, Sparkles } from 'lucide-react'

export default function Login() {
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
      addToast(`Authentication successful! Welcome back, ${data.fullName || 'User'}.`, 'success')
      
      // Dynamic Role-Based Redirection
      if (data.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Authentication failed. Please check your email and password.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Quick Autofill Demo Credentials
  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div style={{ width: '100%', maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 16px 40px rgba(0,0,0,0.15)' }}>
      {/* Left Side: Deep Midnight Violet Banking Showcase */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)', padding: '48px 40px', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '4px solid #f59e0b', position: 'relative' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 18px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: 30, color: '#ffffff', backdropFilter: 'blur(10px)', width: 'fit-content', marginBottom: 28 }}>
            <Building2 size={22} color="#a7f3d0" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>FinSync Unified NetBanking</span>
          </div>

          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, lineHeight: 1.25, color: '#ffffff', marginBottom: 20, letterSpacing: '-0.6px', textAlign: 'left' }}>
            Single Secure Portal for Clients & Administrators
          </h1>

          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.92)', marginBottom: 36, fontWeight: 500, textAlign: 'justify' }}>
            One unified, high-security authentication station. Sign in with your registered credentials to instantly access your Customer Dashboard or Admin Control Center.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.25)', color: '#a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={20} />
              </div>
              <span>Automated Role Detection (Customer & Admin RBAC)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.25)', color: '#a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={20} />
              </div>
              <span>Stateless JWT Session Tokens & 256-bit SSL Encryption</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.25)', color: '#a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={20} />
              </div>
              <span>ACID Double-Entry Ledger & Real-Time Security Logs</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.2)', fontWeight: 600, textAlign: 'justify', width: '100%' }}>
          <strong>Security Notice:</strong> FinSync Bank will never ask for your confidential password or OTP over phone or email.
        </div>
      </div>

      {/* Right Side: Clean Form Theme */}
      <div style={{ background: 'var(--bg-secondary)', padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          
          <div style={{ marginBottom: 28, textAlign: 'left', width: '100%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(99, 102, 241, 0.12)', borderRadius: 20, color: 'var(--primary)', fontWeight: 800, fontSize: '0.82rem', marginBottom: 12 }}>
              <ShieldCheck size={16} />
              <span>Unified Portal Access</span>
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 8, textAlign: 'left', letterSpacing: '-0.5px' }}>
              Sign In to FinSync
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', fontWeight: 600, textAlign: 'left' }}>
              Enter your registered credentials to access your account.
            </p>
          </div>

          {/* Quick Autofill Demo Credentials */}
          <div style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-color)', marginBottom: 24 }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={13} color="var(--primary)" /> Demo Account Quick Fill:
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fillCredentials('scott@gmail.com', 'SecretPassword123!')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--accent-emerald)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <UserCheck size={13} /> Customer: scott@gmail.com
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('admin@gmail.com', 'SecretPassword123!')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <ShieldCheck size={13} /> Admin: admin@gmail.com
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div className="form-group" style={{ marginBottom: 22, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)', textAlign: 'left' }}>Registered Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@domain.com"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 20px 14px 48px',
                    borderRadius: 12,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '1.02rem',
                    outline: 'none'
                  }}
                />
                <Mail size={20} style={{ position: 'absolute', left: 16, top: 14, color: 'var(--primary)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 26, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)', textAlign: 'left' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 48px 14px 48px',
                    borderRadius: 12,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '1.02rem',
                    outline: 'none'
                  }}
                />
                <Lock size={20} style={{ position: 'absolute', left: 16, top: 14, color: 'var(--primary)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 16, top: 14, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                fontSize: '1.05rem',
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
              <span>{loading ? 'Authenticating…' : 'Sign In to Account'}</span>
              <ArrowRight size={20} />
            </button>
          </form>

          <p style={{ marginTop: 26, textAlign: 'center', fontSize: '0.98rem', color: 'var(--text-muted)', fontWeight: 600, width: '100%' }}>
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



