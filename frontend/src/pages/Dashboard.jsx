import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Modal from '../components/Modal.jsx'
import { QRCodeCanvas } from 'qrcode.react'
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Send,
  Plus,
  Clock,
  Sparkles,
  PieChart,
  History,
  QrCode,
  CheckCircle2,
  Copy,
  Download,
  Share2,
  Check,
  PiggyBank,
  ArrowRight,
  TrendingDown,
  ShoppingBag,
  Utensils,
  Zap,
  Plane,
  HelpCircle
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [accounts, setAccounts] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [savingsGoals, setSavingsGoals] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [selectedTxn, setSelectedTxn] = useState(null)
  const [copiedPayId, setCopiedPayId] = useState(false)

  // Quick Deposit Form
  const [depositAccId, setDepositAccId] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [depositLoading, setDepositLoading] = useState(false)

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [accRes, goalRes, expRes] = await Promise.all([
        api.get('/accounts').catch(() => ({ data: [] })),
        api.get('/savings-goals').catch(() => ({ data: [] })),
        api.get('/expenses').catch(() => ({ data: [] }))
      ])

      const accList = accRes.data || []
      setAccounts(accList)
      setSavingsGoals(goalRes.data || [])
      setExpenses(expRes.data || [])

      if (accList.length > 0) {
        if (!depositAccId) setDepositAccId(accList[0].id)
        const historyPromises = accList.map(a =>
          api.get(`/accounts/${a.id}/history`).then(r => r.data || []).catch(() => [])
        )
        const allHistories = await Promise.all(historyPromises)
        const combined = allHistories.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setRecentTransactions(combined.slice(0, 6))
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Calculate Balances
  const totalBalance = accounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0)
  const savingsBalance = accounts
    .filter(a => (a.accountType || '').toUpperCase().includes('SAVINGS'))
    .reduce((sum, a) => sum + (Number(a.balance) || 0), 0)
  const currentBalance = accounts
    .filter(a => (a.accountType || '').toUpperCase().includes('CURRENT') || (a.accountType || '').toUpperCase().includes('BUSINESS'))
    .reduce((sum, a) => sum + (Number(a.balance) || 0), 0)

  // Calculate Monthly Spending & Categories
  const totalSpentThisMonth = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
  const foodSpending = expenses.filter(e => (e.category || '').toLowerCase().includes('food') || (e.category || '').toLowerCase().includes('dining')).reduce((s, e) => s + Number(e.amount), 0)
  const shoppingSpending = expenses.filter(e => (e.category || '').toLowerCase().includes('shop')).reduce((s, e) => s + Number(e.amount), 0)
  const billsSpending = expenses.filter(e => (e.category || '').toLowerCase().includes('bill') || (e.category || '').toLowerCase().includes('util')).reduce((s, e) => s + Number(e.amount), 0)
  const travelSpending = expenses.filter(e => (e.category || '').toLowerCase().includes('travel') || (e.category || '').toLowerCase().includes('trans')).reduce((s, e) => s + Number(e.amount), 0)

  // Quick Deposit Handler
  const handleQuickDeposit = async (e) => {
    e.preventDefault()
    if (!depositAccId || !depositAmount || Number(depositAmount) <= 0) {
      addToast('Please enter a valid deposit amount', 'error')
      return
    }
    setDepositLoading(true)
    try {
      await api.post(`/accounts/${depositAccId}/deposit`, {
        amount: Number(depositAmount),
        description: 'Instant Online Cash Deposit'
      })
      addToast(`₹${Number(depositAmount).toLocaleString('en-IN')} added to your account!`, 'success')
      setShowDepositModal(false)
      setDepositAmount('')
      window.dispatchEvent(new Event('finsync:activity'))
      loadDashboardData()
    } catch (err) {
      addToast(err.response?.data?.message || 'Deposit failed', 'error')
    } finally {
      setDepositLoading(false)
    }
  }

  const payId = user?.publicPaymentId || `FS-PAY-${user?.id || '101'}`
  const qrString = `FINSYNC://PAY?payId=${payId}`

  const handleCopyPayId = () => {
    navigator.clipboard.writeText(payId)
    setCopiedPayId(true)
    addToast(`Pay ID copied: ${payId}`, 'success')
    setTimeout(() => setCopiedPayId(false), 2000)
  }

  const handleDownloadQr = () => {
    const canvas = document.getElementById('dashboard-qr-canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    const safeName = (user?.fullName || 'Customer').replace(/\s+/g, '-')
    link.href = url
    link.download = `FinSync-QR-${safeName}.png`
    link.click()
    addToast('QR code downloaded!', 'success')
  }

  // Get Friendly Time Greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Helper for Transaction Label
  const getFriendlyTxnInfo = (txn) => {
    const isCredit = txn.type.includes('IN') || txn.type === 'DEPOSIT'
    let label = txn.description || 'Transaction'
    let category = 'Transfer'

    if (txn.type === 'DEPOSIT') {
      label = 'Deposit'
      category = 'Added Money'
    } else if (txn.type === 'WITHDRAWAL') {
      label = 'Cash Withdrawal'
      category = 'Cash'
    } else if (txn.type === 'QR_TRANSFER') {
      category = 'Scan & Pay'
    } else if (txn.description && txn.description.toLowerCase().includes('amazon')) {
      category = 'Shopping'
    } else if (txn.description && txn.description.toLowerCase().includes('salary')) {
      category = 'Salary'
    }

    return { isCredit, label, category }
  }

  return (
    <div>
      {/* Friendly Welcome Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          {greeting}, {user?.fullName?.split(' ')[0] || 'Customer'} 👋
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: 4 }}>
          Here's your money overview.
        </p>
      </div>

      {/* Main Money Overview Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.06) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '24px 28px',
          marginBottom: 'var(--section-gap)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Balance
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-main)', marginTop: 4, letterSpacing: '-0.02em' }}>
              ₹{totalBalance.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ padding: '8px 16px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>SAVINGS ACCOUNT</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)', marginTop: 2 }}>
                ₹{savingsBalance.toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ padding: '8px 16px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>CURRENT ACCOUNT</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: 2 }}>
                ₹{currentBalance.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS SECTION (Highly Visible & Friendly) */}
      <div style={{ marginBottom: 'var(--section-gap)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Quick Actions
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>What would you like to do?</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {/* Send Money */}
          <button
            type="button"
            onClick={() => navigate('/transfer')}
            className="card"
            style={{
              padding: '16px',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Send size={22} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Send Money</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>Transfer to anyone</div>
            </div>
          </button>

          {/* Scan & Pay */}
          <button
            type="button"
            onClick={() => navigate('/transfer')}
            className="card"
            style={{
              padding: '16px',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <QrCode size={22} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Scan & Pay</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>Pay using QR code</div>
            </div>
          </button>

          {/* Receive Money */}
          <button
            type="button"
            onClick={() => setShowReceiveModal(true)}
            className="card"
            style={{
              padding: '16px',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ArrowDownLeft size={22} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Receive Money</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>Show your QR & Pay ID</div>
            </div>
          </button>

          {/* Add Money (Deposit) */}
          <button
            type="button"
            onClick={() => setShowDepositModal(true)}
            className="card"
            style={{
              padding: '16px',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Plus size={22} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Add Money</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>Instant account deposit</div>
            </div>
          </button>

          {/* View Transactions */}
          <button
            type="button"
            onClick={() => navigate('/accounts')}
            className="card"
            style={{
              padding: '16px',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#8b5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <History size={22} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Transactions</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>View all history</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2-Column Main Section: Recent Transactions & Spending Overview */}
      <div className="grid grid-2" style={{ gap: 24, marginBottom: 'var(--section-gap)' }}>
        {/* Left: Recent Transactions (Clean & Friendly) */}
        <div className="grid-col-left">
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <h3 className="card-title">
                <History size={18} color="var(--primary)" />
                <span>Recent Transactions</span>
              </h3>
              <Link to="/accounts" className="btn btn-secondary btn-sm" style={{ fontSize: '12px' }}>
                View All <ArrowRight size={13} />
              </Link>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 16 }}>
              Click any transaction to view details.
            </p>

            {recentTransactions.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>No transactions yet.</div>
                <div style={{ fontSize: '12px', marginTop: 4 }}>Your payments and deposits will appear here.</div>
                <button
                  type="button"
                  onClick={() => navigate('/transfer')}
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: 14 }}
                >
                  <Send size={14} /> Send Money
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentTransactions.map((txn) => {
                  const { isCredit, label, category } = getFriendlyTxnInfo(txn)
                  const amt = Number(txn.amount || 0)
                  return (
                    <div
                      key={txn.id}
                      onClick={() => setSelectedTxn(txn)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: isCredit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                            color: isCredit ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                            {label}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
                            {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today'} • {category}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: isCredit ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                          {isCredit ? '+' : '-'}₹{amt.toLocaleString('en-IN')}
                        </div>
                        <span className={`badge ${isCredit ? 'badge-emerald' : 'badge-indigo'}`} style={{ fontSize: '10px', padding: '1px 6px', marginTop: 2 }}>
                          {isCredit ? 'Received' : 'Sent'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Spending This Month & Savings Goals */}
        <div className="grid-col-right" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Spending This Month Card */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <h3 className="card-title">
                <PieChart size={18} color="var(--primary)" />
                <span>Spending This Month</span>
              </h3>
              <Link to="/expenses" className="btn btn-secondary btn-sm" style={{ fontSize: '12px' }}>
                Analytics <ArrowRight size={13} />
              </Link>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>You spent</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-main)', marginTop: 2 }}>
                ₹{totalSpentThisMonth.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Spending Category Breakdown */}
            {expenses.length === 0 ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No expenses logged this month.
                <div style={{ marginTop: 8 }}>
                  <Link to="/expenses" className="btn btn-secondary btn-sm">Log First Expense</Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                      <Utensils size={13} color="var(--primary)" /> Food & Dining
                    </span>
                    <span style={{ fontWeight: 700 }}>₹{foodSpending.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--bg-input)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${totalSpentThisMonth > 0 ? Math.min(100, Math.round((foodSpending / totalSpentThisMonth) * 100)) : 0}%`, height: '100%', background: 'var(--primary)', borderRadius: 99 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                      <ShoppingBag size={13} color="var(--accent-emerald)" /> Shopping
                    </span>
                    <span style={{ fontWeight: 700 }}>₹{shoppingSpending.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--bg-input)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${totalSpentThisMonth > 0 ? Math.min(100, Math.round((shoppingSpending / totalSpentThisMonth) * 100)) : 0}%`, height: '100%', background: 'var(--accent-emerald)', borderRadius: 99 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                      <Zap size={13} color="var(--accent-amber)" /> Bills & Utilities
                    </span>
                    <span style={{ fontWeight: 700 }}>₹{billsSpending.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--bg-input)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${totalSpentThisMonth > 0 ? Math.min(100, Math.round((billsSpending / totalSpentThisMonth) * 100)) : 0}%`, height: '100%', background: 'var(--accent-amber)', borderRadius: 99 }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Savings Goals Preview Card */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <h3 className="card-title">
                <PiggyBank size={18} color="var(--accent-emerald)" />
                <span>Savings Goals</span>
              </h3>
              <Link to="/savings" className="btn btn-secondary btn-sm" style={{ fontSize: '12px' }}>
                View Goals <ArrowRight size={13} />
              </Link>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 14 }}>
              Set aside money for something important.
            </p>

            {savingsGoals.length === 0 ? (
              <div style={{ padding: '16px 12px', borderRadius: 8, background: 'var(--bg-input)', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>Start your first savings goal</div>
                <button
                  type="button"
                  onClick={() => navigate('/savings')}
                  className="btn btn-emerald btn-sm"
                  style={{ marginTop: 10 }}
                >
                  <Plus size={13} /> Create Goal
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {savingsGoals.slice(0, 2).map((g) => {
                  const curr = Number(g.currentAmount || 0)
                  const tgt = Number(g.targetAmount || 1)
                  const pct = Math.min(100, Math.round((curr / tgt) * 100))
                  return (
                    <div
                      key={g.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 8,
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 6 }}>
                        <span style={{ fontWeight: 700 }}>{g.name}</span>
                        <span style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>{pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99, marginBottom: 6 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent-emerald)', borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Saved: ₹{curr.toLocaleString('en-IN')}</span>
                        <span>Target: ₹{tgt.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RECEIVE MONEY MODAL */}
      <Modal isOpen={showReceiveModal} onClose={() => setShowReceiveModal(false)} title="Receive Money">
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div
            style={{
              padding: 14,
              background: '#ffffff',
              borderRadius: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}
          >
            <QRCodeCanvas
              id="dashboard-qr-canvas"
              value={qrString}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>

          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            {user?.fullName}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: 4, marginBottom: 14 }}>
            Let someone scan this code to send you money.
          </p>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: 320,
              margin: '0 auto 16px auto'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>YOUR FINSYNC PAY ID</div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--primary)', fontFamily: 'monospace', marginTop: 2 }}>
                {payId}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyPayId}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 10px' }}
            >
              {copiedPayId ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10, maxWidth: 320, margin: '0 auto' }}>
            <button
              type="button"
              onClick={handleDownloadQr}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              <Download size={14} /> Download QR
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(payId)
                addToast('Pay ID copied to clipboard!', 'success')
              }}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              <Share2 size={14} /> Share Pay ID
            </button>
          </div>
        </div>
      </Modal>

      {/* QUICK ADD MONEY (DEPOSIT) MODAL */}
      <Modal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} title="Add Money to Account">
        <form onSubmit={handleQuickDeposit}>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 16 }}>
            Transfer funds from your linked external bank or debit card instantly.
          </p>

          <div className="form-group">
            <label>Select Target Account</label>
            <select
              value={depositAccId}
              onChange={(e) => setDepositAccId(e.target.value)}
              required
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.accountType} — {a.accountNumber} (Balance: ₹{Number(a.balance || 0).toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Amount to Add (₹)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="e.g. 10000"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowDepositModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={depositLoading}
              className="btn btn-emerald"
            >
              {depositLoading ? 'Adding Funds…' : 'Add Money Instantly'}
            </button>
          </div>
        </form>
      </Modal>

      {/* FRIENDLY TRANSACTION DETAILS MODAL */}
      <Modal isOpen={selectedTxn !== null} onClose={() => setSelectedTxn(null)} title="Payment Details">
        {selectedTxn && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}
            >
              <CheckCircle2 size={30} />
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {selectedTxn.type.includes('IN') || selectedTxn.type === 'DEPOSIT' ? 'Money Received' : 'Payment Successful'}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-main)', margin: '4px 0 16px 0' }}>
              ₹{Number(selectedTxn.amount || 0).toLocaleString('en-IN')}
            </div>

            <div style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', textAlign: 'left', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Description</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{selectedTxn.description || 'Transfer'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date & Time</span>
                <span style={{ fontWeight: 600 }}>
                  {selectedTxn.createdAt ? new Date(selectedTxn.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recently'}
                </span>
              </div>
              {selectedTxn.counterpartyAccountNumber && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Counterparty Account</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{selectedTxn.counterpartyAccountNumber}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>Successful</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction Reference</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                  #TXN-00{selectedTxn.id}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTxn(null)}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Done
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
