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

  const isEmpRequired = role === 'ANALYST' || role === 'ADMIN'

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

    // Validate Employee Number if Analyst or Admin selected
    if (isEmpRequired && !empNo.trim()) {
      addToast(`Employee Number is required for ${role} registration.`, 'error')
      return
    }

    setLoading(true)
    try {
      await register(fullName.trim(), email.trim(), password, phoneNumber.trim(), role, empNo.trim())
      addToast(`FinSync account created as ${role}! Welcome aboard.`, 'success')
      if (role === 'CUSTOMER') {
        navigate('/dashboard')
      } else {
        navigate('/rbac')
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Digital onboarding failed. Please try again.', 'error')
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
            Digital Onboarding & Role Clearance
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 32, color: 'rgba(255,255,255,0.9)' }}>
            Join FinSync Bank NetBanking in 60 seconds with instant role-based access management.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
              <CheckCircle2 size={20} color="#a7f3d0" />
              <span>Customer: Retail Banking & Instant Debit Cards</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
              <CheckCircle2 size={20} color="#a7f3d0" />
              <span>Analyst: Macro Portfolio Analytics & Yield Benchmarks</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
              <CheckCircle2 size={20} color="#a7f3d0" />
              <span>Admin: User Access Directory & Security Elevation</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 20 }}>
          <strong>Employee Verification:</strong> Employee ID (`empNo`) is verified for Analyst and Admin role registrations.
        </div>
      </div>

      {/* Registration Form Container */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 20, padding: 40, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>
            Digital Onboarding
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Select your role and enter your registration details.</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Account Role Selection */}
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-main)' }}>Select Account Role</label>
            <div style={{ position: 'relative' }}>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  fontWeight: 700
                }}
              >
                <option value="CUSTOMER">Retail Client (Customer)</option>
                <option value="ANALYST">Financial Analyst (Requires Emp No)</option>
                <option value="ADMIN">System Security Admin (Requires Emp No)</option>
              </select>
              <ShieldCheck size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--primary)' }} />
            </div>
          </div>

          {/* Conditional Employee Number Field */}
          {isEmpRequired && (
            <div className="form-group" style={{ marginBottom: 16, animation: 'fadeIn 0.3s ease' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: 6, color: 'var(--primary)' }}>
                Employee ID Number (empNo) <span style={{ color: '#ef4444' }}>*Required</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={empNo}
                  onChange={(e) => setEmpNo(e.target.value)}
                  placeholder="e.g. EMP-10492"
                  required={isEmpRequired}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: 8,
                    border: '1.5px solid var(--primary)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
                    fontWeight: 700
                  }}
                />
                <BadgeCheck size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--primary)' }} />
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-main)' }}>Full Legal Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full legal name"
                required
                autoComplete="off"
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
              <User size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--primary)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-main)' }}>Email Address</label>
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

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-main)' }}>10-Digit Mobile Number</label>
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
                  padding: '12px 16px 12px 42px',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem'
                }}
              />
              <Phone size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--primary)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-main)' }}>NetBanking Password</label>
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
            <span>{loading ? 'Registering...' : `Complete Onboarding (${role})`}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: 18, textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>
            NetBanking Login
          </Link>
        </p>
      </div>
    </div>
  )
}
