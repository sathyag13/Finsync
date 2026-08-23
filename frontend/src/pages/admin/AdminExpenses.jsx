import { PieChart } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'

export default function AdminExpenses() {
  return (
    <div>
      <PageHeader
        title="Bank Expense Outflow & Category Controls"
        description="Set maximum merchant transaction limits and category outflow controls"
        icon={PieChart}
      />

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 16 }}>Platform Merchant Debit Limits</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>P2P Single Transfer Daily Limit</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Default cap for retail customers</div>
            </div>
            <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '15px' }}>₹1,00,000 / Day</div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>Merchant POS Single Swipe Limit</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Automated Fraud Intercept Point</div>
            </div>
            <div style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '15px' }}>₹2,50,000 / Swipe</div>
          </div>
        </div>
      </div>
    </div>
  )
}
