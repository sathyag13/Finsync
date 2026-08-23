import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import api from '../api/axios.js'
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
  X,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react'

export function Sidebar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!user) return null

  const initials = user.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'FS'

  // Dynamic Role-Based Sidebar Nav Items (Filtered for Role-Relevant Modules)
  let navItems = []

  if (user.role === 'ADMIN') {
    navItems = [
      { label: 'Admin Control Center', path: '/admin', icon: LayoutDashboard },
      { label: 'User Directory', path: '/admin/users', icon: UserCheck },
      { label: 'Accounts Opened This Month', path: '/admin/accounts', icon: CreditCard },
      { label: 'User Transactions Audit Logs', path: '/admin/audit-logs', icon: History },
      { label: 'System Settings', path: '/admin/settings', icon: Settings },
      { label: 'Admin Profile', path: '/profile', icon: User }
    ]
  } else {
    // CUSTOMER ROLE
    navItems = [
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
          style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.1)' }}
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
        <nav className="sidebar-nav" style={{ padding: '16px 12px', overflowY: 'auto', flex: 1 }}>
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

        {/* Sidebar Footer User Card */}
        <div className="sidebar-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px' }}>
          <div className="user-mini-card" onClick={() => navigate('/profile')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="user-avatar" style={{ background: '#6366f1', color: '#ffffff', fontWeight: 800 }}>{initials}</div>
            <div className="user-info">
              <div className="user-name" style={{ color: '#ffffff', fontWeight: 800 }}>{user.fullName}</div>
              <div className="user-role" style={{ color: '#a7f3d0', fontSize: '0.75rem', fontWeight: 700 }}>{user.role} {user.empNo ? `• ${user.empNo}` : ''}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

function formatTimeAgo(isoString) {
  if (!isoString) return 'Just now'
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diffSec = Math.floor((now - date) / 1000)
    if (diffSec < 45) return 'Just now'
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return `${diffHour}h ago`
    const diffDay = Math.floor(diffHour / 24)
    if (diffDay === 1) return 'Yesterday'
    if (diffDay < 7) return `${diffDay}d ago`
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  } catch {
    return 'Recently'
  }
}

export function TopHeader() {
  const { user, logout, switchRole } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loadingNotifs, setLoadingNotifs] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const loadRealtimeNotifications = async () => {
    if (!user) return
    try {
      setLoadingNotifs(true)
      const accRes = await api.get('/accounts').catch(() => ({ data: [] }))
      const accountsList = accRes.data || []

      let allTxns = []
      if (accountsList.length > 0) {
        const historyResults = await Promise.all(
          accountsList.map((a) =>
            api.get(`/accounts/${a.id}/history`)
              .then((r) => (r.data || []).map((t) => ({ ...t, accountNumber: a.accountNumber, accountType: a.accountType })))
              .catch(() => [])
          )
        )
        allTxns = historyResults.flat()
      }

      // Sort newest first
      allTxns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      const formatted = allTxns.slice(0, 15).map((t) => {
        const amt = Number(t.amount || 0).toLocaleString('en-IN')
        if (t.type === 'DEPOSIT') {
          return {
            id: `tx-${t.id}`,
            title: `Deposit Credited`,
            badge: `+₹${amt}`,
            desc: `₹${amt} deposited into ${t.accountType || 'Bank'} Acc (${t.accountNumber})${t.description ? ' • ' + t.description : ''}`,
            time: formatTimeAgo(t.createdAt),
            icon: ArrowDownLeft,
            color: '#10b981',
            badgeBg: 'rgba(16,185,129,0.15)',
            badgeColor: '#10b981'
          }
        } else if (t.type === 'WITHDRAWAL') {
          return {
            id: `tx-${t.id}`,
            title: `Cash Withdrawal`,
            badge: `-₹${amt}`,
            desc: `₹${amt} withdrawn from ${t.accountType || 'Bank'} Acc (${t.accountNumber})${t.description ? ' • ' + t.description : ''}`,
            time: formatTimeAgo(t.createdAt),
            icon: ArrowUpRight,
            color: '#f43f5e',
            badgeBg: 'rgba(244,63,94,0.15)',
            badgeColor: '#f43f5e'
          }
        } else if (t.type === 'TRANSFER_OUT') {
          return {
            id: `tx-${t.id}`,
            title: `Funds Transferred`,
            badge: `-₹${amt}`,
            desc: `₹${amt} transferred to ${t.counterpartyAccountNumber || 'Recipient'}${t.description ? ' • ' + t.description : ''}`,
            time: formatTimeAgo(t.createdAt),
            icon: Send,
            color: '#6366f1',
            badgeBg: 'rgba(99,102,241,0.15)',
            badgeColor: '#6366f1'
          }
        } else if (t.type === 'TRANSFER_IN') {
          return {
            id: `tx-${t.id}`,
            title: `Transfer Received`,
            badge: `+₹${amt}`,
            desc: `₹${amt} received from ${t.counterpartyAccountNumber || 'Sender'}${t.description ? ' • ' + t.description : ''}`,
            time: formatTimeAgo(t.createdAt),
            icon: ArrowDownLeft,
            color: '#10b981',
            badgeBg: 'rgba(16,185,129,0.15)',
            badgeColor: '#10b981'
          }
        } else {
          return {
            id: `tx-${t.id}`,
            title: `Transaction Activity`,
            badge: `₹${amt}`,
            desc: `${t.description || t.type} on Acc ${t.accountNumber}`,
            time: formatTimeAgo(t.createdAt),
            icon: CreditCard,
            color: 'var(--primary)',
            badgeBg: 'rgba(99,102,241,0.12)',
            badgeColor: 'var(--primary)'
          }
        }
      })

      // Add system clearance status item
      formatted.push({
        id: 'sys-auth',
        title: `Authenticated Session`,
        badge: user.role || 'USER',
        desc: `Active banking session clearance for ${user.fullName}`,
        time: 'Active Now',
        icon: CheckCircle2,
        color: '#10b981',
        badgeBg: 'rgba(16,185,129,0.12)',
        badgeColor: '#10b981'
      })

      setNotifications(formatted)
      setUnreadCount(allTxns.length)
    } catch (err) {
      console.error('Failed to load realtime notifications:', err)
    } finally {
      setLoadingNotifs(false)
    }
  }

  useEffect(() => {
    loadRealtimeNotifications()

    // Realtime polling and custom activity event listener
    const interval = setInterval(loadRealtimeNotifications, 8000)
    const handleActivityEvent = () => loadRealtimeNotifications()
    window.addEventListener('finsync:activity', handleActivityEvent)

    return () => {
      clearInterval(interval)
      window.removeEventListener('finsync:activity', handleActivityEvent)
    }
  }, [user, location.pathname])

  if (!user) return null

  const handleConfirmLogout = () => {
    setShowLogoutModal(false)
    logout()
    navigate('/login')
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

  return (
    <>
      <header className="top-header" style={{ position: 'sticky', top: 0, zIndex: 40, background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="header-title">
          <span>{getPageTitle()}</span>
        </div>

        <div className="header-actions" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* Static Role Clearance Indicator Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 99, background: 'rgba(99, 102, 241, 0.15)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 800 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span>{user.role || 'CUSTOMER'} PORTAL</span>
          </div>

          <button className="icon-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="var(--primary)" />}
          </button>

          <button
            className="icon-btn"
            onClick={() => {
              setShowNotifications(!showNotifications)
              if (!showNotifications) loadRealtimeNotifications()
            }}
            title="Realtime Activity Notifications"
            style={{ position: 'relative' }}
          >
            <Bell size={18} color="var(--primary)" />
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                minWidth: 16,
                height: 16,
                padding: '0 4px',
                borderRadius: 99,
                background: '#10b981',
                color: '#ffffff',
                fontSize: '0.62rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px rgba(16,185,129,0.7)'
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
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

          {/* Realtime Notifications Dropdown Panel */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: 52,
              right: 0,
              width: 380,
              maxWidth: '90vw',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glow)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
              padding: '16px 18px',
              zIndex: 100,
              backdropFilter: 'var(--glass-filter)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bell size={16} color="var(--primary)" /> Realtime Activities
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 7px', borderRadius: 99, background: 'rgba(16,185,129,0.18)', color: '#10b981' }}>
                    LIVE
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}
                    onClick={loadRealtimeNotifications}
                    title="Refresh activities"
                  >
                    <RefreshCw size={14} style={{ animation: loadingNotifs ? 'spin 1s linear infinite' : 'none' }} />
                  </button>
                  <button
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}
                    onClick={() => setShowNotifications(false)}
                    title="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Notification Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 340, overflowY: 'auto', paddingRight: 4 }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '28px 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Clock size={28} color="var(--primary)" style={{ margin: '0 auto 8px auto', opacity: 0.7 }} />
                    <div style={{ fontWeight: 700 }}>No transaction activities yet</div>
                    <div style={{ fontSize: '0.75rem', marginTop: 4 }}>Your deposits, withdrawals, and transfers will appear here in real time.</div>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const Icon = n.icon
                    return (
                      <div
                        key={n.id}
                        style={{
                          display: 'flex',
                          gap: 12,
                          alignItems: 'flex-start',
                          padding: '10px 12px',
                          borderRadius: 10,
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-color)',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${n.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 }}>
                          <Icon size={16} color={n.color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {n.title}
                            </span>
                            {n.badge && (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '1px 6px', borderRadius: 4, background: n.badgeBg || 'rgba(99,102,241,0.15)', color: n.badgeColor || 'var(--primary)', flexShrink: 0 }}>
                                {n.badge}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2, wordBreak: 'break-word', lineHeight: 1.35 }}>
                            {n.desc}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: 4, fontWeight: 600 }}>
                            {n.time}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer action */}
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false)
                    navigate('/dashboard')
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  View Full Transactions History →
                </button>
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

