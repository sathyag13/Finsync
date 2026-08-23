import { useState, useEffect } from 'react'
import { Send, RefreshCw, CheckCircle2 } from 'lucide-react'
import api from '../../api/axios.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminTransactions() {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [txns, setTxns] = useState([])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/transactions')
      setTxns(res.data)
    } catch (err) {
      console.error(err)
      addToast('Could not load system transactions.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  return (
    <div style={{ paddingBottom: 60 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Send size={28} color="var(--primary)" /> Real System Transactions Directory
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
            Live administrative transaction ledger: Monitoring real deposits, withdrawals, and P2P transfers in database
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={loadTransactions} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
          <RefreshCw size={16} /> Refresh Transactions
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
            Fetching live bank transaction ledger from database...
          </div>
        ) : txns.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
            No real transactions recorded in the bank database yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>TX ID</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>ACCOUNT HOLDER</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>ACCOUNT NO</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>TYPE</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>DESCRIPTION / RECIPIENT</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 800 }}>AMOUNT (₹)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 800 }}>BALANCE AFTER</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)' }}>#TXN-00{t.id}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{t.userName || 'Valued Client'}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-muted)' }}>{t.accountNumber}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: 99, background: t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN' ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)', color: t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN' ? '#10b981' : 'var(--primary)' }}>
                        {t.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-main)', fontWeight: 600 }}>
                      {t.description || (t.counterpartyAccountNumber ? `Transfer to ${t.counterpartyAccountNumber}` : 'Bank Deposit / Operation')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN' ? '#10b981' : '#ef4444' }}>
                      {t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: 'var(--text-main)' }}>
                      ₹{Number(t.balanceAfter).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={12} /> {t.status || 'SUCCESS'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
