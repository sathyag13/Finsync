import { useState } from 'react'
import { Send, RefreshCw, XCircle } from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminTransactions() {
  const { addToast } = useToast()
  const [txns, setTxns] = useState([
    { id: 'TX-99482', sender: 'Sathya Narayanan', recipient: 'External Bank', amount: 1850000.0, status: 'COMPLETED' },
    { id: 'TX-99481', sender: 'Aarav Sharma', recipient: 'SIP Mutual Fund', amount: 1420000.0, status: 'COMPLETED' },
    { id: 'TX-99480', sender: 'Unknown Entity', recipient: 'Offshore Account', amount: 2800000.0, status: 'FLAGGED' }
  ])

  const handleReverse = (id) => {
    setTxns(prev => prev.map(t => t.id === id ? { ...t, status: 'REVERSED' } : t))
    addToast(`Transaction ${id} reversed by Admin order!`, 'warning')
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Send size={28} color="var(--primary)" /> System Transactions & Reversal Management
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Administrative transaction control panel: Review flagged items & trigger transaction reversals
        </p>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>TX ID</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>SENDER</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>RECIPIENT</th>
                <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 800 }}>AMOUNT</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>STATUS</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>ADMIN ACTION</th>
              </tr>
            </thead>
            <tbody>
              {txns.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)' }}>{t.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{t.sender}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{t.recipient}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#10b981' }}>₹{t.amount.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: t.status === 'COMPLETED' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.18)', color: t.status === 'COMPLETED' ? '#10b981' : '#ef4444' }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    {t.status !== 'REVERSED' && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleReverse(t.id)} style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                        Reverse Transaction
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
