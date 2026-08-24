import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import Modal from './Modal.jsx'
import {
  Building2,
  Search,
  ShieldCheck,
  CreditCard,
  Send,
  PieChart,
  PiggyBank,
  User,
  Sun,
  Moon,
  LogOut,
  Lock,
  LayoutDashboard
} from 'lucide-react'

export default function PublicNavbar() {
  const { user, logout, switchRole } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleConfirmLogout = () => {
    setShowLogoutModal(false)
    logout()
    navigate('/login')
  }

  const handleAdminClick = () => {
    if (user) {
      if (user.role !== 'ADMIN') switchRole('ADMIN')
      navigate('/admin')
    } else {
      navigate('/login')
    }
  }

  const handleDashboardClick = () => {
    if (user?.role === 'ADMIN') navigate('/admin')
    else if (user?.role === 'ANALYST') navigate('/analyst')
    else navigate('/dashboard')
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'FS'

  return (
    <>
      {/* FinSync Top Utility Bar (Single Horizontal Row) */}
      <div
        className="public-topbar"
        style={{
          background: '#1e1b4b',
          padding: '8px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.78rem',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          boxSizing: 'border-box',
          whiteSpace: 'nowrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.9)' }}>
            <ShieldCheck size={14} color="#a7f3d0" /> RBI Authorized Scheduled Commercial Bank • Toll-Free: <strong>1800-425-1199</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.78rem',
              fontWeight: 600
            }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={14} color="#f59e0b" /> : <Moon size={14} color="#a5b4fc" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <span style={{ opacity: 0.3, color: '#fff' }}>|</span>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontWeight: 700, color: '#a7f3d0' }}>
                Logged in as: {user.fullName} ({user.role || 'USER'})
              </span>
              <span style={{ cursor: 'pointer', color: '#60a5fa', fontWeight: 800 }} onClick={handleAdminClick}>Admin Portal</span>
            </div>
          ) : (
            <>
              <span style={{ cursor: 'pointer', color: '#ffffff', fontWeight: 700 }} onClick={() => navigate('/register')}>Open Account Online</span>
              <span style={{ opacity: 0.3, color: '#fff' }}>|</span>
              <span style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }} onClick={() => navigate('/login')}>NetBanking Sign In</span>
              <span style={{ opacity: 0.3, color: '#fff' }}>|</span>
              <span style={{ cursor: 'pointer', color: '#a7f3d0', fontWeight: 700 }} onClick={handleAdminClick}>Admin Portal</span>
            </>
          )}
        </div>
      </div>

      {/* Main Brand Header */}
      <header className="public-navbar" style={{ background: '#ffffff', borderBottom: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(15,23,42,0.02)' }}>
        <div className="nav-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand Logo */}
          <Link to={user ? (user.role === 'ADMIN' ? "/admin" : user.role === 'ANALYST' ? "/analyst" : "/dashboard") : "/"} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#ecfdf5',
                border: '1.5px solid #a7f3d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                boxShadow: '0 2px 8px rgba(167, 243, 208, 0.3)'
              }}
            >
              <Building2 size={24} />
            </div>
            <div>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
                FINSYNC BANK
              </span>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#059669', letterSpacing: 1.2, textTransform: 'uppercase', marginTop: -2 }}>
                ALWAYS WITH YOU
              </div>
            </div>
          </Link>

          {/* Nav Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: '1px solid #f1f5f9',
                background: '#fafaf9',
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              title="Search"
            >
              <Search size={16} />
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={handleAdminClick}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '8px 14px', fontWeight: 800, background: '#fafaf9', border: '1px solid #e2e8f0', color: '#0f172a' }}
                >
                  <ShieldCheck size={16} color="#059669" />
                  <span>Admin Portal</span>
                </button>
                <button
                  onClick={handleDashboardClick}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '8px 16px', fontWeight: 700, background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46' }}
                >
                  <LayoutDashboard size={16} />
                  <span>Go to Workspace</span>
                </button>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="btn btn-rose btn-sm"
                  style={{ padding: '8px 14px', fontWeight: 700 }}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={handleAdminClick}
                  style={{
                    padding: '10px 18px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#fafaf9',
                    border: '1.5px solid #f1f5f9',
                    borderRadius: 8,
                    color: '#0f172a',
                    cursor: 'pointer'
                  }}
                >
                  <ShieldCheck size={16} color="#059669" />
                  <span>Admin Portal</span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    padding: '10px 22px',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#ecfdf5',
                    border: '1.5px solid #a7f3d0',
                    borderRadius: 8,
                    color: '#065f46',
                    boxShadow: '0 2px 10px rgba(167, 243, 208, 0.4)',
                    cursor: 'pointer'
                  }}
                >
                  <Lock size={16} />
                  <span>NetBanking Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Bar Overlay */}
      {searchOpen && (
        <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '16px 24px', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FinSync accounts, transfer money, debit cards, interest rates…"
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                fontSize: '0.95rem'
              }}
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="btn btn-primary"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Confirm Sign Out">
        <div style={{ textAlign: 'center', padding: '10px 0 20px 0' }}>
          <div
            style={{
              width: 52,
              height: 52,
              margin: '0 auto 16px auto',
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.15)',
              color: 'var(--accent-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LogOut size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-main)' }}>
            Sign Out of FinSync Bank?
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
            Are you sure you want to end your secure NetBanking session?
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setShowLogoutModal(false)}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLogout}
              className="btn btn-rose"
              style={{ flex: 1 }}
            >
              Confirm Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
