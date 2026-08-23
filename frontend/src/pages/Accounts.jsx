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
      window.dispatchEvent(new Event('finsync:activity'))
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
      window.dispatchEvent(new Event('finsync:activity'))
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>Accounts & Virtual Debit Cards</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 600 }}>
            Manage your savings, current, commercial, and business banking vaults
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            color: '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(99,102,241,0.45)',
            transition: 'all 0.2s ease'
          }}
        >
          <Plus size={20} color="#ffffff" />
          <span>OPEN NEW ACCOUNT</span>
        </button>
      </div>

      {/* Accounts Virtual Cards Showcase (Cards + "+ ADD ACCOUNT / CARD" Tile) */}
      <div className="grid grid-3" style={{ marginBottom: 32, gap: 20 }}>
        {accounts.length > 0 ? (
          accounts.map((a, idx) => {
            const isSelected = selectedAccount?.id === a.id
            return (
              <div
                key={a.id}
                onClick={() => viewHistory(a)}
                style={{
                  cursor: 'pointer',
                  borderRadius: 18,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isSelected ? 'translateY(-8px) scale(1.01)' : 'none',
                  boxShadow: isSelected
                    ? '0 22px 42px -8px rgba(0, 0, 0, 0.5), 0 10px 22px -4px rgba(99, 102, 241, 0.4)'
                    : '0 8px 20px -4px rgba(0, 0, 0, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.025)'
                  e.currentTarget.style.boxShadow = '0 28px 56px -10px rgba(0, 0, 0, 0.6), 0 14px 28px -4px rgba(99, 102, 241, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = isSelected ? 'translateY(-8px) scale(1.01)' : 'none'
                  e.currentTarget.style.boxShadow = isSelected
                    ? '0 22px 42px -8px rgba(0, 0, 0, 0.5), 0 10px 22px -4px rgba(99, 102, 241, 0.4)'
                    : '0 8px 20px -4px rgba(0, 0, 0, 0.25)'
                }}
              >
                <DebitCard account={a} userName={user?.fullName || 'VALUED CLIENT'} index={idx} />
              </div>
            )
          })
        ) : (
          <div
            onClick={() => setIsCreateOpen(true)}
            style={{
              aspectRatio: '1.586 / 1',
              borderRadius: 18,
              border: '2px dashed var(--border-color)',
              background: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: 20,
              cursor: 'pointer'
            }}
          >
            <CreditCard size={36} color="var(--primary)" />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main)' }}>No Accounts Registered</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Click "+ ADD ACCOUNT / CARD" to issue your card</div>
            </div>
          </div>
        )}

        {/* Interactive "ADD ACCOUNT / CARD" Tile as requested in annotated screenshot */}
        <div
          onClick={() => setIsCreateOpen(true)}
          style={{
            aspectRatio: '1.586 / 1',
            borderRadius: 18,
            border: '2.5px dashed var(--primary)',
            background: 'rgba(99, 102, 241, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            padding: 20
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.16)'
            e.currentTarget.style.transform = 'translateY(-3px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)'
            e.currentTarget.style.transform = 'none'
          }}
        >
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4338ca)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
            <Plus size={28} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)', letterSpacing: 0.5 }}>+ ADD ACCOUNT / CARD</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 4 }}>Open new Savings or Current Vault</div>
          </div>
        </div>
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
                {(selectedAccount.isPrimary || accounts.indexOf(selectedAccount) === 0) && (
                  <span className="badge badge-emerald" style={{ background: 'rgba(16,185,129,0.18)', color: '#10b981', fontWeight: 800 }}>
                    PRIMARY ACCOUNT
                  </span>
                )}
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
