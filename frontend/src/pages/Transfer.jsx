import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios.js'
import Modal from '../components/Modal.jsx'
import { useToast } from '../context/ToastContext.jsx'
import {
  Send,
  ArrowRight,
  CheckCircle2,
  Building2,
  ShieldCheck,
  CreditCard,
  Search,
  User,
  Phone,
  Check
} from 'lucide-react'

export default function Transfer() {
  const { addToast } = useToast()
  const [accounts, setAccounts] = useState([])
  const [allAccounts, setAllAccounts] = useState([])
  const [fromAccountNumber, setFromAccountNumber] = useState('')
  const [toAccountNumber, setToAccountNumber] = useState('')
  const [recipientSearchTerm, setRecipientSearchTerm] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [recipientFilter, setRecipientFilter] = useState('CUSTOMERS_ONLY') // 'CUSTOMERS_ONLY' | 'ALL'

  // Receipt Modal State
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    // Fetch my owned accounts
    api.get('/accounts').then((res) => {
      const myAccounts = res.data || []
      setAccounts(myAccounts)
      if (myAccounts.length > 0) setFromAccountNumber(myAccounts[0].accountNumber)
    })

    // Fetch all real user accounts from the database for recipient search
    const loadAllBankAccounts = async () => {
      try {
        const [accountsRes, usersRes] = await Promise.all([
          api.get('/accounts/all').catch(() => ({ data: [] })),
          api.get('/admin/users').catch(() => ({ data: [] }))
        ])

        const list = accountsRes.data || []
        const usersList = usersRes.data || []

        const enriched = list.map((a) => {
          const matchedUser = usersList.find(
            u => u.id === a.userId || u.email === a.userEmail || u.fullName === a.userName
          )
          return {
            ...a,
            userName: a.userName || (matchedUser ? matchedUser.fullName : 'Valued Client'),
            userPhone: a.userPhone || (matchedUser ? matchedUser.phoneNumber : ''),
            userEmail: a.userEmail || (matchedUser ? matchedUser.email : ''),
            userRole: matchedUser?.role || a.userRole || 'CUSTOMER'
          }
        })

        setAllAccounts(enriched)
      } catch (err) {
        console.error('Could not load recipient accounts:', err)
      }
    }
    loadAllBankAccounts()
  }, [])

  const selectedSourceAccount = accounts.find(a => a.accountNumber === fromAccountNumber)

  const handleTransfer = async (e) => {
    e.preventDefault()
    let cleanToAcc = (toAccountNumber || recipientSearchTerm || '').trim()
    const match = cleanToAcc.match(/(FS\d+)/i)
    if (match) {
      cleanToAcc = match[1]
    }

    if (!fromAccountNumber) {
      addToast('Please select a source account to send funds from.', 'error')
      return
    }

    if (!cleanToAcc) {
      addToast('Please enter or select a valid recipient account number.', 'error')
      return
    }

    if (fromAccountNumber === cleanToAcc) {
      addToast('Cannot transfer money to the same source account.', 'error')
      return
    }

    const numAmount = Number(amount)
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      addToast('Please enter a valid transfer amount greater than ₹0.', 'error')
      return
    }

    if (selectedSourceAccount && Number(selectedSourceAccount.balance) < numAmount) {
      addToast(`Insufficient balance. Your available balance is ₹${Number(selectedSourceAccount.balance).toLocaleString('en-IN')}`, 'error')
      return
    }

    setLoading(true)
    try {
      await api.post('/transfer', {
        fromAccountNumber,
        toAccountNumber: cleanToAcc,
        amount: numAmount,
        description: description.trim() || 'Direct Peer Transfer'
      })
      addToast(`₹${numAmount.toLocaleString('en-IN')} transferred to ${cleanToAcc} successfully!`, 'success')
      window.dispatchEvent(new Event('finsync:activity'))

      setReceipt({
        txnId: 'TXN' + Math.floor(1000000000 + Math.random() * 9000000000),
        from: fromAccountNumber,
        to: cleanToAcc,
        amount: numAmount,
        description: description.trim() || 'Direct Peer Transfer',
        timestamp: new Date().toLocaleString()
      })

      setAmount('')
      setDescription('')
      setToAccountNumber('')
      setRecipientSearchTerm('')
      // Reload accounts balance
      const accRes = await api.get('/accounts')
      setAccounts(accRes.data || [])
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Transfer failed. Check balance and recipient details.'
      addToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const presetAmounts = [500, 1000, 5000, 10000, 25000]

  // Filter out source account
  const baseCandidates = allAccounts.filter(a => a.accountNumber !== fromAccountNumber)

  // Show all bank customer accounts as banking recipients
  const recipientCandidates = baseCandidates.filter(a => {
    if (recipientFilter === 'CUSTOMERS_ONLY') {
      return (a.userRole || 'CUSTOMER') === 'CUSTOMER'
    }
    return true
  })

  // Dynamic search filtering by Name, Phone Number, or Account Number
  const searchFilteredRecipients = recipientCandidates.filter(a => {
    if (!recipientSearchTerm || !recipientSearchTerm.trim()) return true
    const rawTerm = recipientSearchTerm.toLowerCase().trim()
    const cleanTerm = rawTerm.replace(/\(fs\d+\)/gi, '').trim() || rawTerm

    const uName = (a.userName || '').toLowerCase()
    const uPhone = (a.userPhone || a.phoneNumber || '').toLowerCase()
    const accNo = (a.accountNumber || '').toLowerCase()
    const uEmail = (a.userEmail || '').toLowerCase()

    return uName.includes(cleanTerm) || uPhone.includes(cleanTerm) || accNo.includes(cleanTerm) || uEmail.includes(cleanTerm)
  })

  const selectRecipient = (account) => {
    setToAccountNumber(account.accountNumber)
    setRecipientSearchTerm(`${account.userName || 'Valued Client'} (${account.accountNumber})`)
    setShowSearchResults(false)
  }

  return (
    <div style={{ width: '100%', paddingBottom: 60 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-main)' }}>
          <Send size={26} color="var(--primary)" /> Pay & Transfer Funds
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Instant zero-fee transfer across all FinSync bank customer accounts and verified recipients
        </p>
      </div>



      {accounts.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <CreditCard size={42} color="var(--primary)" />
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>No Active Bank Accounts</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
              You don't have any bank accounts to transfer money from. Open your first account to get started.
            </p>
          </div>
          <Link to="/accounts" className="btn btn-primary" style={{ fontWeight: 800 }}>
            + Open First Bank Account
          </Link>
        </div>
      ) : (
        /* Main Transfer Form Card */
        <div className="card">
          <form onSubmit={handleTransfer}>
            {/* Step 1: Select Source Account */}
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>From Source Account</span>
                {selectedSourceAccount && (
                  <span style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: 800 }}>
                    Available Balance: ₹{Number(selectedSourceAccount.balance).toLocaleString('en-IN')}
                  </span>
                )}
              </label>
              <select
                value={fromAccountNumber}
                onChange={(e) => setFromAccountNumber(e.target.value)}
                required
              >
                <option value="">Select source account</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.accountNumber}>
                    {a.accountType} ACCOUNT — {a.accountNumber} (Balance: ₹{Number(a.balance).toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Interactive Recipient Search (ByName, Phone, AccountNumber) */}
            <div className="form-group" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ margin: 0, fontWeight: 800 }}>
                  Banking Recipients / Account
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => setRecipientFilter('CUSTOMERS_ONLY')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: recipientFilter === 'CUSTOMERS_ONLY' ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                      color: '#ffffff'
                    }}
                  >
                    Customers Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientFilter('ALL')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: recipientFilter === 'ALL' ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                      color: '#ffffff'
                    }}
                  >
                    All Accounts
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={recipientSearchTerm}
                  onFocus={(e) => {
                    setShowSearchResults(true)
                    e.target.select()
                  }}
                  onChange={(e) => {
                    setRecipientSearchTerm(e.target.value)
                    setToAccountNumber(e.target.value)
                    setShowSearchResults(true)
                  }}
                  required
                  placeholder="Search by recipient name, account number, or phone..."
                  style={{ paddingLeft: 42, width: '100%' }}
                />
                <Search size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--primary)' }} />
              </div>

              {/* Dynamic Live Matching Dropdown List */}
              {showSearchResults && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    background: 'var(--bg-card)',
                    border: '1.5px solid var(--primary)',
                    borderRadius: 14,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    maxHeight: 280,
                    overflowY: 'auto',
                    marginTop: 6
                  }}
                >
                  <div style={{ padding: '8px 14px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Matching Bank Recipients ({searchFilteredRecipients.length})</span>
                    <button type="button" onClick={() => setShowSearchResults(false)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 800 }}>Close ✕</button>
                  </div>

                  {searchFilteredRecipients.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                      No recipients match "{recipientSearchTerm}".
                    </div>
                  ) : (
                    searchFilteredRecipients.map((a) => {
                      const isSelected = toAccountNumber === a.accountNumber
                      return (
                        <div
                          key={a.id || a.accountNumber}
                          onClick={() => selectRecipient(a)}
                          style={{
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            background: isSelected ? 'rgba(99,102,241,0.15)' : 'transparent',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? 'rgba(99,102,241,0.15)' : 'transparent' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>
                              {(a.userName || 'C')[0].toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {a.userName || 'Valued Client'}
                                <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: 'rgba(16,185,129,0.18)', color: '#10b981' }}>
                                  CUSTOMER
                                </span>
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: 10, marginTop: 2 }}>
                                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{a.accountNumber}</span>
                                {(a.userPhone || a.phoneNumber) ? (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Phone size={12} /> {a.userPhone || a.phoneNumber}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: 99, background: 'rgba(99,102,241,0.15)', color: 'var(--primary)' }}>
                              {a.accountType || 'SAVINGS'}
                            </span>
                            {isSelected && <div style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 800, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}><Check size={12} /> Selected</div>}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}

              {/* Banking Recipients List — visible always */}
              {recipientCandidates.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {recipientSearchTerm.trim() ? `Matching Banking Recipients (${searchFilteredRecipients.length})` : `Banking Recipients (${recipientCandidates.length})`}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 240, overflowY: 'auto', borderRadius: 12, border: '1px solid var(--border-color)', padding: 6 }}>
                    {(recipientSearchTerm.trim() ? searchFilteredRecipients : recipientCandidates).map((a) => {
                      const isSelected = toAccountNumber === a.accountNumber
                      return (
                        <div
                          key={a.id || a.accountNumber}
                          onClick={() => selectRecipient(a)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: 10,
                            cursor: 'pointer',
                            background: isSelected ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.03)',
                            border: isSelected ? '1.5px solid var(--primary)' : '1px solid transparent',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
                          onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.88rem', flexShrink: 0 }}>
                              {(a.userName || 'C')[0].toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {a.userName || 'Valued Client'}
                                <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '1px 6px', borderRadius: 4, background: 'rgba(16,185,129,0.18)', color: '#10b981' }}>
                                  CUSTOMER
                                </span>
                              </div>
                              <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 700, marginTop: 2 }}>
                                {a.accountNumber}
                                {(a.userPhone || a.phoneNumber) && (
                                  <span style={{ marginLeft: 8, fontFamily: 'inherit', fontWeight: 600 }}>· {a.userPhone || a.phoneNumber}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: 99, background: 'rgba(99,102,241,0.15)', color: 'var(--primary)' }}>
                              {a.accountType || 'SAVINGS'}
                            </span>
                            {isSelected && (
                              <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Check size={15} />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Transfer Amount + Presets */}
            <div className="form-group">
              <label style={{ fontWeight: 800 }}>Transfer Amount (₹)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="Enter amount in ₹"
              />

              <div className="preset-pills">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className={`preset-pill ${Number(amount) === amt ? 'active' : ''}`}
                    onClick={() => setAmount(amt.toString())}
                  >
                    +₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Note */}
            <div className="form-group">
              <label style={{ fontWeight: 800 }}>Reference Note (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Invoice payout, Project bonus"
              />
            </div>

            {/* Features Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: 16,
              borderRadius: 12,
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              marginBottom: 24,
              fontSize: '0.88rem',
              color: 'var(--text-muted)'
            }}>
              <ShieldCheck size={28} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>Instant 24/7 IMPS & Peer Transfer</span>
                <p style={{ margin: 0, fontSize: '0.8rem', marginTop: 2 }}>Transfers are authenticated and recorded directly in the central database ledger.</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                fontWeight: 800,
                fontSize: '1.05rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10
              }}
            >
              <Send size={18} />
              <span>{loading ? 'Processing Transfer...' : `Confirm & Send ₹${Number(amount || 0).toLocaleString('en-IN')}`}</span>
            </button>
          </form>
        </div>
      )}

      {/* Transfer Success Receipt Modal */}
      {receipt && (
        <Modal isOpen={!!receipt} onClose={() => setReceipt(null)} title="Transfer Confirmation Receipt">
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: 4, color: 'var(--text-main)' }}>
              Transfer Completed!
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981', margin: '12px 0' }}>
              ₹{receipt.amount.toLocaleString('en-IN')}
            </div>

            <div style={{
              background: 'var(--bg-input)',
              borderRadius: 14,
              padding: '16px 20px',
              textAlign: 'left',
              margin: '20px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              fontSize: '0.88rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction Reference</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>{receipt.txnId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>From Account</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{receipt.from}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>To Recipient Account</span>
                <span style={{ fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>{receipt.to}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Description Note</span>
                <span style={{ fontWeight: 600 }}>{receipt.description}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Completed At</span>
                <span style={{ fontWeight: 600 }}>{receipt.timestamp}</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setReceipt(null)}
              style={{ width: '100%', padding: '12px', fontWeight: 800 }}
            >
              Done & Return
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
