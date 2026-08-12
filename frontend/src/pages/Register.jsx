import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { Zap, ShieldCheck, ArrowRight, Sparkles, User, Mail, Phone, Lock } from 'lucide-react'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      addToast('Please enter a valid email address format (e.g. user@domain.com).', 'error')
      return
    }

    // Validate phone number (must contain at least 10 digits and valid characters)
    const phoneDigits = phoneNumber.replace(/\D/g, '')
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/
    if (!phoneNumber.trim() || !phoneRegex.test(phoneNumber.trim()) || phoneDigits.length < 10) {
      addToast('Please enter a valid mobile number (at least 10 digits).', 'error')
      return
    }

    setLoading(true)
    try {
      await register(fullName.trim(), email.trim(), password, phoneNumber.trim())
      addToast('Account created successfully! Welcome to FinSync.', 'success')
      navigate('/dashboard')
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed.', 'error')
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#6ee7b7', fontSize: '0.82rem', fontWeight: 600, marginBottom: 20 }}>
            <Sparkles size={15} />
            <span>Open Account in 60 Seconds</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 20 }}>
            Join the Next Era of Digital Banking.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 32 }}>
            Instant account numbers, digital platinum debit cards, and multi-currency vaults designed for modern builders.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#e2e8f0', fontSize: '0.95rem' }}>
              <ShieldCheck size={20} color="#10b981" />
              <span>Zero Account Opening Fees</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#e2e8f0', fontSize: '0.95rem' }}>
              <ShieldCheck size={20} color="#10b981" />
              <span>Instant Digital Debit Card Provisioning</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#e2e8f0', fontSize: '0.95rem' }}>
              <ShieldCheck size={20} color="#10b981" />
              <span>Free P2P Money Transfers Across India</span>
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
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>Create Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fill in your real details to open your account</p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label>Full Legal Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  autoComplete="off"
                  style={{ paddingLeft: 42 }}
                />
                <User size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-dim)' }} />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="off"
                  style={{ paddingLeft: 42 }}
                />
                <Mail size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-dim)' }} />
              </div>
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  required
                  autoComplete="off"
                  style={{ paddingLeft: 42 }}
                />
                <Phone size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-dim)' }} />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  style={{ paddingLeft: 42 }}
                />
                <Lock size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-dim)' }} />
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
              {loading ? 'Creating Account…' : 'Complete Registration'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
