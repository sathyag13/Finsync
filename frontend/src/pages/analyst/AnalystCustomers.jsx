import { Users, Globe2, Award } from 'lucide-react'

export default function AnalystCustomers() {
  const cohorts = [
    { tier: 'VIP Platinum High Net Worth (HNW)', count: 650, percentage: 5.2, avgBalance: '₹45.0 Lakh' },
    { tier: 'Power Active NetBanking Users', count: 3800, percentage: 30.4, avgBalance: '₹8.5 Lakh' },
    { tier: 'Standard Retail Clients', count: 7350, percentage: 58.8, avgBalance: '₹1.8 Lakh' },
    { tier: 'Student & Youth Starter Accounts', count: 700, percentage: 5.6, avgBalance: '₹45,000' }
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users size={28} color="var(--primary)" /> Customer Demographics & Cohort Insights
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Segmentation analysis of customer tiers, deposit profiles, and activity levels (Read-Only)
        </p>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 18 }}>Customer Tier Distribution</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>CUSTOMER SEGMENT / TIER</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>USER COUNT</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>PERCENTAGE</th>
                <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 800 }}>AVG PORTFOLIO BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map((c, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{c.tier}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800 }}>{c.count.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 900, color: 'var(--primary)' }}>{c.percentage}%</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#10b981' }}>{c.avgBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
