import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import api from '../api/axios.js'
import Modal from './Modal.jsx'
import FinSyncLogo from './FinSyncLogo.jsx'
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
  HelpCircle,
  ShieldAlert,
  FileText
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
      { label: 'User Directory & KYC', path: '/admin/users', icon: UserCheck },
      { label: 'Accounts & Cards', path: '/admin/accounts', icon: CreditCard },
      { label: 'Live Transactions', path: '/admin/transactions', icon: Send },
      { label: 'Risk & Fraud Alerts', path: '/admin/risk', icon: ShieldAlert },
      { label: 'Audit Trail Logs', path: '/admin/audit-logs', icon: History },
      { label: 'Reports & Compliance', path: '/admin/reports', icon: FileText },
      { label: 'Liquidity & Outflows', path: '/admin/expenses', icon: PieChart },
      { label: 'Savings Vault APY', path: '/admin/savings', icon: PiggyBank },
      { label: 'System Settings', path: '/admin/settings', icon: Settings },
      { label: 'Admin Profile', path: '/admin/profile', icon: User }
    ]

    return (
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo-icon" style={{ background: 'transparent', border: 'none', boxShadow: 'none', width: 'auto', height: 'auto', padding: 0 }}>
            <FinSyncLogo size={34} glow />
          </div>
          <div>
            <div className="sidebar-brand-title">FINSYNC</div>
            <div className="sidebar-brand-subtitle">ADMIN CONTROL</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || (item.path === '/admin/profile' && location.pathname === '/profile')
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
          <div className="user-mini-card" onClick={() => navigate('/admin/profile')}>
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
        <div className="sidebar-logo-icon" style={{ background: 'transparent', border: 'none', boxShadow: 'none', width: 'auto', height: 'auto', padding: 0 }}>
          <FinSyncLogo size={34} glow />
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
  const notifContainerRef = useRef(null)

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifContainerRef.current && !notifContainerRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [showNotifications])

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'FS'

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
    if (e) e.stopPropagation()
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true, isRead: true } : n))
      )
      setUnreadCount((c) => Math.max(0, c - 1))
    } catch (err) {
      console.error('Failed to mark read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all read:', err)
    }
  }

  const handleDeleteNotification = async (id, e) => {
    if (e) e.stopPropagation()
    try {
      await api.delete(`/notifications/${id}`)
      const target = notifications.find((n) => n.id === id)
      if (target && !target.read && !target.isRead) {
        setUnreadCount((c) => Math.max(0, c - 1))
      }
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      console.error('Failed to delete notification:', err)
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
    ? notifications.filter((n) => (!n.read && !n.isRead))
    : notifications


  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ADMIN_SECURITY':
      case 'ADMIN_RISK':
      case 'SECURITY':
      case 'CARD_CONTROL':
        return <ShieldAlert size={16} color="var(--accent-coral, #ef4444)" />
      case 'ADMIN_USER':
      case 'ADMIN_KYC':
        return <UserCheck size={16} color="var(--primary, #6366f1)" />
      case 'ADMIN_ACCOUNT':
      case 'ACCOUNT':
        return <CreditCard size={16} color="var(--accent-emerald, #10b981)" />
      case 'ADMIN_TRANSACTION':
      case 'TRANSFER':
      case 'DEPOSIT':
      case 'WITHDRAWAL':
        return <ArrowUpRight size={16} color="var(--accent-cyan, #06b6d4)" />
      case 'ADMIN_SYSTEM':
      case 'SETTINGS':
        return <Settings size={16} color="var(--accent-violet, #8b5cf6)" />
      default:
        return <CheckCircle2 size={16} color="var(--primary)" />
    }
  }

  const getNotificationTypeTag = (type) => {
    if (!type) return null
    if (type.startsWith('ADMIN_')) {
      const label = type.replace('ADMIN_', '')
      return (
        <span style={{ fontSize: '10px', padding: '1px 5px', borderRadius: 4, background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', marginRight: 6 }}>
          {label}
        </span>
      )
    }
    return null
  }

  // Dynamic Page Label Helper
  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/' || path === '/dashboard') return 'Dashboard Overview'
    if (path === '/accounts') return 'My Accounts & Cards'
    if (path === '/transfer') return 'Pay & Transfer'
    if (path === '/expenses') return 'Expense Analytics'
    if (path === '/savings') return 'Savings Goals'
    if (path === '/profile' || path === '/admin/profile') return user?.role === 'ADMIN' ? 'Admin Profile & Security' : 'My Profile'
    if (path === '/admin') return 'Admin Control Center'
    if (path === '/admin/users') return 'User Directory & KYC'
    if (path === '/admin/accounts') return 'Accounts & Cards Ledger'
    if (path === '/admin/transactions') return 'Live Transaction Ledger'
    if (path === '/admin/risk') return 'Risk & Fraud Surveillance'
    if (path === '/admin/audit-logs') return 'Real-Time Audit Trail'
    if (path === '/admin/reports') return 'Administrative Reports & Compliance'
    if (path === '/admin/expenses') return 'Liquidity Flow & Limits'
    if (path === '/admin/savings') return 'Savings Vault APY Yields'
    if (path === '/admin/settings') return 'System Settings & Config'
    return path.slice(1).replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  return (
    <header className="top-header">
      {/* Dynamic Page Indicator & Portal Breadcrumb */}
      <div className="header-breadcrumbs">
        <span style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Building2 size={15} color="var(--primary)" />
          <span>{user?.role === 'ADMIN' ? 'Admin Console' : 'Customer Portal'}</span>
          <span style={{ opacity: 0.5 }}>/</span>
        </span>
        <span className="breadcrumb-current">
          {getPageTitle()}
        </span>
      </div>

      {/* Security Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-emerald)', boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }} />
        <span>Bank-Grade SSL • Active Session</span>
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
        <div ref={notifContainerRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="header-icon-btn"
            onClick={toggleNotifications}
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

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="btn-link"
                      onClick={handleMarkAllAsRead}
                      style={{ fontSize: '12px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      title="Mark all notifications as read"
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px 6px',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: '12px'
                      }}
                      title="Clear all notifications"
                    >
                      <Trash2 size={13} />
                      <span>Clear all</span>
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
                  <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    {user?.role === 'ADMIN' ? 'All Admin Alerts Cleared 🛡️' : "You're all caught up! ✨"}
                  </div>
                ) : (
                  displayedNotifications.map((notif) => {
                    const isUnread = !notif.read && !notif.isRead
                    return (
                      <div
                        key={notif.id}
                        className={`notification-item ${isUnread ? 'unread' : ''}`}
                        onClick={(e) => isUnread && handleMarkAsRead(notif.id, e)}
                      >
                        <div className="notification-icon">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="notification-content">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              {getNotificationTypeTag(notif.type)}
                              <span className="notification-title">{notif.title}</span>
                            </div>
                            <span className="notification-time">{formatTimeAgo(notif.createdAt)}</span>
                          </div>
                          <p className="notification-desc">{notif.message}</p>
                        </div>
                        <div className="notification-item-actions">
                          {isUnread && (
                            <button
                              type="button"
                              className="notif-action-btn mark-read"
                              onClick={(e) => handleMarkAsRead(notif.id, e)}
                              title="Mark as read"
                            >
                              <Check size={13} />
                            </button>
                          )}
                          <button
                            type="button"
                            className="notif-action-btn delete-notif"
                            onClick={(e) => handleDeleteNotification(notif.id, e)}
                            title="Delete notification"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}

        </div>

        {/* User / Admin Profile Header Trigger */}
        <div
          className="header-user-badge"
          onClick={() => navigate(user?.role === 'ADMIN' ? '/admin/profile' : '/profile')}
          title={user?.role === 'ADMIN' ? 'Admin Profile & Security' : 'My Profile'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '4px 12px 4px 6px',
            borderRadius: 24,
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '11px'
            }}
          >
            {initials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.fullName || 'User'}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: user?.role === 'ADMIN' ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
              {user?.role === 'ADMIN' ? (user.empNo ? `ADMIN • ${user.empNo}` : 'ADMIN') : 'CUSTOMER'}
            </span>
          </div>
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
