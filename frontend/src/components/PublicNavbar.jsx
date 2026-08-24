import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import Modal from './Modal.jsx'
import FinSyncLogo from './FinSyncLogo.jsx'
import {
  Building2,
  Home,
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
      <header className="public-navbar" style={{ background: '#ffffff', borderBottom: '1px solid #E5E7EB', boxShadow: '0 2px 12px rgba(17, 24, 39, 0.03)' }}>
        <div className="nav-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand Logo with Bank Emblem */}
          <Link to={user ? (user.role === 'ADMIN' ? "/admin" : user.role === 'ANALYST' ? "/analyst" : "/dashboard") : "/"} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            <FinSyncLogo size={46} glow />
            <div>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#111827', letterSpacing: '-0.5px' }}>
                FINSYNC BANK
              </span>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#12A878', letterSpacing: 1.2, textTransform: 'uppercase', marginTop: -2 }}>
                ALWAYS WITH YOU
              </div>
            </div>
          </Link>

          {/* Nav Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: '1px solid #E5E7EB',
                background: '#F4F9FF',
                color: '#12A878',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              title="Home"
            >
              <Home size={18} color="#12A878" />
            </button>

            <button
              onClick={toggleTheme}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: '1px solid #E5E7EB',
                background: '#F4F9FF',
                color: '#4B5563',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} color="#D97706" /> : <Moon size={16} color="#12A878" />}
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={handleAdminClick}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '8px 14px', fontWeight: 800, background: '#ffffff', border: '1.5px solid #E2E8F0', color: '#111827' }}
                >
                  <ShieldCheck size={16} color="#12A878" />
                  <span>Admin Portal</span>
                </button>
                <button
                  onClick={handleDashboardClick}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '8px 16px', fontWeight: 700, background: '#0FA878', border: 'none', color: '#ffffff', boxShadow: '0 4px 12px rgba(15, 168, 120, 0.25)' }}
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
                    background: '#ffffff',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: 8,
                    color: '#111827',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <ShieldCheck size={16} color="#12A878" />
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
                    background: '#0FA878',
                    border: 'none',
                    borderRadius: 8,
                    color: '#ffffff',
                    boxShadow: '0 4px 14px rgba(15, 168, 120, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Lock size={16} color="#ffffff" />
                  <span>NetBanking Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

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
