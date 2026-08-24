import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import {
  Building2,
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  BadgeCheck,
  CreditCard,
  PiggyBank,
  Sparkles,
  Zap,
  LockKeyhole
} from 'lucide-react'

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

    setLoading(true)
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim(),
        role,
        empNo: isEmpRequired ? empNo.trim() : null
      })
      addToast('Account created successfully! Welcome to FinSync Bank.', 'success')
      navigate(role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed. Please check your inputs.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 16px 40px rgba(0,0,0,0.15)' }}>
      {/* Left Side: Deep Navy & Emerald Banking Showcase with Rich Value Pillars */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #064E3B 100%)', padding: '44px 38px', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '4px solid #12A878', position: 'relative' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 16px', background: 'rgba(255, 255, 255, 0.12)', borderRadius: 30, color: '#ffffff', backdropFilter: 'blur(10px)', width: 'fit-content', marginBottom: 20 }}>
            <Building2 size={20} color="#12A878" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>FinSync Digital Onboarding</span>
          </div>

          <h1 style={{ fontSize: '2.35rem', fontWeight: 900, lineHeight: 1.2, color: '#ffffff', marginBottom: 14, letterSpacing: '-0.5px', textAlign: 'left' }}>
            Open Your FinSync Account & Role Clearance
          </h1>

          <p style={{ fontSize: '1.02rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', marginBottom: 26, fontWeight: 500, textAlign: 'justify' }}>
            Join FinSync Bank NetBanking in under 60 seconds. Experience zero account opening fees, multi-currency vaults, and industry-leading security controls.
          </p>

          {/* 4 Feature Value Pillars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 26, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(18, 168, 120, 0.22)', color: '#12A878', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <CreditCard size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff' }}>Everyday Accounts & Virtual Debit Cards</div>
                <div style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.4 }}>Instant digital card issuance with real-time transaction spending insights.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(2, 132, 199, 0.22)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <PiggyBank size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff' }}>High-Yield Automated Savings</div>
                <div style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.4 }}>Earn competitive daily compounding interest with customized goal vaults.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(219, 39, 119, 0.22)', color: '#F472B6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Zap size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff' }}>Instant P2P & Cross-Border Transfers</div>
                <div style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.4 }}>Send funds seamlessly with zero hidden charges and automated double-entry ledger.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(18, 168, 120, 0.22)', color: '#12A878', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <LockKeyhole size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff' }}>256-Bit SSL & Enterprise RBAC Clearance</div>
                <div style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.4 }}>Stateless JWT tokens, role separation, and real-time security audit trails.</div>
              </div>
            </div>
          </div>

          {/* Micro Trust Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: '14px', borderRadius: 12, background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#12A878' }}>0.00%</div>
              <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, textTransform: 'uppercase' }}>Annual Fee</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38BDF8' }}>&lt;60s</div>
              <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, textTransform: 'uppercase' }}>Instant Setup</div>
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FCD34D' }}>256-Bit</div>
              <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, textTransform: 'uppercase' }}>Encryption</div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', paddingTop: 18, marginTop: 18, borderTop: '1px solid rgba(255,255,255,0.12)', fontWeight: 600, textAlign: 'justify', width: '100%' }}>
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
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>Select Account Role</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 40px 0 46px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value="CUSTOMER">Retail Client (Customer)</option>
                  <option value="ADMIN">System Security Admin</option>
                </select>
                <ShieldCheck size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Auto-Generated Employee ID Notice for Admin */}
            {role === 'ADMIN' && (
              <div style={{
                marginBottom: 18,
                padding: '14px 16px',
                borderRadius: 10,
                background: '#EAF9F3',
                border: '1px solid #C6F0DF',
                color: '#0E7F5A',
                fontSize: '0.92rem',
                fontWeight: 600,
                textAlign: 'left'
              }}>
                <strong>Admin Clearance:</strong> A 5-digit system employee number (EMP-XXXXX) will be assigned to your administrative credentials.
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 18, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>Full Legal Name</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alexander Hamilton"
                  required
                  autoComplete="off"
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 16px 0 46px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.96rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <User size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 18, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>Email Address</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  autoComplete="off"
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 16px 0 46px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.96rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <Mail size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 18, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>10-Digit Mobile Number</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                  autoComplete="off"
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 16px 0 46px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.96rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <Phone size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 26, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>Create Secure Password</label>
              <div style={{ position: 'relative', width: '100%' }}>
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
                    height: '48px',
                    padding: '0 48px 0 46px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.96rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <Lock size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
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
                background: '#0FA878',
                color: '#ffffff',
                border: 'none',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 4px 14px rgba(15,168,120,0.3)',
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

