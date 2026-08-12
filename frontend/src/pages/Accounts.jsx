import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import DebitCard from '../components/DebitCard.jsx'
import Modal from '../components/Modal.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import {
  CreditCard,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  CheckCircle2,
  DollarSign,
  Building,
  ShieldCheck,
  Search
} from 'lucide-react'

export default function Accounts() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [history, setHistory] = useState([])

  // New Account State
  const [accountType, setAccountType] = useState('SAVINGS')
  const [openingBalance, setOpeningBalance] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Action Modals State
  const [actionModalType, setActionModalType] = useState(null) // 'DEPOSIT' | 'WITHDRAW' | null
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const loadAccounts = () => {
    api.get('/accounts').then((res) => {
      setAccounts(res.data)
      if (res.data.length > 0 && !selectedAccount) {
        viewHistory(res.data[0])
      }
    })
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    try {
      await api.post('/accounts', { accountType, openingBalance: openingBalance || 0 })
      addToast(`New ${accountType} account opened successfully!`, 'success')
      setOpeningBalance('')
      setIsCreateOpen(false)
      loadAccounts()
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not create account.', 'error')
    }
  }

  const viewHistory = async (account) => {
    setSelectedAccount(account)
    try {
      const res = await api.get(`/accounts/${account.id}/history`)
      setHistory(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleTransaction = async (e) => {
    e.preventDefault()
    const endpoint = actionModalType === 'DEPOSIT' ? 'deposit' : 'withdraw'
    try {
      await api.post(`/accounts/${selectedAccount.id}/${endpoint}`, { amount, description })
      addToast(`${actionModalType === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} of ₹${Number(amount).toLocaleString('en-IN')} completed!`, 'success')
      setAmount('')
      setDescription('')
      setActionModalType(null)
      loadAccounts()
      viewHistory(selectedAccount)
    } catch (err) {
      addToast(err.response?.data?.message || 'Transaction failed', 'error')
    }
  }

  const filteredHistory = history.filter(t =>
    (t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Accounts & Virtual Cards</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage your savings, commercial, and business banking vaults
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={18} />
          <span>Open New Account</span>
        </button>
      </div>

      {/* Accounts Virtual Cards Showcase */}
      <div className="grid grid-3" style={{ marginBottom: 32 }}>
        {accounts.map((a) => (
          <div
            key={a.id}
            onClick={() => viewHistory(a)}
            style={{
              cursor: 'pointer',
              border: selectedAccount?.id === a.id ? '2px solid var(--primary)' : '2px solid transparent',
              borderRadius: 'var(--radius-lg)',
              transition: 'all 0.25s ease'
            }}
          >
            <DebitCard account={a} userName={user.fullName} />
          </div>
        ))}
      </div>

      {/* Selected Account Manager */}
      {selectedAccount && (
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {selectedAccount.accountType} ACCOUNT
                </h2>
                <span className="badge badge-indigo">{selectedAccount.accountNumber}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 2 }}>
                Opened on {new Date(selectedAccount.createdAt).toLocaleDateString()} • Verified Tier 1 Vault
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Balance</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  ₹{Number(selectedAccount.balance).toLocaleString('en-IN')}
                </div>
              </div>

              <button className="btn btn-emerald btn-sm" onClick={() => setActionModalType('DEPOSIT')}>
                <ArrowDownLeft size={16} />
                <span>Deposit</span>
              </button>

              <button className="btn btn-rose btn-sm" onClick={() => setActionModalType('WITHDRAW')}>
                <ArrowUpRight size={16} />
                <span>Withdraw</span>
              </button>
            </div>
          </div>

          {/* Statement Header & Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 16px 0', flexWrap: 'wrap', gap: 12 }}>
            <h3 className="card-title"><History size={18} color="var(--primary)" /> Account Statement Ledger</h3>

            <div style={{ position: 'relative', width: 260 }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter transactions…"
                style={{ paddingLeft: 36, padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-dim)' }} />
            </div>
          </div>

          {/* Transaction Ledger Table */}
          {filteredHistory.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '24px 0', textAlign: 'center' }}>
              No matching transactions found for this account.
            </p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Date & Time</th>
                    <th>Amount (₹)</th>
                    <th>Balance After</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((t) => {
                    const isCredit = t.type.includes('IN') || t.type === 'DEPOSIT'
                    return (
                      <tr key={t.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className={`stat-icon ${isCredit ? 'emerald' : 'rose'}`} style={{ width: 28, height: 28 }}>
                              {isCredit ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
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
                        <td style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                          ₹{Number(t.balanceAfter).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Open Account Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Open New Bank Account">
        <form onSubmit={handleCreateAccount}>
          <div className="form-group">
            <label>Select Account Type</label>
            <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
              <option value="SAVINGS">Savings Account (Standard 5.5% APY)</option>
              <option value="CURRENT">Current Commercial Account</option>
            </select>
          </div>

          <div className="form-group">
            <label>Initial Opening Deposit (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 10 }}>
            Create Account Now
          </button>
        </form>
      </Modal>

      {/* Deposit / Withdraw Action Modal */}
      <Modal
        isOpen={Boolean(actionModalType)}
        onClose={() => setActionModalType(null)}
        title={`${actionModalType === 'DEPOSIT' ? 'Deposit' : 'Withdraw'} Funds — ${selectedAccount?.accountNumber}`}
      >
        <form onSubmit={handleTransaction}>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              required
            />
          </div>

          <div className="form-group">
            <label>Reference Note</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional transaction note"
            />
          </div>

          <button
            className={`btn ${actionModalType === 'DEPOSIT' ? 'btn-emerald' : 'btn-rose'}`}
            type="submit"
            style={{ width: '100%', marginTop: 10 }}
          >
            Confirm {actionModalType === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
