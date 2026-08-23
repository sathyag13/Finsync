import { ShieldAlert, AlertTriangle } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'

export default function AdminRisk() {
  return (
    <div>
      <PageHeader
        title="Security Risk & Fraud Alert Center"
        description="Real-time anomaly monitoring, automated AML alerts & suspicious pattern intercept"
        icon={ShieldAlert}
        iconColor="var(--accent-rose)"
      />

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(244, 63, 94, 0.18)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>2 Suspicious Transactions Intercepted</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Automated AML Rule Engine • High Volume Cross-Border SWIFT</div>
          </div>
        </div>

        <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '13px' }}>TX-99478 (₹28.0 Lakh SWIFT)</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Unverified offshore counterparty address</div>
          </div>
          <span className="badge badge-rose">
            FLAGGED FOR REVIEW
          </span>
        </div>
      </div>
    </div>
  )
}
