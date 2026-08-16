import { useState } from 'react'
import { Send, Search, Filter, ArrowUpRight, Lock } from 'lucide-react'

export default function AnalystTransactions() {
  const [filterType, setFilterType] = useState('ALL')
  const [search, setSearch] = useState('')

  const txns = [
    { id: 'TX-1001', sender: 'Sathya Narayanan', recipient: 'Aarav Sharma', amount: 4500.0, type: 'P2P Transfer', date: '2026-08-16 00:10', status: 'COMPLETED' },
    { id: 'TX-1002', sender: 'Priya Patel', recipient: 'Amazon India POS', amount: 1250.0, type: 'Merchant Debit', date: '2026-08-15 22:45', status: 'COMPLETED' },
    { id: 'TX-1003', sender: 'Rahul Verma', recipient: 'Nippon India MF', amount: 15000.0, type: 'SIP Mutual Fund', date: '2026-08-15 20:30', status: 'COMPLETED' },
    { id: 'TX-1004', sender: 'Ananya Roy', recipient: 'FinSync Vault Reserves', amount: 50000.0, type: 'Vault Deposit', date: '2026-08-15 18:15', status: 'COMPLETED' }
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Send size={28} color="var(--primary)" /> Bank Transaction & Payment Flow Analytics
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Comprehensive view of atomic money transfers, merchant settlements, and payment volumes (Read-Only)
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24, padding: '16px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Filter size={18} color="var(--primary)" />
          <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Payment Type Filter:</span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field" style={{ padding: '6px 12px', fontSize: '0.84rem', width: 'auto' }}>
            <option value="ALL">All Payment Types</option>
            <option value="P2P">P2P Money Transfers</option>
            <option value="Merchant">Merchant POS</option>
            <option value="SIP">SIP Investments</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>TRANSACTION ID</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>SENDER</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>RECIPIENT / COUNTERPARTY</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>TYPE</th>
                <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 800 }}>AMOUNT</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {txns.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)' }}>{t.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{t.sender}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{t.recipient}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: 99, background: 'rgba(99,102,241,0.12)', color: 'var(--primary)', fontWeight: 700 }}>
                      {t.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#10b981' }}>
                    ₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
