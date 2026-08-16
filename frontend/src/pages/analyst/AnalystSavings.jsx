import { PiggyBank, ArrowUpRight } from 'lucide-react'

export default function AnalystSavings() {
  const vaults = [
    { name: 'Emergency Contingency Reserve', totalDeposits: 28000000.0, avgApy: '5.50%', usersCount: 3420 },
    { name: 'High-Yield Fixed Deposits (FD)', totalDeposits: 45000000.0, avgApy: '7.85%', usersCount: 2150 },
    { name: 'Sovereign Gold & Wealth Vaults', totalDeposits: 18500000.0, avgApy: '11.80%', usersCount: 1280 }
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <PiggyBank size={28} color="#10b981" /> Savings & Financial Product Trends
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Deposit vault growth curves, APY interest accumulation, and wealth creation trends (Read-Only)
        </p>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 28 }}>
        {vaults.map((v, idx) => (
          <div key={idx} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{v.name}</div>
              <span style={{ fontSize: '0.75rem', fontWeight: 900, padding: '3px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.18)', color: '#10b981' }}>
                {v.avgApy} APY
              </span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981', marginBottom: 6 }}>
              ₹{(v.totalDeposits / 100000).toFixed(1)} Lakh
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {v.usersCount.toLocaleString()} Participating Customers
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
