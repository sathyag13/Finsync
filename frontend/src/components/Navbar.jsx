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
  Building2,
  UserCheck,
  History,
  Settings,
  Trash2,
  Check,
  QrCode,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  HelpCircle
} from 'lucide-react'

export function Sidebar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!user) return null

  const initials = user.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'FS'

  // Dynamic Role-Based Sidebar Nav Items
  if (user.role === 'ADMIN') {
    const adminNavItems = [
      { label: 'Admin Control Center', path: '/admin', icon: LayoutDashboard },
      { label: 'User Directory', path: '/admin/users', icon: UserCheck },
      { label: 'Accounts Opened This Month', path: '/admin/accounts', icon: CreditCard },
      { label: 'User Transactions Audit Logs', path: '/admin/audit-logs', icon: History },
      { label: 'System Settings', path: '/admin/settings', icon: Settings },
      { label: 'Admin Profile', path: '/profile', icon: User }
    ]

    return (
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo-icon">
            <Building2 size={20} color="#ffffff" />
          </div>
          <div>
            <div className="sidebar-brand-title">FINSYNC</div>
            <div className="sidebar-brand-subtitle">ADMIN CONTROL</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                type="button"
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini-card" onClick={() => navigate('/profile')}>
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user.fullName}</div>
              <div className="user-role">
                {user.role} {user.empNo ? `• ${user.empNo}` : ''}
              </div>
            </div>
          </div>
        </div>
      </aside>
    )
  }

  // CUSTOMER ROLE: Clean, Organized, User-Friendly Categories
  // CUSTOMER ROLE: Clean, Organized, User-Friendly Categories (Distinct 1-to-1 Routes)
  const customerSections = [
    {
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      category: 'MONEY',
      items: [
        { label: 'Accounts & Cards', path: '/accounts', icon: CreditCard },
        { label: 'Pay & Transfer', path: '/transfer', icon: Send }
      ]
    },
    {
      category: 'SPENDING',
      items: [
        { label: 'Expense Analytics', path: '/expenses', icon: PieChart }
      ]
    },
    {
      category: 'SAVINGS',
      items: [
        { label: 'Savings Goals', path: '/savings', icon: PiggyBank }
      ]
    },
    {
      category: 'ACCOUNT',
      items: [
        { label: 'My Profile', path: '/profile', icon: User }
      ]
    }
  ]

  return (
    <aside className="sidebar">
      {/* Brand Logo Header */}
      <div className="sidebar-brand">
        <div className="sidebar-logo-icon">
          <Building2 size={20} color="#ffffff" />
        </div>
        <div>
          <div className="sidebar-brand-title">FINSYNC</div>
          <div className="sidebar-brand-subtitle">ALWAYS WITH YOU</div>
        </div>
      </div>

      {/* Sidebar Nav Links Grouped by Friendly Categories */}
      <nav className="sidebar-nav" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {customerSections.map((sec, sIdx) => (
          <div key={sIdx} style={{ marginBottom: 4 }}>
            {sec.category && (
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  padding: '6px 12px 4px 12px',
                  textTransform: 'uppercase'
                }}
              >
                {sec.category}
              </div>
            )}
            {sec.items.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.label + item.path}
                  type="button"
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                  style={{ width: '100%', marginBottom: 2 }}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer User Card */}
      <div className="sidebar-footer">
        <div className="user-mini-card" onClick={() => navigate('/profile')}>
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user.fullName}</div>
            <div className="user-role">Customer Account</div>
          </div>
        </div>
      </div>
    </aside>
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
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false)

  const loadNotifications = async () => {
    if (!user) return
    try {
      const [notifRes, countRes] = await Promise.all([
        api.get('/notifications').catch(() => ({ data: [] })),
        api.get('/notifications/unread-count').catch(() => ({ data: { unreadCount: 0 } }))
      ])

      setNotifications(notifRes.data || [])
      setUnreadCount(countRes.data?.unreadCount || 0)
    } catch (err) {
      console.error('Failed to load notifications:', err)
    }
  }

  useEffect(() => {
    loadNotifications()

    // 45-second polling interval + reactive event listener on user activities
    const interval = setInterval(loadNotifications, 45000)
    const handleActivity = () => loadNotifications()
    window.addEventListener('finsync:activity', handleActivity)

    return () => {
      clearInterval(interval)
      window.removeEventListener('finsync:activity', handleActivity)
    }
  }, [user])

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation()
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
      setUnreadCount((c) => Math.max(0, c - 1))
    } catch (err) {
      console.error('Failed to mark read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all read:', err)
    }
  }

  const handleClearAll = async () => {
    try {
      await api.delete('/notifications/clear-all')
      setNotifications([])
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to clear notifications:', err)
    }
  }

  const displayedNotifications = filterUnreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications

  return (
    <header className="top-header">
      {/* Dynamic Page Indicator */}
      <div className="header-breadcrumbs">
        <span className="breadcrumb-current">
          {location.pathname === '/' || location.pathname === '/dashboard'
            ? 'Dashboard'
            : location.pathname.startsWith('/admin')
            ? 'Admin Portal'
            : location.pathname.slice(1).replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </span>
      </div>

      {/* Header Actions Area */}
      <div className="header-actions">
        {/* Theme Toggle Button */}
        <button
          type="button"
          className="header-icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Real-Time Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="header-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-main)' }}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="badge badge-indigo" style={{ padding: '2px 6px', fontSize: '11px' }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="btn-link"
                      onClick={handleMarkAllAsRead}
                      style={{ fontSize: '12px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}
                      title="Clear All"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Filter Pills */}
              <div style={{ display: 'flex', gap: 6, padding: '8px 14px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-input)' }}>
                <button
                  type="button"
                  onClick={() => setFilterUnreadOnly(false)}
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    border: 'none',
                    cursor: 'pointer',
                    background: !filterUnreadOnly ? 'var(--primary)' : 'transparent',
                    color: !filterUnreadOnly ? '#ffffff' : 'var(--text-muted)'
                  }}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterUnreadOnly(true)}
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    border: 'none',
                    cursor: 'pointer',
                    background: filterUnreadOnly ? 'var(--primary)' : 'transparent',
                    color: filterUnreadOnly ? '#ffffff' : 'var(--text-muted)'
                  }}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Notification Items List */}
              <div className="notifications-list">
                {displayedNotifications.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    You're all caught up! ✨
                  </div>
                ) : (
                  displayedNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notification-item ${!notif.read ? 'unread' : ''}`}
                      onClick={(e) => !notif.read && handleMarkAsRead(notif.id, e)}
                    >
                      <div className="notification-icon">
                        <CheckCircle2 size={16} color="var(--primary)" />
                      </div>
                      <div className="notification-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="notification-title">{notif.title}</span>
                          <span className="notification-time">{formatTimeAgo(notif.createdAt)}</span>
                        </div>
                        <p className="notification-desc">{notif.message}</p>
                      </div>
                      {!notif.read && (
                        <button
                          type="button"
                          className="mark-read-btn"
                          onClick={(e) => handleMarkAsRead(notif.id, e)}
                          title="Mark as read"
                        >
                          <Check size={12} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Sign Out Header Trigger */}
        <button
          type="button"
          className="header-icon-btn"
          onClick={() => setShowLogoutModal(true)}
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Sign Out Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Sign Out of FinSync"
      >
        <div style={{ padding: '8px 0' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: 20 }}>
            Are you sure you want to terminate your secure banking session?
          </p>
          <div className="modal-actions">
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
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </header>
  )
}
