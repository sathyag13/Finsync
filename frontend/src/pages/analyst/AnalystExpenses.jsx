import { PieChart, TrendingUp } from 'lucide-react'

export default function AnalystExpenses() {
  const categories = [
    { name: 'Investments & Mutual Funds', amount: 45000000.0, share: 38.4, color: '#6366f1' },
    { name: 'Retail & E-Commerce POS', amount: 28000000.0, share: 23.9, color: '#10b981' },
    { name: 'Utilities & Bill Payments', amount: 18000000.0, share: 15.3, color: '#f59e0b' },
    { name: 'Travel & Dining Outflows', amount: 15000000.0, share: 12.8, color: '#ec4899' },
    { name: 'Healthcare & Medical', amount: 11250000.0, share: 9.6, color: '#06b6d4' }
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <PieChart size={28} color="var(--primary)" /> System-Wide Spending & Category Analytics
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Macro analysis of customer spending behaviors, outflow channels, and category concentration (Read-Only)
        </p>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 28 }}>
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 18 }}>Category Concentration Shares</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {categories.map((c, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: 4, fontWeight: 700 }}>
                  <span>{c.name}</span>
                  <span style={{ color: c.color, fontWeight: 900 }}>₹{(c.amount / 100000).toFixed(1)}L ({c.share}%)</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${c.share}%`, height: '100%', background: c.color, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(99,102,241,0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <TrendingUp size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>Total Category Outflow</h3>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: 8 }}>₹11.72 Crore</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 380 }}>
            Macro consumer outflow analyzed across 12,500 active customer accounts during the last 30 billing cycles.
          </p>
        </div>
      </div>
    </div>
  )
}
