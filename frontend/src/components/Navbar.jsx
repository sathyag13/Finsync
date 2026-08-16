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
  CheckCircle2,
  ShieldCheck,
  Building2,
  Home,
  Users,
  FileText,
  UserCheck,
  ShieldAlert,
  History,
  Settings,
  X
} from 'lucide-react'

export function Sidebar() {
  const { user, logout, switchRole } = useAuth()
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

  // Dynamic Role-Based Sidebar Nav Items
  let navItems = []

  if (user.role === 'ADMIN') {
    navItems = [
      { label: 'Bank Portfolio Home', path: '/home', icon: Home },
      { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
      { label: 'User Management', path: '/admin/users', icon: UserCheck },
      { label: 'Accounts & Cards', path: '/admin/accounts', icon: CreditCard },
      { label: 'Transactions & Payments', path: '/admin/transactions', icon: Send },
      { label: 'Expense Analytics', path: '/admin/expenses', icon: PieChart },
      { label: 'Savings & Products', path: '/admin/savings', icon: PiggyBank },
      { label: 'Reports & Analytics', path: '/admin/reports', icon: FileText },
      { label: 'Risk & Fraud', path: '/admin/risk', icon: ShieldAlert },
      { label: 'Audit Logs', path: '/admin/audit-logs', icon: History },
      { label: 'System Settings', path: '/admin/settings', icon: Settings },
      { label: 'Admin Profile', path: '/profile', icon: User }
    ]
  } else if (user.role === 'ANALYST') {
    navItems = [
      { label: 'Bank Portfolio Home', path: '/home', icon: Home },
      { label: 'Dashboard Overview', path: '/analyst', icon: LayoutDashboard },
      { label: 'Accounts & Cards', path: '/analyst/accounts', icon: CreditCard },
      { label: 'Transactions & Payments', path: '/analyst/transactions', icon: Send },
      { label: 'Expense Analytics', path: '/analyst/expenses', icon: PieChart },
      { label: 'Savings & Trends', path: '/analyst/savings', icon: PiggyBank },
      { label: 'Customer Insights', path: '/analyst/customers', icon: Users },
      { label: 'Reports', path: '/analyst/reports', icon: FileText },
      { label: 'Analyst Profile', path: '/profile', icon: User }
    ]
  } else {
    // CUSTOMER ROLE
    navItems = [
      { label: 'Bank Portfolio Home', path: '/home', icon: Home },
      { label: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Accounts & Cards', path: '/accounts', icon: CreditCard },
      { label: 'Pay & Transfer', path: '/transfer', icon: Send },
      { label: 'Expense Analytics', path: '/expenses', icon: PieChart },
      { label: 'Savings Vaults', path: '/savings', icon: PiggyBank },
      { label: 'User Profile', path: '/profile', icon: User }
    ]
  }

  return (
    <>
      <aside className="sidebar" style={{ background: '#1e1b4b', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Brand Logo Header */}
        <div
          className="sidebar-brand"
          onClick={() => navigate('/home')}
          title="Click to view Bank Portfolio Landing Page"
          style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
        >
          <div className="sidebar-logo-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)', borderRadius: 12, width: 42, height: 42, boxShadow: '0 4px 14px rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Building2 size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px' }}>FINSYNC BANK</div>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#a7f3d0', letterSpacing: 1.2, textTransform: 'uppercase' }}>ALWAYS WITH YOU</div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="sidebar-nav" style={{ padding: '16px 12px', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                type="button"
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                style={{
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: '11px 16px',
                  borderRadius: 10,
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.88rem',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.8)',
                  background: isActive ? 'linear-gradient(135deg, #6366f1, #4338ca)' : 'transparent',
                  boxShadow: isActive ? '0 4px 14px rgba(99, 102, 241, 0.4)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#ffffff' : '#a5b4fc'} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* FinSync Bank Security Widget */}
        <div style={{
          padding: '14px 16px',
          margin: '12px 14px 0 14px',
          borderRadius: 14,
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#ffffff', letterSpacing: 0.5 }}>
                {user.role} CLEARANCE
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 700 }}>256-Bit SSL</span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.3, margin: 0 }}>
            RBI Scheduled Bank Secure Session
          </p>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="sidebar-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px' }}>
          <div className="user-mini-card" onClick={() => navigate('/profile')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div className="user-avatar" style={{ background: '#6366f1', color: '#ffffff', fontWeight: 800 }}>{initials}</div>
            <div className="user-info">
              <div className="user-name" style={{ color: '#ffffff', fontWeight: 800 }}>{user.fullName}</div>
              <div className="user-role" style={{ color: '#a7f3d0', fontSize: '0.75rem', fontWeight: 700 }}>{user.role} {user.empNo ? `• ${user.empNo}` : ''}</div>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={() => setShowLogoutModal(true)} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>Sign Out of FinSync Bank?</h3>
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
  const { user, logout, switchRole } = useAuth()
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

  const handleRoleSelect = (e) => {
    const newRole = e.target.value
    switchRole(newRole)
    if (newRole === 'ADMIN') navigate('/admin')
    else if (newRole === 'ANALYST') navigate('/analyst')
    else navigate('/dashboard')
  }

  const getPageTitle = () => {
    if (location.pathname === '/home') return 'FinSync Bank Portfolio'
    if (location.pathname === '/profile') return 'User Account & Security'
    if (location.pathname.startsWith('/admin')) {
      switch (location.pathname) {
        case '/admin': return 'Admin Control Center Dashboard'
        case '/admin/users': return 'User Management Directory'
        case '/admin/accounts': return 'Bank Accounts Administration'
        case '/admin/transactions': return 'System Transactions Ledger'
        case '/admin/expenses': return 'Expense Outflow Controls'
        case '/admin/savings': return 'Financial Products & Rates'
        case '/admin/reports': return 'Administrative Reports & Exports'
        case '/admin/risk': return 'Risk & Fraud Alerts Center'
        case '/admin/audit-logs': return 'Administrative Audit Logs'
        case '/admin/settings': return 'System Security Settings'
        default: return 'FinSync Admin Workspace'
      }
    }
    if (location.pathname.startsWith('/analyst')) {
      switch (location.pathname) {
        case '/analyst': return 'Financial Analyst Dashboard'
        case '/analyst/accounts': return 'Bank-Wide Accounts Analytics'
        case '/analyst/transactions': return 'Transaction Data & Payment Trends'
        case '/analyst/expenses': return 'System-Wide Expense Analytics'
        case '/analyst/savings': return 'Savings & Financial Trends'
        case '/analyst/customers': return 'Customer Demographics & Insights'
        case '/analyst/reports': return 'Analytical Reports Generator'
        default: return 'FinSync Analyst Workspace'
      }
    }
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard Overview'
      case '/accounts': return 'Accounts & Debit Cards'
      case '/transfer': return 'Send & Transfer Funds'
      case '/expenses': return 'Expense Analytics'
      case '/savings': return 'Savings Vaults & APY'
      case '/rbac': return 'Role-Based Access & Investment Reach'
      default: return 'FinSync Workspace'
    }
  }

  const initials = user.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'FS'

  const notifications = [
    { id: 1, title: `Authenticated as ${user.role}`, desc: `Session clearance for ${user.fullName}`, time: 'Active Now', icon: CheckCircle2, color: 'var(--accent-emerald)' },
    { id: 2, title: 'Realtime Backend Database', desc: 'Connected to Spring Boot ACID database.', time: 'Just now', icon: ShieldCheck, color: 'var(--primary)' }
  ]

  return (
    <>
      <header className="top-header" style={{ position: 'sticky', top: 0, zIndex: 40, background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="header-title">
          <span>{getPageTitle()}</span>
        </div>

        <div className="header-actions" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/home')}
            title="View Bank Portfolio Landing Page"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', fontSize: '0.8rem', fontWeight: 800 }}
          >
            <Home size={15} color="var(--primary)" />
            <span>Bank Home</span>
          </button>

          {/* Interactive Role Switcher Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 99, background: 'rgba(99, 102, 241, 0.15)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 800 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <select
              value={user.role || 'CUSTOMER'}
              onChange={handleRoleSelect}
              title="Switch Active Portal Role"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="CUSTOMER" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>CUSTOMER Portal</option>
              <option value="ANALYST" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>ANALYST Portal</option>
              <option value="ADMIN" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>ADMIN Portal</option>
            </select>
          </div>

          <button className="icon-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="var(--primary)" />}
          </button>

          <button
            className="icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="System Notifications"
            style={{ position: 'relative' }}
          >
            <Bell size={18} color="var(--primary)" />
            <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
          </button>

          {/* Clickable Profile Avatar */}
          <div
            onClick={() => navigate('/profile')}
            title="View Profile & Settings"
            style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 10, borderLeft: '1px solid var(--border-color)', cursor: 'pointer' }}
          >
            <div className="user-avatar" style={{ width: 34, height: 34, fontSize: '0.8rem', background: 'var(--primary)', color: '#ffffff', fontWeight: 800 }}>
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>Sign Out of FinSync Bank?</h3>
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
