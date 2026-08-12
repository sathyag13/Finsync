import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import DebitCard from '../components/DebitCard.jsx'
import Modal from '../components/Modal.jsx'
import { useToast } from '../context/ToastContext.jsx'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Send,
  CreditCard,
  Building2,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [accounts, setAccounts] = useState([])
  const [recentTxns, setRecentTxns] = useState([])
  const [loading, setLoading] = useState(true)

  // Deposit Modal state
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [depositAccId, setDepositAccId] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [depositDesc, setDepositDesc] = useState('')

  const loadData = async () => {
    try {
      const res = await api.get('/accounts')
      setAccounts(res.data)
      if (res.data.length > 0) {
        setDepositAccId(res.data[0].id)
        const histories = await Promise.all(
          res.data.map((a) => api.get(`/accounts/${a.id}/history`).then((r) => r.data).catch(() => []))
        )
        const merged = histories.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setRecentTxns(merged.slice(0, 8))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDepositSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/accounts/${depositAccId}/deposit`, { amount: depositAmount, description: depositDesc })
      addToast(`₹${Number(depositAmount).toLocaleString('en-IN')} deposited successfully!`, 'success')
      setIsDepositOpen(false)
      setDepositAmount('')
      setDepositDesc('')
      loadData()
    } catch (err) {
      addToast(err.response?.data?.message || 'Deposit failed', 'error')
    }
  }

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0)
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'User'

  const totalCredits = recentTxns
    .filter((t) => t.type.includes('IN') || t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalOutflows = recentTxns
    .filter((t) => t.type.includes('OUT') || t.type === 'WITHDRAWAL')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 16 }}>
        <div className="sidebar-logo-icon" style={{ animation: 'pulseDot 1.5s infinite' }}>
          <Sparkles size={24} color="white" />
        </div>
        <p style={{ color: 'var(--text-muted)' }}>Loading your financial workspace…</p>
      </div>
    )
  }

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>
            Good day, {firstName} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Here is your live wealth overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-emerald" onClick={() => setIsDepositOpen(true)}>
            <Plus size={18} />
            <span>Deposit Money</span>
          </button>
          <Link to="/transfer" className="btn btn-primary">
            <Send size={18} />
            <span>Quick Transfer</span>
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Net Worth</span>
            <div className="stat-icon indigo"><Wallet size={20} /></div>
          </div>
          <div className="stat-value">₹{totalBalance.toLocaleString('en-IN')}</div>
          <div className="stat-trend up">
            <TrendingUp size={14} />
            <span>Across all accounts</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-label">Active Bank Accounts</span>
            <div className="stat-icon cyan"><Building2 size={20} /></div>
          </div>
          <div className="stat-value">{accounts.length}</div>
          <div className="stat-trend up">
            <span>{accounts.filter(a => a.accountType === 'SAVINGS').length} Savings / {accounts.filter(a => a.accountType !== 'SAVINGS').length} Commercial</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Deposits / Credits</span>
            <div className="stat-icon emerald"><ArrowDownLeft size={20} /></div>
          </div>
          <div className="stat-value">₹{totalCredits.toLocaleString('en-IN')}</div>
          <div className="stat-trend up">
            <TrendingUp size={14} />
            <span>Real Inflows</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Outflows</span>
            <div className="stat-icon rose"><ArrowUpRight size={20} /></div>
          </div>
          <div className="stat-value">₹{totalOutflows.toLocaleString('en-IN')}</div>
          <div className="stat-trend down">
            <TrendingDown size={14} />
            <span>Real Outflows</span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-1-2" style={{ marginBottom: 28 }}>
        {/* Left Side: Debit Card Viewer */}
        <div>
          <div className="card-header" style={{ marginBottom: 16 }}>
            <h3 className="card-title"><CreditCard size={18} color="var(--primary)" /> Virtual Debit Card</h3>
            <Link to="/accounts" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Manage</Link>
          </div>
          {accounts.length > 0 ? (
            <DebitCard account={accounts[0]} userName={user.fullName} />
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>No accounts open yet.</p>
              <Link to="/accounts" className="btn btn-primary btn-sm">Open Your First Account</Link>
            </div>
          )}
        </div>

        {/* Right Side: Account Balances & Recent Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Building2 size={18} color="var(--accent-cyan)" /> Portfolio Accounts</h3>
            <Link to="/accounts" className="btn btn-secondary btn-sm">Open New Account</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {accounts.map((a) => (
              <div key={a.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="stat-icon indigo" style={{ width: 36, height: 36 }}>
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{a.accountType} ACCOUNT</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{a.accountNumber}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>₹{Number(a.balance).toLocaleString('en-IN')}</div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><Clock size={18} color="var(--primary)" /> Recent Transactions Ledger</h3>
          <Link to="/accounts" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>View Full Statement</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {recentTxns.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>No transactions recorded yet.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Transaction Type</th>
                  <th>Description</th>
                  <th>Date & Time</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {recentTxns.map((t) => {
                  const isCredit = t.type.includes('IN') || t.type === 'DEPOSIT'
                  return (
                    <tr key={t.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className={`stat-icon ${isCredit ? 'emerald' : 'rose'}`} style={{ width: 32, height: 32 }}>
                            {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                          </div>
                          <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                            {t.type.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                        {t.description || 'Electronic Funds Transfer'}
                      </td>
                      <td style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                        {new Date(t.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td>
                        <span className={`badge ${isCredit ? 'badge-in' : 'badge-out'}`}>
                          {isCredit ? '+' : '-'} ₹{Number(t.amount).toLocaleString('en-IN')}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      <Modal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} title="Deposit Funds to Account">
        <form onSubmit={handleDepositSubmit}>
          <div className="form-group">
            <label>Select Target Account</label>
            <select value={depositAccId} onChange={(e) => setDepositAccId(e.target.value)} required>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.accountType} — {a.accountNumber} (Current Balance: ₹{Number(a.balance).toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Deposit Amount (₹)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="e.g. 10000"
              required
            />
          </div>

          <div className="form-group">
            <label>Notes / Description</label>
            <input
              type="text"
              value={depositDesc}
              onChange={(e) => setDepositDesc(e.target.value)}
              placeholder="e.g. Salary deposit, freelance payment"
            />
          </div>

          <button className="btn btn-emerald" type="submit" style={{ width: '100%', marginTop: 10 }}>
            Confirm Deposit
          </button>
        </form>
      </Modal>
    </div>
  )
}
