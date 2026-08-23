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
  UserCheck,
  History,
  Settings,
  Trash2,
  Check
} from 'lucide-react'

export function Sidebar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!user) return null

  const initials = user.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'FS'

  // Dynamic Role-Based Sidebar Nav Items (2 Roles: CUSTOMER and ADMIN)
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
      { label: 'Customer Profile', path: '/profile', icon: User }
    ]
  }

  return (
    <aside className="sidebar">
      {/* Brand Logo Header (64px height) */}
      <div className="sidebar-brand">
        <div className="sidebar-logo-icon">
          <Building2 size={20} color="#ffffff" />
        </div>
        <div>
          <div className="sidebar-brand-title">FINSYNC</div>
          <div className="sidebar-brand-subtitle">ALWAYS WITH YOU</div>
        </div>
      </div>

      {/* Sidebar Nav Links */}
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
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Sidebar Footer User Card */}
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

    const interval = setInterval(loadNotifications, 8000)
    const handleActivityEvent = () => loadNotifications()
    window.addEventListener('finsync:activity', handleActivityEvent)

    return () => {
      clearInterval(interval)
      window.removeEventListener('finsync:activity', handleActivityEvent)
    }
  }, [user, location.pathname])

  if (!user) return null

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark read', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all as read', err)
    }
  }

  const handleDeleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`)
      setNotifications(prev => prev.filter(n => n.id !== id))
      loadNotifications()
    } catch (err) {
      console.error('Failed to delete notification', err)
    }
  }

  const handleConfirmLogout = () => {
    setShowLogoutModal(false)
    logout()
    navigate('/login')
  }

  const filteredNotifs = filterUnreadOnly
    ? notifications.filter(n => !n.isRead)
    : notifications

  return (
    <>
      <header className="top-header">
        {/* Left: Clearance & System Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className={`badge ${user.role === 'ADMIN' ? 'badge-indigo' : 'badge-emerald'}`}>
            <ShieldCheck size={14} />
            <span>{user.role === 'ADMIN' ? 'ADMIN ACCESS' : 'RETAIL CLIENT'}</span>
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
            FinSync Secure Portal • 256-bit SSL
          </span>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Notification Center Trigger */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                position: 'relative',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-main)'
              }}
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: 'var(--accent-rose)',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 900,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--card-bg)'
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  top: 44,
                  right: 0,
                  width: 360,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 100,
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Bell size={15} color="var(--primary)" /> Notifications ({unreadCount} new)
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Filter Switch */}
                <div style={{ display: 'flex', padding: '6px 12px', background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => setFilterUnreadOnly(false)}
                    style={{
                      border: 'none',
                      background: !filterUnreadOnly ? 'var(--primary)' : 'transparent',
                      color: !filterUnreadOnly ? '#ffffff' : 'var(--text-muted)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterUnreadOnly(true)}
                    style={{
                      border: 'none',
                      background: filterUnreadOnly ? 'var(--primary)' : 'transparent',
                      color: filterUnreadOnly ? '#ffffff' : 'var(--text-muted)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {filteredNotifs.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                      No notifications to display.
                    </div>
                  ) : (
                    filteredNotifs.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          padding: '10px 14px',
                          borderBottom: '1px solid var(--border-color)',
                          background: n.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.05)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: 8
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>{n.title}</span>
                            {!n.isRead && (
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{n.message}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: 4 }}>
                            {formatTimeAgo(n.createdAt)}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {!n.isRead && (
                            <button
                              type="button"
                              onClick={() => handleMarkAsRead(n.id)}
                              style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', padding: 4 }}
                              title="Mark as read"
                            >
                              <Check size={13} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteNotification(n.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 4 }}
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} />}
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="btn btn-rose btn-sm"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Confirm Sign Out">
        <div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: '14px' }}>
            Are you sure you want to end your secure FinSync banking session?
          </p>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </button>
            <button className="btn btn-rose" onClick={handleConfirmLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
