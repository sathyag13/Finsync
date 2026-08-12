import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import Modal from '../components/Modal.jsx'
import { useToast } from '../context/ToastContext.jsx'
import {
  Send,
  ArrowRight,
  CheckCircle2,
  Building2,
  CreditCard,
  Zap,
  Sparkles,
  ShieldCheck,
  Receipt
} from 'lucide-react'

export default function Transfer() {
  const { addToast } = useToast()
  const [accounts, setAccounts] = useState([])
  const [fromAccountNumber, setFromAccountNumber] = useState('')
  const [toAccountNumber, setToAccountNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  // Receipt Modal State
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    api.get('/accounts').then((res) => {
      setAccounts(res.data)
      if (res.data.length > 0) setFromAccountNumber(res.data[0].accountNumber)
    })
  }, [])

  const selectedSourceAccount = accounts.find(a => a.accountNumber === fromAccountNumber)

  const handleTransfer = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/transfer', { fromAccountNumber, toAccountNumber, amount, description })
      addToast(`₹${Number(amount).toLocaleString('en-IN')} transferred to ${toAccountNumber}!`, 'success')

      setReceipt({
        txnId: 'TXN' + Math.floor(1000000000 + Math.random() * 9000000000),
        from: fromAccountNumber,
        to: toAccountNumber,
        amount: Number(amount),
        description: description || 'Direct Peer Transfer',
        timestamp: new Date().toLocaleString()
      })

      setAmount('')
      setDescription('')
      // Reload accounts
      const res = await api.get('/accounts')
      setAccounts(res.data)
    } catch (err) {
      addToast(err.response?.data?.message || 'Transfer failed. Check balance & account number.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const presetAmounts = [500, 1000, 5000, 10000, 25000]

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Send size={24} color="var(--primary)" /> Pay & Transfer Funds
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Instant zero-fee transfer across all FinSync accounts and external bank numbers
        </p>
      </div>

      {/* Main Transfer Form Card */}
      <div className="card">
        <form onSubmit={handleTransfer}>
          {/* Step 1: Select Source Account */}
          <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>From Source Account</span>
              {selectedSourceAccount && (
                <span style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 600 }}>
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

          {/* Step 2: Target Account Number */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ margin: 0 }}>Recipient Account Number</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {accounts.filter(a => a.accountNumber !== fromAccountNumber).map(a => (
                  <button
                    key={a.id}
                    type="button"
                    className="preset-pill"
                    style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                    onClick={() => setToAccountNumber(a.accountNumber)}
                  >
                    Use {a.accountType} ({a.accountNumber.slice(-4)})
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={toAccountNumber}
              onChange={(e) => setToAccountNumber(e.target.value)}
              required
              placeholder="e.g. FS994018274"
            />
          </div>

          {/* Step 3: Transfer Amount + Presets */}
          <div className="form-group">
            <label>Transfer Amount (₹)</label>
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
            <label>Reference Note (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Invoice #1092 payout, Project bonus"
            />
          </div>

          {/* Features Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: 14,
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid var(--border-color)',
            marginBottom: 24,
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            <ShieldCheck size={22} color="var(--primary)" />
            <div>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>End-to-End Instant Settlement:</span> Transactions are encrypted with 256-bit SSL protocols and posted instantly.
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Processing Transfer…' : 'Execute Instant Transfer'}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>

      {/* Transfer Receipt Modal Overlay */}
      <Modal isOpen={Boolean(receipt)} onClose={() => setReceipt(null)} title="Transaction Receipt">
        {receipt && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div className="sidebar-logo-icon" style={{ width: 52, height: 52, margin: '0 auto 12px auto', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <CheckCircle2 size={30} color="white" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>Transfer Successful!</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Ref ID: {receipt.txnId}</p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              marginBottom: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount Transferred</span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>₹{receipt.amount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Debited From</span>
                <span style={{ fontFamily: 'monospace' }}>{receipt.from}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Credited To</span>
                <span style={{ fontFamily: 'monospace' }}>{receipt.to}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Description</span>
                <span>{receipt.description}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date & Time</span>
                <span>{receipt.timestamp}</span>
              </div>
            </div>

            <button className="btn btn-secondary" onClick={() => setReceipt(null)} style={{ width: '100%' }}>
              Close Receipt
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
