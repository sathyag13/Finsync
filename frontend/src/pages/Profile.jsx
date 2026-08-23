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
  Mail,
  Lock,
  BadgeCheck,
  CreditCard
} from 'lucide-react'

export default function Profile() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  if (!user) return null

  const initials = user.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'FS'

  return (
    <div style={{ width: '100%', paddingBottom: 60 }}>
      {/* Header Bar */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <User size={28} color="var(--primary)" /> FinSync NetBanking Profile & Security
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Manage your verified account identity, transfer limits, and application preferences
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="card" style={{ marginBottom: 28, borderRadius: 20, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 900,
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
              border: '3px solid rgba(255,255,255,0.2)'
            }}
          >
            {initials}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>{user.fullName}</h2>
              <span className="badge badge-emerald" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 800, padding: '5px 14px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} /> Verified FinSync Client
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: 4, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mail size={15} color="var(--primary)" /> {user.email}
            </p>
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: 24 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                value={user.fullName}
                disabled
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  borderRadius: 12,
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.98rem'
                }}
              />
              <User size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--primary)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                value={user.email}
                disabled
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  borderRadius: 12,
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.98rem'
                }}
              />
              <Mail size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--primary)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Account Type / Role</label>
            <div style={{ position: 'relative' }}>
              <input
                value={user.role || 'CUSTOMER'}
                disabled
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  borderRadius: 12,
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--primary)',
                  fontWeight: 800,
                  fontSize: '0.98rem'
                }}
              />
              <BadgeCheck size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--primary)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Primary Currency</label>
            <div style={{ position: 'relative' }}>
              <input
                value="INR (₹) — Indian Rupee"
                disabled
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  borderRadius: 12,
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.98rem'
                }}
              />
              <CreditCard size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--primary)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Account Limits & Workspace Preferences */}
      <div className="grid grid-2" style={{ gap: 24 }}>
        <div className="card" style={{ borderRadius: 20, border: '1px solid var(--border-color)', padding: 24 }}>
          <h3 className="card-title" style={{ marginBottom: 20, fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={20} color="var(--primary)" /> Account Limits & Features
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Daily Transfer Limit</span>
              <span style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1rem' }}>₹5,00,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Instant P2P Transfers</span>
              <span className="badge badge-emerald" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 800, padding: '4px 12px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={14} /> Enabled
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Vault Savings APY</span>
              <span style={{ fontWeight: 900, color: '#10b981', fontSize: '1rem' }}>5.50% p.a.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Account Tier</span>
              <span className="badge badge-indigo" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--primary)', fontWeight: 800, padding: '4px 12px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Award size={14} /> Platinum Tier
              </span>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderRadius: 20, border: '1px solid var(--border-color)', padding: 24 }}>
          <h3 className="card-title" style={{ marginBottom: 20, fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={20} color="#06b6d4" /> Application Preferences
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>Interface Theme</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>
                  Current: {theme === 'dark' ? 'Dark Glass Mode' : 'Light Mode'}
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={toggleTheme}
                style={{ padding: '8px 16px', borderRadius: 10, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#6366f1" />}
                <span>Toggle</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>Transaction Notifications</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>Instant Email & Toast Alerts</div>
              </div>
              <span className="badge badge-emerald" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 800, padding: '4px 12px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Bell size={14} /> Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
