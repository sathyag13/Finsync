import { PieChart, ShieldCheck } from 'lucide-react'

export default function AdminExpenses() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <PieChart size={28} color="var(--primary)" /> Bank Expense Outflow & Category Controls
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Set maximum merchant transaction limits and category outflow controls
        </p>
      </div>

      <div className="card" style={{ padding: 32 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16 }}>Platform Merchant Debit Limits</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800 }}>P2P Single Transfer Daily Limit</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Default cap for retail customers</div>
            </div>
            <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.1rem' }}>₹1,00,000 / Day</div>
          </div>

          <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800 }}>Merchant POS Single Swipe Limit</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Automated Fraud Intercept Point</div>
            </div>
            <div style={{ fontWeight: 900, color: '#10b981', fontSize: '1.1rem' }}>₹2,50,000 / Swipe</div>
          </div>
        </div>
      </div>
    </div>
  )
}
