import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import DebitCard from '../components/DebitCard.jsx'
import Modal from '../components/Modal.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import {
  CreditCard,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Building,
  Search,
  Lock,
  Unlock,
  Sliders,
  Globe,
  Wifi,
  Smartphone,
  Calendar,
  AlertTriangle
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

  // Card Controls State
  const [updatingControls, setUpdatingControls] = useState(false)
  const [dailyLimitInput, setDailyLimitInput] = useState('50000')

  const loadAccounts = () => {
    api.get('/accounts').then((res) => {
      const list = res.data || []
      setAccounts(list)
      if (list.length > 0) {
        const target = selectedAccount ? list.find(a => a.id === selectedAccount.id) || list[0] : list[0]
        setSelectedAccount(target)
        setDailyLimitInput(target.dailyLimit ? target.dailyLimit.toString() : '50000')
        viewHistory(target)
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
    setDailyLimitInput(account.dailyLimit ? account.dailyLimit.toString() : '50000')
    try {
      const res = await api.get(`/accounts/${account.id}/history`)
      setHistory(res.data || [])
    } catch (err) {
      console.error('Failed to load transaction history:', err)
      setHistory([])
    }
  }

  const handleTransaction = async (e) => {
    e.preventDefault()
    if (!selectedAccount) return

    if (selectedAccount.status === 'FROZEN') {
      addToast('Cannot perform transactions on a frozen account.', 'error')
      return
    }

    const endpoint = actionModalType === 'DEPOSIT' ? 'deposit' : 'withdraw'
    try {
      await api.post(`/accounts/${selectedAccount.id}/${endpoint}`, { amount, description })
      addToast(`${actionModalType === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} of ₹${Number(amount).toLocaleString('en-IN')} completed!`, 'success')
      window.dispatchEvent(new Event('finsync:activity'))
      setAmount('')
      setDescription('')
      setActionModalType(null)
      loadAccounts()
    } catch (err) {
      addToast(err.response?.data?.message || 'Transaction failed', 'error')
    }
  }

  const handleCardControlToggle = async (field, value) => {
    if (!selectedAccount) return
    try {
      setUpdatingControls(true)
      const payload = { [field]: value }
      const res = await api.patch(`/accounts/${selectedAccount.id}/card-controls`, payload)
      setSelectedAccount(res.data)
      setAccounts(prev => prev.map(a => a.id === res.data.id ? res.data : a))
      window.dispatchEvent(new Event('finsync:activity'))
      addToast(
        field === 'cardFrozen'
          ? (value ? 'Debit card FROZEN successfully!' : 'Debit card ACTIVE & restored!')
          : 'Card preferences updated successfully!',
        'success'
      )
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update card controls', 'error')
    } finally {
      setUpdatingControls(false)
    }
  }

  const handleSaveDailyLimit = async () => {
    if (!selectedAccount) return
    const num = Number(dailyLimitInput)
    if (isNaN(num) || num <= 0) {
      addToast('Please enter a valid daily limit amount', 'error')
      return
    }
    try {
      setUpdatingControls(true)
      const res = await api.patch(`/accounts/${selectedAccount.id}/card-controls`, { dailyLimit: num })
      setSelectedAccount(res.data)
      setAccounts(prev => prev.map(a => a.id === res.data.id ? res.data : a))
      window.dispatchEvent(new Event('finsync:activity'))
      addToast(`Daily transaction limit set to ₹${num.toLocaleString('en-IN')}`, 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update daily limit', 'error')
    } finally {
      setUpdatingControls(false)
    }
  }

  const filteredHistory = history.filter(t =>
    (t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.type || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Accounts & Virtual Debit Cards"
        description="Manage your deposit accounts, security card controls, limits, and statements"
        icon={CreditCard}
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setIsCreateOpen(true)}>
            <Plus size={15} /> Open New Account
          </button>
        }
      />

      <div className="grid grid-1-2" style={{ gap: 24, marginBottom: 'var(--section-gap)' }}>
        {/* Left Column: Accounts List & Debit Card */}
        <div className="grid-col-left">
          <div className="card-header" style={{ marginBottom: 12 }}>
            <h3 className="card-title">Select Account & Card</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {accounts.map((a) => {
              const isSelected = selectedAccount?.id === a.id
              const isFrozen = a.status === 'FROZEN' || a.cardFrozen
              return (
                <div
                  key={a.id}
                  onClick={() => viewHistory(a)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--card-radius)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div className="stat-icon indigo" style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0 }}>
                      <Building size={18} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span>{a.accountType}</span>
                        {a.isPrimary && <span className="badge badge-indigo" style={{ fontSize: '10px' }}>Primary</span>}
                        {isFrozen && <span className="badge badge-rose" style={{ fontSize: '10px' }}>Frozen</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {a.accountNumber}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 8 }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                      ₹{Number(a.balance || 0).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                      Avail: ₹{Number(a.availableBalance || a.balance || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Active Debit Card Preview */}
          {selectedAccount && (
            <div style={{ marginBottom: 16 }}>
              <DebitCard account={selectedAccount} userName={user.fullName} />
            </div>
          )}

          {/* Virtual Card Controls Card */}
          {selectedAccount && (
            <div className="card" style={{ padding: 20, marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
                <h3 className="card-title">
                  <Sliders size={16} color="var(--primary)" />
                  <span>Card Controls</span>
                </h3>
                <button
                  type="button"
                  onClick={() => handleCardControlToggle('cardFrozen', !selectedAccount.cardFrozen)}
                  disabled={updatingControls}
                  className={`btn btn-sm ${selectedAccount.cardFrozen ? 'btn-emerald' : 'btn-rose'}`}
                >
                  {selectedAccount.cardFrozen ? <Unlock size={13} /> : <Lock size={13} />}
                  <span>{selectedAccount.cardFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
                </button>
              </div>

              {selectedAccount.cardFrozen && (
                <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.25)', color: 'var(--accent-rose)', fontSize: '12px', fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={14} /> Card transactions are currently disabled.
                </div>
              )}

              {/* Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'var(--bg-input)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Smartphone size={15} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>Online Transactions</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>E-commerce & web portals</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedAccount.onlineTxnEnabled !== false}
                    onChange={(e) => handleCardControlToggle('onlineTxnEnabled', e.target.checked)}
                    disabled={selectedAccount.cardFrozen || updatingControls}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'var(--bg-input)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Wifi size={15} color="var(--accent-emerald)" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>Contactless (NFC)</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>POS terminal tap payments</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedAccount.contactlessEnabled !== false}
                    onChange={(e) => handleCardControlToggle('contactlessEnabled', e.target.checked)}
                    disabled={selectedAccount.cardFrozen || updatingControls}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'var(--bg-input)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Globe size={15} color="var(--accent-amber)" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>International Payments</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Foreign currency & overseas</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!selectedAccount.internationalTxnEnabled}
                    onChange={(e) => handleCardControlToggle('internationalTxnEnabled', e.target.checked)}
                    disabled={selectedAccount.cardFrozen || updatingControls}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                </div>

                {/* Daily Transaction Limit */}
                <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg-input)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Daily Transaction Limit</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>₹{Number(selectedAccount.dailyLimit || 50000).toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="number"
                      value={dailyLimitInput}
                      onChange={(e) => setDailyLimitInput(e.target.value)}
                      disabled={selectedAccount.cardFrozen || updatingControls}
                      placeholder="e.g. 50000"
                    />
                    <button
                      type="button"
                      onClick={handleSaveDailyLimit}
                      disabled={selectedAccount.cardFrozen || updatingControls}
                      className="btn btn-secondary btn-sm"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Account Details, Fast Actions & History */}
        <div className="grid-col-right">
          {selectedAccount ? (
            <>
              {/* Account Details Card */}
              <div className="card" style={{ marginBottom: 'var(--section-gap)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <span className="badge badge-indigo" style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 700 }}>
                      {selectedAccount.accountType} SPECIFICATION
                    </span>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginTop: 4, marginBottom: 4 }}>
                      ₹{Number(selectedAccount.balance || 0).toLocaleString('en-IN')}
                    </h2>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span>Acc: <strong style={{ fontFamily: 'monospace' }}>{selectedAccount.accountNumber}</strong></span>
                      <span>•</span>
                      <span>Status: <strong style={{ color: selectedAccount.status === 'FROZEN' ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>{selectedAccount.status || 'ACTIVE'}</strong></span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={13} /> {selectedAccount.createdAt ? new Date(selectedAccount.createdAt).toLocaleDateString('en-IN') : 'Recently'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => setActionModalType('DEPOSIT')} className="btn btn-emerald btn-sm">
                      <Plus size={14} /> Deposit
                    </button>
                    <button onClick={() => setActionModalType('WITHDRAW')} className="btn btn-secondary btn-sm">
                      <ArrowUpRight size={14} /> Withdraw
                    </button>
                  </div>
                </div>
              </div>

              {/* Transactions History Ledger */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <History size={16} color="var(--primary)" />
                    <span>Transaction Statement</span>
                  </h3>
                  <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft: 32 }}
                    />
                    <Search size={14} style={{ position: 'absolute', left: 10, top: 13, color: 'var(--text-muted)' }} />
                  </div>
                </div>

                {filteredHistory.length === 0 ? (
                  <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No transactions found for this account.
                  </div>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Action Type</th>
                          <th>Description</th>
                          <th>Date</th>
                          <th>Risk</th>
                          <th style={{ textAlign: 'center' }}>Status</th>
                          <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                          <th style={{ textAlign: 'right' }}>Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHistory.map((t) => {
                          const isCredit = t.type.includes('IN') || t.type === 'DEPOSIT'
                          const risk = t.riskLevel || 'LOW'
                          return (
                            <tr key={t.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div className={`stat-icon ${isCredit ? 'emerald' : 'rose'}`} style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0 }}>
                                    {isCredit ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                                  </div>
                                  <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                    {t.type.replace('_', ' ')}
                                  </span>
                                </div>
                              </td>
                              <td className="cell-desc" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                {t.description || 'Electronic Transfer'}
                              </td>
                              <td style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                                {new Date(t.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td>
                                <span
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    background: risk === 'HIGH' ? 'rgba(244, 63, 94, 0.15)' : (risk === 'MEDIUM' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'),
                                    color: risk === 'HIGH' ? 'var(--accent-rose)' : (risk === 'MEDIUM' ? 'var(--accent-amber)' : 'var(--accent-emerald)')
                                  }}
                                >
                                  {risk}
                                </span>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <span className="badge badge-emerald">
                                  {t.status || 'SUCCESS'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <span className={`badge ${isCredit ? 'badge-in' : 'badge-out'}`} style={{ fontSize: '13px', fontWeight: 700 }}>
                                  {isCredit ? '+' : '-'} ₹{Number(t.amount || 0).toLocaleString('en-IN')}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '13px' }}>
                                ₹{Number(t.balanceAfter || 0).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              Select an account on the left to view details and card settings.
            </div>
          )}
        </div>
      </div>

      {/* Create Account Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Open New Bank Account">
        <form onSubmit={handleCreateAccount}>
          <div className="form-group">
            <label>Select Account Type</label>
            <select value={accountType} onChange={(e) => setAccountType(e.target.value)} required>
              <option value="SAVINGS">SAVINGS ACCOUNT (5.50% APY Vault)</option>
              <option value="CURRENT">BUSINESS CURRENT ACCOUNT (High Limit)</option>
              <option value="INVESTMENT">INVESTMENT PORTFOLIO ACCOUNT</option>
              <option value="GOLD">GOLD PREMIER WEALTH VAULT</option>
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
              placeholder="e.g. 5000 (Optional)"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Create Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Deposit / Withdraw Action Modal */}
      <Modal isOpen={actionModalType !== null} onClose={() => setActionModalType(null)} title={`${actionModalType === 'DEPOSIT' ? 'Deposit Money into' : 'Withdraw Funds from'} Account`}>
        <form onSubmit={handleTransaction}>
          <div className="form-group">
            <label>Target Account</label>
            <input
              type="text"
              value={`${selectedAccount?.accountType} — ${selectedAccount?.accountNumber}`}
              disabled
            />
          </div>

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
            <label>Remarks / Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. ATM cash withdrawal, payroll credit"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setActionModalType(null)}>
              Cancel
            </button>
            <button className={`btn ${actionModalType === 'DEPOSIT' ? 'btn-emerald' : 'btn-primary'}`} type="submit">
              Confirm {actionModalType === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
