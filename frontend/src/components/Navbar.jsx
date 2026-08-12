import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import Modal from './Modal.jsx'
import {
  LayoutDashboard,
  CreditCard,
  Send,
  PieChart,
  PiggyBank,
  User,
  LogOut,
  Moon,
  Sun,
  Bell,
  Zap,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck
} from 'lucide-react'

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  if (!user) return null

  const handleConfirmLogout = () => {
    setShowLogoutModal(false)
    logout()
    navigate('/login')
  }

  const initials = user.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'FS'

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Accounts', path: '/accounts', icon: CreditCard },
    { label: 'Pay & Transfer', path: '/transfer', icon: Send },
    { label: 'Expenses', path: '/expenses', icon: PieChart },
    { label: 'Savings Goals', path: '/savings', icon: PiggyBank },
    { label: 'Profile', path: '/profile', icon: User }
  ]

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo-icon">
            <Zap size={22} color="white" />
          </div>
          <span className="sidebar-brand-text">FinSync</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                type="button"
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                style={{ border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini-card" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user.fullName}</div>
              <div className="user-role">{user.role || 'Verified Client'}</div>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={() => setShowLogoutModal(true)} style={{ width: '100%' }}>
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Sign Out Confirmation Modal */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Confirm Sign Out">
        <div style={{ textAlign: 'center', padding: '10px 0 20px 0' }}>
          <div className="sidebar-logo-icon" style={{ width: 48, height: 48, margin: '0 auto 16px auto', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)' }}>
            <LogOut size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>Sign Out of FinSync?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
            Are you sure you want to sign out of your account session?
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)} style={{ flex: 1 }}>
              Cancel
            </button>
            <button className="btn btn-rose" onClick={handleConfirmLogout} style={{ flex: 1 }}>
              Confirm Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export function TopHeader() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  if (!user) return null

  const handleConfirmLogout = () => {
    setShowLogoutModal(false)
    logout()
    navigate('/login')
  }

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard Overview'
      case '/accounts': return 'Accounts & Banking'
      case '/transfer': return 'Send & Transfer Funds'
      case '/expenses': return 'Expense Analytics'
      case '/savings': return 'Savings Goals & Vaults'
      case '/profile': return 'User Account & Security'
      default: return 'FinSync Workspace'
    }
  }

  const initials = user.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'FS'

  const notifications = [
    { id: 1, title: `Welcome, ${user.fullName || 'User'}`, desc: 'Your banking session is authenticated with AES-256 JWT encryption.', time: 'Active Now', icon: CheckCircle2, color: 'var(--accent-emerald)' },
    { id: 2, title: 'Realtime Database', desc: 'Connected to your personal account ledger.', time: 'Just now', icon: ShieldCheck, color: 'var(--primary)' }
  ]

  return (
    <>
      <header className="top-header" style={{ position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="header-title">
          <span>{getPageTitle()}</span>
        </div>

        <div className="header-actions" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="btn-demo-badge">
            <div className="demo-dot" />
            <span>FinSync Live</span>
          </div>

          <button className="icon-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          <button
            className="icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="System Notifications"
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-rose)' }} />
          </button>

          {/* Clickable Profile Avatar */}
          <div
            onClick={() => navigate('/profile')}
            title="View Profile & Settings"
            style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 10, borderLeft: '1px solid var(--border-color)', cursor: 'pointer' }}
          >
            <div className="user-avatar" style={{ width: 34, height: 34, fontSize: '0.8rem', boxShadow: '0 2px 8px var(--primary-glow)' }}>
              {initials}
            </div>
          </div>

          {/* Header Sign Out Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowLogoutModal(true)}
            title="Sign Out"
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.3)', marginLeft: 6 }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: 52,
              right: 0,
              width: 340,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glow)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: 18,
              zIndex: 100,
              backdropFilter: 'var(--glass-filter)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bell size={16} color="var(--primary)" /> Notifications
                </div>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  onClick={() => setShowNotifications(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {notifications.map((n) => {
                  const Icon = n.icon
                  return (
                    <div key={n.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                        <Icon size={16} color={n.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{n.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{n.desc}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4 }}>{n.time}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Header Sign Out Confirmation Modal */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Confirm Sign Out">
        <div style={{ textAlign: 'center', padding: '10px 0 20px 0' }}>
          <div className="sidebar-logo-icon" style={{ width: 48, height: 48, margin: '0 auto 16px auto', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)' }}>
            <LogOut size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>Sign Out of FinSync?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
            Are you sure you want to sign out of your account session?
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)} style={{ flex: 1 }}>
              Cancel
            </button>
            <button className="btn btn-rose" onClick={handleConfirmLogout} style={{ flex: 1 }}>
              Confirm Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default function Navbar() {
  return null
}
