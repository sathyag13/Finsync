import { useState } from 'react'
import { CreditCard, Search, ArrowUpRight, Lock, Filter } from 'lucide-react'

export default function AnalystAccounts() {
  const [search, setSearch] = useState('')

  const accounts = [
    { id: 'ACC-8829', holder: 'Sathya Narayanan', type: 'Savings Account', balance: 145000.0, status: 'ACTIVE', branch: 'Mumbai Main' },
    { id: 'ACC-9912', holder: 'Aarav Sharma', type: 'Checking Account', balance: 320000.0, status: 'ACTIVE', branch: 'Bengaluru Tech Hub' },
    { id: 'ACC-7734', holder: 'Priya Patel', type: 'Savings Vault', balance: 95000.0, status: 'ACTIVE', branch: 'Delhi NCR' },
    { id: 'ACC-5512', holder: 'Rahul Verma', type: 'Demat Investment', balance: 1250000.0, status: 'ACTIVE', branch: 'Hyderabad IT City' },
    { id: 'ACC-4419', holder: 'Ananya Roy', type: 'Fixed Deposit', balance: 2100000.0, status: 'ACTIVE', branch: 'Kolkata Central' }
  ]

  const filtered = accounts.filter(a => a.holder.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <CreditCard size={28} color="var(--primary)" /> Bank-Wide Accounts & Balance Distribution
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Analytical overview of customer bank accounts, deposit ledgers, and branch allocations (Read-Only)
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Lock size={18} color="#10b981" />
          <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Read-Only Financial Analyst Clearance</span>
        </div>
        <div style={{ position: 'relative', width: 260 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search account ID or holder..."
            className="input-field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36, padding: '6px 12px 6px 36px', fontSize: '0.84rem' }}
          />
        </div>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>ACCOUNT ID</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>PRIMARY HOLDER</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>ACCOUNT TYPE</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>BRANCH LOCATION</th>
                <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 800 }}>LEDGER BALANCE</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)' }}>{a.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{a.holder}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: 99, background: 'rgba(99,102,241,0.12)', color: 'var(--primary)', fontWeight: 700 }}>
                      {a.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{a.branch}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#10b981' }}>
                    ₹{a.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                      {a.status}
                    </span>
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
