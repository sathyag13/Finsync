import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { Building2, ArrowRight, User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, BadgeCheck } from 'lucide-react'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('CUSTOMER')
  const [empNo, setEmpNo] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const isEmpRequired = role === 'ADMIN'

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate email format strictly
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      addToast('Please enter a valid email address format (e.g. user@domain.com).', 'error')
      return
    }

    // Validate phone number (must contain at least 10 digits)
    const phoneDigits = phoneNumber.replace(/\D/g, '')
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/
    if (!phoneNumber.trim() || !phoneRegex.test(phoneNumber.trim()) || phoneDigits.length < 10) {
      addToast('Please enter a valid 10-digit mobile number.', 'error')
      return
    }

    const finalEmpNo = role === 'ADMIN' ? (empNo || Math.floor(10000 + Math.random() * 90000).toString()) : ''

    setLoading(true)
    try {
      await register(fullName.trim(), email.trim(), password, phoneNumber.trim(), role, finalEmpNo)
      addToast(`Account created successfully! Please sign in with your credentials.`, 'success')
      navigate('/login')
    } catch (err) {
      addToast(err.response?.data?.message || 'Digital onboarding failed. Please try again.', 'error')
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
            <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>FinSync Digital Onboarding</span>
          </div>

          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, lineHeight: 1.25, color: '#ffffff', marginBottom: 20, letterSpacing: '-0.6px', textAlign: 'left' }}>
            Open Your FinSync Account & Role Clearance
          </h1>

          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.92)', marginBottom: 36, fontWeight: 500, textAlign: 'justify' }}>
            Join FinSync Bank NetBanking in under 60 seconds. Set up multi-currency accounts, vault savings, and role-based permissions seamlessly.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.25)', color: '#a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={20} />
              </div>
              <span>Retail Customer: Multi-Currency Accounts & Cards</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.25)', color: '#a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={20} />
              </div>
              <span>Security Admin: User Access Directory & Security Elevation</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.2)', fontWeight: 600, textAlign: 'justify', width: '100%' }}>
          <strong>Employee Verification:</strong> 5-Digit Employee ID is verified for System Admin role registrations.
        </div>
      </div>

      {/* Right Side: Theme 2 - Clean Form Theme (Centered in Right Half) */}
      <div style={{ background: 'var(--bg-secondary)', padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ marginBottom: 24, textAlign: 'left', width: '100%' }}>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 8, textAlign: 'left' }}>
              Digital Onboarding
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', fontWeight: 600, textAlign: 'justify' }}>
              Select your role and enter your registration details to open an account.
            </p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" style={{ width: '100%' }}>
            {/* Account Role Selection */}
            <div className="form-group" style={{ marginBottom: 18, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>Select Account Role</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                >
                  <option value="CUSTOMER">Retail Client (Customer)</option>
                  <option value="ADMIN">System Security Admin</option>
                </select>
                <ShieldCheck size={20} style={{ position: 'absolute', left: 15, top: 14, color: 'var(--primary)' }} />
              </div>
            </div>

            {/* Auto-Generated Employee ID Notice for Admin */}
            {role === 'ADMIN' && (
              <div style={{
                marginBottom: 18,
                padding: '14px 16px',
                borderRadius: 10,
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1.5px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                textAlign: 'left'
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <BadgeCheck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Auto-Generated Employee ID
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    A unique 5-digit administrative clearance ID will be automatically generated and assigned upon account creation.
                  </div>
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 18, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  required
                  autoComplete="off"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <User size={20} style={{ position: 'absolute', left: 15, top: 14, color: 'var(--primary)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 18, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="off"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <Mail size={20} style={{ position: 'absolute', left: 15, top: 14, color: 'var(--primary)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 18, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>10-Digit Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                  autoComplete="off"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <Phone size={20} style={{ position: 'absolute', left: 15, top: 14, color: 'var(--primary)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 24, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>NetBanking Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  style={{
                    width: '100%',
                    padding: '14px 48px 14px 48px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <Lock size={20} style={{ position: 'absolute', left: 15, top: 14, color: 'var(--primary)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 15, top: 14, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
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
              <span>{loading ? 'Registering...' : `Complete Onboarding (${role})`}</span>
              <ArrowRight size={20} />
            </button>
          </form>

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600, width: '100%' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>
              NetBanking Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

