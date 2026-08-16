import { useState } from 'react'
import { CreditCard, Search, Lock, Unlock, CheckCircle2, XCircle } from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminAccounts() {
  const { addToast } = useToast()
  const [accounts, setAccounts] = useState([
    { id: 'ACC-8829', holder: 'Sathya Narayanan', type: 'Savings Account', balance: 145000.0, status: 'ACTIVE', cardStatus: 'ACTIVE' },
    { id: 'ACC-9912', holder: 'Aarav Sharma', type: 'Checking Account', balance: 320000.0, status: 'ACTIVE', cardStatus: 'ACTIVE' },
    { id: 'ACC-7734', holder: 'Priya Patel', type: 'Savings Vault', balance: 95000.0, status: 'FROZEN', cardStatus: 'BLOCKED' },
    { id: 'ACC-5512', holder: 'Rahul Verma', type: 'Demat Investment', balance: 1250000.0, status: 'ACTIVE', cardStatus: 'ACTIVE' }
  ])

  const toggleFreeze = (id) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE' } : a))
    addToast(`Account #${id} status toggled!`, 'warning')
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <CreditCard size={28} color="var(--primary)" /> Bank Accounts & Cards Administration
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Administrative control over bank account states, card issuance, freeze commands & debit limits
        </p>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>ACCOUNT ID</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>HOLDER</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>TYPE</th>
                <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 800 }}>BALANCE</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>STATUS</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)' }}>{a.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{a.holder}</td>
                  <td style={{ padding: '12px 14px' }}>{a.type}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#10b981' }}>₹{a.balance.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: a.status === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.18)', color: a.status === 'ACTIVE' ? '#10b981' : '#ef4444' }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => toggleFreeze(a.id)} style={{ fontSize: '0.78rem' }}>
                      {a.status === 'ACTIVE' ? 'Freeze Account' : 'Unfreeze Account'}
                    </button>
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
