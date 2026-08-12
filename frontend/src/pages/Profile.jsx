import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import {
  User,
  ShieldCheck,
  Sun,
  Moon,
  CheckCircle2,
  Globe,
  Sliders,
  Award,
  Bell,
  LogOut
} from 'lucide-react'

export default function Profile() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'FS'

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <User size={24} color="var(--primary)" /> Profile & Preferences
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage your personal information, account limits, and workspace preferences
          </p>
        </div>

        <button className="btn btn-rose" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
          <div className="user-avatar" style={{ width: 72, height: 72, fontSize: '1.8rem', boxShadow: '0 8px 24px var(--primary-glow)' }}>
            {initials}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user.fullName}</h2>
              <span className="badge badge-emerald">
                <ShieldCheck size={14} /> Verified Client
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 2 }}>{user.email}</p>
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: 20 }}>
          <div className="form-group">
            <label>Full Legal Name</label>
            <input value={user.fullName} disabled style={{ opacity: 0.9, fontWeight: 600 }} />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input value={user.email} disabled style={{ opacity: 0.9, fontWeight: 600 }} />
          </div>

          <div className="form-group">
            <label>Account Type / Role</label>
            <input value={user.role || 'ROLE_USER'} disabled style={{ opacity: 0.9, fontWeight: 600 }} />
          </div>

          <div className="form-group">
            <label>Primary Currency</label>
            <input value="INR (₹) — Indian Rupee" disabled style={{ opacity: 0.9, fontWeight: 600 }} />
          </div>
        </div>
      </div>

      {/* Account Limits & Workspace Preferences */}
      <div className="grid grid-2">
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 16 }}>
            <Sliders size={18} color="var(--primary)" /> Account Limits & Features
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Daily Transfer Limit</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹5,00,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Instant P2P Transfers</span>
              <span className="badge badge-emerald"><CheckCircle2 size={12} /> Enabled</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Vault Savings APY</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>5.50% p.a.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Account Tier</span>
              <span className="badge badge-indigo"><Award size={12} /> Platinum Tier</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 16 }}>
            <Globe size={18} color="var(--accent-cyan)" /> Application Preferences
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Interface Theme</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current: {theme === 'dark' ? 'Dark Glass Mode' : 'Light Mode'}</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#6366f1" />}
                <span>Toggle</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Transaction Notifications</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instant Email & Toast Alerts</div>
              </div>
              <span className="badge badge-emerald"><Bell size={12} /> Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
