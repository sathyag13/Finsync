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
                background: '#f5f3ff',
                border: '1.5px solid #ddd6fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7c3aed',
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)'
              }}
            >
              <Building2 size={24} />
            </div>
            <div>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
                FINSYNC BANK
              </span>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#7c3aed', letterSpacing: 1.2, textTransform: 'uppercase', marginTop: -2 }}>
                ALWAYS WITH YOU
              </div>
            </div>
          </Link>

          {/* Nav Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={toggleTheme}
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
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} color="#d97706" /> : <Moon size={16} color="#7c3aed" />}
            </button>

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
                  <ShieldCheck size={16} color="#7c3aed" />
                  <span>Admin Portal</span>
                </button>
                <button
                  onClick={handleDashboardClick}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '8px 16px', fontWeight: 700, background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#5b21b6' }}
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
                  <ShieldCheck size={16} color="#7c3aed" />
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
                    background: '#f5f3ff',
                    border: '1.5px solid #ddd6fe',
                    borderRadius: 8,
                    color: '#5b21b6',
                    boxShadow: '0 2px 10px rgba(124, 58, 237, 0.25)',
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
