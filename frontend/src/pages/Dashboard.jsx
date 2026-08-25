import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Modal from '../components/Modal.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
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
  ShoppingBag,
  Utensils,
  Zap,
  Car
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [accounts, setAccounts] = useState([])
  const [allTransactions, setAllTransactions] = useState([])
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
        setAllTransactions(combined)
        setRecentTransactions(combined.slice(0, 6))
      } else {
        setAllTransactions([])
        setRecentTransactions([])
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

  // 1. Calculate Real Balances
  const totalBalance = accounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0)
  const savingsBalance = accounts
    .filter(a => (a.accountType || '').toUpperCase().includes('SAVINGS'))
    .reduce((sum, a) => sum + (Number(a.balance) || 0), 0)
  const currentBalance = accounts
    .filter(a => (a.accountType || '').toUpperCase().includes('CURRENT') || (a.accountType || '').toUpperCase().includes('BUSINESS'))
    .reduce((sum, a) => sum + (Number(a.balance) || 0), 0)

  // 2. Calculate Real Inflow & Outflow strictly from data (No fake fallbacks)
  const totalInflow = allTransactions
    .filter(t => t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN' || (t.type && t.type.includes('IN')))
    .reduce((s, t) => s + Number(t.amount || 0), 0)

  const outgoingTxns = allTransactions
    .filter(t => t.type === 'WITHDRAWAL' || t.type === 'TRANSFER_OUT' || t.type === 'QR_TRANSFER' || (t.type && t.type.includes('OUT')))

  const totalOutflow = outgoingTxns.reduce((s, t) => s + Number(t.amount || 0), 0)

  // 3. Dynamic Spending Calculation & Category Grouping
  const totalSpentThisMonth = expenses.length > 0
    ? expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
    : totalOutflow

  // Dynamic Spending Categories List (Only non-zero categories)
  const spendingCategories = (() => {
    if (expenses.length > 0) {
      const map = {}
      expenses.forEach(e => {
        const cat = e.category || 'General'
        map[cat] = (map[cat] || 0) + Number(e.amount || 0)
      })
      return Object.entries(map)
        .map(([name, amount]) => ({ name, amount }))
        .filter(c => c.amount > 0)
        .sort((a, b) => b.amount - a.amount)
    }
    if (outgoingTxns.length > 0) {
      const map = {}
      outgoingTxns.forEach(t => {
        const { category } = getFriendlyTxnInfo(t)
        map[category] = (map[category] || 0) + Number(t.amount || 0)
      })
      return Object.entries(map)
        .map(([name, amount]) => ({ name, amount }))
        .filter(c => c.amount > 0)
        .sort((a, b) => b.amount - a.amount)
    }
    return []
  })()

  // Monthly Budget
  const monthlyBudget = totalInflow > 0 ? Math.max(50000, totalInflow) : 50000
  const budgetRemaining = Math.max(0, monthlyBudget - totalSpentThisMonth)

  // Helper for Transaction Label
  function getFriendlyTxnInfo(txn) {
    const isCredit = (txn.type && txn.type.includes('IN')) || txn.type === 'DEPOSIT'
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
    } else if (txn.description && txn.description.toLowerCase().includes('food')) {
      category = 'Food & Dining'
    } else if (txn.description && txn.description.toLowerCase().includes('amazon')) {
      category = 'Shopping'
    } else if (txn.description && txn.description.toLowerCase().includes('bill')) {
      category = 'Bills & Utilities'
    } else if (txn.description && txn.description.toLowerCase().includes('travel')) {
      category = 'Travel & Transit'
    } else if (txn.description && txn.description.toLowerCase().includes('salary')) {
      category = 'Salary'
    }

    return { isCredit, label, category }
  }

  // Category Icon & Color Helper
  const getCategoryDetails = (catName) => {
    const c = (catName || '').toLowerCase()
    if (c.includes('food') || c.includes('dining') || c.includes('restaurant') || c.includes('swiggy') || c.includes('zomato')) {
      return { label: catName, icon: Utensils, color: 'var(--primary)' }
    }
    if (c.includes('shop') || c.includes('amazon') || c.includes('flipkart') || c.includes('retail')) {
      return { label: catName, icon: ShoppingBag, color: 'var(--accent-emerald)' }
    }
    if (c.includes('bill') || c.includes('util') || c.includes('electric') || c.includes('recharge') || c.includes('wifi')) {
      return { label: catName, icon: Zap, color: 'var(--accent-amber)' }
    }
    if (c.includes('travel') || c.includes('flight') || c.includes('transit') || c.includes('uber') || c.includes('ola') || c.includes('transport')) {
      return { label: catName, icon: Car, color: 'var(--accent-cyan)' }
    }
    return { label: catName, icon: PieChart, color: 'var(--primary)' }
  }

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

  return (
    <div>
      {/* 1. Bold Modern Welcome Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.8px', lineHeight: 1.2 }}>
          {greeting}, {user?.fullName?.split(' ')[0] || 'SCOTT'} 👋
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: 6, fontWeight: 600 }}>
          Here's your real-time financial overview and quick banking actions.
        </p>
      </div>

      {/* 2. Main Money Overview Banner with Dynamic Inflow & Outflow */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1.5px solid rgba(99, 102, 241, 0.3)',
          padding: '24px 28px',
          marginBottom: 'var(--section-gap)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {/* Total Balance */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Total Balance
            </div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-main)', marginTop: 2, letterSpacing: '-0.03em' }}>
              <AnimatedCounter value={totalBalance} />
            </div>
          </div>

          {/* Inflow & Outflow Metrics (Calculated Strictly from Real Data) */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ padding: '10px 18px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px rgba(16,185,129,0.08)' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ArrowDownLeft size={18} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-emerald)', letterSpacing: '0.05em' }}>THIS MONTH INFLOW</div>
                <div style={{ fontSize: '17px', fontWeight: 900, color: 'var(--accent-emerald)', marginTop: 2 }}>
                  +<AnimatedCounter value={totalInflow} />
                </div>
              </div>
            </div>

            <div style={{ padding: '10px 18px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid rgba(244, 63, 94, 0.3)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px rgba(244,63,94,0.08)' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ArrowUpRight size={18} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-rose)', letterSpacing: '0.05em' }}>THIS MONTH OUTFLOW</div>
                <div style={{ fontSize: '17px', fontWeight: 900, color: 'var(--accent-rose)', marginTop: 2 }}>
                  -<AnimatedCounter value={totalOutflow} />
                </div>
              </div>
            </div>
          </div>

          {/* Account Breakdown (From Real Accounts Array) */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <div style={{ padding: '10px 18px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-color)', textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>SAVINGS ACCOUNT</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)', marginTop: 2 }}>
                <AnimatedCounter value={savingsBalance} />
              </div>
            </div>

            <div style={{ padding: '10px 18px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-color)', textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>CURRENT ACCOUNT</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--accent-cyan)', marginTop: 2 }}>
                <AnimatedCounter value={currentBalance} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS SECTION (Preserved Clickable Interactive Buttons) */}
      <div style={{ marginBottom: 'var(--section-gap)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="var(--primary)" />
            <span>Quick Actions</span>
          </h2>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Click any action to execute immediately</span>
        </div>

        <div className="quick-actions-grid">
          {/* Send Money */}
          <button
            type="button"
            onClick={() => navigate('/transfer')}
            className="quick-action-card qa-send"
          >
            <div className="quick-action-icon-wrapper">
              <Send size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>Send Money</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>Transfer to anyone</div>
            </div>
          </button>

          {/* Scan & Pay */}
          <button
            type="button"
            onClick={() => navigate('/transfer')}
            className="quick-action-card qa-scan"
          >
            <div className="quick-action-icon-wrapper">
              <QrCode size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>Scan & Pay</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>Pay using QR code</div>
            </div>
          </button>

          {/* Receive Money */}
          <button
            type="button"
            onClick={() => setShowReceiveModal(true)}
            className="quick-action-card qa-receive"
          >
            <div className="quick-action-icon-wrapper">
              <ArrowDownLeft size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>Receive Money</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>Show your QR & Pay ID</div>
            </div>
          </button>

          {/* Add Money (Deposit) */}
          <button
            type="button"
            onClick={() => setShowDepositModal(true)}
            className="quick-action-card qa-deposit"
          >
            <div className="quick-action-icon-wrapper">
              <Plus size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>Add Money</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>Instant account deposit</div>
            </div>
          </button>

          {/* Transactions */}
          <button
            type="button"
            onClick={() => navigate('/accounts')}
            className="quick-action-card qa-history"
          >
            <div className="quick-action-icon-wrapper">
              <History size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>Transactions</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>View all history</div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. 2-Column Main Section: Recent Transactions & Spending Overview */}
      <div className="dashboard-grid" style={{ marginBottom: 'var(--section-gap)' }}>
        {/* Left: Recent Transactions (Clean, Content-Driven Natural Height) */}
        <div className="dashboard-left-col">
          <div className="card recent-transactions-card" style={{ height: 'auto', minHeight: 0, marginBottom: 0 }}>
            <div className="card-header">
              <h3 className="card-title">
                <History size={18} color="var(--primary)" />
                <span>Recent Transactions</span>
              </h3>
              {recentTransactions.length > 0 && (
                <Link to="/accounts" className="btn btn-secondary btn-sm" style={{ fontSize: '12px' }}>
                  View All <ArrowRight size={13} />
                </Link>
              )}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 16 }}>
              {recentTransactions.length > 0 ? 'Click any transaction to view details.' : 'Your recent banking activity will appear here.'}
            </p>

            {/* Scenario 1: 0 Transactions Clean Empty State */}
            {recentTransactions.length === 0 ? (
              <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto'
                  }}
                >
                  <History size={22} />
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>No transactions yet</div>
                <div style={{ fontSize: '13px', marginTop: 4 }}>Your payments, transfers, and deposits will appear here.</div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
                  <button
                    type="button"
                    onClick={() => setShowDepositModal(true)}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={14} /> Add Money
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/transfer')}
                    className="btn btn-secondary btn-sm"
                  >
                    <Send size={14} /> Send Money
                  </button>
                </div>
              </div>
            ) : (
              /* Scenario 2: Populated Transactions (Latest 5-6 with natural fit or scroll) */
              <>
                <div
                  className={recentTransactions.length > 5 ? 'custom-scroll' : ''}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    maxHeight: recentTransactions.length > 5 ? 380 : 'none',
                    overflowY: recentTransactions.length > 5 ? 'auto' : 'visible',
                    paddingRight: recentTransactions.length > 5 ? 6 : 0
                  }}
                >
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
                              width: 38,
                              height: 38,
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
                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                              {label}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
                              {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today'} • {category}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: isCredit ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                            {isCredit ? '+' : '-'}₹{amt.toLocaleString('en-IN')}
                          </div>
                          <span className={`badge ${isCredit ? 'badge-emerald' : 'badge-indigo'}`} style={{ fontSize: '11px', padding: '2px 8px', marginTop: 2 }}>
                            {isCredit ? 'Received' : 'Sent'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Compact Monthly Activity Summary Grid */}
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: 8, marginBottom: 12 }}>
                    <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 3, letterSpacing: '0.04em' }}>
                        <ArrowDownLeft size={12} /> RECEIVED
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: 2 }}>
                        +₹{totalInflow.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: 3, letterSpacing: '0.04em' }}>
                        <ArrowUpRight size={12} /> SENT
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-rose)', marginTop: 2 }}>
                        -₹{totalOutflow.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                        NET MOVEMENT
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: (totalInflow - totalOutflow) >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)', marginTop: 2 }}>
                        {(totalInflow - totalOutflow) >= 0 ? '+' : ''}₹{(totalInflow - totalOutflow).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/accounts"
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '12px', fontWeight: 700, padding: '8px 14px' }}
                  >
                    View All Transactions <ArrowRight size={13} />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Spending This Month & Savings Goals */}
        <div className="dashboard-right-col">
          {/* Spending This Month Card (Dynamic & Responsive to Real Data) */}
          <div className="card" style={{ marginBottom: 0, height: 'auto', minHeight: 0 }}>
            <div className="card-header">
              <h3 className="card-title">
                <PieChart size={18} color="var(--primary)" />
                <span>Spending This Month</span>
              </h3>
              <Link to="/expenses" className="btn btn-secondary btn-sm" style={{ fontSize: '12px' }}>
                Analytics <ArrowRight size={13} />
              </Link>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Spent</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-main)', marginTop: 2 }}>
                ₹{totalSpentThisMonth.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Dynamic Spending Category Breakdown (Only display categories that actually have spending) */}
            {spendingCategories.length === 0 ? (
              <div style={{ padding: '24px 16px', borderRadius: 10, background: 'var(--bg-input)', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px auto'
                  }}
                >
                  <PieChart size={20} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>No spending yet</div>
                <div style={{ fontSize: '12px', marginTop: 4 }}>Your spending insights will appear here when you make a payment.</div>
              </div>
            ) : (
              <div
                className={spendingCategories.length > 3 ? 'custom-scroll' : ''}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  maxHeight: spendingCategories.length > 3 ? 200 : 'none',
                  overflowY: spendingCategories.length > 3 ? 'auto' : 'visible',
                  paddingRight: spendingCategories.length > 3 ? 6 : 0
                }}
              >
                {spendingCategories.map((cat) => {
                  const { label, icon: IconComponent, color } = getCategoryDetails(cat.name)
                  const pct = totalSpentThisMonth > 0 ? Math.min(100, Math.round((cat.amount / totalSpentThisMonth) * 100)) : 0
                  return (
                    <div key={cat.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 6 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-main)', fontWeight: 700 }}>
                          <IconComponent size={15} color={color} /> {label}
                        </span>
                        <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>₹{cat.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ width: '100%', height: 8, background: 'var(--bg-input)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Bottom Budget Health Bar */}
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>Monthly Budget: <strong>₹{monthlyBudget.toLocaleString('en-IN')}</strong></span>
              <span className="badge badge-emerald" style={{ fontSize: '11px' }}>
                ₹{budgetRemaining.toLocaleString('en-IN')} remaining
              </span>
            </div>
          </div>

          {/* Savings Goals Preview Card (Dynamic Empty vs Populated) */}
          <div className="card" style={{ marginBottom: 0, height: 'auto', minHeight: 0 }}>
            <div className="card-header">
              <h3 className="card-title">
                <PiggyBank size={18} color="var(--accent-emerald)" />
                <span>Savings Goals</span>
              </h3>
              <Link to="/savings" className="btn btn-secondary btn-sm" style={{ fontSize: '12px' }}>
                {savingsGoals.length > 0 ? 'View Goals' : 'Start Saving'} <ArrowRight size={13} />
              </Link>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 14 }}>
              Earn 5.50% APY return by setting aside funds for your goals.
            </p>

            {/* Scenario: 0 Savings Goals Clean Empty State */}
            {savingsGoals.length === 0 ? (
              <div style={{ padding: '24px 16px', borderRadius: 10, background: 'var(--bg-input)', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: 'var(--accent-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px auto'
                  }}
                >
                  <PiggyBank size={22} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>No savings goals yet</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>Create a goal and start saving toward something important.</div>
                <button
                  type="button"
                  onClick={() => navigate('/savings')}
                  className="btn btn-emerald btn-sm"
                  style={{ marginTop: 14 }}
                >
                  <Plus size={14} /> Create Goal
                </button>
              </div>
            ) : (
              /* Scenario: Populated Real Goals */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {savingsGoals.slice(0, 2).map((g) => {
                  const curr = Number(g.currentAmount || 0)
                  const tgt = Number(g.targetAmount || 1)
                  const pct = Math.min(100, Math.round((curr / tgt) * 100))
                  return (
                    <div
                      key={g.id}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 10,
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: 6 }}>
                        <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{g.name}</span>
                        <span style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>{pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, marginBottom: 8 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent-emerald)', borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                        <span>Saved: ₹{curr.toLocaleString('en-IN')}</span>
                        <span>Target: ₹{tgt.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>Interest Yield: <strong style={{ color: 'var(--accent-emerald)' }}>+5.50% APY</strong></span>
              <span>Compounded Daily</span>
            </div>
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
              {(selectedTxn.type && selectedTxn.type.includes('IN')) || selectedTxn.type === 'DEPOSIT' ? 'Money Received' : 'Payment Successful'}
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
