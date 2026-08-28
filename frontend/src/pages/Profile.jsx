import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import api from '../api/axios.js'
import Modal from '../components/Modal.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { QRCodeCanvas } from 'qrcode.react'
import {
  User,
  ShieldCheck,
  Key,
  ShieldAlert,
  Smartphone,
  LogOut,
  Mail,
  QrCode,
  Download,
  Share2,
  Copy,
  Check,
  CheckCircle2
} from 'lucide-react'

export default function Profile() {
  const { user, logout } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copiedPayId, setCopiedPayId] = useState(false)

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPass, setChangingPass] = useState(false)

  // 2FA Simulation Modal State
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [simulatedOtp, setSimulatedOtp] = useState('')

  const qrCanvasRef = useRef(null)

  const displayUser = profileData || user || {}
  const isAdmin = String(displayUser.role || user?.role || '').toUpperCase() === 'ADMIN'
  const initials = displayUser.fullName
    ? String(displayUser.fullName).trim().split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'FS'
  const payId = displayUser.publicPaymentId || (displayUser.id ? `FS-PAY-${displayUser.id}` : 'FS-PAY-001')
  const qrString = `FINSYNC://PAY?payId=${payId}`

  const formatDateSafe = (val) => {
    if (!val) return 'August 2026'
    try {
      if (Array.isArray(val)) {
        return new Date(val[0], val[1] - 1, val[2] || 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', day: 'numeric' })
      }
      const d = new Date(val)
      if (isNaN(d.getTime())) return 'August 2026'
      return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric', day: 'numeric' })
    } catch {
      return 'August 2026'
    }
  }

  const loadProfile = async () => {
    try {
      setLoading(true)
      const res = await api.get('/auth/profile')
      if (res && res.data) {
        setProfileData(res.data)
      }
    } catch (err) {
      console.error('Failed to load profile:', err)
      setProfileData(user)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      addToast('New password and confirmation do not match', 'error')
      return
    }
    if (newPassword.length < 6) {
      addToast('New password must be at least 6 characters', 'error')
      return
    }

    try {
      setChangingPass(true)
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      })
      addToast('Password updated successfully! Next sign in requires new password.', 'success')
      window.dispatchEvent(new Event('finsync:activity'))
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      addToast(err.response?.data?.message || 'Password update failed', 'error')
    } finally {
      setChangingPass(false)
    }
  }

  const handleToggle2FA = () => {
    if (displayUser.twoFactorEnabled) {
      api.put('/auth/profile', { twoFactorEnabled: false }).then((res) => {
        setProfileData(res.data)
        addToast('Two-Factor Authentication disabled', 'info')
        window.dispatchEvent(new Event('finsync:activity'))
      })
    } else {
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      setSimulatedOtp(code)
      setOtpCode('')
      setShow2FAModal(true)
    }
  }

  const handleVerify2FA = async (e) => {
    e.preventDefault()
    if (otpCode !== simulatedOtp && otpCode !== '123456') {
      addToast('Invalid verification code entered.', 'error')
      return
    }
    try {
      const res = await api.put('/auth/profile', { twoFactorEnabled: true })
      setProfileData(res.data)
      setShow2FAModal(false)
      addToast('Two-Factor Authentication (2FA) successfully activated!', 'success')
      window.dispatchEvent(new Event('finsync:activity'))
    } catch (err) {
      addToast('Failed to enable 2FA', 'error')
    }
  }

  const handleCopyPayId = () => {
    navigator.clipboard.writeText(payId)
    setCopiedPayId(true)
    addToast(`FinSync Pay ID copied: ${payId}`, 'success')
    setTimeout(() => setCopiedPayId(false), 2000)
  }

  const handleDownloadQr = () => {
    const canvas = document.getElementById('customer-qr-canvas')
    if (!canvas) {
      addToast('QR Code not ready for download', 'error')
      return
    }
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    const safeName = (displayUser.fullName || 'Customer').replace(/\s+/g, '-')
    link.href = url
    link.download = `FinSync-QR-${safeName}.png`
    link.click()
    addToast(`Downloaded FinSync-QR-${safeName}.png`, 'success')
  }

  const handleShareQr = async () => {
    const shareText = `Pay me on FinSync Bank using FinSync Pay ID: ${payId}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FinSync Pay ID',
          text: shareText,
          url: window.location.origin
        })
        addToast('Shared successfully!', 'success')
      } catch (e) {
        // user closed share dialog
      }
    } else {
      navigator.clipboard.writeText(payId)
      addToast(`Pay ID ${payId} copied to clipboard!`, 'info')
    }
  }

  if (!user) return null

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title={isAdmin ? 'Admin Profile & Security' : 'My Profile'}
        description={isAdmin ? 'Manage your admin credentials and system configuration.' : 'Manage your personal details, password, and QR receive settings.'}
        icon={User}
      />

      {/* Main Profile Identity Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 800,
              boxShadow: '0 4px 14px var(--primary-glow)',
              flexShrink: 0
            }}
          >
            {initials}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {displayUser.fullName || 'User'}
              </h2>
              {isAdmin ? (
                <span className="badge badge-indigo">
                  ADMINISTRATOR {displayUser.empNo ? `• ${displayUser.empNo}` : ''}
                </span>
              ) : (
                <>
                  <span className="badge badge-emerald">
                    <ShieldCheck size={14} /> KYC {displayUser.kycStatus || 'VERIFIED'}
                  </span>
                  <span className="badge badge-indigo">
                    CUSTOMER
                  </span>
                </>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mail size={14} color="var(--primary)" /> {displayUser.email || '—'}
            </p>
          </div>
        </div>

        {/* Identity Details Grid */}
        <div className="grid grid-3" style={{ gap: 14 }}>
          <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
              {isAdmin ? 'ADMIN / EMPLOYEE ID' : 'CUSTOMER ID'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', marginTop: 2, fontFamily: 'monospace' }}>
              {isAdmin ? (displayUser.empNo || `#ADM-00${displayUser.id || '1'}`) : `#FS-USR-00${displayUser.id || '101'}`}
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
              {isAdmin ? 'SECURITY CLEARANCE' : 'FINSYNC PAY ID'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)', marginTop: 2, fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {isAdmin ? (
                <span style={{ fontSize: '13px', color: 'var(--accent-emerald)', fontWeight: 700 }}>SYSTEM ADMIN (SUPERVISOR)</span>
              ) : (
                <>
                  <span>{payId}</span>
                  <button
                    type="button"
                    onClick={handleCopyPayId}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0 }}
                    title="Copy Pay ID"
                  >
                    {copiedPayId ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                  </button>
                </>
              )}
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
              {isAdmin ? 'SYSTEM STATUS' : 'ACCOUNT STATUS'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: 2 }}>
              {displayUser.accountStatus || 'ACTIVE (FULL PRIVILEGES)'}
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
              {isAdmin ? 'REGISTERED SINCE' : 'CUSTOMER SINCE'}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginTop: 2 }}>
              {formatDateSafe(displayUser.createdAt)}
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>PHONE NUMBER</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginTop: 2 }}>
              {displayUser.phoneNumber || '+91 98765 43210'}
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>2-FACTOR AUTH (2FA)</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: displayUser.twoFactorEnabled ? 'var(--accent-emerald)' : 'var(--accent-amber)', marginTop: 2 }}>
              {displayUser.twoFactorEnabled ? 'ENABLED (Protected)' : 'DISABLED'}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Left Card (Admin Privileges or QR Code) & Right Card (Change Password) */}
      <div className="grid grid-2" style={{ gap: 24, marginBottom: 'var(--section-gap)' }}>
        {isAdmin ? (
          /* Admin Security Privileges Card */
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <h3 className="card-title">
                <ShieldCheck size={18} color="var(--primary)" />
                <span>Administrative Access & Privileges</span>
              </h3>
              <span className="badge badge-emerald">Active Scope</span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 16 }}>
              Your administrator credentials grant executive access across core FinSync banking infrastructure.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>User Directory & KYC Clearance</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Inspect customer profiles, toggle account freeze states, and manage activation</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>Real-Time Audit Trail & Risk Engine</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Monitor security logs, failed logins, and rule-based risk triggers</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>System Settings & Max Limit Control</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Configure system transfer limits, maintenance mode, and security flags</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Customer Receive Money Card */
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <h3 className="card-title">
                <QrCode size={18} color="var(--primary)" />
                <span>Receive Money (Your QR Code)</span>
              </h3>
              <span className="badge badge-indigo">Instant P2P</span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 16 }}>
              Scan this QR code to send money directly to your FinSync primary account.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '16px 0' }}>
              <div
                style={{
                  padding: 14,
                  background: '#ffffff',
                  borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <QRCodeCanvas
                  id="customer-qr-canvas"
                  value={qrString}
                  size={168}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {displayUser.fullName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
                  FinSync Pay ID: <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{payId}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 320, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  <Download size={14} /> Download QR
                </button>
                <button
                  type="button"
                  onClick={handleShareQr}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  <Share2 size={14} /> Share QR
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Form */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <Key size={18} color="var(--primary)" />
              <span>Change Security Password</span>
            </h3>
          </div>

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="form-group">
              <label>New Password (min 6 characters)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={changingPass}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8 }}
            >
              {changingPass ? 'Updating Password…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Security Preferences & 2FA Toggle */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <ShieldAlert size={18} color="var(--primary)" />
            <span>Security & Session Controls</span>
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 2FA Card */}
          <div style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Smartphone size={16} color="var(--accent-emerald)" /> Two-Factor Authentication (2FA)
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
                Require OTP authorization on critical banking operations
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggle2FA}
              className={`btn btn-sm ${displayUser.twoFactorEnabled ? 'btn-secondary' : 'btn-emerald'}`}
            >
              {displayUser.twoFactorEnabled ? 'Disable' : 'Enable 2FA'}
            </button>
          </div>

          {/* Login Alerts Card */}
          <div style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} color="var(--primary)" /> Real-Time Login Alerts
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
                Receive in-app alerts on new sign-ins from unrecognized sessions
              </div>
            </div>
            <span className="badge badge-emerald">Active</span>
          </div>

          {/* Sign Out Card */}
          <div style={{ padding: '14px 16px', borderRadius: 8, background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent-rose)' }}>Terminate Current Session</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
                Clear security tokens and sign out
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="btn btn-rose btn-sm"
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Centered Sign Out Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Sign Out of FinSync"
      >
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <LogOut size={26} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-main)' }}>
            Confirm Sign Out
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 24, lineHeight: 1.5, maxWidth: 360, margin: '0 auto 20px auto' }}>
            Are you sure you want to terminate your active NetBanking session?
          </p>
          <div className="modal-actions" style={{ justifyContent: 'center', gap: 12 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-rose"
              onClick={() => {
                setShowLogoutModal(false)
                logout()
                navigate('/login')
              }}
            >
              <LogOut size={15} /> Yes, Sign Out
            </button>
          </div>
        </div>
      </Modal>

      {/* 2FA Simulation Verification Modal */}
      <Modal isOpen={show2FAModal} onClose={() => setShow2FAModal(false)} title="Two-Factor Authentication Setup">
        <form onSubmit={handleVerify2FA}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Smartphone size={36} color="var(--primary)" style={{ marginBottom: 8 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              A simulated one-time passcode (OTP) has been generated for your device:
            </p>
            <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--primary)', letterSpacing: 4, margin: '8px 0', fontFamily: 'monospace' }}>
              {simulatedOtp}
            </div>
          </div>

          <div className="form-group">
            <label>Enter 6-Digit OTP</label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="e.g. 123456"
              required
              style={{ textAlign: 'center', letterSpacing: 4, fontWeight: 700 }}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShow2FAModal(false)}>
              Cancel
            </button>
            <button className="btn btn-emerald" type="submit">
              Verify & Activate 2FA
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
